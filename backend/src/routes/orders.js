import { Router } from 'express'
import { supabase } from '../lib/supabase.js'
import { requireAuth, requireAdmin } from '../middleware/auth.js'
import { sendOrderConfirmationEmail, sendOrderStatusEmail } from '../lib/email.js'

const router = Router()

// GET /api/orders — get current user's orders
router.get('/', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items(*, menu_items(name, image_url)),
      addresses(street, city)
    `)
    .eq('user_id', req.userId)
    .order('created_at', { ascending: false })

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// GET /api/orders/:id — get single order
router.get('/:id', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items(*, menu_items(name, image_url, description)),
      addresses(*)
    `)
    .eq('id', req.params.id)
    .eq('user_id', req.userId)
    .single()

  if (error) return res.status(404).json({ error: 'Order not found' })
  res.json(data)
})

// POST /api/orders — place a new order
router.post('/', requireAuth, async (req, res) => {
  const { items, address_id, notes } = req.body

  // items: [{ item_id, quantity }]
  if (!items?.length) return res.status(400).json({ error: 'No items in order' })
  if (!address_id)    return res.status(400).json({ error: 'Delivery address required' })

  // Fetch prices from DB (never trust client-side prices)
  const itemIds = items.map(i => i.item_id)
  const { data: menuItems, error: menuError } = await supabase
    .from('menu_items')
    .select('id, name, price, is_available, stock_count')
    .in('id', itemIds)

  if (menuError) return res.status(500).json({ error: menuError.message })

  // Validate availability and build order items
  const orderItems = []
  let subtotal = 0

  for (const reqItem of items) {
    const menuItem = menuItems.find(m => m.id === reqItem.item_id)
    if (!menuItem)             return res.status(400).json({ error: `Item ${reqItem.item_id} not found` })
    if (!menuItem.is_available) return res.status(400).json({ error: `${menuItem.name} is not available` })
    if (menuItem.stock_count !== null && menuItem.stock_count < reqItem.quantity) {
      return res.status(400).json({ error: `Only ${menuItem.stock_count} of ${menuItem.name} left` })
    }

    const lineTotal = menuItem.price * reqItem.quantity
    subtotal += lineTotal
    orderItems.push({
      item_id:  menuItem.id,
      name:     menuItem.name,
      price:    menuItem.price,
      quantity: reqItem.quantity,
      subtotal: lineTotal
    })
  }

  const delivery_fee    = subtotal >= 25 ? 0 : 3.99
  const total           = subtotal + delivery_fee

  // Create order in a transaction-like fashion
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({ user_id: req.userId, address_id, subtotal, delivery_fee, total, notes })
    .select()
    .single()

  if (orderError) return res.status(500).json({ error: orderError.message })

  // Insert order items
  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems.map(i => ({ ...i, order_id: order.id })))

  if (itemsError) return res.status(500).json({ error: itemsError.message })

  // Decrement stock_count for limited items
  for (const reqItem of items) {
    const menuItem = menuItems.find(m => m.id === reqItem.item_id)
    if (menuItem?.stock_count !== null) {
      await supabase
        .from('menu_items')
        .update({ stock_count: menuItem.stock_count - reqItem.quantity })
        .eq('id', menuItem.id)
    }
  }

  // Send confirmation email (non-blocking)
  sendOrderConfirmationEmail(req.user.email, order).catch(console.error)

  // Create in-app notification
  await supabase.from('notifications').insert({
    user_id: req.userId,
    title:   'Order Confirmed! 🎉',
    body:    `Your order ${order.order_number} has been placed successfully.`,
    type:    'order',
    order_id: order.id
  })

  res.status(201).json(order)
})

// PATCH /api/orders/:id/status — Admin: update order status
router.patch('/:id/status', requireAdmin, async (req, res) => {
  const { status } = req.body
  const validStatuses = ['confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled']

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` })
  }

  const { data: order, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', req.params.id)
    .select('*, profiles(id)')
    .single()

  if (error) return res.status(500).json({ error: error.message })

  // Notify customer
  const messages = {
    preparing:        'Your order is being prepared 👨‍🍳',
    out_for_delivery: 'Your order is on the way! 🛵',
    delivered:        'Your order has been delivered. Enjoy! 🎉',
    cancelled:        'Your order has been cancelled.'
  }

  if (messages[status]) {
    await supabase.from('notifications').insert({
      user_id:  order.profiles.id,
      title:    `Order ${order.order_number} Update`,
      body:     messages[status],
      type:     'order',
      order_id: order.id
    })
  }

  res.json(order)
})

// GET /api/orders/admin/all — Admin: see all orders
router.get('/admin/all', requireAdmin, async (req, res) => {
  const { status, page = 1, limit = 30 } = req.query
  const offset = (Number(page) - 1) * Number(limit)

  let query = supabase
    .from('orders')
    .select('*, profiles(full_name), addresses(street, city), order_items(name, quantity, price)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + Number(limit) - 1)

  if (status) query = query.eq('status', status)

  const { data, error, count } = await query
  if (error) return res.status(500).json({ error: error.message })
  res.json({ orders: data, total: count })
})

export default router
