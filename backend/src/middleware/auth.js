import { createClient } from '@supabase/supabase-js'

// Verifies the Bearer token from the frontend and attaches user to req
export async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' })
  }

  const token = authHeader.split(' ')[1]

  // Use anon client to verify user token
  const userClient = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  )

  const { data: { user }, error } = await userClient.auth.getUser(token)

  if (error || !user) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }

  req.user = user
  req.userId = user.id
  next()
}

// Admin-only middleware (checks profiles table for role)
export async function requireAdmin(req, res, next) {
  await requireAuth(req, res, async () => {
    const { supabase } = await import('../lib/supabase.js')
    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', req.userId)
      .single()

    if (data?.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' })
    }
    next()
  })
}
