import { Router } from 'express'
import Stripe from 'stripe'
import { supabase } from '../lib/supabase.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// POST /api/payments/create-intent
// Creates a Stripe PaymentIntent; frontend uses client_secret to render Stripe UI
router.post('/create-intent', requireAuth, async (req, res) => {
  const { order_id } = req.body
  if (!order_id) return res.status(400).json({ error: 'order_id is required' })

  // Fetch order and verify ownership
  const { data: order, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', order_id)
    .eq('user_id', req.userId)
    .single()

  if (error || !order) return res.status(404).json({ error: 'Order not found' })
  if (order.paid_at)   return res.status(409).json({ error: 'Order already paid' })

  const paymentIntent = await stripe.paymentIntents.create({
    amount:   Math.round(order.total * 100),   // Stripe uses cents
    currency: 'usd',
    metadata: {
      order_id:     order.id,
      order_number: order.order_number,
      user_id:      req.userId
    }
  })

  // Save intent ID on order for webhook reconciliation
  await supabase
    .from('orders')
    .update({ stripe_payment_intent_id: paymentIntent.id })
    .eq('id', order.id)

  res.json({ client_secret: paymentIntent.client_secret })
})

// POST /api/payments/webhook — Stripe webhook (no auth — verified by signature)
router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature']

  let event
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Webhook signature error:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object
    const order_id = pi.metadata?.order_id

    if (order_id) {
      await supabase
        .from('orders')
        .update({ paid_at: new Date().toISOString(), status: 'confirmed' })
        .eq('id', order_id)
    }
  }

  if (event.type === 'payment_intent.payment_failed') {
    const pi = event.data.object
    console.error('Payment failed for order:', pi.metadata?.order_id)
  }

  res.json({ received: true })
})

export default router
