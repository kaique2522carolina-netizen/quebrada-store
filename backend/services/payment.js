import axios from 'axios'

const MP_BASE_URL = 'https://api.mercadopago.com'
const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN

if (!MP_ACCESS_TOKEN || MP_ACCESS_TOKEN.startsWith('APP_USR-xxx')) {
  console.warn('⚠️  MP_ACCESS_TOKEN não configurado. Pagamentos reais desativados.')
}

/**
 * Creates a Mercado Pago payment preference
 * Returns: { preferenceId, initPoint }
 */
export async function createPreference({ items, payer }) {
  const total = items.reduce((acc, i) => acc + i.price * i.qty, 0)

  const payload = {
    items: items.map(item => ({
      title: item.name,
      quantity: item.qty,
      unit_price: item.price,
      currency_id: 'BRL',
    })),
    payer: {
      name: payer.nome,
      surname: payer.sobrenome,
      email: payer.email || 'customer@quebrada.store',
      phone: {
        area_code: payer.whatsapp.slice(1, 3),
        number: payer.whatsapp.slice(6),
      },
      identification: {
        type: 'CPF',
        number: payer.cpf.replace(/\D/g, ''),
      },
      address: {
        zip_code: payer.cep?.replace(/\D/g, ''),
        street_name: payer.logradouro,
        street_number: payer.numero,
      },
    },
    back_urls: {
      success: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/checkout/success`,
      failure: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/checkout/fail`,
      pending: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/checkout/pending`,
    },
    auto_return: 'approved',
    notification_url: `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/payment/webhook`,
    external_reference: `order-${Date.now()}`,
    statement_descriptor: 'QUEBRADA STORE',
  }

  try {
    const response = await axios.post(
      `${MP_BASE_URL}/checkout/preferences`,
      payload,
      {
        headers: {
          'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    )

    return {
      preferenceId: response.data.id,
      initPoint: response.data.init_point,
      sandboxInitPoint: response.data.sandbox_init_point,
    }
  } catch (error) {
    console.error('❌ Erro ao criar preferência:', error.response?.data || error.message)
    throw new Error(`Mercado Pago: ${error.response?.data?.message || error.message}`)
  }
}

/**
 * Gets payment details from Mercado Pago
 * Returns: { id, status, status_detail, payer, transaction_amount, ... }
 */
export async function getPaymentDetails(paymentId) {
  try {
    const response = await axios.get(
      `${MP_BASE_URL}/v1/payments/${paymentId}`,
      {
        headers: {
          'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
        },
      }
    )

    return {
      id: response.data.id,
      status: response.data.status,
      status_detail: response.data.status_detail,
      payer: response.data.payer,
      transaction_amount: response.data.transaction_amount,
      description: response.data.description,
      created_at: response.data.date_created,
      approved_at: response.data.date_approved,
    }
  } catch (error) {
    console.error('❌ Erro ao buscar status:', error.response?.data || error.message)
    throw new Error(`Mercado Pago: ${error.response?.data?.message || error.message}`)
  }
}
