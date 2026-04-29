import { Resend } from 'resend'

let resend = null
if (process.env.RESEND_API_KEY) {
  const { Resend } = await import('resend')
  resend = new Resend(process.env.RESEND_API_KEY)
}
const FROM = process.env.EMAIL_FROM || 'Yasmin Flavors <orders@yasminflavors.com>'

export async function sendOrderConfirmationEmail(email, order) {
  if (!email || !process.env.RESEND_API_KEY) return

  await resend.emails.send({
    from:    FROM,
    to:      email,
    subject: `Order Confirmed - ${order.order_number} 🎉`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px;">
        <h1 style="color:#E8593C">Yasmin Flavors 🌸</h1>
        <h2>Your order is confirmed!</h2>
        <p>Hi there! We've received your order and it's being prepared.</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0">
          <tr>
            <td style="padding:8px;background:#f9f9f9"><strong>Order #</strong></td>
            <td style="padding:8px">${order.order_number}</td>
          </tr>
          <tr>
            <td style="padding:8px"><strong>Total</strong></td>
            <td style="padding:8px">$${order.total.toFixed(2)}</td>
          </tr>
          <tr>
            <td style="padding:8px;background:#f9f9f9"><strong>Delivery fee</strong></td>
            <td style="padding:8px">${order.delivery_fee === 0 ? 'Free!' : '$' + order.delivery_fee.toFixed(2)}</td>
          </tr>
        </table>
        <p>We'll notify you as your order progresses. Estimated delivery: <strong>30 minutes</strong>.</p>
        <p style="color:#888;font-size:12px">© Yasmin Flavors</p>
      </div>
    `
  })
}

export async function sendOrderStatusEmail(email, order) {
  if (!email || !process.env.RESEND_API_KEY) return

  const statusMessages = {
    preparing:        { subject: 'Your order is being prepared 👨‍🍳', body: 'Our chefs are working on your delicious meal!' },
    out_for_delivery: { subject: 'Your order is on the way! 🛵',    body: 'Your food is out for delivery. Get ready!' },
    delivered:        { subject: 'Order delivered! Enjoy 🎉',        body: 'Your order has been delivered. Bon appétit!' }
  }

  const msg = statusMessages[order.status]
  if (!msg) return

  await resend.emails.send({
    from:    FROM,
    to:      email,
    subject: `${order.order_number} — ${msg.subject}`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px;">
        <h1 style="color:#E8593C">Yasmin Flavors 🌸</h1>
        <h2>${msg.subject}</h2>
        <p>${msg.body}</p>
        <p>Order: <strong>${order.order_number}</strong></p>
        <p style="color:#888;font-size:12px">© Yasmin Flavors</p>
      </div>
    `
  })
}
