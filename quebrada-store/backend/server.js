import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import paymentRoutes from './routes/paymentRoutes.js'

const app = express()
const PORT = process.env.PORT || 3001

// ── Middleware ─────────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(morgan('dev'))
app.use(express.json())

// ── Routes ─────────────────────────────────────────────────────────────────────
app.use('/api/payment', paymentRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    mp_configured: !!(process.env.MP_ACCESS_TOKEN && !process.env.MP_ACCESS_TOKEN.startsWith('APP_USR-xxx')),
  })
})

// 404 catch-all
app.use((req, res) => {
  res.status(404).json({ message: 'Rota não encontrada' })
})

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: 'Erro interno do servidor' })
})

// ── Start ──────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Quebrada Store API rodando em http://localhost:${PORT}`)
  console.log(`📡 Ambiente: ${process.env.NODE_ENV || 'development'}`)
  console.log(
    process.env.MP_ACCESS_TOKEN && !process.env.MP_ACCESS_TOKEN.startsWith('APP_USR-xxx')
      ? '✅ Mercado Pago: CONFIGURADO'
      : '⚠️  Mercado Pago: aguardando credenciais (.env)'
  )
  console.log(`\nEndpoints disponíveis:`)
  console.log(`  POST /api/payment/create-preference`)
  console.log(`  GET  /api/payment/status/:paymentId`)
  console.log(`  POST /api/payment/webhook`)
  console.log(`  GET  /api/health\n`)
})
