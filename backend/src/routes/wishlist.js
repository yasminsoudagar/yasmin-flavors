import { Router } from 'express'
import { supabase } from '../lib/supabase.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// GET /api/wishlist
router.get('/', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('wishlist')
    .select('*, menu_items(id, name, price, image_url, is_available, rating)')
    .eq('user_id', req.userId)
    .order('created_at', { ascending: false })

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// POST /api/wishlist — add item
router.post('/', requireAuth, async (req, res) => {
  const { item_id } = req.body
  if (!item_id) return res.status(400).json({ error: 'item_id is required' })

  const { data, error } = await supabase
    .from('wishlist')
    .insert({ user_id: req.userId, item_id })
    .select('*, menu_items(name, image_url)')
    .single()

  if (error?.code === '23505') return res.status(409).json({ error: 'Item already in wishlist' })
  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json(data)
})

// DELETE /api/wishlist/:item_id — remove item
router.delete('/:item_id', requireAuth, async (req, res) => {
  const { error } = await supabase
    .from('wishlist')
    .delete()
    .eq('user_id', req.userId)
    .eq('item_id', req.params.item_id)

  if (error) return res.status(500).json({ error: error.message })
  res.json({ message: 'Removed from wishlist' })
})

// DELETE /api/wishlist — clear all
router.delete('/', requireAuth, async (req, res) => {
  const { error } = await supabase
    .from('wishlist')
    .delete()
    .eq('user_id', req.userId)

  if (error) return res.status(500).json({ error: error.message })
  res.json({ message: 'Wishlist cleared' })
})

export default router
