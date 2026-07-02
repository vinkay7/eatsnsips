export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const {
    full_name, email, phone, whatsapp, order_type, menu_category, delivery_type, address, landmark, preferred_time, extra_notes, items
  } = req.body;

  const resendApiKey = process.env.RESEND_API_KEY;
  const ownerEmail = 'eatsnsipsafrica@gmail.com';
  const logoUrl = 'https://eatsnsips.vercel.app/assets/official-logo.png';

  const orderItemsHtml = items && items.length > 0 
    ? items.map(item => `<li><strong style="color: #2E2E2E;">${item.name}</strong>: ${item.quantity}</li>`).join('')
    : '<li>No items listed</li>';

  const ownerEmailBody = `<div style="font-family: sans-serif; color: #2E2E2E; max-width: 600px; margin: auto; border: 1px solid #E6E8EE; padding: 20px;"><h2 style="color: #2B52C3;">New Order Received!</h2><p><strong>Customer:</strong> ${full_name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Phone:</strong> ${phone}</p><p><strong>Order Type:</strong> ${order_type}</p><h3 style="color: #2B52C3;">Items:</h3><ul>${orderItemsHtml}</ul><p><strong>Delivery:</strong> ${delivery_type} at ${preferred_time}</p><p><strong>Notes:</strong> ${extra_notes}</p></div>`;

  const customerEmailBody = `<div style="font-family: sans-serif; color: #2E2E2E; max-width: 600px; margin: auto; border: 1px solid #E6E8EE; padding: 40px; text-align: center;"><img src="${logoUrl}" alt="Eats N Sips Logo" style="width: 100px; border-radius: 50%;"><h1 style="color: #9f080c;">Hello, ${full_name}!</h1><p>We've received your order request!</p><div style="text-align: left; background: #fff4d9; padding: 20px; border-radius: 12px; border: 1px solid #f3b21a;"><h3>Order Summary</h3><p><strong>Order Type:</strong> ${order_type}</p><ul>${orderItemsHtml}</ul></div><p>We will contact you shortly at ${phone} to confirm.</p></div>`;

  try {
    await fetch('https://api.resend.com/emails', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${resendApiKey}` }, body: JSON.stringify({ from: 'Eats N Sips <orders@resend.dev>', to: [ownerEmail], subject: `New Order: ${order_type} from ${full_name}`, html: ownerEmailBody }) });
    await fetch('https://api.resend.com/emails', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${resendApiKey}` }, body: JSON.stringify({ from: 'Eats N Sips <orders@resend.dev>', to: [email], subject: `Your Eats N Sips Order Request`, html: customerEmailBody }) });
    return res.status(200).json({ success: true });
  } catch (error) { return res.status(500).json({ error: 'Failed to process order' }); }
}