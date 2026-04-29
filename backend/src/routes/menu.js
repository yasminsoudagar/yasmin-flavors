import { Router } from 'express'
import { supabase } from '../lib/supabase.js'
import { requireAdmin } from '../middleware/auth.js'

const router = Router()

// GET /api/menu/categories
router.get('/categories', async (req, res) => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// GET /api/menu/items
// Query params: category, veg, search, sort (price_asc|price_desc|rating|default), page, limit
router.get('/items', async (req, res) => {
  const { category, veg, search, sort = 'default', page = 1, limit = 20 } = req.query
  const offset = (Number(page) - 1) * Number(limit)

  let query = supabase
    .from('menu_items')
    .select('*, categories(name, emoji)', { count: 'exact' })
    .eq('is_available', true)

  if (category && category !== 'all') {
    // Support filtering by category name or ID
    const { data: cat } = await supabase
      .from('categories')
      .select('id')
      .ilike('name', category)
      .single()
    if (cat) query = query.eq('category_id', cat.id)
  }

  if (veg === 'true') query = query.eq('is_veg', true)

  if (search) query = query.ilike('name', `%${search}%`)

  switch (sort) {
    case 'price_asc':  query = query.order('price', { ascending: true }); break
    case 'price_desc': query = query.order('price', { ascending: false }); break
    case 'rating':     query = query.order('rating', { ascending: false }); break
    default:           query = query.order('sort_order')
  }

  query = query.range(offset, offset + Number(limit) - 1)

  const { data, error, count } = await query
  if (error) return res.status(500).json({ error: error.message })

  res.json({
    items: data,
    pagination: {
      total: count,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(count / Number(limit))
    }
  })
})

// GET /api/menu/items/:id
router.get('/items/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*, categories(name, emoji), reviews(rating, comment, created_at, profiles(full_name, avatar_url))')
    .eq('id', req.params.id)
    .single()

  if (error) return res.status(404).json({ error: 'Item not found' })
  res.json(data)
})

// POST /api/menu/items — Admin: create item
router.post('/items', requireAdmin, async (req, res) => {
  const { name, description, price, original_price, category_id, image_url, is_veg, stock_count, discount_pct } = req.body

  if (!name || !price) return res.status(400).json({ error: 'name and price are required' })

  const { data, error } = await supabase
    .from('menu_items')
    .insert({ name, description, price, original_price, category_id, image_url, is_veg, stock_count, discount_pct })
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json(data)
})

// PATCH /api/menu/items/:id — Admin: update item
router.patch('/items/:id', requireAdmin, async (req, res) => {
  const { data, error } = await supabase
    .from('menu_items')
    .update(req.body)
    .eq('id', req.params.id)
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// DELETE /api/menu/items/:id — Admin: soft delete (mark unavailable)
router.delete('/items/:id', requireAdmin, async (req, res) => {
  const { error } = await supabase
    .from('menu_items')
    .update({ is_available: false })
    .eq('id', req.params.id)

  if (error) return res.status(500).json({ error: error.message })
  res.json({ message: 'Item removed from menu' })
})

export default router
