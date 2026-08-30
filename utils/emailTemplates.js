export const getOrderStatusEmailTemplate = (order, status) => {
  const customerName = order.user ? order.user.name : order.guestDetails?.name;
  let title = '';
  let message = '';
  let color = '#c5a059'; // primary color

  switch (status) {
    case 'Confirmed':
      title = 'Order Confirmed';
      message = 'Thank you for your purchase! We have received your order and it is now being processed.';
      color = '#10b981'; // success
      break;
    case 'Shipped':
      title = 'Order Shipped';
      message = 'Great news! Your order has been shipped and is on its way to you.';
      break;
    case 'Delivered':
      title = 'Order Delivered';
      message = 'Your order has been delivered. We hope you love it!';
      color = '#10b981';
      break;
    case 'Cancelled':
      title = 'Order Cancelled';
      message = 'Your order has been cancelled. If you have any questions, please contact our support team.';
      color = '#ef4444'; // danger
      break;
    default:
      title = `Order Status: ${status}`;
      message = `The status of your order has been updated to: ${status}.`;
  }

  const productsHtml = order.products.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee; display: flex; align-items: center; gap: 10px;">
        <img src="${item.product?.images?.[0] || 'https://via.placeholder.com/50'}" alt="${item.product?.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;" />
        <span style="font-weight: 600; color: #333;">${item.product?.name || 'Product'}</span>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center; color: #555;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right; color: #555; font-weight: 600;">₹${(item.price || 0).toLocaleString()}</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f9f9f9; padding: 20px; color: #333; margin: 0; }
        .container { max-width: 600px; margin: 0 auto; background-color: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
        .header { background-color: ${color}; color: #fff; padding: 30px 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; letter-spacing: 1px; }
        .content { padding: 30px 20px; }
        .content h2 { margin-top: 0; font-size: 20px; color: #333; }
        .content p { font-size: 15px; line-height: 1.6; color: #555; margin-bottom: 20px; }
        .order-details { margin-bottom: 30px; border: 1px solid #eee; border-radius: 6px; padding: 15px; background-color: #fafafa; }
        .order-details p { margin: 5px 0; font-size: 14px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th { text-align: left; padding: 12px; font-size: 14px; color: #777; border-bottom: 2px solid #eee; }
        th.center { text-align: center; }
        th.right { text-align: right; }
        .total-row { padding: 15px 12px; text-align: right; font-size: 18px; font-weight: bold; color: ${color}; border-top: 2px solid #eee; }
        .footer { padding: 20px; text-align: center; font-size: 13px; color: #888; background-color: #f1f1f1; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${title}</h1>
        </div>
        <div class="content">
          <h2>Hi ${customerName},</h2>
          <p>${message}</p>
          
          <div class="order-details">
            <p><strong>Order ID:</strong> #${order._id.toString().substring(0,8)}</p>
            <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
            <p><strong>Shipping Address:</strong><br>
              ${order.shippingAddress?.street || ''}<br>
              ${order.shippingAddress?.city || ''}, ${order.shippingAddress?.state || ''} - ${order.shippingAddress?.zipCode || ''}
            </p>
          </div>

          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th class="center">Qty</th>
                <th class="right">Price</th>
              </tr>
            </thead>
            <tbody>
              ${productsHtml}
            </tbody>
          </table>
          
          <div class="total-row">
            Total: ₹${(order.totalAmount || 0).toLocaleString()}
          </div>
          
          <p style="margin-top: 30px;">If you have any questions, please reply to this email.</p>
          <p>Best regards,<br><strong>Swarnstree Team</strong></p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} Swarnstree. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
};
