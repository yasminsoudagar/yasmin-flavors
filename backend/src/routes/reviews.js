import { Router } from 'express'
import { supabase } from '../lib/supabase.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// GET /api/reviews?item_id=xxx
router.get('/', async (req, res) => {
  const { item_id, page = 1, limit = 10 } = req.query
  if (!item_id) return res.status(400).json({ error: 'item_id is required' })

  const offset = (Number(page) - 1) * Number(limit)

  const { data, error, count } = await supabase
    .from('reviews')
    .select('*, profiles(full_name, avatar_url)', { count: 'exact' })
    .eq('item_id', item_id)
    .order('created_at', { ascending: false })
    .range(offset, offset + Number(limit) - 1)

  if (error) return res.status(500).json({ error: error.message })
  res.json({ reviews: data, total: count })
})

// POST /api/reviews — submit a review
router.post('/', requireAuth, async (req, res) => {
  const { item_id, order_id, rating, comment } = req.body

  if (!item_id || !rating) return res.status(400).json({ error: 'item_id and rating are required' })
  if (rating < 1 || rating > 5) return res.status(400).json({ error: 'Rating must be 1-5' })

  // Optional: verify user actually ordered this item
  if (order_id) {
    const { data: orderItem } = await supabase
      .from('order_items')
      .select('id')
      .eq('item_id', item_id)
      .eq('order_id', order_id)
      .single()

    if (!orderItem) return res.status(403).json({ error: 'You can only review items you ordered' })
  }

  const { data, error } = await supabase
    .from('reviews')
    .insert({ user_id: req.userId, item_id, order_id, rating, comment })
    .select('*, profiles(full_name, avatar_url)')
    .single()

  if (error?.code === '23505') return res.status(409).json({ error: 'You have already reviewed this item for this order' })
  if (error) return res.status(500).json({ error: error.message })

  res.status(201).json(data)
})

// PATCH /api/reviews/:id
router.patch('/:id', requireAuth, async (req, res) => {
  const { rating, comment } = req.body

  const { data, error } = await supabase
    .from('reviews')
    .update({ rating, comment })
    .eq('id', req.params.id)
    .eq('user_id', req.userId)
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// DELETE /api/reviews/:id
router.delete('/:id', requireAuth, async (req, res) => {
  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', req.params.id)
    .eq('user_id', req.userId)

  if (error) return res.status(500).json({ error: error.message })
  res.json({ message: 'Review deleted' })
})

export default router
