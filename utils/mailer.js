import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// ===============================
// BREVO SMTP CONFIGURATION (Port 2525)
// ===============================
const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587, 
  secure: false, 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  connectionTimeout: 40000,
  greetingTimeout: 40000,
  socketTimeout: 40000,
  tls: {
    rejectUnauthorized: false,
  },
});

// VERIFY CONNECTION
transporter.verify((error, success) => {
  if (error) {
    console.log('[NotificationService] Brevo SMTP Error ❌:', error.message);
  } else {
    console.log('[NotificationService] Brevo SMTP Ready ✅');
  }
});

const BRAND_NAME = 'Swarnstree';
const BRAND_EMAIL = 'support@swarnstree.com';

const getRecipientEmail = (order) => {
  return order.guestDetails?.email || order.user?.email;
};

const getRecipientName = (order) => {
  return order.guestDetails?.name || order.user?.name || 'Customer';
};

/**
 * Sends a premium HTML email for order confirmation
 */
const sendOrderConfirmationEmail = async (order) => {
  const recipientEmail = getRecipientEmail(order);
  if (!recipientEmail) {
    console.warn('[NotificationService] No email found for order:', order._id);
    return;
  }

  const itemsHtml = order.products.map(item => {
    const productName = item.product?.name || 'Product';
    const productImage = item.product?.images?.[0] || item.product?.image || '';
    
    return `
    <tr style="border-bottom: 1px solid #eee;">
      <td style="padding: 12px 0;">
        ${productImage ? `<img src="${productImage}" alt="${productName}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px; margin-right: 12px; vertical-align: middle;">` : ''}
        <span style="font-weight: 600; color: #2c1810;">${productName}</span>
      </td>
      <td style="padding: 12px 0; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px 0; text-align: right; font-weight: 700;">₹${(item.price * item.quantity).toLocaleString()}</td>
    </tr>
  `}).join('');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f9f6f2; }
        .container { max-width: 600px; margin: 20px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #e8dfd2; }
        .header { background: #c5a059; color: #000; padding: 40px 20px; text-align: center; }
        .content { padding: 30px; }
        .order-id { font-family: monospace; font-size: 18px; color: #c5a059; font-weight: bold; margin-bottom: 20px; }
        .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        .footer { background: #faf8f4; padding: 20px; text-align: center; font-size: 12px; color: #8b7355; border-top: 1px solid #eee; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-family: serif; font-size: 28px;">${BRAND_NAME}</h1>
          <p style="margin: 10px 0 0; opacity: 0.8; letter-spacing: 2px; font-size: 12px; text-transform: uppercase;">Order Confirmed</p>
        </div>
        <div class="content">
          <h2 style="color: #000;">Hi ${getRecipientName(order)},</h2>
          <p>Great news! Your order has been confirmed and is now being processed.</p>
          <div class="order-id">Order #${order._id.toString().slice(-8).toUpperCase()}</div>
          <table class="table">
            <thead>
              <tr style="border-bottom: 2px solid #e8dfd2; text-align: left; font-size: 12px; color: #8b7355; text-transform: uppercase;">
                <th style="padding-bottom: 10px;">Item</th>
                <th style="padding-bottom: 10px; text-align: center;">Qty</th>
                <th style="padding-bottom: 10px; text-align: right;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          <div style="margin-top: 25px; border-top: 2px solid #f0ebe3; padding-top: 15px;">
            <div style="display: flex; justify-content: space-between; padding: 10px 0; font-size: 18px; font-weight: bold; color: #000; border-top: 1px solid #eee; margin-top: 10px;">
              <span>Total Paid:</span><span style="color: #c5a059;">₹${order.totalAmount?.toLocaleString()}</span>
            </div>
          </div>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} ${BRAND_NAME}. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"${BRAND_NAME}" <${process.env.SMTP_FROM || process.env.SMTP_USER || BRAND_EMAIL}>`,
      to: recipientEmail,
      subject: `Order Confirmed - #${order._id.toString().slice(-8).toUpperCase()}`,
      html: htmlContent,
    });
    console.log('[NotificationService] Brevo Email sent ✅:', info.messageId);
    return info;
  } catch (error) {
    console.error('[NotificationService] Brevo Sending Failed ❌:', error.message);
    throw error;
  }
};

/**
 * Sends Email when order is Shipped
 */
const sendOrderShippedEmail = async (order) => {
  const recipientEmail = getRecipientEmail(order);
  if (!recipientEmail) return;

  const htmlContent = `<h1>Order Shipped! 🚚</h1><p>Hi ${getRecipientName(order)}, your order #${order._id.toString().slice(-8).toUpperCase()} is on its way.</p>`;

  await transporter.sendMail({
    from: `"${BRAND_NAME}" <${process.env.SMTP_FROM || process.env.SMTP_USER || BRAND_EMAIL}>`,
    to: recipientEmail,
    subject: `Order Shipped! 🚚 - #${order._id.toString().slice(-8).toUpperCase()}`,
    html: htmlContent,
  });
};

/**
 * Sends Email when order is Delivered
 */
const sendOrderDeliveredEmail = async (order) => {
  const recipientEmail = getRecipientEmail(order);
  if (!recipientEmail) return;

  const htmlContent = `<h1>Delivered! 🎉</h1><p>Hi ${getRecipientName(order)}, your order #${order._id.toString().slice(-8).toUpperCase()} has been delivered. Enjoy!</p>`;

  await transporter.sendMail({
    from: `"${BRAND_NAME}" <${process.env.SMTP_FROM || process.env.SMTP_USER || BRAND_EMAIL}>`,
    to: recipientEmail,
    subject: `Order Delivered! 🎉 - #${order._id.toString().slice(-8).toUpperCase()}`,
    html: htmlContent,
  });
};

/**
 * Sends Email when order is Cancelled
 */
const sendOrderCancelledEmail = async (order) => {
  const recipientEmail = getRecipientEmail(order);
  if (!recipientEmail) return;

  const htmlContent = `<h1>Order Cancelled ❌</h1><p>Hi ${getRecipientName(order)}, your order #${order._id.toString().slice(-8).toUpperCase()} has been cancelled.</p><p>If you have any questions, please contact our support.</p>`;

  await transporter.sendMail({
    from: `"${BRAND_NAME}" <${process.env.SMTP_FROM || process.env.SMTP_USER || BRAND_EMAIL}>`,
    to: recipientEmail,
    subject: `Order Cancelled - #${order._id.toString().slice(-8).toUpperCase()}`,
    html: htmlContent,
  });
};

/**
 * Main export function to handle status changes
 */
export const sendOrderStatusEmail = async (order, status) => {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn('[NotificationService] SMTP credentials not configured. Skipping email send.');
      return;
    }

    if (status === 'Confirmed') {
      return await sendOrderConfirmationEmail(order);
    } else if (status === 'Shipped') {
      return await sendOrderShippedEmail(order);
    } else if (status === 'Delivered') {
      return await sendOrderDeliveredEmail(order);
    } else if (status === 'Cancelled') {
      return await sendOrderCancelledEmail(order);
    }
  } catch (error) {
    console.error('[NotificationService] Error sending order status email:', error);
  }
};
