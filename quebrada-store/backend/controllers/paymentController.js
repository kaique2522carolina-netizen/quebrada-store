import { createPreference, getPaymentDetails } from '../services/payment.js'

/**
 * POST /api/payment/create-preference
 * Creates a Mercado Pago payment preference
 */
export async function createPaymentPreference(req, res) {
  try {
    const { items, payer } = req.body

    // Validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Carrinho vazio' })
    }
    if (!payer?.nome || !payer?.cpf || !payer?.whatsapp) {
      return res.status(400).json({ message: 'Dados do comprador incompletos' })
    }

    const preference = await createPreference({ items, payer })

    // Log order (in production, save to database here)
    console.log(`📦 Novo pedido: ${preference.preferenceId} — R$${
      items.reduce((acc, i) => acc + i.price * i.qty, 0).toFixed(2)
    }`)

    return res.json(preference)
  } catch (err) {
    console.error('❌ Error creating preference:', err)
    return res.status(500).json({ message: 'Erro ao criar preferência de pagamento', error: err.message })
  }
}

/**
 * GET /api/payment/status/:paymentId
 * Gets payment status from Mercado Pago
 */
export async function getPaymentStatus(req, res) {
  try {
    const { paymentId } = req.params
    const details = await getPaymentDetails(paymentId)
    return res.json(details)
  } catch (err) {
    console.error('❌ Error getting payment status:', err)
    return res.status(500).json({ message: 'Erro ao buscar status', error: err.message })
  }
}

/**
 * POST /api/payment/webhook
 * Receives Mercado Pago payment notifications
 */
export async function handleWebhook(req, res) {
  try {
    const { type, data } = req.body

    if (type === 'payment') {
      const paymentId = data.id
      console.log(`🔔 Webhook recebido: pagamento ${paymentId}`)

      const details = await getPaymentDetails(paymentId)
      const status = details.status

      // Handle payment status changes
      switch (status) {
        case 'approved':
          console.log(`✅ Pagamento aprovado: ${paymentId}`)
          // TODO: Mark order as paid in DB, send confirmation email/WhatsApp
          break
        case 'pending':
          console.log(`⏳ Pagamento pendente: ${paymentId}`)
          break
        case 'rejected':
          console.log(`❌ Pagamento rejeitado: ${paymentId}`)
          break
        default:
          console.log(`ℹ️ Status: ${status} — ${paymentId}`)
      }
    }

    // MP expects 200 OK within 5s
    return res.status(200).json({ received: true })
  } catch (err) {
    console.error('❌ Webhook error:', err)
    return res.status(200).json({ received: true }) // Still return 200 to avoid MP retries
  }
}
