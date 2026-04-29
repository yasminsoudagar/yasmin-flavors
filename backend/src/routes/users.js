import { Router } from 'express'
import { supabase } from '../lib/supabase.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// GET /api/users/me — get own profile
router.get('/me', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', req.userId)
    .single()

  if (error) return res.status(404).json({ error: 'Profile not found' })
  res.json(data)
})

// PATCH /api/users/me — update profile
router.patch('/me', requireAuth, async (req, res) => {
  const { full_name, phone, avatar_url } = req.body

  const { data, error } = await supabase
    .from('profiles')
    .update({ full_name, phone, avatar_url })
    .eq('id', req.userId)
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// GET /api/users/me/addresses
router.get('/me/addresses', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', req.userId)
    .order('is_default', { ascending: false })

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// POST /api/users/me/addresses
router.post('/me/addresses', requireAuth, async (req, res) => {
  const { label, street, city, state, zip_code, is_default } = req.body

  if (!street || !city) return res.status(400).json({ error: 'street and city are required' })

  // If new address is default, unset any existing default
  if (is_default) {
    await supabase
      .from('addresses')
      .update({ is_default: false })
      .eq('user_id', req.userId)
  }

  const { data, error } = await supabase
    .from('addresses')
    .insert({ user_id: req.userId, label, street, city, state, zip_code, is_default })
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json(data)
})

// PATCH /api/users/me/addresses/:id
router.patch('/me/addresses/:id', requireAuth, async (req, res) => {
  if (req.body.is_default) {
    await supabase
      .from('addresses')
      .update({ is_default: false })
      .eq('user_id', req.userId)
  }

  const { data, error } = await supabase
    .from('addresses')
    .update(req.body)
    .eq('id', req.params.id)
    .eq('user_id', req.userId)
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// DELETE /api/users/me/addresses/:id
router.delete('/me/addresses/:id', requireAuth, async (req, res) => {
  const { error } = await supabase
    .from('addresses')
    .delete()
    .eq('id', req.params.id)
    .eq('user_id', req.userId)

  if (error) return res.status(500).json({ error: error.message })
  res.json({ message: 'Address deleted' })
})

// GET /api/users/me/notifications
router.get('/me/notifications', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', req.userId)
    .order('created_at', { ascending: false })
    .limit(30)

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// PATCH /api/users/me/notifications/read — mark all as read
router.patch('/me/notifications/read', requireAuth, async (req, res) => {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', req.userId)

  if (error) return res.status(500).json({ error: error.message })
  res.json({ message: 'All notifications marked as read' })
})

export default router
