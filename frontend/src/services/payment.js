const API_BASE = '/api'

/**
 * Creates a payment preference via backend.
 * Backend sends to Mercado Pago when MP_ACCESS_TOKEN is configured.
 * @param {Object} orderData
 * @returns {Promise<{preferenceId: string, initPoint: string}>}
 */
export async function createPaymentPreference(orderData) {
  const res = await fetch(`${API_BASE}/payment/create-preference`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message || 'Erro ao criar preferência de pagamento')
  }

  return res.json()
}

/**
 * Gets order status by preference ID.
 * @param {string} preferenceId
 */
export async function getOrderStatus(preferenceId) {
  const res = await fetch(`${API_BASE}/payment/status/${preferenceId}`)
  if (!res.ok) throw new Error('Erro ao buscar status')
  return res.json()
}
