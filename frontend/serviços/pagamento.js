const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

/**
 * Creates a payment preference and returns MP checkout link
 */
export async function createPaymentPreference(orderData) {
  try {
    const response = await fetch(`${API_URL}/api/payment/create-preference`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Erro ao criar preferência de pagamento')
    }

    return await response.json()
  } catch (err) {
    console.error('❌ Payment preference error:', err)
    throw err
  }
}

/**
 * Gets payment status by ID
 */
export async function getPaymentStatus(paymentId) {
  try {
    const response = await fetch(`${API_URL}/api/payment/status/${paymentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Erro ao buscar status do pagamento')
    }

    return await response.json()
  } catch (err) {
    console.error('❌ Payment status error:', err)
    throw err
  }
}
