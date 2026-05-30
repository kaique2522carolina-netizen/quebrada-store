import { MercadoPagoConfig, Preference, Payment } from 'mercadopago'

// Initialize MP client with token from .env
// When MP_ACCESS_TOKEN is set, payments become real
const getClient = () => {
  const token = process.env.MP_ACCESS_TOKEN
  if (!token || token.startsWith('APP_USR-xxx')) {
    return null // sandbox mode
  }
  return new MercadoPagoConfig({ accessToken: token })
}

/**
 * Creates a Mercado Pago payment preference.
 * When MP_ACCESS_TOKEN is not set, returns a simulated response.
 *
 * @param {Object} orderData - { items, payer, backUrls, notificationUrl }
 * @returns {Promise<{preferenceId: string, initPoint: string, sandboxInitPoint: string}>}
 */
export async function createPreference(orderData) {
  const client = getClient()

  // SANDBOX MODE — credentials not configured yet
  if (!client) {
    console.log('⚠️  MP_ACCESS_TOKEN not set — returning sandbox response')
    const fakeId = `SANDBOX-${Date.now()}`
    return {
      preferenceId: fakeId,
      initPoint: `https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=${fakeId}`,
      sandboxInitPoint: `https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=${fakeId}`,
      sandbox: true,
    }
  }

  // PRODUCTION MODE — real MP preference
  const preference = new Preference(client)
  const body = {
    items: orderData.items.map(item => ({
      id: String(item.id),
      title: item.name,
      quantity: item.qty,
      unit_price: item.price,
      currency_id: 'BRL',
      picture_url: '',
    })),
    payer: {
      name: orderData.payer.nome,
      surname: orderData.payer.sobrenome,
      email: orderData.payer.email || 'cliente@quebradastore.com',
      phone: {
        area_code: orderData.payer.whatsapp?.replace(/\D/g, '').slice(0, 2),
        number: orderData.payer.whatsapp?.replace(/\D/g, '').slice(2),
      },
      identification: {
        type: 'CPF',
        number: orderData.payer.cpf?.replace(/\D/g, ''),
      },
      address: {
        zip_code: orderData.payer.cep?.replace(/\D/g, ''),
        street_name: orderData.payer.logradouro,
        street_number: Number(orderData.payer.numero) || 0,
      },
    },
    back_urls: {
      success: `${process.env.FRONTEND_URL}/checkout/success`,
      failure: `${process.env.FRONTEND_URL}/checkout/failure`,
      pending: `${process.env.FRONTEND_URL}/checkout/pending`,
    },
    auto_return: 'approved',
    notification_url: process.env.WEBHOOK_URL,
    statement_descriptor: 'QUEBRADA STORE',
    external_reference: `QS-${Date.now()}`,
  }

  const result = await preference.create({ body })
  return {
    preferenceId: result.id,
    initPoint: result.init_point,
    sandboxInitPoint: result.sandbox_init_point,
  }
}

/**
 * Gets payment details by MP payment ID.
 * @param {string} paymentId
 */
export async function getPaymentDetails(paymentId) {
  const client = getClient()
  if (!client) return { status: 'sandbox', id: paymentId }

  const payment = new Payment(client)
  return payment.get({ id: paymentId })
}
