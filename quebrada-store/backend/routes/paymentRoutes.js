import { Router } from 'express'
import {
  createPaymentPreference,
  getPaymentStatus,
  handleWebhook,
} from '../controllers/paymentController.js'

const router = Router()

// POST /api/payment/create-preference
router.post('/create-preference', createPaymentPreference)

// GET /api/payment/status/:paymentId
router.get('/status/:paymentId', getPaymentStatus)

// POST /api/payment/webhook — Mercado Pago webhook
router.post('/webhook', handleWebhook)

export default router
