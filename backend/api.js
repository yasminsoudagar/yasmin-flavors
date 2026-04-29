// ============================================================
// api.js — Drop this into your Lovable frontend src/lib/
// Handles all calls to the Yasmin Flavors backend API
// ============================================================

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

// Helper: get Supabase session token
async function getToken() {
  const { createClient } = await import('@supabase/supabase-js')
  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
  )
  const { data: { session } } = await supabase.auth.getSession()
  return session?.access_token
}

async function request(path, options = {}) {
  const token = await getToken()
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error || 'API error')
  return json
}

// ── Menu ──────────────────────────────────────────────────────
export const menuApi = {
  getCategories: () =>
    request('/api/menu/categories'),

  getItems: (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return request(`/api/menu/items${qs ? '?' + qs : ''}`)
  },

  getItem: (id) =>
    request(`/api/menu/items/${id}`)
}

// ── Orders ────────────────────────────────────────────────────
export const ordersApi = {
  getMyOrders: () =>
    request('/api/orders'),

  getOrder: (id) =>
    request(`/api/orders/${id}`),

  placeOrder: (body) =>
    request('/api/orders', { method: 'POST', body: JSON.stringify(body) })
}

// ── Wishlist ──────────────────────────────────────────────────
export const wishlistApi = {
  getWishlist: () =>
    request('/api/wishlist'),

  addItem: (item_id) =>
    request('/api/wishlist', { method: 'POST', body: JSON.stringify({ item_id }) }),

  removeItem: (item_id) =>
    request(`/api/wishlist/${item_id}`, { method: 'DELETE' }),

  clearAll: () =>
    request('/api/wishlist', { method: 'DELETE' })
}

// ── User ──────────────────────────────────────────────────────
export const userApi = {
  getProfile: () =>
    request('/api/users/me'),

  updateProfile: (body) =>
    request('/api/users/me', { method: 'PATCH', body: JSON.stringify(body) }),

  getAddresses: () =>
    request('/api/users/me/addresses'),

  addAddress: (body) =>
    request('/api/users/me/addresses', { method: 'POST', body: JSON.stringify(body) }),

  deleteAddress: (id) =>
    request(`/api/users/me/addresses/${id}`, { method: 'DELETE' }),

  getNotifications: () =>
    request('/api/users/me/notifications'),

  markNotificationsRead: () =>
    request('/api/users/me/notifications/read', { method: 'PATCH' })
}

// ── Reviews ───────────────────────────────────────────────────
export const reviewsApi = {
  getReviews: (item_id, page = 1) =>
    request(`/api/reviews?item_id=${item_id}&page=${page}`),

  submitReview: (body) =>
    request('/api/reviews', { method: 'POST', body: JSON.stringify(body) }),

  deleteReview: (id) =>
    request(`/api/reviews/${id}`, { method: 'DELETE' })
}

// ── Payments ──────────────────────────────────────────────────
export const paymentsApi = {
  createPaymentIntent: (order_id) =>
    request('/api/payments/create-intent', { method: 'POST', body: JSON.stringify({ order_id }) })
}
