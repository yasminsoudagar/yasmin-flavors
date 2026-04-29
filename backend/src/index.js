import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import menuRouter     from './routes/menu.js'
import ordersRouter   from './routes/orders.js'
import wishlistRouter from './routes/wishlist.js'
import usersRouter    from './routes/users.js'
import reviewsRouter  from './routes/reviews.js'
import paymentsRouter from './routes/payments.js'

const app  = express()
const PORT = process.env.PORT || 3001

// ── Stripe webhook needs raw body ───────────────────────────
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }))

// ── Global middleware ────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://yasmin-flavors-feasty.lovable.app',
  credentials: true
}))
app.use(express.json())

// ── Routes ───────────────────────────────────────────────────
app.use('/api/menu',     menuRouter)
app.use('/api/orders',   ordersRouter)
app.use('/api/wishlist', wishlistRouter)
app.use('/api/users',    usersRouter)
app.use('/api/reviews',  reviewsRouter)
app.use('/api/payments', paymentsRouter)

// ── Health check ─────────────────────────────────────────────
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }))

// ── 404 handler ──────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ error: 'Route not found' }))

// ── Error handler ────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`🚀 Yasmin Flavors API running on port ${PORT}`)
})
