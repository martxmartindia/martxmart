import transporter from "@/utils/nodemailer";

const welcomeEmail = async (name: string, email: string) => {
  const info = await transporter.sendMail({
    from: '"MartxMart" <support@martxmart.com>',
    to: email,
    subject: `Welcome to martXmart, ${name} ! Grab 10% Off Your First Order 🎉 `,
    text: `Hi ${name},  

We’re so excited to welcome you to the *martXmart* family! 🛒 At martXmart, we’re all about bringing you the best in [e.g., fashion, electronics, home essentials] at unbeatable prices.  

As a thank-you for joining us, here’s a special *10% off coupon* for your first purchase: *WELCOME10*. Just use it at checkout to save!  

Ready to start shopping? [CTA Button: Explore Now]  

Have questions? Our friendly team is here for you at *support@martxmart.com*.  

Happy Shopping!  
The martXmart Team  
www.martxmart.com  

 MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985 `,
    html: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Welcome to martXmart</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #333;
        background-color: #f9f9f9;
        padding: 20px;
      }
      .email-container {
        max-width: 600px;
        margin: 0 auto;
        background: #ffffff;
        border: 1px solid #ddd;
        border-radius: 10px;
        padding: 30px;
      }
      .button {
        display: inline-block;
        padding: 12px 20px;
        margin-top: 20px;
        font-size: 16px;
        color: #fff;
        background-color: #2e7d32;
        text-decoration: none;
        border-radius: 5px;
      }
      .footer {
        margin-top: 30px;
        font-size: 13px;
        color: #777;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <p>Hi <strong>${name}</strong>,</p>

      <p>
        We’re so excited to welcome you to the <strong><em>martXmart</em></strong> family! 🛒 At martXmart, we’re all about bringing you the best in
        <em>fashion, electronics, home essentials</em> at unbeatable prices.
      </p>

      <p>
        As a thank-you for joining us, here’s a special <strong>10% off coupon</strong> for your first purchase:
        <strong>WELCOME10</strong>. Just use it at checkout to save!
      </p>

      <p>
        Ready to start shopping?
        <br />
        <a href="https://www.martxmart.com" class="button" target="_blank">Explore Now</a>
      </p>

      <p>
        Have questions? Our friendly team is here for you at
        <a href="mailto:support@martxmart.com">support@martxmart.com</a>.
      </p>

      <p>Happy Shopping!<br />The martXmart Team</p>

      <div class="footer">
        www.martxmart.com <br />
        MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985
      </div>
    </div>
  </body>
</html>
`,
  });
};

const newsletterEmail = async ( email: string) => {
  const unsubscribeLink = `https://www.martxmart.com/unsubscribe?email=${encodeURIComponent(
    email
  )}`;

  const info = await transporter.sendMail({
    from: '"martXmart" <support@martxmart.com>',
    to: email,
    subject: `Welcome to martXmart, ! 🎉`,
    text: `Hi User,
  
  Welcome to the martXmart family! 🛒
  
  We’re excited to bring you the best in fashion, electronics, and home essentials—always at unbeatable prices.
  
  💝 As a thank-you for joining us, enjoy 10% off your first purchase with this code: WELCOME10  
  Use it at checkout and start saving!
  
  🛍️ Start shopping now: https://www.martxmart.com
  
  Need help? We're just an email away: support@martxmart.com
  
  Happy Shopping!  
  The martXmart Team  
  www.martxmart.com  
  
  MARTXMART RETAIL PRIVATE LIMITED  
  CIN: U47912BR2025PTC075985  
  
  To unsubscribe from future emails, click here: ${unsubscribeLink}
  `,

    html: `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Welcome to martXmart</title>
      <style>
        body {
          background-color: #f9f9f9;
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background: #fff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .header {
          background-color: #2e7d32;
          padding: 20px;
          color: #fff;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
        }
        .content {
          padding: 20px;
        }
        .content h2 {
          color: #2e7d32;
        }
        .cta-button {
          display: inline-block;
          margin-top: 20px;
          padding: 12px 25px;
          background-color: #2e7d32;
          color: white;
          text-decoration: none;
          font-weight: bold;
          border-radius: 4px;
        }
        .footer {
          background-color: #f0f0f0;
          padding: 15px;
          font-size: 12px;
          text-align: center;
          color: #777;
        }
        .footer a {
          color: #777;
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Welcome to martXmart, User!</h1>
        </div>
        <div class="content">
          <h2>Hello User,</h2>
          <p>We’re thrilled to have you on board. At <strong>martXmart</strong>, we bring you top deals on:</p>
          <ul>
            <li>👗 Trendy fashion must-haves</li>
            <li>📱 Cutting-edge electronics</li>
            <li>🏠 Stylish and practical home essentials</li>
          </ul>
          <p><strong>Enjoy 10% OFF</strong> your first order with this exclusive code: <strong>WELCOME10</strong></p>
          <a href="https://www.martxmart.com" class="cta-button" target="_blank">Shop Now</a>
        </div>
        <div class="footer">
          www.martxmart.com<br />
          MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985<br />
          📩 support@martxmart.com<br />
          <br />
          If you wish to unsubscribe, click <a href="${unsubscribeLink}">here</a>.
        </div>
      </div>
    </body>
  </html>
  `,
  });
};

const orderConfirmationEmail = async (
  name: string,
  email: string,
  orderId: string,
  orderDate: string,
  estimateDelivery: string,
  orderItemsHtml: string, // HTML list items
  totalPrice: string
) => {
  const plainText = `Hi ${name},
  
  Thank you for shopping with martXmart! Your order #${orderId} is confirmed, and we’re busy getting it ready for you.
  
  Your Order Details:
  - Order Number: ${orderId}
  - Order Date: ${orderDate}
  - Estimated Delivery: ${estimateDelivery}
  
  Items:
  ${orderItemsHtml.replace(/<[^>]*>/g, "")}
  
  Total: ${totalPrice}
  
  Check your order status anytime at: https://www.martxmart.com/orders/${orderId}
  
  Need help? Reach out to us at support@martxmart.com
  
  Thanks for choosing martXmart!
  The martXmart Team
  www.martxmart.com
  
  MARTXMART RETAIL PRIVATE LIMITED
  CIN: U47912BR2025PTC075985
  `;

  const htmlContent = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <p>Hi ${name},</p>
  
        <p>Thank you for shopping with <strong>martXmart</strong>! Your order <strong>#${orderId}</strong> is confirmed, and we’re busy getting it ready for you. 🎉</p>
  
        <h3>Your Order Details:</h3>
        <ul>
          <li><strong>Order Number:</strong> ${orderId}</li>
          <li><strong>Order Date:</strong> ${orderDate}</li>
          <li><strong>Estimated Delivery:</strong> ${estimateDelivery}</li>
        </ul>
  
        <h4>Items:</h4>
        <ul>
          ${orderItemsHtml}
        </ul>
  
        <p><strong>Total:</strong> ${totalPrice}</p>
  
        <p><a href="https://www.martxmart.com/orders/${orderId}" style="background-color: #007bff; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Order</a></p>
  
        <p>If you have any questions or need assistance, please don’t hesitate to contact our support team:</p>
        <ul>
          <li>Email: <a href="mailto:support@martxmart.com">support@martxmart.com</a></li>
          <li>Phone: +91 9595959595</li>
          <li>Website: <a href="https://www.martxmart.com">www.martxmart.com</a></li>
        </ul>
  
        <p>Thanks again for choosing <strong>martXmart</strong>!</p>
  
        <p>Best regards,<br>The martXmart Team</p>
  
        <hr>
        <small>
          MARTXMART RETAIL PRIVATE LIMITED<br>
          CIN: U47912BR2025PTC075985<br>
          <a href="#">Unsubscribe</a>
        </small>
      </div>
    `;

  await transporter.sendMail({
    from: '"martXmart" <support@martxmart.com>',
    to: email,
    subject: `🎉 Your martXmart Order #${orderId} is Confirmed!`,
    text: plainText,
    html: htmlContent,
  });
};

const shippingConfirmationEmail = async (
  customerName: string,
  email: string,
  orderNumber: string,
  estimatedDeliveryDate: string,
  trackingNumber: string,
  courierName: string,
  trackingUrl: string
) => {
  const unsubscribeLink = `https://www.martxmart.com/unsubscribe?email=${encodeURIComponent(
    email
  )}`;

  await transporter.sendMail({
    from: '"martXmart" <support@martxmart.com>',
    to: email,
    subject: `Your martXmart Order #${orderNumber} Is On Its Way! 🚚`,
    text: `Hi ${customerName},
  
  Great news! Your martXmart order #${orderNumber} has shipped and is on its way. You can expect delivery by ${estimatedDeliveryDate}.
  
  Shipping Details:
  - Order Number: #${orderNumber}
  - Tracking Number: ${trackingNumber}
  - Courier: ${courierName}
  
  Track your package here: ${trackingUrl}
  
  Got questions? We’re here to help at support@martxmart.com.
  
  Happy Shopping!  
  The martXmart Team  
  www.martxmart.com  
  
  To unsubscribe, click here: ${unsubscribeLink}
  
  MARTXMART RETAIL PRIVATE LIMITED  
  CIN: U47912BR2025PTC075985`,

    html: `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Shipping Confirmation - martXmart</title>
      <style>
        body {
          background-color: #f9f9f9;
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
          background-color: #2e7d32;
          color: #fff;
          padding: 20px;
          text-align: center;
        }
        .content {
          padding: 20px;
        }
        .content h2 {
          color: #2e7d32;
        }
        .details {
          margin-top: 15px;
          background: #f4f4f4;
          padding: 10px;
          border-radius: 6px;
          font-size: 14px;
        }
        .cta-button {
          display: inline-block;
          margin-top: 20px;
          padding: 12px 25px;
          background-color: #2e7d32;
          color: white;
          text-decoration: none;
          font-weight: bold;
          border-radius: 4px;
        }
        .footer {
          background-color: #f0f0f0;
          padding: 15px;
          font-size: 12px;
          text-align: center;
          color: #777;
        }
        .footer a {
          color: #777;
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📦 Your Order #${orderNumber} Has Shipped!</h1>
        </div>
        <div class="content">
          <h2>Hello ${customerName},</h2>
          <p>Great news! Your <strong>martXmart</strong> order <strong>#${orderNumber}</strong> has shipped and is on its way. You can expect delivery by <strong>${estimatedDeliveryDate}</strong>.</p>
          
          <div class="details">
            <p><strong>Order Number:</strong> #${orderNumber}</p>
            <p><strong>Tracking Number:</strong> ${trackingNumber}</p>
            <p><strong>Courier:</strong> ${courierName}</p>
          </div>
  
          <a href="${trackingUrl}" class="cta-button" target="_blank">Track Now</a>
  
          <p style="margin-top: 20px;">Have questions? Reach us at <a href="mailto:support@martxmart.com">support@martxmart.com</a>.</p>
        </div>
        <div class="footer">
          www.martxmart.com<br />
          MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985<br />
          📩 support@martxmart.com<br />
          <br />
          To unsubscribe, click <a href="${unsubscribeLink}">here</a>.
        </div>
      </div>
    </body>
  </html>`,
  });
};
const deliveryConfirmationEmail = async (
  customerName: string,
  email: string,
  orderNumber: string,
  deliveryDate: string,
  productNames: string,
  reviewUrl: string,
  returnPolicyUrl: string
) => {
  const unsubscribeLink = `https://www.martxmart.com/unsubscribe?email=${encodeURIComponent(
    email
  )}`;

  await transporter.sendMail({
    from: '"martXmart" <support@martxmart.com>',
    to: email,
    subject: `Your martXmart Order #${orderNumber} Has Arrived! 🎁`,
    text: `Hi ${customerName},
  
  Woohoo! Your martXmart order #${orderNumber} was successfully delivered on ${deliveryDate}. We hope you're loving your new purchase: ${productNames}!
  
  We’d Love to Hear from You:
  Share your experience and help others! Your feedback means the world to us.
  Leave a review: ${reviewUrl}
  
  Need help with returns or anything else?  
  Check our return policy here: ${returnPolicyUrl}  
  Or reach out at: support@martxmart.com
  
  Thank you for shopping with martXmart!  
  The martXmart Team  
  www.martxmart.com  
  
  To unsubscribe: ${unsubscribeLink}  
  MARTXMART RETAIL PRIVATE LIMITED  
  CIN: U47912BR2025PTC075985`,

    html: `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Order Delivered - martXmart</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f9f9f9;
          margin: 0;
          padding: 0;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        .header {
          background-color: #2e7d32;
          color: white;
          text-align: center;
          padding: 20px;
        }
        .content {
          padding: 20px;
        }
        .content h2 {
          color: #2e7d32;
        }
        .details {
          background: #f4f4f4;
          padding: 15px;
          border-radius: 6px;
          margin-top: 15px;
          font-size: 14px;
        }
        .cta-button {
          display: inline-block;
          margin-top: 20px;
          padding: 12px 25px;
          background-color: #2e7d32;
          color: #fff;
          text-decoration: none;
          font-weight: bold;
          border-radius: 4px;
        }
        .footer {
          text-align: center;
          font-size: 12px;
          color: #777;
          padding: 20px;
          background-color: #f0f0f0;
        }
        .footer a {
          color: #777;
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Order #${orderNumber} Delivered!</h1>
        </div>
        <div class="content">
          <h2>Hello ${customerName},</h2>
          <p>We’re thrilled to let you know your <strong>martXmart</strong> order <strong>#${orderNumber}</strong> was delivered on <strong>${deliveryDate}</strong>. We hope you’re loving your new:</p>
          <p><em>${productNames}</em></p>
  
          <div class="details">
            ✅ Delivered on: <strong>${deliveryDate}</strong><br/>
            📦 Products: <strong>${productNames}</strong>
          </div>
  
          <p style="margin-top: 20px;">We’d love to hear your thoughts! Your review helps others and helps us improve.</p>
          <a href="${reviewUrl}" class="cta-button" target="_blank">Share Your Review</a>
  
          <p style="margin-top: 20px;">Need help with returns or support?  
          Visit our <a href="${returnPolicyUrl}" target="_blank">Return Policy</a> or email us at <a href="mailto:support@martxmart.com">support@martxmart.com</a>.</p>
        </div>
        <div class="footer">
          www.martxmart.com<br />
          MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985<br />
          📩 support@martxmart.com<br /><br />
          <a href="${unsubscribeLink}">Unsubscribe</a>
        </div>
      </div>
    </body>
  </html>`,
  });
};

const cartAbandonmentEmail = async (
  customerName: string,
  email: string,
  cartItems: { name: string; price: number }[],
  cartTotal: number,
  checkoutUrl: string
) => {
  const discountCode = "SAVE5";
  const unsubscribeLink = `https://www.martxmart.com/unsubscribe?email=${encodeURIComponent(
    email
  )}`;

  const itemListText = cartItems
    .map((item) => `- ${item.name} - ₹${item.price.toFixed(2)}`)
    .join("\n");

  const itemListHTML = cartItems
    .map((item) => `<li>${item.name} - ₹${item.price.toFixed(2)}</li>`)
    .join("");

  await transporter.sendMail({
    from: '"martXmart" <support@martxmart.com>',
    to: email,
    subject: `${customerName}, Your martXmart Cart Misses You! 🛒`,
    text: `Hi ${customerName},
  
  Looks like you left some awesome items in your martXmart cart. Don’t let them slip away!
  
  Enjoy 5% OFF your order — just use code: ${discountCode}
  
  Your Cart:
  ${itemListText}
  Total: ₹${cartTotal.toFixed(2)}
  
  Complete your purchase here: ${checkoutUrl}
  
  Need help? Email support@martxmart.com
  
  Happy Shopping,  
  The martXmart Team  
  www.martxmart.com  
  
  To unsubscribe: ${unsubscribeLink}  
  MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985`,

    html: `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Your Cart Awaits - martXmart</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f9fafb;
          margin: 0;
          padding: 0;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        .header {
          background-color: #f57c00;
          color: white;
          padding: 20px;
          text-align: center;
        }
        .content {
          padding: 20px;
        }
        .content h2 {
          color: #f57c00;
        }
        .cart-items {
          margin: 15px 0;
          padding-left: 20px;
        }
        .cta-button {
          display: inline-block;
          padding: 12px 25px;
          background-color: #f57c00;
          color: white;
          text-decoration: none;
          font-weight: bold;
          border-radius: 5px;
          margin-top: 20px;
        }
        .footer {
          text-align: center;
          font-size: 12px;
          color: #777;
          background-color: #f1f1f1;
          padding: 20px;
        }
        .footer a {
          color: #777;
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🛒 Your Cart Is Waiting, ${customerName}!</h1>
        </div>
        <div class="content">
          <h2>Don't Miss Out!</h2>
          <p>Looks like you left some awesome items in your cart. Complete your purchase now and enjoy <strong>5% off</strong> with code: <strong>${discountCode}</strong></p>
  
          <ul class="cart-items">
            ${itemListHTML}
          </ul>
          <p><strong>Total:</strong> ₹${cartTotal.toFixed(2)}</p>
  
          <a href="${checkoutUrl}" class="cta-button" target="_blank">Complete Purchase</a>
  
          <p style="margin-top: 20px;">Need help? Email us at <a href="mailto:support@martxmart.com">support@martxmart.com</a></p>
        </div>
        <div class="footer">
          www.martxmart.com<br />
          MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985<br />
          📩 support@martxmart.com<br /><br />
          <a href="${unsubscribeLink}">Unsubscribe</a>
        </div>
      </div>
    </body>
  </html>`,
  });
};
const paymentReminderEmail = async (
  customerName: string,
  email: string,
  orderNumber: string,
  items: { name: string; price: number }[],
  totalPrice: number,
  paymentLink: string
) => {
  const unsubscribeLink = `https://www.martxmart.com/unsubscribe?email=${encodeURIComponent(
    email
  )}`;
  const itemListText = items
    .map((i) => `- ${i.name} - ₹${i.price.toFixed(2)}`)
    .join("\n");
  const itemListHTML = items
    .map((i) => `<li>${i.name} - ₹${i.price.toFixed(2)}</li>`)
    .join("");

  await transporter.sendMail({
    from: '"martXmart" <support@martxmart.com>',
    to: email,
    subject: `${customerName}, Let’s Finalize Your martXmart Order #${orderNumber}`,
    text: `Hi ${customerName},
  
  We noticed the payment for your martXmart order #${orderNumber} is still pending.
  
  Let’s confirm it so we can ship your items!
  
  Order Details:
  - Order Number: #${orderNumber}
  ${itemListText}
  Total: ₹${totalPrice.toFixed(2)}
  
  Complete your payment here: ${paymentLink}
  
  Already paid? You can ignore this email.
  
  Need help? Email us at support@martxmart.com
  
  Thanks for shopping with martXmart!  
  The martXmart Team  
  www.martxmart.com  
  
  To unsubscribe: ${unsubscribeLink}  
  MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985`,

    html: `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Payment Reminder - martXmart</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f9fafb;
          margin: 0;
          padding: 0;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        .header {
          background-color: #f44336;
          color: white;
          padding: 20px;
          text-align: center;
        }
        .content {
          padding: 20px;
        }
        .content h2 {
          color: #f44336;
        }
        .order-details {
          margin-top: 15px;
          padding-left: 20px;
        }
        .cta-button {
          display: inline-block;
          padding: 12px 25px;
          background-color: #f44336;
          color: white;
          text-decoration: none;
          font-weight: bold;
          border-radius: 5px;
          margin-top: 20px;
        }
        .footer {
          text-align: center;
          font-size: 12px;
          color: #777;
          background-color: #f1f1f1;
          padding: 20px;
        }
        .footer a {
          color: #777;
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🧾 Confirm Your Payment, ${customerName}</h1>
        </div>
        <div class="content">
          <h2>Your Order #${orderNumber} is Waiting!</h2>
          <p>We noticed the payment for your order is still pending. Confirm it now so we can ship your items without delay.</p>
  
          <div class="order-details">
            <strong>Order Number:</strong> #${orderNumber}<br/>
            <ul>
              ${itemListHTML}
            </ul>
            <p><strong>Total:</strong> ₹${totalPrice.toFixed(2)}</p>
          </div>
  
          <a href="${paymentLink}" class="cta-button" target="_blank">Pay Now</a>
  
          <p style="margin-top: 20px;">Already paid? You can ignore this email.<br/>
          Need help? Contact us at <a href="mailto:support@martxmart.com">support@martxmart.com</a></p>
        </div>
        <div class="footer">
          www.martxmart.com<br/>
          MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985<br/>
          📩 support@martxmart.com<br/><br/>
          <a href="${unsubscribeLink}">Unsubscribe</a>
        </div>
      </div>
    </body>
  </html>`,
  });
};
const promotionalEmail = async (
  customerName: string,
  email: string,
  category: string,
  endDate: string,
  shopLink: string
) => {
  const unsubscribeLink = `https://www.martxmart.com/unsubscribe?email=${encodeURIComponent(
    email
  )}`;

  await transporter.sendMail({
    from: '"martXmart" <support@martxmart.com>',
    to: email,
    subject: `${customerName}, martXmart’s Big Sale Is Here – Up to 50% Off! 🛍`,

    text: `Hi ${customerName},
  
  The martXmart Big Sale is LIVE! 🎉  
  Save up to 50% on your favorite ${category}. Don’t miss out on these amazing deals.
  
  Use code SALE50 at checkout for extra savings.
  
  Shop now: ${shopLink}
  
  Hurry, this offer ends on ${endDate}!
  
  Need help? Contact us at support@martxmart.com
  
  Happy Shopping!  
  The martXmart Team  
  www.martxmart.com  
  
  To unsubscribe: ${unsubscribeLink}  
  MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985`,

    html: `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Big Sale - martXmart</title>
    <style>
      body {
        font-family: 'Helvetica Neue', Arial, sans-serif;
        background-color: #f8fafc;
        color: #333;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background-color: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 10px rgba(0,0,0,0.07);
      }
      .header {
        background-color: #ff6f61;
        color: white;
        text-align: center;
        padding: 30px 20px;
      }
      .header h1 {
        margin: 0;
        font-size: 28px;
      }
      .content {
        padding: 30px 20px;
        text-align: center;
      }
      .content p {
        font-size: 16px;
        line-height: 1.6;
      }
      .cta-button {
        display: inline-block;
        background-color: #ff6f61;
        color: white;
        text-decoration: none;
        font-weight: bold;
        padding: 14px 25px;
        border-radius: 5px;
        margin-top: 20px;
      }
      .code {
        font-weight: bold;
        background: #f1f1f1;
        padding: 6px 10px;
        border-radius: 4px;
        display: inline-block;
        margin: 10px 0;
        color: #ff6f61;
      }
      .footer {
        text-align: center;
        font-size: 12px;
        color: #888;
        background-color: #f1f1f1;
        padding: 20px;
      }
      .footer a {
        color: #888;
        text-decoration: underline;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>🎉 Big Sale Alert, ${customerName}!</h1>
      </div>
      <div class="content">
        <p>The <strong>martXmart Big Sale</strong> is <em>LIVE</em>!  
          Save up to <strong>50%</strong> on your favorite <strong>${category}</strong>.</p>
  
        <p class="code">Use Code: SALE50</p>
  
        <a href="${shopLink}" class="cta-button" target="_blank">Shop the Sale</a>
  
        <p style="margin-top: 25px;">Hurry, this offer ends on <strong>${endDate}</strong>!</p>
        <p>Need help? Contact us at <a href="mailto:support@martxmart.com">support@martxmart.com</a></p>
      </div>
      <div class="footer">
        www.martxmart.com<br/>
        MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985<br/>
        📩 support@martxmart.com<br/><br/>
        <a href="${unsubscribeLink}">Unsubscribe</a>
      </div>
    </div>
  </body>
  </html>`,
  });
};
const reEngagementEmail = async (
  customerName: string,
  email: string,
  shopLink: string
) => {
  const unsubscribeLink = `https://www.martxmart.com/unsubscribe?email=${encodeURIComponent(
    email
  )}`;

  await transporter.sendMail({
    from: '"martXmart" <support@martxmart.com>',
    to: email,
    subject: `💖 ${customerName}, We Miss You! Get 20% Off at martXmart!`,

    text: `Hi ${customerName},
  
  We’ve missed you at martXmart! 😢  
  Come back and save 20% with code: WELCOMEBACK20 🎁
  
  Check out new arrivals here: ${shopLink}
  
  Your feedback is important! If you need any assistance, email us at support@martxmart.com.
  
  Let’s shop again! 😄  
  The martXmart Team  
  www.martxmart.com  
  
  To unsubscribe: ${unsubscribeLink}  
  MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985`,

    html: `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>We Miss You at martXmart!</title>
    <style>
      body {
        font-family: 'Helvetica Neue', Arial, sans-serif;
        background-color: #f8fafc;
        color: #333;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background-color: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 10px rgba(0,0,0,0.07);
      }
      .header {
        background-color: #ff6f61;
        color: white;
        text-align: center;
        padding: 30px 20px;
      }
      .header h1 {
        margin: 0;
        font-size: 28px;
      }
      .content {
        padding: 30px 20px;
        text-align: center;
      }
      .content p {
        font-size: 16px;
        line-height: 1.6;
      }
      .cta-button {
        display: inline-block;
        background-color: #ff6f61;
        color: white;
        text-decoration: none;
        font-weight: bold;
        padding: 14px 25px;
        border-radius: 5px;
        margin-top: 20px;
      }
      .code {
        font-weight: bold;
        background: #f1f1f1;
        padding: 6px 10px;
        border-radius: 4px;
        display: inline-block;
        margin: 10px 0;
        color: #ff6f61;
      }
      .footer {
        text-align: center;
        font-size: 12px;
        color: #888;
        background-color: #f1f1f1;
        padding: 20px;
      }
      .footer a {
        color: #888;
        text-decoration: underline;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>💖 ${customerName}, We Miss You!</h1>
      </div>
      <div class="content">
        <p>We’ve missed you at <strong>martXmart</strong>! 😢  
          Come back and save <strong>20%</strong> with code:  
          <span class="code">WELCOMEBACK20</span> 🎁</p>
  
        <a href="${shopLink}" class="cta-button" target="_blank">🛍 Shop Now</a>
  
        <p style="margin-top: 25px;">We’ve got fresh arrivals that we know you’ll love! Let us know how we can help you, and we can always chat at <a href="mailto:support@martxmart.com">support@martxmart.com</a></p>
      </div>
      <div class="footer">
        www.martxmart.com<br/>
        MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985<br/>
        📩 support@martxmart.com<br/><br/>
        <a href="${unsubscribeLink}">Unsubscribe</a>
      </div>
    </div>
  </body>
  </html>`,
  });
};

const ProductReview = async (
  customerName: string,
  email: string,
  shopLink: string
) => {
  // Create the unsubscribe link dynamically
  const unsubscribeLink = `https://www.martxmart.com/unsubscribe?email=${encodeURIComponent(
    email
  )}`;
  const info = await transporter.sendMail({
    from: '"martXmart" <support@martxmart.com>',
    to: email,
    subject: `💖 ${customerName}, We Miss You! Get 20% Off at martXmart!`,
    text: `Hi ${customerName},

We’ve missed you at martXmart! 😢  
Come back and save 20% with code: WELCOMEBACK20 🎁

Check out new arrivals here: ${shopLink}

Your feedback is important! If you need any assistance, email us at support@martxmart.com.

Let’s shop again! 😄  
The martXmart Team  
www.martxmart.com  

To unsubscribe: ${unsubscribeLink}  
MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>We Miss You at martXmart!</title>
  <style>
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      background-color: #f8fafc;
      color: #333;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 10px rgba(0,0,0,0.07);
    }
    .header {
      background-color: #ff6f61;
      color: white;
      text-align: center;
      padding: 30px 20px;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
    }
    .content {
      padding: 30px 20px;
      text-align: center;
    }
    .content p {
      font-size: 16px;
      line-height: 1.6;
    }
    .cta-button {
      display: inline-block;
      background-color: #ff6f61;
      color: white;
      text-decoration: none;
      font-weight: bold;
      padding: 14px 25px;
      border-radius: 5px;
      margin-top: 20px;
    }
    .code {
      font-weight: bold;
      background: #f1f1f1;
      padding: 6px 10px;
      border-radius: 4px;
      display: inline-block;
      margin: 10px 0;
      color: #ff6f61;
    }
    .footer {
      text-align: center;
      font-size: 12px;
      color: #888;
      background-color: #f1f1f1;
      padding: 20px;
    }
    .footer a {
      color: #888;
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>💖 ${customerName}, We Miss You!</h1>
    </div>
    <div class="content">
      <p>We’ve missed you at <strong>martXmart</strong>! 😢  
        Come back and save <strong>20%</strong> with code:  
        <span class="code">WELCOMEBACK20</span> 🎁</p>

      <a href="${shopLink}" class="cta-button" target="_blank">🛍 Shop Now</a>

      <p style="margin-top: 25px;">We’ve got fresh arrivals that we know you’ll love! Let us know how we can help you, and we can always chat at <a href="mailto:support@martxmart.com">support@martxmart.com</a></p>
    </div>
    <div class="footer">
      www.martxmart.com<br/>
      MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985<br/>
      📩 support@martxmart.com<br/><br/>
      <a href="${unsubscribeLink}">Unsubscribe</a>
    </div>
  </div>
</body>
</html>`,
  });
};

const loyaltyProgramEmail = async (
  customerName: string,
  email: string,
  points: number,
  rewardsLink: string,
  shopLink: string
) => {
  // Create the unsubscribe link dynamically
  const unsubscribeLink = `https://www.martxmart.com/unsubscribe?email=${encodeURIComponent(
    email
  )}`;
  const info = await transporter.sendMail({
    from: '"martXmart" <support@martxmart.com>',
    to: email,
    subject: `🎉 ${customerName}, You’ve Got ${points} martXmart Points! 🏆`,
    text: `Hi ${customerName},

You’re rocking the martXmart Loyalty Program! 🌟 You’ve earned **${points} Points** for cool rewards! 🎁

📊 Your Points: ${points}

🎁 Redeem your rewards here: ${rewardsLink}

Earn more: ${shopLink}

Questions? Email support@martxmart.com 📧

You’re a VIP! 😄
The martXmart Team
www.martxmart.com

To unsubscribe: ${unsubscribeLink}
MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>You're a VIP, ${customerName}!</title>
  <style>
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      background-color: #f8fafc;
      color: #333;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 10px rgba(0,0,0,0.07);
    }
    .header {
      background-color: #4caf50;
      color: white;
      text-align: center;
      padding: 30px 20px;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
    }
    .content {
      padding: 30px 20px;
      text-align: center;
    }
    .content p {
      font-size: 16px;
      line-height: 1.6;
    }
    .cta-button {
      display: inline-block;
      background-color: #4caf50;
      color: white;
      text-decoration: none;
      font-weight: bold;
      padding: 14px 25px;
      border-radius: 5px;
      margin-top: 20px;
    }
    .footer {
      text-align: center;
      font-size: 12px;
      color: #888;
      background-color: #f1f1f1;
      padding: 20px;
    }
    .footer a {
      color: #888;
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 ${customerName}, You’ve Got ${points} martXmart Points! 🏆</h1>
    </div>
    <div class="content">
      <p>You’re rocking the martXmart Loyalty Program! 🌟 You’ve earned <strong>${points} Points</strong> for cool rewards! 🎁</p>

      <a href="${rewardsLink}" class="cta-button" target="_blank">🎁 Redeem Rewards</a>

      <p style="margin-top: 25px;">Earn more: <a href="${shopLink}" target="_blank" class="cta-button">🛒 Shop Now</a></p>
    </div>
    <div class="footer">
      www.martxmart.com<br/>
      MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985<br/>
      📩 support@martxmart.com<br/><br/>
      <a href="${unsubscribeLink}">Unsubscribe</a>
    </div>
  </div>
</body>
</html>`,
  });
};

const wishlistReminderEmail = async (
  customerName: string,
  email: string,
  wishlistItems: { productName: string; price: string }[],
  wishlistLink: string
) => {
  // Create the unsubscribe link dynamically
  const unsubscribeLink = `https://www.martxmart.com/unsubscribe?email=${encodeURIComponent(
    email
  )}`;

  // Create the wishlist items list
  const wishlistItemsList = wishlistItems
    .map((item) => `- ${item.productName} - ${item.price}`)
    .join("\n");

  const info = await transporter.sendMail({
    from: '"martXmart" <support@martxmart.com>',
    to: email,
    subject: `🛍 ${customerName}, Your martXmart Wishlist Is Back! 🎉`,
    text: `Hi ${customerName},

Your martXmart wishlist items are back in stock! 🎁 Grab them fast!

🌟 Your Wishlist:
${wishlistItemsList}

Shop now: ${wishlistLink}

Help? Email support@martxmart.com 📧

Make it yours! 😊
The martXmart Team
www.martxmart.com

To unsubscribe: ${unsubscribeLink}
MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Your Wishlist is Back! 🎉</title>
  <style>
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      background-color: #f8fafc;
      color: #333;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 10px rgba(0,0,0,0.07);
    }
    .header {
      background-color: #ff6f61;
      color: white;
      text-align: center;
      padding: 30px 20px;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
    }
    .content {
      padding: 30px 20px;
      text-align: center;
    }
    .content p {
      font-size: 16px;
      line-height: 1.6;
    }
    .wishlist-items {
      text-align: left;
      margin-top: 15px;
      font-size: 14px;
      line-height: 1.6;
    }
    .cta-button {
      display: inline-block;
      background-color: #ff6f61;
      color: white;
      text-decoration: none;
      font-weight: bold;
      padding: 14px 25px;
      border-radius: 5px;
      margin-top: 20px;
    }
    .footer {
      text-align: center;
      font-size: 12px;
      color: #888;
      background-color: #f1f1f1;
      padding: 20px;
    }
    .footer a {
      color: #888;
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🛍 ${customerName}, Your martXmart Wishlist Is Back! 🎉</h1>
    </div>
    <div class="content">
      <p>Your martXmart wishlist items are back in stock! 🎁 Grab them fast!</p>

      <div class="wishlist-items">
        <ul>
          ${wishlistItems
            .map((item) => `<li>${item.productName} - ${item.price}</li>`)
            .join("")}
        </ul>
      </div>

      <a href="${wishlistLink}" class="cta-button" target="_blank">🛒 Shop Wishlist</a>

      <p style="margin-top: 25px;">Have questions? We're here to help! Reach us at <a href="mailto:support@martxmart.com">support@martxmart.com</a></p>
    </div>
    <div class="footer">
      www.martxmart.com<br/>
      MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985<br/>
      📩 support@martxmart.com<br/><br/>
      <a href="${unsubscribeLink}">Unsubscribe</a>
    </div>
  </div>
</body>
</html>`,
  });
};

const otpVerificationEmail = async (
  name: string,
  email: string,
  otp: string
) => {
  // Create the unsubscribe link dynamically
  const unsubscribeLink = `https://www.martxmart.com/unsubscribe?email=${encodeURIComponent(
    email
  )}`;
  const info = await transporter.sendMail({
    from: '"martXmart" <support@martXmart.com>',
    to: email,
    subject: `🔐 ${name}, Verify Your martXmart Account`,
    text: `Dear ${name},

      Thank you for signing up for martXmart! To complete your registration, please enter the following OTP:

                Your OTP Code : ${otp}
              Validity: 5 minutes

If you didn't sign up for martXmart, please ignore this email.

For any questions, reach us at support@martXmart.com

Best regards,
The martXmart Team
www.martXmart.com`,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>OTP Verification</title>
  <style>
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      background-color: #f8fafc;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 10px rgba(0,0,0,0.07);
    }
    .header {
      background-color: #4caf50;
      color: white;
      text-align: center;
      padding: 30px 20px;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 30px 20px;
      text-align: center;
    }
    .content p {
      font-size: 16px;
      line-height: 1.6;
    }
    .otp {
      font-size: 20px;
      font-weight: bold;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      font-size: 12px;
      color: #888;
      background-color: #f1f1f1;
      padding: 20px;
    }
    .footer a {
      color: #888;
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔐 ${name}, Verify Your martXmart Account</h1>
    </div>
    <div class="content">
      <p>Thank you for signing up for martXmart! To complete your registration, please enter the following OTP:</p>
      <p class="otp">Your OTP Code : ${otp}</p>
      <p><strong>Validity:</strong> 5 minutes</p>
      <p>If you didn't sign up for martXmart, please ignore this email.</p>
      <p>For support, email us at <a href="mailto:support@martXmart.com">support@martXmart.com</a></p>
      <p>– The martXmart Team</p>
    </div>
    <div class="footer">
      www.martXmart.com<br/>
      MARTXMART RETAIL PRIVATE LIMITED<br/>
      CIN: U47912BR2025PTC075985<br/><br/>
      📩 <a href="mailto:support@martXmart.com">support@martXmart.com</a><br/><br/>
      <a href="${unsubscribeLink}">Unsubscribe</a>
    </div>
  </div>
</body>
</html>`,
  });
};
const passwordChangeConfirmationEmail = async (name: string, email: string) => {
  const unsubscribeLink = `https://www.martxmart.com/unsubscribe?email=${encodeURIComponent(email)}`;

  const info = await transporter.sendMail({
    from: '"martXmart" <support@martXmart.com>',
    to: email,
    subject: `🔐 ${name}, Your martXmart Password Was Successfully Changed`,
    text: `Dear ${name},

This is a confirmation that your password for your martXmart account was successfully changed.

If you did not initiate this change, please contact our support team immediately.

For assistance, email us at support@martXmart.com

Best regards,
The martXmart Team
www.martXmart.com`,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Password Changed</title>
  <style>
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      background-color: #f8fafc;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 10px rgba(0,0,0,0.07);
    }
    .header {
      background-color: #4caf50;
      color: white;
      text-align: center;
      padding: 30px 20px;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 30px 20px;
      text-align: center;
    }
    .content p {
      font-size: 16px;
      line-height: 1.6;
    }
    .footer {
      text-align: center;
      font-size: 12px;
      color: #888;
      background-color: #f1f1f1;
      padding: 20px;
    }
    .footer a {
      color: #888;
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔐 Password Changed Successfully</h1>
    </div>
    <div class="content">
      <p>Hi ${name},</p>
      <p>This is a confirmation that your password for your martXmart account was successfully changed.</p>
      <p>If you did not make this change, please contact our support team immediately.</p>
      <p>For support, email us at <a href="mailto:support@martXmart.com">support@martXmart.com</a></p>
      <p>– The martXmart Team</p>
    </div>
    <div class="footer">
      www.martXmart.com<br/>
      MARTXMART RETAIL PRIVATE LIMITED<br/>
      CIN: U47912BR2025PTC075985<br/><br/>
      📩 <a href="mailto:support@martXmart.com">support@martXmart.com</a><br/><br/>
      <a href="${unsubscribeLink}">Unsubscribe</a>
    </div>
  </div>
</body>
</html>`
  });
};

const orderCancelledEmail = async (name: string, email: string, orderId: string, refundInfo: string) => {
  const unsubscribeLink = `https://www.martxmart.com/unsubscribe?email=${encodeURIComponent(email)}`;

  await transporter.sendMail({
    from: '"martXmart" <support@martXmart.com>',
    to: email,
    subject: `🛑 Order #${orderId} Cancelled`,
    text: `Dear ${name},

We regret to inform you that your order #${orderId} has been cancelled. ${refundInfo}

If you have questions or need support, please reach us at support@martXmart.com

Best regards,
The martXmart Team
www.martXmart.com`,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Order Cancelled</title>
  <style>
    body { font-family: Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #fff; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.07); overflow: hidden; }
    .header { background-color: #e53935; color: white; text-align: center; padding: 30px 20px; }
    .header h1 { margin: 0; font-size: 22px; }
    .content { padding: 30px 20px; text-align: center; }
    .content p { font-size: 16px; line-height: 1.6; }
    .footer { text-align: center; font-size: 12px; color: #888; background-color: #f1f1f1; padding: 20px; }
    .footer a { color: #888; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🛑 Order #${orderId} Cancelled</h1>
    </div>
    <div class="content">
      <p>Hi ${name},</p>
      <p>We’re sorry to inform you that your order <strong>#${orderId}</strong> has been cancelled.</p>
      <p>${refundInfo}</p>
      <p>Need help? Reach us at <a href="mailto:support@martXmart.com">support@martXmart.com</a></p>
    </div>
    <div class="footer">
      www.martXmart.com<br/>MARTXMART RETAIL PRIVATE LIMITED<br/>CIN: U47912BR2025PTC075985<br/><br/>
      📩 <a href="mailto:support@martXmart.com">support@martXmart.com</a><br/><br/>
      <a href="${unsubscribeLink}">Unsubscribe</a>
    </div>
  </div>
</body>
</html>`
  });
};

const returnRequestReceivedEmail = async (name: string, email: string, orderId: string) => {
  const unsubscribeLink = `https://www.martxmart.com/unsubscribe?email=${encodeURIComponent(email)}`;

  await transporter.sendMail({
    from: '"martXmart" <support@martXmart.com>',
    to: email,
    subject: `📦 Your Return Request for Order #${orderId} Has Been Received`,
    text: `Dear ${name},

We've received your return/refund request for order #${orderId}. Our team will review it shortly and keep you updated.

For help, email support@martXmart.com.

Regards,
martXmart Support`,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Return Request Received</title>
  <style>
    body { font-family: Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #fff; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.07); overflow: hidden; }
    .header { background-color: #0277bd; color: white; text-align: center; padding: 30px 20px; }
    .header h1 { margin: 0; font-size: 22px; }
    .content { padding: 30px 20px; text-align: center; }
    .content p { font-size: 16px; line-height: 1.6; }
    .footer { text-align: center; font-size: 12px; color: #888; background-color: #f1f1f1; padding: 20px; }
    .footer a { color: #888; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📦 Return Request Received</h1>
    </div>
    <div class="content">
      <p>Hi ${name},</p>
      <p>We've received your return request for <strong>Order #${orderId}</strong>.</p>
      <p>We’ll review the request and notify you about the next steps shortly.</p>
      <p>Contact us anytime at <a href="mailto:support@martXmart.com">support@martXmart.com</a></p>
    </div>
    <div class="footer">
      www.martXmart.com<br/>MARTXMART RETAIL PRIVATE LIMITED<br/>CIN: U47912BR2025PTC075985<br/><br/>
      📩 <a href="mailto:support@martXmart.com">support@martXmart.com</a><br/><br/>
      <a href="${unsubscribeLink}">Unsubscribe</a>
    </div>
  </div>
</body>
</html>`
  });
};
 
const refundApprovedEmail = async (name: string, email: string, orderId: string, refundTimeline: string) => {
  const unsubscribeLink = `https://www.martxmart.com/unsubscribe?email=${encodeURIComponent(email)}`;

  await transporter.sendMail({
    from: '"martXmart" <support@martXmart.com>',
    to: email,
    subject: `💰 Your Refund for Order #${orderId} is Approved`,
    text: `Dear ${name},

Your refund for order #${orderId} has been approved. ${refundTimeline}

Thank you for shopping with martXmart.

Best regards,
The martXmart Team`,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Refund Approved</title>
  <style>
    body { font-family: Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #fff; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.07); overflow: hidden; }
    .header { background-color: #43a047; color: white; text-align: center; padding: 30px 20px; }
    .header h1 { margin: 0; font-size: 22px; }
    .content { padding: 30px 20px; text-align: center; }
    .content p { font-size: 16px; line-height: 1.6; }
    .footer { text-align: center; font-size: 12px; color: #888; background-color: #f1f1f1; padding: 20px; }
    .footer a { color: #888; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>💰 Refund Approved</h1>
    </div>
    <div class="content">
      <p>Hi ${name},</p>
      <p>Your refund for <strong>Order #${orderId}</strong> has been successfully approved.</p>
      <p>${refundTimeline}</p>
      <p>For questions, contact us at <a href="mailto:support@martXmart.com">support@martXmart.com</a></p>
    </div>
    <div class="footer">
      www.martXmart.com<br/>MARTXMART RETAIL PRIVATE LIMITED<br/>CIN: U47912BR2025PTC075985<br/><br/>
      📩 <a href="mailto:support@martXmart.com">support@martXmart.com</a><br/><br/>
      <a href="${unsubscribeLink}">Unsubscribe</a>
    </div>
  </div>
</body>
</html>`
  });
};

const specialOfferEmail = async (name: string, email: string, offerDetails: string) => {
  const unsubscribeLink = `https://www.martxmart.com/unsubscribe?email=${encodeURIComponent(email)}`;
  
  await transporter.sendMail({
    from: '"martXmart" <offers@martXmart.com>',
    to: email,
    subject: `🎉 Exclusive Discount Just for You – Limited Time Only!`,

    html: `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><style>
body { font-family: Arial, sans-serif; background-color: #f5f7fa; margin: 0; padding: 0; }
.container { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); overflow: hidden; }
.header { background-color: #ff9800; color: #fff; padding: 30px 20px; text-align: center; }
.header h1 { margin: 0; font-size: 22px; }
.content { padding: 30px 20px; text-align: center; }
.content p { font-size: 16px; line-height: 1.5; }
.button { display: inline-block; background: #ff9800; color: #fff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold; margin-top: 15px; }
.footer { background: #f1f1f1; text-align: center; padding: 20px; font-size: 12px; color: #888; }
</style></head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎁 Special Offer Just for You</h1>
    </div>
    <div class="content">
      <p>Hi ${name},</p>
      <p>We're excited to bring you an exclusive deal:</p>
      <p><strong>${offerDetails}</strong></p>
      <a class="button" href="https://www.martxmart.com/offers">Shop Now</a>
    </div>
    <div class="footer">
      www.martxmart.com<br/>MARTXMART RETAIL PRIVATE LIMITED<br/>
      📩 <a href="mailto:offers@martxmart.com">offers@martxmart.com</a><br/>
      <a href="${unsubscribeLink}">Unsubscribe</a>
    </div>
  </div>
</body>
</html>`
  });
};

const productLaunchEmail = async (name: string, email: string, productName: string, productLink: string) => {
  const unsubscribeLink = `https://www.martxmart.com/unsubscribe?email=${encodeURIComponent(email)}`;

  await transporter.sendMail({
    from: '"martXmart" <news@martxmart.com>',
    to: email,
    subject: `🚜 Introducing Our Latest Machinery – Be the First to Know!`,
    html: `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><style>
body { font-family: Arial, sans-serif; background-color: #f5f7fa; margin: 0; padding: 0; }
.container { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); overflow: hidden; }
.header { background-color: #4caf50; color: #fff; padding: 30px 20px; text-align: center; }
.header h1 { margin: 0; font-size: 22px; }
.content { padding: 30px 20px; text-align: center; }
.content p { font-size: 16px; line-height: 1.5; }
.button { display: inline-block; background: #4caf50; color: #fff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold; margin-top: 15px; }
.footer { background: #f1f1f1; text-align: center; padding: 20px; font-size: 12px; color: #888; }
</style></head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚀 New Arrival: ${productName}</h1>
    </div>
    <div class="content">
      <p>Hi ${name},</p>
      <p>Discover our latest innovation – <strong>${productName}</strong> is here!</p>
      <a class="button" href="${productLink}">View Product</a>
    </div>
    <div class="footer">
      www.martxmart.com<br/>MARTXMART RETAIL PRIVATE LIMITED<br/>
      📩 <a href="mailto:news@martxmart.com">news@martxmart.com</a><br/>
      <a href="${unsubscribeLink}">Unsubscribe</a>
    </div>
  </div>
</body>
</html>`
  });
};

const supportTicketConfirmation = async (name: string, email: string, ticketId: string) => {
  await transporter.sendMail({
    from: '"martXmart Support" <support@martxmart.com>',
    to: email,
    subject: `📩 We’ve Received Your Support Request – Ticket #${ticketId}`,
    html: `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><style>
body { font-family: Arial, sans-serif; background: #f8f9fa; margin: 0; padding: 0; }
.container { max-width: 600px; margin: 40px auto; background: white; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
.header { background: #3f51b5; color: white; padding: 20px; text-align: center; }
.content { padding: 20px; text-align: center; }
.footer { background: #f1f1f1; color: #888; padding: 15px; text-align: center; font-size: 12px; }
</style></head>
<body>
  <div class="container">
    <div class="header">
      <h2>Support Request Received</h2>
    </div>
    <div class="content">
      <p>Hi ${name},</p>
      <p>We've received your request. Your ticket number is <strong>#${ticketId}</strong>.</p>
      <p>Our team will get back to you shortly.</p>
    </div>
    <div class="footer">
      MARTXMART RETAIL PRIVATE LIMITED<br/>support@martxmart.com
    </div>
  </div>
</body>
</html>`
  });
};


const supportTicketResolved = async (name: string, email: string, ticketId: string, resolutionNote: string) => {
  await transporter.sendMail({
    from: '"martXmart Support" <support@martxmart.com>',
    to: email,
    subject: `✅ Your Support Request #${ticketId} Has Been Resolved`,
    html: `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><style>
body { font-family: Arial, sans-serif; background: #f5f7fa; margin: 0; padding: 0; }
.container { max-width: 600px; margin: 40px auto; background: white; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
.header { background: #388e3c; color: white; padding: 20px; text-align: center; }
.content { padding: 20px; text-align: center; }
.footer { background: #f1f1f1; color: #888; padding: 15px; text-align: center; font-size: 12px; }
</style></head>
<body>
  <div class="container">
    <div class="header">
      <h2>Issue Resolved</h2>
    </div>
    <div class="content">
      <p>Hi ${name},</p>
      <p>Your support ticket <strong>#${ticketId}</strong> has been successfully resolved.</p>
      <p>${resolutionNote}</p>
    </div>
    <div class="footer">
      www.martxmart.com | support@martxmart.com
    </div>
  </div>
</body>
</html>`
  });
};

const postPurchaseFeedbackRequest = async (name: string, email: string, orderId: string, feedbackLink: string) => {
  await transporter.sendMail({
    from: '"martXmart Feedback" <feedback@martxmart.com>',
    to: email,
    subject: `📝 Tell Us How We Did – Review Your Purchase`,
    html: `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><style>
body { font-family: Arial, sans-serif; background: #f8f9fa; margin: 0; padding: 0; }
.container { max-width: 600px; margin: 40px auto; background: white; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
.header { background: #607d8b; color: white; padding: 20px; text-align: center; }
.content { padding: 20px; text-align: center; }
.button { background: #607d8b; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 10px; }
.footer { background: #f1f1f1; color: #888; padding: 15px; text-align: center; font-size: 12px; }
</style></head>
<body>
  <div class="container">
    <div class="header">
      <h2>We Value Your Feedback</h2>
    </div>
    <div class="content">
      <p>Hi ${name},</p>
      <p>Thank you for your recent purchase (Order #${orderId})!</p>
      <p>We’d love to hear your thoughts.</p>
      <a href="${feedbackLink}" class="button">Leave a Review</a>
    </div>
    <div class="footer">
      www.martxmart.com | feedback@martxmart.com
    </div>
  </div>
</body>
</html>`
  });
};


const vendorAccountApprovedEmail = async (
  vendorName: string,
  email: string,
  vendorDashboardLink: string
) => {
  const unsubscribeLink = `https://www.martxmart.com/unsubscribe?email=${encodeURIComponent(email)}`;

  const info = await transporter.sendMail({
    from: '"martXmart" <support@martxmart.com>',
    to: email,
    subject: `Your Vendor Account Has Been Approved`,
    text: `Hi ${vendorName},

Great news! Your MartxMart vendor account has been approved! 🎉

You can now start setting up your store and listing your products. Log in to your vendor dashboard to get started.

Visit your dashboard: ${vendorDashboardLink}

Need help? Email support@martxmart.com 📧

Welcome aboard! 😊
The martXmart Team
www.martxmart.com

To unsubscribe: ${unsubscribeLink}
MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Your Vendor Account Has Been Approved</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.07); }
    .header { background-color: #ff6f61; color: white; text-align: center; padding: 30px 20px; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px 20px; text-align: center; }
    .content p { font-size: 16px; line-height: 1.6; }
    .cta-button { display: inline-block; background-color: #ff6f61; color: white; text-decoration: none; font-weight: bold; padding: 14px 25px; border-radius: 5px; margin-top: 20px; }
    .footer { text-align: center; font-size: 12px; color: #888; background-color: #f1f1f1; padding: 20px; }
    .footer a { color: #888; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Your Vendor Account Has Been Approved 🎉</h1>
    </div>
    <div class="content">
      <p>Hi ${vendorName},</p>
      <p>Great news! Your MartxMart vendor account has been approved! You can now start setting up your store and listing your products.</p>
      <a href="${vendorDashboardLink}" class="cta-button" target="_blank">Visit Dashboard</a>
      <p style="margin-top: 25px;">Need help? We're here to help! Reach us at <a href="mailto:support@martxmart.com">support@martxmart.com</a></p>
    </div>
    <div class="footer">
      www.martxmart.com<br/>
      MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985<br/>
      📩 support@martxmart.com<br/><br/>
      <a href="${unsubscribeLink}">Unsubscribe</a>
    </div>
  </div>
</body>
</html>`,
  });
};

const newOrderNotificationEmail = async (
  vendorName: string,
  email: string,
  orderId: string,
  orderDetails: { productName: string; quantity: number; price: string }[],
  orderLink: string
) => {
  const unsubscribeLink = `https://www.martxmart.com/unsubscribe?email=${encodeURIComponent(email)}`;
  const orderItemsList = orderDetails
    .map((item) => `- ${item.productName} (Qty: ${item.quantity}) - ${item.price}`)
    .join("\n");

  const info = await transporter.sendMail({
    from: '"martXmart" <support@martxmart.com>',
    to: email,
    subject: `New Order Received – Order #${orderId}`,
    text: `Hi ${vendorName},

You’ve received a new order on MartxMart! 🎉 Order #${orderId}

Order Details:
${orderItemsList}

View order: ${orderLink}

Please process and ship the order promptly. Contact support@martxmart.com for any issues 📧

Thank you for being a valued vendor! 😊
The martXmart Team
www.martxmart.com

To unsubscribe: ${unsubscribeLink}
MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>New Order Received – Order #${orderId}</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.07); }
    .header { background-color: #ff6f61; color: white; text-align: center; padding: 30px 20px; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px 20px; text-align: center; }
    .content p { font-size: 16px; line-height: 1.6; }
    .order-items { text-align: left; margin-top: 15px; font-size: 14px; line-height: 1.6; }
    .cta-button { display: inline-block; background-color: #ff6f61; color: white; text-decoration: none; font-weight: bold; padding: 14px 25px; border-radius: 5px; margin-top: 20px; }
    .footer { text-align: center; font-size: 12px; color: #888; background-color: #f1f1f1; padding: 20px; }
    .footer a { color: #888; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Order Received – Order #${orderId} 🎉</h1>
    </div>
    <div class="content">
      <p>Hi ${vendorName},</p>
      <p>You’ve received a new order on MartxMart! Please process and ship the order promptly.</p>
      <div class="order-items">
        <ul>
          ${orderDetails
            .map((item) => `<li>${item.productName} (Qty: ${item.quantity}) - ${item.price}</li>`)
            .join("")}
        </ul>
      </div>
      <a href="${orderLink}" class="cta-button" target="_blank">View Order</a>
      <p style="margin-top: 25px;">Contact us at <a href="mailto:support@martxmart.com">support@martxmart.com</a> for any issues.</p>
    </div>
    <div class="footer">
      www.martxmart.com<br/>
      MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985<br/>
      📩 support@martxmart.com<br/><br/>
      <a href="${unsubscribeLink}">Unsubscribe</a>
    </div>
  </div>
</body>
</html>`,
  });
};

const payoutConfirmationEmail = async (
  vendorName: string,
  email: string,
  payoutAmount: string,
  payoutDate: string
) => {
  const unsubscribeLink = `https://www.martxmart.com/unsubscribe?email=${encodeURIComponent(email)}`;

  const info = await transporter.sendMail({
    from: '"martXmart" <support@martxmart.com>',
    to: email,
    subject: `Your Payout of ₹${payoutAmount} Has Been Processed`,
    text: `Hi ${vendorName},

Good news! Your payout of ₹${payoutAmount} has been processed on ${payoutDate}. 🎉

Expect the funds in your account within 2-3 business days. For any queries, reach out to support@martxmart.com 📧

Thank you for partnering with us! 😊
The martXmart Team
www.martxmart.com

To unsubscribe: ${unsubscribeLink}
MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Your Payout of ₹${payoutAmount} Has Been Processed</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.07); }
    .header { background-color: #ff6f61; color: white; text-align: center; padding: 30px 20px; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px 20px; text-align: center; }
    .content p { font-size: 16px; line-height: 1.6; }
    .cta-button { display: inline-block; background-color: #ff6f61; color: white; text-decoration: none; font-weight: bold; padding: 14px 25px; border-radius: 5px; margin-top: 20px; }
    .footer { text-align: center; font-size: 12px; color: #888; background-color: #f1f1f1; padding: 20px; }
    .footer a { color: #888; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Your Payout of ₹${payoutAmount} Has Been Processed 🎉</h1>
    </div>
    <div class="content">
      <p>Hi ${vendorName},</p>
      <p>Good news! Your payout of ₹${payoutAmount} has been processed on ${payoutDate}. Expect the funds in your account within 2-3 business days.</p>
      <p style="margin-top: 25px;">For any queries, reach out to <a href="mailto:support@martxmart.com">support@martxmart.com</a></p>
    </div>
    <div class="footer">
      www.martxmart.com<br/>
      MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985<br/>
      📩 support@martxmart.com<br/><br/>
      <a href="${unsubscribeLink}">Unsubscribe</a>
    </div>
  </div>
</body>
</html>`,
  });
};

const vendorPolicyUpdateEmail = async (
  vendorName: string,
  email: string,
  policyLink: string
) => {
  const unsubscribeLink = `https://www.martxmart.com/unsubscribe?email=${encodeURIComponent(email)}`;

  const info = await transporter.sendMail({
    from: '"martXmart" <support@martxmart.com>',
    to: email,
    subject: `Important Update to Vendor Policies`,
    text: `Hi ${vendorName},

We’ve updated our vendor policies at MartxMart to better serve you and our customers. 📢

Please review the updated policies here: ${policyLink}

If you have any questions, contact us at support@martxmart.com 📧

Thank you for being a valued vendor! 😊
The martXmart Team
www.martxmart.com

To unsubscribe: ${unsubscribeLink}
MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Important Update to Vendor Policies</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.07); }
    .header { background-color: #ff6f61; color: white; text-align: center; padding: 30px 20px; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px 20px; text-align: center; }
    .content p { font-size: 16px; line-height: 1.6; }
    .cta-button { display: inline-block; background-color: #ff6f61; color: white; text-decoration: none; font-weight: bold; padding: 14px 25px; border-radius: 5px; margin-top: 20px; }
    .footer { text-align: center; font-size: 12px; color: #888; background-color: #f1f1f1; padding: 20px; }
    .footer a { color: #888; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Important Update to Vendor Policies 📢</h1>
    </div>
    <div class="content">
      <p>Hi ${vendorName},</p>
      <p>We’ve updated our vendor policies at MartxMart to better serve you and our customers. Please review the updated policies to stay informed.</p>
      <a href="${policyLink}" class="cta-button" target="_blank">Review Policies</a>
      <p style="margin-top: 25px;">If you have any questions, contact us at <a href="mailto:support@martxmart.com">support@martxmart.com</a></p>
    </div>
    <div class="footer">
      www.martxmart.com<br/>
      MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985<br/>
      📩 support@martxmart.com<br/><br/>
      <a href="${unsubscribeLink}">Unsubscribe</a>
    </div>
  </div>
</body>
</html>`,
  });
};

const lowInventoryAlertEmail = async (
  productName: string,
  productId: string,
  stockLevel: number,
  adminEmail: string,
  productLink: string
) => {
  const info = await transporter.sendMail({
    from: '"MartxMart Admin" <admin@martxmart.com>',
    to: adminEmail,
    subject: `${productName} Inventory is Low`,
    text: `Dear Admin,

The inventory for "${productName}" (Product ID: ${productId}) is critically low at ${stockLevel} units.

Please review and restock: ${productLink}

Contact support@martxmart.com for assistance.

MartxMart System
www.martxmart.com
MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${productName} Inventory is Low</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.07); }
    .header { background-color: #ff6f61; color: white; text-align: center; padding: 30px 20px; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px 20px; text-align: center; }
    .content p { font-size: 16px; line-height: 1.6; }
    .cta-button { display: inline-block; background-color: #ff6f61; color: white; text-decoration: none; font-weight: bold; padding: 14px 25px; border-radius: 5px; margin-top: 20px; }
    .footer { text-align: center; font-size: 12px; color: #888; background-color: #f1f1f1; padding: 20px; }
    .footer a { color: #888; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Low Inventory Alert 📉</h1>
    </div>
    <div class="content">
      <p>Dear Admin,</p>
      <p>The inventory for "<strong>${productName}</strong>" (Product ID: ${productId}) is critically low at <strong>${stockLevel} units</strong>.</p>
      <a href="${productLink}" class="cta-button" target="_blank">Review Product</a>
      <p style="margin-top: 25px;">Contact <a href="mailto:support@martxmart.com">support@martxmart.com</a> for assistance.</p>
    </div>
    <div class="footer">
      www.martxmart.com<br/>
      MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985<br/>
      📩 admin@martxmart.com
    </div>
  </div>
</body>
</html>`,
  });
};

const newUserRegistrationEmail = async (
  userName: string,
  userEmail: string,
  adminEmail: string,
  userProfileLink: string
) => {
  const info = await transporter.sendMail({
    from: '"MartxMart Admin" <admin@martxmart.com>',
    to: adminEmail,
    subject: `New User Registered: ${userName || userEmail}`,
    text: `Dear Admin,

A new user has registered on MartxMart:
Name: ${userName || 'N/A'}
Email: ${userEmail}

View user profile: ${userProfileLink}

Contact support@martxmart.com for assistance.

MartxMart System
www.martxmart.com
MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>New User Registered: ${userName || userEmail}</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.07); }
    .header { background-color: #ff6f61; color: white; text-align: center; padding: 30px 20px; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px 20px; text-align: center; }
    .content p { font-size: 16px; line-height: 1.6; }
    .details { text-align: left; margin-top: 15px; font-size: 14px; line-height: 1.6; }
    .cta-button { display: inline-block; background-color: #ff6f61; color: white; text-decoration: none; font-weight: bold; padding: 14px 25px; border-radius: 5px; margin-top: 20px; }
    .footer { text-align: center; font-size: 12px; color: #888; background-color: #f1f1f1; padding: 20px; }
    .footer a { color: #888; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New User Registered 📋</h1>
    </div>
    <div class="content">
      <p>Dear Admin,</p>
      <p>A new user has registered on MartxMart.</p>
      <div class="details">
        <p><strong>Name:</strong> ${userName || 'N/A'}</p>
        <p><strong>Email:</strong> ${userEmail}</p>
      </div>
      <a href="${userProfileLink}" class="cta-button" target="_blank">View User Profile</a>
      <p style="margin-top: 25px;">Contact <a href="mailto:support@martxmart.com">support@martxmart.com</a> for assistance.</p>
    </div>
    <div class="footer">
      www.martxmart.com<br/>
      MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985<br/>
      📩 admin@martxmart.com
    </div>
  </div>
</body>
</html>`,
  });
};

// 3. Daily Sales Summary Report
const dailySalesSummaryEmail = async (
  adminEmail: string,
  date: string,
  salesData: { totalOrders: number; totalRevenue: string; topProduct: string },
  reportLink: string
) => {
  const info = await transporter.sendMail({
    from: '"MartxMart Admin" <admin@martxmart.com>',
    to: adminEmail,
    subject: `MartxMart Daily Sales Report – ${date}`,
    text: `Dear Admin,

Here’s the daily sales summary for ${date}:

- Total Orders: ${salesData.totalOrders}
- Total Revenue: ₹${salesData.totalRevenue}
- Top Product: ${salesData.topProduct}

View full report: ${reportLink}

Contact support@martxmart.com for assistance.

MartxMart System
www.martxmart.com
MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>MartxMart Daily Sales Report – ${date}</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.07); }
    .header { background-color: #ff6f61; color: white; text-align: center; padding: 30px 20px; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px 20px; text-align: center; }
    .content p { font-size: 16px; line-height: 1.6; }
    .details { text-align: left; margin-top: 15px; font-size: 14px; line-height: 1.6; }
    .cta-button { display: inline-block; background-color: #ff6f61; color: white; text-decoration: none; font-weight: bold; padding: 14px 25px; border-radius: 5px; margin-top: 20px; }
    .footer { text-align: center; font-size: 12px; color: #888; background-color: #f1f1f1; padding: 20px; }
    .footer a { color: #888; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Daily Sales Report – ${date} 📊</h1>
    </div>
    <div class="content">
      <p>Dear Admin,</p>
      <p>Here’s the daily sales summary for ${date}:</p>
      <div class="details">
        <p><strong>Total Orders:</strong> ${salesData.totalOrders}</p>
        <p><strong>Total Revenue:</strong> ₹${salesData.totalRevenue}</p>
        <p><strong>Top Product:</strong> ${salesData.topProduct}</p>
      </div>
      <a href="${reportLink}" class="cta-button" target="_blank">View Full Report</a>
      <p style="margin-top: 25px;">Contact <a href="mailto:support@martxmart.com">support@martxmart.com</a> for assistance.</p>
    </div>
    <div class="footer">
      www.martxmart.com<br/>
      MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985<br/>
      📩 admin@martxmart.com
    </div>
  </div>
</body>
</html>`,
  });
};
const fraudDetectionAlertEmail = async (
  adminEmail: string,
  orderId: string,
  orderDetails: { customerEmail: string; amount: string; reason: string },
  orderLink: string
) => {
  const info = await transporter.sendMail({
    from: '"MartxMart Admin" <admin@martxmart.com>',
    to: adminEmail,
    subject: `⚠️ Potential Fraud Detected on Order #${orderId}`,
    text: `Dear Admin,

A potential fraud has been detected on Order #${orderId}:

- Customer Email: ${orderDetails.customerEmail}
- Amount: ₹${orderDetails.amount}
- Reason: ${orderDetails.reason}

Please review the order: ${orderLink}

Contact support@martxmart.com for assistance.

MartxMart System
www.martxmart.com
MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Potential Fraud Detected on Order #${orderId}</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.07); }
    .header { background-color: #ff6f61; color: white; text-align: center; padding: 30px 20px; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px 20px; text-align: center; }
    .content p { font-size: 16px; line-height: 1.6; }
    .details { text-align: left; margin-top: 15px; font-size: 14px; line-height: 1.6; }
    .cta-button { display: inline-block; background-color: #ff6f61; color: white; text-decoration: none; font-weight: bold; padding: 14px 25px; border-radius: 5px; margin-top: 20px; }
    .footer { text-align: center; font-size: 12px; color: #888; background-color: #f1f1f1; padding: 20px; }
    .footer a { color: #888; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⚠️ Potential Fraud Detected on Order #${orderId}</h1>
    </div>
    <div class="content">
      <p>Dear Admin,</p>
      <p>A potential fraud has been detected on Order #${orderId}.</p>
      <div class="details">
        <p><strong>Customer Email:</strong> ${orderDetails.customerEmail}</p>
        <p><strong>Amount:</strong> ₹${orderDetails.amount}</p>
        <p><strong>Reason:</strong> ${orderDetails.reason}</p>
      </div>
      <a href="${orderLink}" class="cta-button" target="_blank">Review Order</a>
      <p style="margin-top: 25px;">Contact <a href="mailto:support@martxmart.com">support@martxmart.com</a> for assistance.</p>
    </div>
    <div class="footer">
      www.martxmart.com<br/>
      MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985<br/>
      📩 admin@martxmart.com
    </div>
  </div>
</body>
</html>`,
  });
};

// 1. Vendor Application Received
const vendorApplicationReceivedEmail = async (
  vendorName: string,
  email: string
) => {
  const unsubscribeLink = `https://www.martxmart.com/unsubscribe?email=${encodeURIComponent(email)}`;

  const info = await transporter.sendMail({
    from: '"martXmart" <support@martxmart.com>',
    to: email,
    subject: `Thanks for Applying as a Vendor on MartxMart`,
    text: `Hi ${vendorName},

Thank you for applying to become a vendor on MartxMart! 🎉

We’ve received your application and our team is reviewing it. You’ll hear back from us within 3-5 business days with the next steps.

Questions? Contact us at support@martxmart.com 📧

We’re excited to potentially have you on board! 😊
The martXmart Team
www.martxmart.com

To unsubscribe: ${unsubscribeLink}
MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Thanks for Applying as a Vendor on MartxMart</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.07); }
    .header { background-color: #ff6f61; color: white; text-align: center; padding: 30px 20px; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px 20px; text-align: center; }
    .content p { font-size: 16px; line-height: 1.6; }
    .cta-button { display: inline-block; background-color: #ff6f61; color: white; text-decoration: none; font-weight: bold; padding: 14px 25px; border-radius: 5px; margin-top: 20px; }
    .footer { text-align: center; font-size: 12px; color: #888; background-color: #f1f1f1; padding: 20px; }
    .footer a { color: #888; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Thanks for Applying as a Vendor on MartxMart 🎉</h1>
    </div>
    <div class="content">
      <p>Hi ${vendorName},</p>
      <p>Thank you for applying to become a vendor on MartxMart! We’ve received your application and our team is reviewing it. You’ll hear back from us within 3-5 business days with the next steps.</p>
      <p>Have questions? We're here to help! Reach us at <a href="mailto:support@martxmart.com">support@martxmart.com</a></p>
    </div>
    <div class="footer">
      www.martxmart.com<br/>
      MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985<br/>
      📩 support@martxmart.com<br/><br/>
      <a href="${unsubscribeLink}">Unsubscribe</a>
    </div>
  </div>
</body>
</html>`,
  });
};

// 2. Vendor Application Approved/Rejected
const vendorApplicationStatusEmail = async (
  vendorName: string,
  email: string,
  status: 'approved' | 'rejected',
  vendorDashboardLink?: string,
  rejectionReason?: string
) => {
  const unsubscribeLink = `https://www.martxmart.com/unsubscribe?email=${encodeURIComponent(email)}`;
  const subject = status === 'approved' ? `Your Vendor Account Has Been Approved` : `Update on Your Vendor Application`;
  const message = status === 'approved'
    ? `Great news! Your MartxMart vendor account has been approved! 🎉\n\nYou can now start setting up your store and listing your products. Log in to your vendor dashboard to get started.\n\nVisit your dashboard: ${vendorDashboardLink}`
    : `We’re sorry, but your vendor application was not approved at this time.\n\nReason: ${rejectionReason}\n\nPlease address the issues and reapply.`;

  const info = await transporter.sendMail({
    from: '"martXmart" <support@martxmart.com>',
    to: email,
    subject,
    text: `Hi ${vendorName},

${message}

Need help? Email support@martxmart.com 📧

${status === 'approved' ? 'Welcome aboard!' : 'Thank you for your interest!'} 😊
The martXmart Team
www.martxmart.com

To unsubscribe: ${unsubscribeLink}
MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${subject}</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.07); }
    .header { background-color: #ff6f61; color: white; text-align: center; padding: 30px 20px; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px 20px; text-align: center; }
    .content p { font-size: 16px; line-height: 1.6; }
    .cta-button { display: inline-block; background-color: #ff6f61; color: white; text-decoration: none; font-weight: bold; padding: 14px 25px; border-radius: 5px; margin-top: 20px; }
    .footer { text-align: center; font-size: 12px; color: #888; background-color: #f1f1f1; padding: 20px; }
    .footer a { color: #888; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${status === 'approved' ? 'Your Vendor Account Has Been Approved 🎉' : 'Update on Your Vendor Application'}</h1>
    </div>
    <div class="content">
      <p>Hi ${vendorName},</p>
      <p>${status === 'approved' ? 'Great news! Your MartxMart vendor account has been approved! You can now start setting up your store and listing your products.' : `We’re sorry, but your vendor application was not approved at this time. Reason: ${rejectionReason}. Please address the issues and reapply.`}</p>
      ${status === 'approved' ? `<a href="${vendorDashboardLink}" class="cta-button" target="_blank">Visit Dashboard</a>` : ''}
      <p style="margin-top: 25px;">Need help? Reach us at <a href="mailto:support@martxmart.com">support@martxmart.com</a></p>
    </div>
    <div class="footer">
      www.martxmart.com<br/>
      MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985<br/>
      📩 support@martxmart.com<br/><br/>
      <a href="${unsubscribeLink}">Unsubscribe</a>
    </div>
  </div>
</body>
</html>`,
  });
};

// 3. New Order Received
const newOrderReceivedEmail = async (
  vendorName: string,
  email: string,
  orderId: string,
  orderDetails: { productName: string; quantity: number; price: string }[],
  orderLink: string
) => {
  const unsubscribeLink = `https://www.martxmart.com/unsubscribe?email=${encodeURIComponent(email)}`;
  const orderItemsList = orderDetails
    .map((item) => `- ${item.productName} (Qty: ${item.quantity}) - ${item.price}`)
    .join("\n");

  const info = await transporter.sendMail({
    from: '"martXmart" <support@martxmart.com>',
    to: email,
    subject: `New Order Received – Order #${orderId}`,
    text: `Hi ${vendorName},

You’ve received a new order on MartxMart! 🎉 Order #${orderId}

Order Details:
${orderItemsList}

View order: ${orderLink}

Please process and ship the order promptly. Contact support@martxmart.com for any issues 📧

Thank you for being a valued vendor! 😊
The martXmart Team
www.martxmart.com

To unsubscribe: ${unsubscribeLink}
MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>New Order Received – Order #${orderId}</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.07); }
    .header { background-color: #ff6f61; color: white; text-align: center; padding: 30px 20px; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px 20px; text-align: center; }
    .content p { font-size: 16px; line-height: 1.6; }
    .order-items { text-align: left; margin-top: 15px; font-size: 14px; line-height: 1.6; }
    .cta-button { display: inline-block; background-color: #ff6f61; color: white; text-decoration: none; font-weight: bold; padding: 14px 25px; border-radius: 5px; margin-top: 20px; }
    .footer { text-align: center; font-size: 12px; color: #888; background-color: #f1f1f1; padding: 20px; }
    .footer a { color: #888; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Order Received – Order #${orderId} 🎉</h1>
    </div>
    <div class="content">
      <p>Hi ${vendorName},</p>
      <p>You’ve received a new order on MartxMart! Please process and ship the order promptly.</p>
      <div class="order-items">
        <ul>
          ${orderDetails
            .map((item) => `<li>${item.productName} (Qty: ${item.quantity}) - ${item.price}</li>`)
            .join("")}
        </ul>
      </div>
      <a href="${orderLink}" class="cta-button" target="_blank">View Order</a>
      <p style="margin-top: 25px;">Contact us at <a href="mailto:support@martxmart.com">support@martxmart.com</a> for any issues.</p>
    </div>
    <div class="footer">
      www.martxmart.com<br/>
      MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985<br/>
      📩 support@martxmart.com<br/><br/>
      <a href="${unsubscribeLink}">Unsubscribe</a>
    </div>
  </div>
</body>
</html>`,
  });
};

// 4. Order Cancellation by Customer
const orderCancellationEmail = async (
  vendorName: string,
  email: string,
  orderId: string,
  cancellationReason: string,
  orderLink: string
) => {
  const unsubscribeLink = `https://www.martxmart.com/unsubscribe?email=${encodeURIComponent(email)}`;

  const info = await transporter.sendMail({
    from: '"martXmart" <support@martxmart.com>',
    to: email,
    subject: `Order #${orderId} Cancelled by Customer`,
    text: `Hi ${vendorName},

Order #${orderId} has been cancelled by the customer.

Reason: ${cancellationReason}

View order details: ${orderLink}

For any questions, contact support@martxmart.com 📧

The martXmart Team
www.martxmart.com

To unsubscribe: ${unsubscribeLink}
MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Order #${orderId} Cancelled by Customer</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.07); }
    .header { background-color: #ff6f61; color: white; text-align: center; padding: 30px 20px; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px 20px; text-align: center; }
    .content p { font-size: 16px; line-height: 1.6; }
    .details { text-align: left; margin-top: 15px; font-size: 14px; line-height: 1.6; }
    .cta-button { display: inline-block; background-color: #ff6f61; color: white; text-decoration: none; font-weight: bold; padding: 14px 25px; border-radius: 5px; margin-top: 20px; }
    .footer { text-align: center; font-size: 12px; color: #888; background-color: #f1f1f1; padding: 20px; }
    .footer a { color: #888; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Order #${orderId} Cancelled 📌</h1>
    </div>
    <div class="content">
      <p>Hi ${vendorName},</p>
      <p>Order #${orderId} has been cancelled by the customer.</p>
      <div class="details">
        <p><strong>Reason:</strong> ${cancellationReason}</p>
      </div>
      <a href="${orderLink}" class="cta-button" target="_blank">View Order Details</a>
      <p style="margin-top: 25px;">For any questions, contact <a href="mailto:support@martxmart.com">support@martxmart.com</a></p>
    </div>
    <div class="footer">
      www.martxmart.com<br/>
      MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985<br/>
      📩 support@martxmart.com<br/><br/>
      <a href="${unsubscribeLink}">Unsubscribe</a>
    </div>
  </div>
</body>
</html>`,
  });
};

// 5. Payout Processed
const payoutProcessedEmail = async (
  vendorName: string,
  email: string,
  payoutAmount: string,
  payoutDate: string
) => {
  const unsubscribeLink = `https://www.martxmart.com/unsubscribe?email=${encodeURIComponent(email)}`;

  const info = await transporter.sendMail({
    from: '"martXmart" <support@martxmart.com>',
    to: email,
    subject: `Your Payout of ₹${payoutAmount} Has Been Processed`,
    text: `Hi ${vendorName},

Good news! Your payout of ₹${payoutAmount} has been processed on ${payoutDate}. 🎉

Expect the funds in your account within 2-3 business days. For any queries, reach out to support@martxmart.com 📧

Thank you for partnering with us! 😊
The martXmart Team
www.martxmart.com

To unsubscribe: ${unsubscribeLink}
MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Your Payout of ₹${payoutAmount} Has Been Processed</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.07); }
    .header { background-color: #ff6f61; color: white; text-align: center; padding: 30px 20px; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px 20px; text-align: center; }
    .content p { font-size: 16px; line-height: 1.6; }
    .cta-button { display: inline-block; background-color: #ff6f61; color: white; text-decoration: none; font-weight: bold; padding: 14px 25px; border-radius: 5px; margin-top: 20px; }
    .footer { text-align: center; font-size: 12px; color: #888; background-color: #f1f1f1; padding: 20px; }
    .footer a { color: #888; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Your Payout of ₹${payoutAmount} Has Been Processed 🎉</h1>
    </div>
    <div class="content">
      <p>Hi ${vendorName},</p>
      <p>Good news! Your payout of ₹${payoutAmount} has been processed on ${payoutDate}. Expect the funds in your account within 2-3 business days.</p>
      <p style="margin-top: 25px;">For any queries, reach out to <a href="mailto:support@martxmart.com">support@martxmart.com</a></p>
    </div>
    <div class="footer">
      www.martxmart.com<br/>
      MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985<br/>
      📩 support@martxmart.com<br/><br/>
      <a href="${unsubscribeLink}">Unsubscribe</a>
    </div>
  </div>
</body>
</html>`,
  });
};

// 6. Stock Low Alert
const stockLowAlertEmail = async (
  vendorName: string,
  email: string,
  productName: string,
  productId: string,
  stockLevel: number,
  productLink: string
) => {
  const unsubscribeLink = `https://www.martxmart.com/unsubscribe?email=${encodeURIComponent(email)}`;

  const info = await transporter.sendMail({
    from: '"martXmart" <support@martxmart.com>',
    to: email,
    subject: `${productName} Inventory is Low`,
    text: `Hi ${vendorName},

The inventory for "${productName}" (Product ID: ${productId}) is low at ${stockLevel} units.

Please restock soon: ${productLink}

Contact support@martxmart.com for assistance 📧

The martXmart Team
www.martxmart.com

To unsubscribe: ${unsubscribeLink}
MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${productName} Inventory is Low</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.07); }
    .header { background-color: #ff6f61; color: white; text-align: center; padding: 30px 20px; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px 20px; text-align: center; }
    .content p { font-size: 16px; line-height: 1.6; }
    .cta-button { display: inline-block; background-color: #ff6f61; color: white; text-decoration: none; font-weight: bold; padding: 14px 25px; border-radius: 5px; margin-top: 20px; }
    .footer { text-align: center; font-size: 12px; color: #888; background-color: #f1f1f1; padding: 20px; }
    .footer a { color: #888; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Low Inventory Alert 📉</h1>
    </div>
    <div class="content">
      <p>Hi ${vendorName},</p>
      <p>The inventory for "<strong>${productName}</strong>" (Product ID: ${productId}) is low at <strong>${stockLevel} units</strong>.</p>
      <a href="${productLink}" class="cta-button" target="_blank">Restock Now</a>
      <p style="margin-top: 25px;">Contact <a href="mailto:support@martxmart.com">support@martxmart.com</a> for assistance.</p>
    </div>
    <div class="footer">
      www.martxmart.com<br/>
      MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985<br/>
      📩 support@martxmart.com<br/><br/>
      <a href="${unsubscribeLink}">Unsubscribe</a>
    </div>
  </div>
</body>
</html>`,
  });
};

// 7. Product Listing Approved/Rejected
const productListingStatusEmail = async (
  vendorName: string,
  email: string,
  productName: string,
  status: 'approved' | 'rejected',
  productLink?: string,
  rejectionReason?: string
) => {
  const unsubscribeLink = `https://www.martxmart.com/unsubscribe?email=${encodeURIComponent(email)}`;
  const subject = status === 'approved' ? `${productName} Listing Approved` : `${productName} Listing Update`;
  const message = status === 'approved'
    ? `Great news! Your product listing for "${productName}" has been approved and is now live on MartxMart! 🎉\n\nView your listing: ${productLink}`
    : `We’re sorry, but your product listing for "${productName}" was not approved.\n\nReason: ${rejectionReason}\n\nPlease make the necessary changes and resubmit.`;

  const info = await transporter.sendMail({
    from: '"martXmart" <support@martxmart.com>',
    to: email,
    subject,
    text: `Hi ${vendorName},

${message}

Contact support@martxmart.com for assistance 📧

${status === 'approved' ? 'Thank you for your contribution!' : 'Thank you for your effort!'} 😊
The martXmart Team
www.martxmart.com

To unsubscribe: ${unsubscribeLink}
MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${subject}</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.07); }
    .header { background-color: #ff6f61; color: white; text-align: center; padding: 30px 20px; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px 20px; text-align: center; }
    .content p { font-size: 16px; line-height: 1.6; }
    .cta-button { display: inline-block; background-color: #ff6f61; color: white; text-decoration: none; font-weight: bold; padding: 14px 25px; border-radius: 5px; margin-top: 20px; }
    .footer { text-align: center; font-size: 12px; color: #888; background-color: #f1f1f1; padding: 20px; }
    .footer a { color: #888; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${status === 'approved' ? `${productName} Listing Approved 🎉` : `${productName} Listing Update`}</h1>
    </div>
    <div class="content">
      <p>Hi ${vendorName},</p>
      <p>${status === 'approved' ? `Great news! Your product listing for "<strong>${productName}</strong>" has been approved and is now live on MartxMart!` : `We’re sorry, but your product listing for "<strong>${productName}</strong>" was not approved. Reason: ${rejectionReason}. Please make the necessary changes and resubmit.`}</p>
      ${status === 'approved' ? `<a href="${productLink}" class="cta-button" target="_blank">View Listing</a>` : ''}
      <p style="margin-top: 25px;">Contact <a href="mailto:support@martxmart.com">support@martxmart.com</a> for assistance.</p>
    </div>
    <div class="footer">
      www.martxmart.com<br/>
      MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985<br/>
      📩 support@martxmart.com<br/><br/>
      <a href="${unsubscribeLink}">Unsubscribe</a>
    </div>
  </div>
</body>
</html>`,
  });
};

// 8. Monthly Sales Report
const monthlySalesReportEmail = async (
  vendorName: string,
  email: string,
  month: string,
  salesData: { totalOrders: number; totalRevenue: string; topProduct: string },
  reportLink: string
) => {
  const unsubscribeLink = `https://www.martxmart.com/unsubscribe?email=${encodeURIComponent(email)}`;

  const info = await transporter.sendMail({
    from: '"martXmart" <support@martxmart.com>',
    to: email,
    subject: `MartxMart Monthly Sales Report – ${month}`,
    text: `Hi ${vendorName},

Here’s your sales report for ${month}:

- Total Orders: ${salesData.totalOrders}
- Total Revenue: ₹${salesData.totalRevenue}
- Top Product: ${salesData.topProduct}

View full report: ${reportLink}

Contact support@martxmart.com for questions 📧

Thank you for being a valued vendor! 😊
The martXmart Team
www.martxmart.com

To unsubscribe: ${unsubscribeLink}
MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>MartxMart Monthly Sales Report – ${month}</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.07); }
    .header { background-color: #ff6f61; color: white; text-align: center; padding: 30px 20px; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px 20px; text-align: center; }
    .content p { font-size: 16px; line-height: 1.6; }
    .details { text-align: left; margin-top: 15px; font-size: 14px; line-height: 1.6; }
    .cta-button { display: inline-block; background-color: #ff6f61; color: white; text-decoration: none; font-weight: bold; padding: 14px 25px; border-radius: 5px; margin-top: 20px; }
    .footer { text-align: center; font-size: 12px; color: #888; background-color: #f1f1f1; padding: 20px; }
    .footer a { color: #888; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Monthly Sales Report – ${month} 📊</h1>
    </div>
    <div class="content">
      <p>Hi ${vendorName},</p>
      <p>Here’s your sales report for ${month}:</p>
      <div class="details">
        <p><strong>Total Orders:</strong> ${salesData.totalOrders}</p>
        <p><strong>Total Revenue:</strong> ₹${salesData.totalRevenue}</p>
        <p><strong>Top Product:</strong> ${salesData.topProduct}</p>
      </div>
      <a href="${reportLink}" class="cta-button" target="_blank">View Full Report</a>
      <p style="margin-top: 25px;">Contact <a href="mailto:support@martxmart.com">support@martxmart.com</a> for questions.</p>
    </div>
    <div class="footer">
      www.martxmart.com<br/>
      MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985<br/>
      📩 support@martxmart.com<br/><br/>
      <a href="${unsubscribeLink}">Unsubscribe</a>
    </div>
  </div>
</body>
</html>`,
  });
};

// 9. Dispute Raised by Customer
const disputeRaisedEmail = async (
  vendorName: string,
  email: string,
  orderId: string,
  disputeDetails: { customerEmail: string; reason: string },
  disputeLink: string
) => {
  const unsubscribeLink = `https://www.martxmart.com/unsubscribe?email=${encodeURIComponent(email)}`;

  const info = await transporter.sendMail({
    from: '"martXmart" <support@martxmart.com>',
    to: email,
    subject: `Dispute Raised on Order #${orderId}`,
    text: `Hi ${vendorName},

A customer has raised a dispute on Order #${orderId}:

- Customer Email: ${disputeDetails.customerEmail}
- Reason: ${disputeDetails.reason}

Please review and respond: ${disputeLink}

Contact support@martxmart.com for assistance 📧

The martXmart Team
www.martxmart.com

To unsubscribe: ${unsubscribeLink}
MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Dispute Raised on Order #${orderId}</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.07); }
    .header { background-color: #ff6f61; color: white; text-align: center; padding: 30px 20px; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px 20px; text-align: center; }
    .content p { font-size: 16px; line-height: 1.6; }
    .details { text-align: left; margin-top: 15px; font-size: 14px; line-height: 1.6; }
    .cta-button { display: inline-block; background-color: #ff6f61; color: white; text-decoration: none; font-weight: bold; padding: 14px 25px; border-radius: 5px; margin-top: 20px; }
    .footer { text-align: center; font-size: 12px; color: #888; background-color: #f1f1f1; padding: 20px; }
    .footer a { color: #888; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Dispute Raised on Order #${orderId} ⚠️</h1>
    </div>
    <div class="content">
      <p>Hi ${vendorName},</p>
      <p>A customer has raised a dispute on Order #${orderId}.</p>
      <div class="details">
        <p><strong>Customer Email:</strong> ${disputeDetails.customerEmail}</p>
        <p><strong>Reason:</strong> ${disputeDetails.reason}</p>
      </div>
      <a href="${disputeLink}" class="cta-button" target="_blank">Review Dispute</a>
      <p style="margin-top: 25px;">Contact <a href="mailto:support@martxmart.com">support@martxmart.com</a> for assistance.</p>
    </div>
    <div class="footer">
      www.martxmart.com<br/>
      MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985<br/>
      📩 support@martxmart.com<br/><br/>
      <a href="${unsubscribeLink}">Unsubscribe</a>
    </div>
  </div>
</body>
</html>`,
  });
};


// 11. KYC or Compliance Request
const kycComplianceRequestEmail = async (
  vendorName: string,
  email: string,
  kycLink: string,
  dueDate: string
) => {
  const unsubscribeLink = `https://www.martxmart.com/unsubscribe?email=${encodeURIComponent(email)}`;

  const info = await transporter.sendMail({
    from: '"martXmart" <support@martxmart.com>',
    to: email,
    subject: `Action Required: KYC/Compliance Verification`,
    text: `Hi ${vendorName},

We need you to complete your KYC/compliance verification to continue selling on MartxMart.

Please submit the required documents by ${dueDate}: ${kycLink}

Contact support@martxmart.com for assistance 📧

Thank you for your cooperation! 😊
The martXmart Team
www.martxmart.com

To unsubscribe: ${unsubscribeLink}
MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Action Required: KYC/Compliance Verification</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.07); }
    .header { background-color: #ff6f61; color: white; text-align: center; padding: 30px 20px; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px 20px; text-align: center; }
    .content p { font-size: 16px; line-height: 1.6; }
    .cta-button { display: inline-block; background-color: #ff6f61; color: white; text-decoration: none; font-weight: bold; padding: 14px 25px; border-radius: 5px; margin-top: 20px; }
    .footer { text-align: center; font-size: 12px; color: #888; background-color: #f1f1f1; padding: 20px; }
    .footer a { color: #888; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Action Required: KYC/Compliance Verification 📋</h1>
    </div>
    <div class="content">
      <p>Hi ${vendorName},</p>
      <p>We need you to complete your KYC/compliance verification to continue selling on MartxMart. Please submit the required documents by <strong>${dueDate}</strong>.</p>
      <a href="${kycLink}" class="cta-button" target="_blank">Submit Documents</a>
      <p style="margin-top: 25px;">Contact <a href="mailto:support@martxmart.com">support@martxmart.com</a> for assistance.</p>
    </div>
    <div class="footer">
      www.martxmart.com<br/>
      MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985<br/>
      📩 support@martxmart.com<br/><br/>
      <a href="${unsubscribeLink}">Unsubscribe</a>
    </div>
  </div>
</body>
</html>`,
  });
};

// 12. Product Performance Report
const productPerformanceReportEmail = async (
  vendorName: string,
  email: string,
  month: string,
  performanceData: { productName: string; unitsSold: number; revenue: string }[],
  reportLink: string
) => {
  const unsubscribeLink = `https://www.martxmart.com/unsubscribe?email=${encodeURIComponent(email)}`;
  const performanceList = performanceData
    .map((item) => `- ${item.productName}: ${item.unitsSold} units, ₹${item.revenue}`)
    .join("\n");

  const info = await transporter.sendMail({
    from: '"martXmart" <support@martxmart.com>',
    to: email,
    subject: `Product Performance Report – ${month}`,
    text: `Hi ${vendorName},

Here’s your product performance report for ${month}:

${performanceList}

View detailed report: ${reportLink}

Contact support@martxmart.com for questions 📧

Thank you for being a valued vendor! 😊
The martXmart Team
www.martxmart.com

To unsubscribe: ${unsubscribeLink}
MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Product Performance Report – ${month}</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.07); }
    .header { background-color: #ff6f61; color: white; text-align: center; padding: 30px 20px; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px 20px; text-align: center; }
    .content p { font-size: 16px; line-height: 1.6; }
    .details { text-align: left; margin-top: 15px; font-size: 14px; line-height: 1.6; }
    .cta-button { display: inline-block; background-color: #ff6f61; color: white; text-decoration: none; font-weight: bold; padding: 14px 25px; border-radius: 5px; margin-top: 20px; }
    .footer { text-align: center; font-size: 12px; color: #888; background-color: #f1f1f1; padding: 20px; }
    .footer a { color: #888; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Product Performance Report – ${month} 📈</h1>
    </div>
    <div class="content">
      <p>Hi ${vendorName},</p>
      <p>Here’s your product performance report for ${month}:</p>
      <div class="details">
        <ul>
          ${performanceData
            .map((item) => `<li>${item.productName}: ${item.unitsSold} units, ₹${item.revenue}</li>`)
            .join("")}
        </ul>
      </div>
      <a href="${reportLink}" class="cta-button" target="_blank">View Detailed Report</a>
      <p style="margin-top: 25px;">Contact <a href="mailto:support@martxmart.com">support@martxmart.com</a> for questions.</p>
    </div>
    <div class="footer">
      www.martxmart.com<br/>
      MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985<br/>
      📩 support@martxmart.com<br/><br/>
      <a href="${unsubscribeLink}">Unsubscribe</a>
    </div>
  </div>
</body>
</html>`,
  });
};

// 13. Negative Review Alert
const negativeReviewAlertEmail = async (
  vendorName: string,
  email: string,
  productName: string,
  reviewRating: number,
  reviewComment: string,
  reviewLink: string
) => {
  const unsubscribeLink = `https://www.martxmart.com/unsubscribe?email=${encodeURIComponent(email)}`;

  const info = await transporter.sendMail({
    from: '"martXmart" <support@martxmart.com>',
    to: email,
    subject: `Negative Review Received for ${productName}`,
    text: `Hi ${vendorName},

A negative review has been received for "${productName}":

- Rating: ${reviewRating}/5
- Comment: ${reviewComment}

Please review and respond: ${reviewLink}

Contact support@martxmart.com for assistance 📧

The martXmart Team
www.martxmart.com

To unsubscribe: ${unsubscribeLink}
MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Negative Review Received for ${productName}</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.07); }
    .header { background-color: #ff6f61; color: white; text-align: center; padding: 30px 20px; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px 20px; text-align: center; }
    .content p { font-size: 16px; line-height: 1.6; }
    .details { text-align: left; margin-top: 15px; font-size: 14px; line-height: 1.6; }
    .cta-button { display: inline-block; background-color: #ff6f61; color: white; text-decoration: none; font-weight: bold; padding: 14px 25px; border-radius: 5px; margin-top: 20px; }
    .footer { text-align: center; font-size: 12px; color: #888; background-color: #f1f1f1; padding: 20px; }
    .footer a { color: #888; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Negative Review Received for ${productName} ⚠️</h1>
    </div>
    <div class="content">
      <p>Hi ${vendorName},</p>
      <p>A negative review has been received for "<strong>${productName}</strong>".</p>
      <div class="details">
        <p><strong>Rating:</strong> ${reviewRating}/5</p>
        <p><strong>Comment:</strong> ${reviewComment}</p>
      </div>
      <a href="${reviewLink}" class="cta-button" target="_blank">Review & Respond</a>
      <p style="margin-top: 25px;">Contact <a href="mailto:support@martxmart.com">support@martxmart.com</a> for assistance.</p>
    </div>
    <div class="footer">
      www.martxmart.com<br/>
      MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985<br/>
      📩 support@martxmart.com<br/><br/>
      <a href="${unsubscribeLink}">Unsubscribe</a>
    </div>
  </div>
</body>
</html>`,
  });
};

// 1. Franchise Application Received
const franchiseApplicationReceivedEmail = async (
  franchiseeName: string,
  email: string
) => {
  const unsubscribeLink = `https://www.martxmart.com/unsubscribe?email=${encodeURIComponent(email)}`;

  const info = await transporter.sendMail({
    from: '"martXmart" <support@martxmart.com>',
    to: email,
    subject: `Thanks for Applying as a MartxMart Franchisee`,
    text: `Hi ${franchiseeName},

Thank you for applying to become a MartxMart franchisee! 🎉

We’ve received your application and our team is reviewing it. You’ll hear back from us within 5-7 business days with the next steps.

Questions? Contact us at support@martxmart.com 📧

We’re excited to potentially partner with you! 😊
The martXmart Team
www.martxmart.com

To unsubscribe: ${unsubscribeLink}
MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Thanks for Applying as a MartxMart Franchisee</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.07); }
    .header { background-color: #ff6f61; color: white; text-align: center; padding: 30px 20px; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px 20px; text-align: center; }
    .content p { font-size: 16px; line-height: 1.6; }
    .cta-button { display: inline-block; background-color: #ff6f61; color: white; text-decoration: none; font-weight: bold; padding: 14px 25px; border-radius: 5px; margin-top: 20px; }
    .footer { text-align: center; font-size: 12px; color: #888; background-color: #f1f1f1; padding: 20px; }
    .footer a { color: #888; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Thanks for Applying as a MartxMart Franchisee 🎉</h1>
    </div>
    <div class="content">
      <p>Hi ${franchiseeName},</p>
      <p>Thank you for applying to become a MartxMart franchisee! We’ve received your application and our team is reviewing it. You’ll hear back from us within 5-7 business days with the next steps.</p>
      <p>Have questions? Reach us at <a href="mailto:support@martxmart.com">support@martxmart.com</a></p>
    </div>
    <div class="footer">
      www.martxmart.com<br/>
      MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985<br/>
      📩 support@martxmart.com<br/><br/>
      <a href="${unsubscribeLink}">Unsubscribe</a>
    </div>
  </div>
</body>
</html>`,
  });
};

// 2. Franchise Onboarding Complete
const franchiseOnboardingCompleteEmail = async (
  franchiseeName: string,
  email: string,
  franchiseDashboardLink: string
) => {
  const unsubscribeLink = `https://www.martxmart.com/unsubscribe?email=${encodeURIComponent(email)}`;

  const info = await transporter.sendMail({
    from: '"martXmart" <support@martxmart.com>',
    to: email,
    subject: `Welcome Aboard! Your MartxMart Franchise Onboarding is Complete`,
    text: `Hi ${franchiseeName},

Congratulations! Your MartxMart franchise onboarding is complete! 🎉

You can now access your franchise dashboard to manage operations, track sales, and more.

Visit your dashboard: ${franchiseDashboardLink}

Need help? Contact support@martxmart.com 📧

Welcome to the MartxMart family! 😊
The martXmart Team
www.martxmart.com

To unsubscribe: ${unsubscribeLink}
MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Welcome Aboard! Franchise Onboarding Complete</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.07); }
    .header { background-color: #ff6f61; color: white; text-align: center; padding: 30px 20px; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px 20px; text-align: center; }
    .content p { font-size: 16px; line-height: 1.6; }
    .cta-button { display: inline-block; background-color: #ff6f61; color: white; text-decoration: none; font-weight: bold; padding: 14px 25px; border-radius: 5px; margin-top: 20px; }
    .footer { text-align: center; font-size: 12px; color: #888; background-color: #f1f1f1; padding: 20px; }
    .footer a { color: #888; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome Aboard! Franchise Onboarding Complete 🎉</h1>
    </div>
    <div class="content">
      <p>Hi ${franchiseeName},</p>
      <p>Congratulations! Your MartxMart franchise onboarding is complete! You can now access your franchise dashboard to manage operations, track sales, and more.</p>
      <a href="${franchiseDashboardLink}" class="cta-button" target="_blank">Access Dashboard</a>
      <p style="margin-top: 25px;">Need help? Reach us at <a href="mailto:support@martxmart.com">support@martxmart.com</a></p>
    </div>
    <div class="footer">
      www.martxmart.com<br/>
      MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985<br/>
      📩 support@martxmart.com<br/><br/>
      <a href="${unsubscribeLink}">Unsubscribe</a>
    </div>
  </div>
</body>
</html>`,
  });
};

// 3. New Lead or Inquiry Notification
const newLeadInquiryEmail = async (
  franchiseeName: string,
  email: string,
  leadDetails: { leadName: string; leadEmail: string; inquiry: string },
  leadLink: string
) => {
  const unsubscribeLink = `https://www.martxmart.com/unsubscribe?email=${encodeURIComponent(email)}`;

  const info = await transporter.sendMail({
    from: '"martXmart" <support@martxmart.com>',
    to: email,
    subject: `New Lead/Inquiry: ${leadDetails.leadName}`,
    text: `Hi ${franchiseeName},

You’ve received a new lead/inquiry for your MartxMart franchise:

- Name: ${leadDetails.leadName}
- Email: ${leadDetails.leadEmail}
- Inquiry: ${leadDetails.inquiry}

View details: ${leadLink}

Please follow up promptly. Contact support@martxmart.com for assistance 📧

The martXmart Team
www.martxmart.com

To unsubscribe: ${unsubscribeLink}
MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>New Lead/Inquiry: ${leadDetails.leadName}</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.07); }
    .header { background-color: #ff6f61; color: white; text-align: center; padding: 30px 20px; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px 20px; text-align: center; }
    .content p { font-size: 16px; line-height: 1.6; }
    .details { text-align: left; margin-top: 15px; font-size: 14px; line-height: 1.6; }
    .cta-button { display: inline-block; background-color: #ff6f61; color: white; text-decoration: none; font-weight: bold; padding: 14px 25px; border-radius: 5px; margin-top: 20px; }
    .footer { text-align: center; font-size: 12px; color: #888; background-color: #f1f1f1; padding: 20px; }
    .footer a { color: #888; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Lead/Inquiry: ${leadDetails.leadName} 📬</h1>
    </div>
    <div class="content">
      <p>Hi ${franchiseeName},</p>
      <p>You’ve received a new lead/inquiry for your MartxMart franchise.</p>
      <div class="details">
        <p><strong>Name:</strong> ${leadDetails.leadName}</p>
        <p><strong>Email:</strong> ${leadDetails.leadEmail}</p>
        <p><strong>Inquiry:</strong> ${leadDetails.inquiry}</p>
      </div>
      <a href="${leadLink}" class="cta-button" target="_blank">View Details</a>
      <p style="margin-top: 25px;">Please follow up promptly. Contact <a href="mailto:support@martxmart.com">support@martxmart.com</a> for assistance.</p>
    </div>
    <div class="footer">
      www.martxmart.com<br/>
      MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985<br/>
      📩 support@martxmart.com<br/><br/>
      <a href="${unsubscribeLink}">Unsubscribe</a>
    </div>
  </div>
</body>
</html>`,
  });
};

// 4. Sales Performance Report
const salesPerformanceReportEmail = async (
  franchiseeName: string,
  email: string,
  period: string,
  salesData: { totalSales: number; totalRevenue: string; topProduct: string },
  reportLink: string
) => {
  const unsubscribeLink = `https://www.martxmart.com/unsubscribe?email=${encodeURIComponent(email)}`;

  const info = await transporter.sendMail({
    from: '"martXmart" <support@martxmart.com>',
    to: email,
    subject: `MartxMart Sales Performance Report – ${period}`,
    text: `Hi ${franchiseeName},

Here’s your sales performance report for ${period}:

- Total Sales: ${salesData.totalSales}
- Total Revenue: ₹${salesData.totalRevenue}
- Top Product: ${salesData.topProduct}

View full report: ${reportLink}

Contact support@martxmart.com for questions 📧

Keep up the great work! 😊
The martXmart Team
www.martxmart.com

To unsubscribe: ${unsubscribeLink}
MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>MartxMart Sales Performance Report – ${period}</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.07); }
    .header { background-color: #ff6f61; color: white; text-align: center; padding: 30px 20px; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px 20px; text-align: center; }
    .content p { font-size: 16px; line-height: 1.6; }
    .details { text-align: left; margin-top: 15px; font-size: 14px; line-height: 1.6; }
    .cta-button { display: inline-block; background-color: #ff6f61; color: white; text-decoration: none; font-weight: bold; padding: 14px 25px; border-radius: 5px; margin-top: 20px; }
    .footer { text-align: center; font-size: 12px; color: #888; background-color: #f1f1f1; padding: 20px; }
    .footer a { color: #888; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Sales Performance Report – ${period} 📊</h1>
    </div>
    <div class="content">
      <p>Hi ${franchiseeName},</p>
      <p>Here’s your sales performance report for ${period}:</p>
      <div class="details">
        <p><strong>Total Sales:</strong> ${salesData.totalSales}</p>
        <p><strong>Total Revenue:</strong> ₹${salesData.totalRevenue}</p>
        <p><strong>Top Product:</strong> ${salesData.topProduct}</p>
      </div>
      <a href="${reportLink}" class="cta-button" target="_blank">View Full Report</a>
      <p style="margin-top: 25px;">Contact <a href="mailto:support@martxmart.com">support@martxmart.com</a> for questions.</p>
    </div>
    <div class="footer">
      www.martxmart.com<br/>
      MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985<br/>
      📩 support@martxmart.com<br/><br/>
      <a href="${unsubscribeLink}">Unsubscribe</a>
    </div>
  </div>
</body>
</html>`,
  });
};

// 5. Commission Disbursement Notification
const commissionDisbursementEmail = async (
  franchiseeName: string,
  email: string,
  commissionAmount: string,
  disbursementDate: string
) => {
  const unsubscribeLink = `https://www.martxmart.com/unsubscribe?email=${encodeURIComponent(email)}`;

  const info = await transporter.sendMail({
    from: '"martXmart" <support@martxmart.com>',
    to: email,
    subject: `Your Commission of ₹${commissionAmount} Has Been Disbursed`,
    text: `Hi ${franchiseeName},

Good news! Your commission of ₹${commissionAmount} has been disbursed on ${disbursementDate}. 🎉

Expect the funds in your account within 2-3 business days. For queries, contact support@martxmart.com 📧

Thank you for your partnership! 😊
The martXmart Team
www.martxmart.com

To unsubscribe: ${unsubscribeLink}
MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Your Commission of ₹${commissionAmount} Has Been Disbursed</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.07); }
    .header { background-color: #ff6f61; color: white; text-align: center; padding: 30px 20px; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px 20px; text-align: center; }
    .content p { font-size: 16px; line-height: 1.6; }
    .cta-button { display: inline-block; background-color: #ff6f61; color: white; text-decoration: none; font-weight: bold; padding: 14px 25px; border-radius: 5px; margin-top: 20px; }
    .footer { text-align: center; font-size: 12px; color: #888; background-color: #f1f1f1; padding: 20px; }
    .footer a { color: #888; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Your Commission of ₹${commissionAmount} Has Been Disbursed 🎉</h1>
    </div>
    <div class="content">
      <p>Hi ${franchiseeName},</p>
      <p>Good news! Your commission of ₹${commissionAmount} has been disbursed on ${disbursementDate}. Expect the funds in your account within 2-3 business days.</p>
      <p style="margin-top: 25px;">For queries, contact <a href="mailto:support@martxmart.com">support@martxmart.com</a></p>
    </div>
    <div class="footer">
      www.martxmart.com<br/>
      MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985<br/>
      📩 support@martxmart.com<br/><br/>
      <a href="${unsubscribeLink}">Unsubscribe</a>
    </div>
  </div>
</body>
</html>`,
  });
};

// 6. Franchise Area Request/Approval
const franchiseAreaRequestEmail = async (
  franchiseeName: string,
  email: string,
  area: string,
  status: 'received' | 'approved' | 'rejected',
  franchiseDashboardLink?: string,
  rejectionReason?: string
) => {
  const unsubscribeLink = `https://www.martxmart.com/unsubscribe?email=${encodeURIComponent(email)}`;
  const subject = status === 'received' ? `Franchise Area Request Received for ${area}` : 
                  status === 'approved' ? `Franchise Area Approved for ${area}` : 
                  `Update on Franchise Area Request for ${area}`;
  const message = status === 'received'
    ? `We’ve received your request to operate a MartxMart franchise in ${area}. Our team is reviewing it, and you’ll hear back within 5-7 business days.`
    : status === 'approved'
      ? `Great news! Your request to operate a MartxMart franchise in ${area} has been approved! 🎉 You can now proceed with setup via your dashboard.\n\nVisit your dashboard: ${franchiseDashboardLink}`
      : `We’re sorry, but your request to operate a MartxMart franchise in ${area} was not approved.\n\nReason: ${rejectionReason}\n\nPlease address the issues or contact us for further details.`;

  const info = await transporter.sendMail({
    from: '"martXmart" <support@martxmart.com>',
    to: email,
    subject,
    text: `Hi ${franchiseeName},

${message}

Contact support@martxmart.com for assistance 📧

${status === 'approved' ? 'Welcome to the MartxMart family!' : 'Thank you for your interest!'} 😊
The martXmart Team
www.martxmart.com

To unsubscribe: ${unsubscribeLink}
MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${subject}</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.07); }
    .header { background-color: #ff6f61; color: white; text-align: center; padding: 30px 20px; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px 20px; text-align: center; }
    .content p { font-size: 16px; line-height: 1.6; }
    .cta-button { display: inline-block; background-color: #ff6f61; color: white; text-decoration: none; font-weight: bold; padding: 14px 25px; border-radius: 5px; margin-top: 20px; }
    .footer { text-align: center; font-size: 12px; color: #888; background-color: #f1f1f1; padding: 20px; }
    .footer a { color: #888; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${status === 'received' ? `Franchise Area Request for ${area}` : status === 'approved' ? `Franchise Area Approved for ${area} 🎉` : `Update on Franchise Area Request for ${area}`}</h1>
    </div>
    <div class="content">
      <p>Hi ${franchiseeName},</p>
      <p>${status === 'received' ? `We’ve received your request to operate a MartxMart franchise in ${area}. Our team is reviewing it, and you’ll hear back within 5-7 business days.` : status === 'approved' ? `Great news! Your request to operate a MartxMart franchise in ${area} has been approved! You can now proceed with setup via your dashboard.` : `We’re sorry, but your request to operate a MartxMart franchise in ${area} was not approved. Reason: ${rejectionReason}. Please address the issues or contact us for further details.`}</p>
      ${status === 'approved' ? `<a href="${franchiseDashboardLink}" class="cta-button" target="_blank">Access Dashboard</a>` : ''}
      <p style="margin-top: 25px;">Contact <a href="mailto:support@martxmart.com">support@martxmart.com</a> for assistance.</p>
    </div>
    <div class="footer">
      www.martxmart.com<br/>
      MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985<br/>
      📩 support@martxmart.com<br/><br/>
      <a href="${unsubscribeLink}">Unsubscribe</a>
    </div>
  </div>
</body>
</html>`,
  });
};

// 7. Policy Changes or Updates
const policyChangesEmail = async (
  franchiseeName: string,
  email: string,
  policyLink: string
) => {
  const unsubscribeLink = `https://www.martxmart.com/unsubscribe?email=${encodeURIComponent(email)}`;

  const info = await transporter.sendMail({
    from: '"martXmart" <support@martxmart.com>',
    to: email,
    subject: `Important Update to MartxMart Franchise Policies`,
    text: `Hi ${franchiseeName},

We’ve updated our franchise policies at MartxMart to ensure a better experience for all partners. 📢

Please review the updated policies: ${policyLink}

Contact support@martxmart.com with any questions 📧

Thank you for your partnership! 😊
The martXmart Team
www.martxmart.com

To unsubscribe: ${unsubscribeLink}
MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Important Update to Franchise Policies</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.07); }
    .header { background-color: #ff6f61; color: white; text-align: center; padding: 30px 20px; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px 20px; text-align: center; }
    .content p { font-size: 16px; line-height: 1.6; }
    .cta-button { display: inline-block; background-color: #ff6f61; color: white; text-decoration: none; font-weight: bold; padding: 14px 25px; border-radius: 5px; margin-top: 20px; }
    .footer { text-align: center; font-size: 12px; color: #888; background-color: #f1f1f1; padding: 20px; }
    .footer a { color: #888; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Important Update to Franchise Policies 📢</h1>
    </div>
    <div class="content">
      <p>Hi ${franchiseeName},</p>
      <p>We’ve updated our franchise policies at MartxMart to ensure a better experience for all partners. Please review the updated policies to stay informed.</p>
      <a href="${policyLink}" class="cta-button" target="_blank">Review Policies</a>
      <p style="margin-top: 25px;">Contact <a href="mailto:support@martxmart.com">support@martxmart.com</a> with any questions.</p>
    </div>
    <div class="footer">
      www.martxmart.com<br/>
      MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985<br/>
      📩 support@martxmart.com<br/><br/>
      <a href="${unsubscribeLink}">Unsubscribe</a>
    </div>
  </div>
</body>
</html>`,
  });
};

// 8. Internal Training Invite
const internalTrainingInviteEmail = async (
  franchiseeName: string,
  email: string,
  trainingDetails: { title: string; date: string; time: string; link: string }
) => {
  const unsubscribeLink = `https://www.martxmart.com/unsubscribe?email=${encodeURIComponent(email)}`;

  const info = await transporter.sendMail({
    from: '"martXmart" <support@martxmart.com>',
    to: email,
    subject: `Invitation: MartxMart Training – ${trainingDetails.title}`,
    text: `Hi ${franchiseeName},

You’re invited to a MartxMart training session!

- Title: ${trainingDetails.title}
- Date: ${trainingDetails.date}
- Time: ${trainingDetails.time}
- Join here: ${trainingDetails.link}

Don’t miss this opportunity to enhance your franchise operations. Contact support@martxmart.com for assistance 📧

See you there! 😊
The martXmart Team
www.martxmart.com

To unsubscribe: ${unsubscribeLink}
MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Invitation: MartxMart Training – ${trainingDetails.title}</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.07); }
    .header { background-color: #ff6f61; color: white; text-align: center; padding: 30px 20px; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px 20px; text-align: center; }
    .content p { font-size: 16px; line-height: 1.6; }
    .details { text-align: left; margin-top: 15px; font-size: 14px; line-height: 1.6; }
    .cta-button { display: inline-block; background-color: #ff6f61; color: white; text-decoration: none; font-weight: bold; padding: 14px 25px; border-radius: 5px; margin-top: 20px; }
    .footer { text-align: center; font-size: 12px; color: #888; background-color: #f1f1f1; padding: 20px; }
    .footer a { color: #888; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Training Invitation: ${trainingDetails.title} 📚</h1>
    </div>
    <div class="content">
      <p>Hi ${franchiseeName},</p>
      <p>You’re invited to a MartxMart training session to enhance your franchise operations.</p>
      <div class="details">
        <p><strong>Title:</strong> ${trainingDetails.title}</p>
        <p><strong>Date:</strong> ${trainingDetails.date}</p>
        <p><strong>Time:</strong> ${trainingDetails.time}</p>
      </div>
      <a href="${trainingDetails.link}" class="cta-button" target="_blank">Join Training</a>
      <p style="margin-top: 25px;">Contact <a href="mailto:support@martxmart.com">support@martxmart.com</a> for assistance.</p>
    </div>
    <div class="footer">
      www.martxmart.com<br/>
      MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985<br/>
      📩 support@martxmart.com<br/><br/>
      <a href="${unsubscribeLink}">Unsubscribe</a>
    </div>
  </div>
</body>
</html>`,
  });
};

// 9. Inventory Restock Request Approved
const inventoryRestockApprovedEmail = async (
  franchiseeName: string,
  email: string,
  restockDetails: { productName: string; quantity: number },
  restockLink: string
) => {
  const unsubscribeLink = `https://www.martxmart.com/unsubscribe?email=${encodeURIComponent(email)}`;

  const info = await transporter.sendMail({
    from: '"martXmart" <support@martxmart.com>',
    to: email,
    subject: `Inventory Restock Approved for ${restockDetails.productName}`,
    text: `Hi ${franchiseeName},

Your inventory restock request for "${restockDetails.productName}" (Quantity: ${restockDetails.quantity}) has been approved! 🎉

View details: ${restockLink}

Contact support@martxmart.com for assistance 📧

The martXmart Team
www.martxmart.com

To unsubscribe: ${unsubscribeLink}
MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Inventory Restock Approved for ${restockDetails.productName}</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.07); }
    .header { background-color: #ff6f61; color: white; text-align: center; padding: 30px 20px; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px 20px; text-align: center; }
    .content p { font-size: 16px; line-height: 1.6; }
    .details { text-align: left; margin-top: 15px; font-size: 14px; line-height: 1.6; }
    .cta-button { display: inline-block; background-color: #ff6f61; color: white; text-decoration: none; font-weight: bold; padding: 14px 25px; border-radius: 5px; margin-top: 20px; }
    .footer { text-align: center; font-size: 12px; color: #888; background-color: #f1f1f1; padding: 20px; }
    .footer a { color: #888; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Inventory Restock Approved 🎉</h1>
    </div>
    <div class="content">
      <p>Hi ${franchiseeName},</p>
      <p>Your inventory restock request for "<strong>${restockDetails.productName}</strong>" (Quantity: ${restockDetails.quantity}) has been approved!</p>
      <div class="details">
        <p><strong>Product:</strong> ${restockDetails.productName}</p>
        <p><strong>Quantity:</strong> ${restockDetails.quantity}</p>
      </div>
      <a href="${restockLink}" class="cta-button" target="_blank">View Details</a>
      <p style="margin-top: 25px;">Contact <a href="mailto:support@martxmart.com">support@martxmart.com</a> for assistance.</p>
    </div>
    <div class="footer">
      www.martxmart.com<br/>
      MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985<br/>
      📩 support@martxmart.com<br/><br/>
      <a href="${unsubscribeLink}">Unsubscribe</a>
    </div>
  </div>
</body>
</html>`,
  });
};

// 10. Inventory Shipment Notification
const inventoryShipmentNotificationEmail = async (
  franchiseeName: string,
  email: string,
  shipmentDetails: { productName: string; quantity: number; expectedDelivery: string },
  shipmentLink: string
) => {
  const unsubscribeLink = `https://www.martxmart.com/unsubscribe?email=${encodeURIComponent(email)}`;

  const info = await transporter.sendMail({
    from: '"martXmart" <support@martxmart.com>',
    to: email,
    subject: `Inventory Shipment for ${shipmentDetails.productName}`,
    text: `Hi ${franchiseeName},

Your inventory shipment for "${shipmentDetails.productName}" (Quantity: ${shipmentDetails.quantity}) has been dispatched.

Expected Delivery: ${shipmentDetails.expectedDelivery}

Track shipment: ${shipmentLink}

Contact support@martxmart.com for assistance 📧

The martXmart Team
www.martxmart.com

To unsubscribe: ${unsubscribeLink}
MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Inventory Shipment for ${shipmentDetails.productName}</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.07); }
    .header { background-color: #ff6f61; color: white; text-align: center; padding: 30px 20px; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px 20px; text-align: center; }
    .content p { font-size: 16px; line-height: 1.6; }
    .details { text-align: left; margin-top: 15px; font-size: 14px; line-height: 1.6; }
    .cta-button { display: inline-block; background-color: #ff6f61; color: white; text-decoration: none; font-weight: bold; padding: 14px 25px; border-radius: 5px; margin-top: 20px; }
    .footer { text-align: center; font-size: 12px; color: #888; background-color: #f1f1f1; padding: 20px; }
    .footer a { color: #888; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Inventory Shipment Notification 📦</h1>
    </div>
    <div class="content">
      <p>Hi ${franchiseeName},</p>
      <p>Your inventory shipment for "<strong>${shipmentDetails.productName}</strong>" (Quantity: ${shipmentDetails.quantity}) has been dispatched.</p>
      <div class="details">
        <p><strong>Product:</strong> ${shipmentDetails.productName}</p>
        <p><strong>Quantity:</strong> ${shipmentDetails.quantity}</p>
        <p><strong>Expected Delivery:</strong> ${shipmentDetails.expectedDelivery}</p>
      </div>
      <a href="${shipmentLink}" class="cta-button" target="_blank">Track Shipment</a>
      <p style="margin-top: 25px;">Contact <a href="mailto:support@martxmart.com">support@martxmart.com</a> for assistance.</p>
    </div>
    <div class="footer">
      www.martxmart.com<br/>
      MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985<br/>
      📩 support@martxmart.com<br/><br/>
      <a href="${unsubscribeLink}">Unsubscribe</a>
    </div>
  </div>
</body>
</html>`,
  });
};

// 11. Franchise Meeting or Webinar Invite
const franchiseMeetingInviteEmail = async (
  franchiseeName: string,
  email: string,
  meetingDetails: { title: string; date: string; time: string; link: string }
) => {
  const unsubscribeLink = `https://www.martxmart.com/unsubscribe?email=${encodeURIComponent(email)}`;

  const info = await transporter.sendMail({
    from: '"martXmart" <support@martxmart.com>',
    to: email,
    subject: `Invitation: MartxMart ${meetingDetails.title}`,
    text: `Hi ${franchiseeName},

You’re invited to a MartxMart ${meetingDetails.title.toLowerCase()}!

- Title: ${meetingDetails.title}
- Date: ${meetingDetails.date}
- Time: ${meetingDetails.time}
- Join here: ${meetingDetails.link}

Don’t miss this chance to connect and grow. Contact support@martxmart.com for assistance 📧

See you there! 😊
The martXmart Team
www.martxmart.com

To unsubscribe: ${unsubscribeLink}
MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Invitation: MartxMart ${meetingDetails.title}</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.07); }
    .header { background-color: #ff6f61; color: white; text-align: center; padding: 30px 20px; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px 20px; text-align: center; }
    .content p { font-size: 16px; line-height: 1.6; }
    .details { text-align: left; margin-top: 15px; font-size: 14px; line-height: 1.6; }
    .cta-button { display: inline-block; background-color: #ff6f61; color: white; text-decoration: none; font-weight: bold; padding: 14px 25px; border-radius: 5px; margin-top: 20px; }
    .footer { text-align: center; font-size: 12px; color: #888; background-color: #f1f1f1; padding: 20px; }
    .footer a { color: #888; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Invitation: ${meetingDetails.title} 📅</h1>
    </div>
    <div class="content">
      <p>Hi ${franchiseeName},</p>
      <p>You’re invited to a MartxMart ${meetingDetails.title.toLowerCase()} to connect and grow your franchise.</p>
      <div class="details">
        <p><strong>Title:</strong> ${meetingDetails.title}</p>
        <p><strong>Date:</strong> ${meetingDetails.date}</p>
        <p><strong>Time:</strong> ${meetingDetails.time}</p>
      </div>
      <a href="${meetingDetails.link}" class="cta-button" target="_blank">Join Meeting</a>
      <p style="margin-top: 25px;">Contact <a href="mailto:support@martxmart.com">support@martxmart.com</a> for assistance.</p>
    </div>
    <div class="footer">
      www.martxmart.com<br/>
      MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985<br/>
      📩 support@martxmart.com<br/><br/>
      <a href="${unsubscribeLink}">Unsubscribe</a>
    </div>
  </div>
</body>
</html>`,
  });
};


// 1. New User Registration Alert
const newUserRegistrationAlertEmail = async (
  adminEmail: string,
  userDetails: { name: string; email: string; registrationDate: string },
  userProfileLink: string
) => {
  const info = await transporter.sendMail({
    from: '"MartxMart Admin" <admin@martxmart.com>',
    to: adminEmail,
    subject: `New User Registered: ${userDetails.name || userDetails.email}`,
    text: `Dear Admin,

A new user has registered on MartxMart:

- Name: ${userDetails.name || 'N/A'}
- Email: ${userDetails.email}
- Registration Date: ${userDetails.registrationDate}

View user profile: ${userProfileLink}

Contact support@martxmart.com for assistance.

MartxMart System
www.martxmart.com
MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>New User Registered: ${userDetails.name || userDetails.email}</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.07); }
    .header { background-color: #ff6f61; color: white; text-align: center; padding: 30px 20px; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px 20px; text-align: center; }
    .content p { font-size: 16px; line-height: 1.6; }
    .details { text-align: left; margin-top: 15px; font-size: 14px; line-height: 1.6; }
    .cta-button { display: inline-block; background-color: #ff6f61; color: white; text-decoration: none; font-weight: bold; padding: 14px 25px; border-radius: 5px; margin-top: 20px; }
    .footer { text-align: center; font-size: 12px; color: #888; background-color: #f1f1f1; padding: 20px; }
    .footer a { color: #888; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New User Registered 📋</h1>
    </div>
    <div class="content">
      <p>Dear Admin,</p>
      <p>A new user has registered on MartxMart.</p>
      <div class="details">
        <p><strong>Name:</strong> ${userDetails.name || 'N/A'}</p>
        <p><strong>Email:</strong> ${userDetails.email}</p>
        <p><strong>Registration Date:</strong> ${userDetails.registrationDate}</p>
      </div>
      <a href="${userProfileLink}" class="cta-button" target="_blank">View User Profile</a>
      <p style="margin-top: 25px;">Contact <a href="mailto:support@martxmart.com">support@martxmart.com</a> for assistance.</p>
    </div>
    <div class="footer">
      www.martxmart.com<br/>
      MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985<br/>
      📩 admin@martxmart.com
    </div>
  </div>
</body>
</html>`,
  });
};

// 2. New Vendor/Franchise Signup
const newVendorFranchiseSignupEmail = async (
  adminEmail: string,
  entityDetails: { type: 'vendor' | 'franchise'; name: string; email: string },
  profileLink: string
) => {
  const entityType = entityDetails.type.charAt(0).toUpperCase() + entityDetails.type.slice(1);
  const info = await transporter.sendMail({
    from: '"MartxMart Admin" <admin@martxmart.com>',
    to: adminEmail,
    subject: `New ${entityType} Signup: ${entityDetails.name || entityDetails.email}`,
    text: `Dear Admin,

A new ${entityDetails.type} has signed up on MartxMart:

- Name: ${entityDetails.name || 'N/A'}
- Email: ${entityDetails.email}
- Type: ${entityType}

View ${entityDetails.type} profile: ${profileLink}

Contact support@martxmart.com for assistance.

MartxMart System
www.martxmart.com
MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>New ${entityType} Signup: ${entityDetails.name || entityDetails.email}</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.07); }
    .header { background-color: #ff6f61; color: white; text-align: center; padding: 30px 20px; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px 20px; text-align: center; }
    .content p { font-size: 16px; line-height: 1.6; }
    .details { text-align: left; margin-top: 15px; font-size: 14px; line-height: 1.6; }
    .cta-button { display: inline-block; background-color: #ff6f61; color: white; text-decoration: none; font-weight: bold; padding: 14px 25px; border-radius: 5px; margin-top: 20px; }
    .footer { text-align: center; font-size: 12px; color: #888; background-color: #f1f1f1; padding: 20px; }
    .footer a { color: #888; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New ${entityType} Signup 📋</h1>
    </div>
    <div class="content">
      <p>Dear Admin,</p>
      <p>A new ${entityDetails.type} has signed up on MartxMart.</p>
      <div class="details">
        <p><strong>Name:</strong> ${entityDetails.name || 'N/A'}</p>
        <p><strong>Email:</strong> ${entityDetails.email}</p>
        <p><strong>Type:</strong> ${entityType}</p>
      </div>
      <a href="${profileLink}" class="cta-button" target="_blank">View ${entityType} Profile</a>
      <p style="margin-top: 25px;">Contact <a href="mailto:support@martxmart.com">support@martxmart.com</a> for assistance.</p>
    </div>
    <div class="footer">
      www.martxmart.com<br/>
      MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985<br/>
      📩 admin@martxmart.com
    </div>
  </div>
</body>
</html>`,
  });
};

// 3. Daily System Summary
const dailySystemSummaryEmail = async (
  adminEmail: string,
  date: string,
  summaryData: { totalOrders: number; totalRevenue: string; newUsers: number; issues: number },
  reportLink: string
) => {
  const info = await transporter.sendMail({
    from: '"MartxMart Admin" <admin@martxmart.com>',
    to: adminEmail,
    subject: `MartxMart Daily System Summary – ${date}`,
    text: `Dear Admin,

Here’s the daily system summary for ${date}:

- Total Orders: ${summaryData.totalOrders}
- Total Revenue: ₹${summaryData.totalRevenue}
- New Users: ${summaryData.newUsers}
- System Issues: ${summaryData.issues}

View full report: ${reportLink}

Contact support@martxmart.com for assistance.

MartxMart System
www.martxmart.com
MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>MartxMart Daily System Summary – ${date}</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.07); }
    .header { background-color: #ff6f61; color: white; text-align: center; padding: 30px 20px; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px 20px; text-align: center; }
    .content p { font-size: 16px; line-height: 1.6; }
    .details { text-align: left; margin-top: 15px; font-size: 14px; line-height: 1.6; }
    .cta-button { display: inline-block; background-color: #ff6f61; color: white; text-decoration: none; font-weight: bold; padding: 14px 25px; border-radius: 5px; margin-top: 20px; }
    .footer { text-align: center; font-size: 12px; color: #888; background-color: #f1f1f1; padding: 20px; }
    .footer a { color: #888; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Daily System Summary – ${date} 📊</h1>
    </div>
    <div class="content">
      <p>Dear Admin,</p>
      <p>Here’s the daily system summary for ${date}:</p>
      <div class="details">
        <p><strong>Total Orders:</strong> ${summaryData.totalOrders}</p>
        <p><strong>Total Revenue:</strong> ₹${summaryData.totalRevenue}</p>
        <p><strong>New Users:</strong> ${summaryData.newUsers}</p>
        <p><strong>System Issues:</strong> ${summaryData.issues}</p>
      </div>
      <a href="${reportLink}" class="cta-button" target="_blank">View Full Report</a>
      <p style="margin-top: 25px;">Contact <a href="mailto:support@martxmart.com">support@martxmart.com</a> for assistance.</p>
    </div>
    <div class="footer">
      www.martxmart.com<br/>
      MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985<br/>
      📩 admin@martxmart.com
    </div>
  </div>
</body>
</html>`,
  });
};

// 4. Fraud Alert Notification
const fraudAlertNotificationEmail = async (
  adminEmail: string,
  orderId: string,
  fraudDetails: { customerEmail: string; amount: string; reason: string },
  orderLink: string
) => {
  const info = await transporter.sendMail({
    from: '"MartxMart Admin" <admin@martxmart.com>',
    to: adminEmail,
    subject: `⚠️ Potential Fraud Detected on Order #${orderId}`,
    text: `Dear Admin,

A potential fraud has been detected on Order #${orderId}:

- Customer Email: ${fraudDetails.customerEmail}
- Amount: ₹${fraudDetails.amount}
- Reason: ${fraudDetails.reason}

Please review the order: ${orderLink}

Contact support@martxmart.com for assistance.

MartxMart System
www.martxmart.com
MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Potential Fraud Detected on Order #${orderId}</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.07); }
    .header { background-color: #ff6f61; color: white; text-align: center; padding: 30px 20px; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px 20px; text-align: center; }
    .content p { font-size: 16px; line-height: 1.6; }
    .details { text-align: left; margin-top: 15px; font-size: 14px; line-height: 1.6; }
    .cta-button { display: inline-block; background-color: #ff6f61; color: white; text-decoration: none; font-weight: bold; padding: 14px 25px; border-radius: 5px; margin-top: 20px; }
    .footer { text-align: center; font-size: 12px; color: #888; background-color: #f1f1f1; padding: 20px; }
    .footer a { color: #888; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⚠️ Potential Fraud Detected on Order #${orderId}</h1>
    </div>
    <div class="content">
      <p>Dear Admin,</p>
      <p>A potential fraud has been detected on Order #${orderId}.</p>
      <div class="details">
        <p><strong>Customer Email:</strong> ${fraudDetails.customerEmail}</p>
        <p><strong>Amount:</strong> ₹${fraudDetails.amount}</p>
        <p><strong>Reason:</strong> ${fraudDetails.reason}</p>
      </div>
      <a href="${orderLink}" class="cta-button" target="_blank">Review Order</a>
      <p style="margin-top: 25px;">Contact <a href="mailto:support@martxmart.com">support@martxmart.com</a> for assistance.</p>
    </div>
    <div class="footer">
      www.martxmart.com<br/>
      MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985<br/>
      📩 admin@martxmart.com
    </div>
  </div>
</body>
</html>`,
  });
};

// 6. Failed Payment Alert
const failedPaymentAlertEmail = async (
  adminEmail: string,
  orderId: string,
  paymentDetails: { customerEmail: string; amount: string; reason: string },
  orderLink: string
) => {
  const info = await transporter.sendMail({
    from: '"MartxMart Admin" <admin@martxmart.com>',
    to: adminEmail,
    subject: `Failed Payment Alert for Order #${orderId}`,
    text: `Dear Admin,

A payment has failed for Order #${orderId}:

- Customer Email: ${paymentDetails.customerEmail}
- Amount: ₹${paymentDetails.amount}
- Reason: ${paymentDetails.reason}

Please review the order: ${orderLink}

Contact support@martxmart.com for assistance.

MartxMart System
www.martxmart.com
MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Failed Payment Alert for Order #${orderId}</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.07); }
    .header { background-color: #ff6f61; color: white; text-align: center; padding: 30px 20px; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px 20px; text-align: center; }
    .content p { font-size: 16px; line-height: 1.6; }
    .details { text-align: left; margin-top: 15px; font-size: 14px; line-height: 1.6; }
    .cta-button { display: inline-block; background-color: #ff6f61; color: white; text-decoration: none; font-weight: bold; padding: 14px 25px; border-radius: 5px; margin-top: 20px; }
    .footer { text-align: center; font-size: 12px; color: #888; background-color: #f1f1f1; padding: 20px; }
    .footer a { color: #888; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Failed Payment Alert ⚠️</h1>
    </div>
    <div class="content">
      <p>Dear Admin,</p>
      <p>A payment has failed for Order #${orderId}.</p>
      <div class="details">
        <p><strong>Customer Email:</strong> ${paymentDetails.customerEmail}</p>
        <p><strong>Amount:</strong> ₹${paymentDetails.amount}</p>
        <p><strong>Reason:</strong> ${paymentDetails.reason}</p>
      </div>
      <a href="${orderLink}" class="cta-button" target="_blank">Review Order</a>
      <p style="margin-top: 25px;">Contact <a href="mailto:support@martxmart.com">support@martxmart.com</a> for assistance.</p>
    </div>
    <div class="footer">
      www.martxmart.com<br/>
      MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985<br/>
      📩 admin@martxmart.com
    </div>
  </div>
</body>
</html>`,
  });
};

// 7. Pending Return Request
const pendingReturnRequestEmail = async (
  adminEmail: string,
  orderId: string,
  returnDetails: { customerEmail: string; productName: string; reason: string },
  returnLink: string
) => {
  const info = await transporter.sendMail({
    from: '"MartxMart Admin" <admin@martxmart.com>',
    to: adminEmail,
    subject: `Pending Return Request for Order #${orderId}`,
    text: `Dear Admin,

A return request is pending for Order #${orderId}:

- Customer Email: ${returnDetails.customerEmail}
- Product: ${returnDetails.productName}
- Reason: ${returnDetails.reason}

Please review the request: ${returnLink}

Contact support@martxmart.com for assistance.

MartxMart System
www.martxmart.com
MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Pending Return Request for Order #${orderId}</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.07); }
    .header { background-color: #ff6f61; color: white; text-align: center; padding: 30px 20px; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px 20px; text-align: center; }
    .content p { font-size: 16px; line-height: 1.6; }
    .details { text-align: left; margin-top: 15px; font-size: 14px; line-height: 1.6; }
    .cta-button { display: inline-block; background-color: #ff6f61; color: white; text-decoration: none; font-weight: bold; padding: 14px 25px; border-radius: 5px; margin-top: 20px; }
    .footer { text-align: center; font-size: 12px; color: #888; background-color: #f1f1f1; padding: 20px; }
    .footer a { color: #888; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Pending Return Request 📦</h1>
    </div>
    <div class="content">
      <p>Dear Admin,</p>
      <p>A return request is pending for Order #${orderId}.</p>
      <div class="details">
        <p><strong>Customer Email:</strong> ${returnDetails.customerEmail}</p>
        <p><strong>Product:</strong> ${returnDetails.productName}</p>
        <p><strong>Reason:</strong> ${returnDetails.reason}</p>
      </div>
      <a href="${returnLink}" class="cta-button" target="_blank">Review Request</a>
      <p style="margin-top: 25px;">Contact <a href="mailto:support@martxmart.com">support@martxmart.com</a> for assistance.</p>
    </div>
    <div class="footer">
      www.martxmart.com<br/>
      MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985<br/>
      📩 admin@martxmart.com
    </div>
  </div>
</body>
</html>`,
  });
};

// 8. Refund Approval Required
const refundApprovalRequiredEmail = async (
  adminEmail: string,
  orderId: string,
  refundDetails: { customerEmail: string; amount: string; reason: string },
  refundLink: string
) => {
  const info = await transporter.sendMail({
    from: '"MartxMart Admin" <admin@martxmart.com>',
    to: adminEmail,
    subject: `Refund Approval Required for Order #${orderId}`,
    text: `Dear Admin,

A refund request requires approval for Order #${orderId}:

- Customer Email: ${refundDetails.customerEmail}
- Amount: ₹${refundDetails.amount}
- Reason: ${refundDetails.reason}

Please review and approve: ${refundLink}

Contact support@martxmart.com for assistance.

MartxMart System
www.martxmart.com
MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Refund Approval Required for Order #${orderId}</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.07); }
    .header { background-color: #ff6f61; color: white; text-align: center; padding: 30px 20px; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px 20px; text-align: center; }
    .content p { font-size: 16px; line-height: 1.6; }
    .details { text-align: left; margin-top: 15px; font-size: 14px; line-height: 1.6; }
    .cta-button { display: inline-block; background-color: #ff6f61; color: white; text-decoration: none; font-weight: bold; padding: 14px 25px; border-radius: 5px; margin-top: 20px; }
    .footer { text-align: center; font-size: 12px; color: #888; background-color: #f1f1f1; padding: 20px; }
    .footer a { color: #888; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Refund Approval Required 💳</h1>
    </div>
    <div class="content">
      <p>Dear Admin,</p>
      <p>A refund request requires approval for Order #${orderId}.</p>
      <div class="details">
        <p><strong>Customer Email:</strong> ${refundDetails.customerEmail}</p>
        <p><strong>Amount:</strong> ₹${refundDetails.amount}</p>
        <p><strong>Reason:</strong> ${refundDetails.reason}</p>
      </div>
      <a href="${refundLink}" class="cta-button" target="_blank">Review & Approve</a>
      <p style="margin-top: 25px;">Contact <a href="mailto:support@martxmart.com">support@martxmart.com</a> for assistance.</p>
    </div>
    <div class="footer">
      www.martxmart.com<br/>
      MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985<br/>
      📩 admin@martxmart.com
    </div>
  </div>
</body>
</html>`,
  });
};

// 9. Ticket Escalation Alert
const ticketEscalationAlertEmail = async (
  adminEmail: string,
  ticketId: string,
  ticketDetails: { customerEmail: string; issue: string; priority: string },
  ticketLink: string
) => {
  const info = await transporter.sendMail({
    from: '"MartxMart Admin" <admin@martxmart.com>',
    to: adminEmail,
    subject: `Ticket Escalation Alert: Ticket #${ticketId}`,
    text: `Dear Admin,

A support ticket requires escalation:

- Ticket ID: ${ticketId}
- Customer Email: ${ticketDetails.customerEmail}
- Issue: ${ticketDetails.issue}
- Priority: ${ticketDetails.priority}

Please review the ticket: ${ticketLink}

Contact support@martxmart.com for assistance.

MartxMart System
www.martxmart.com
MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Ticket Escalation Alert: Ticket #${ticketId}</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.07); }
    .header { background-color: #ff6f61; color: white; text-align: center; padding: 30px 20px; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px 20px; text-align: center; }
    .content p { font-size: 16px; line-height: 1.6; }
    .details { text-align: left; margin-top: 15px; font-size: 14px; line-height: 1.6; }
    .cta-button { display: inline-block; background-color: #ff6f61; color: white; text-decoration: none; font-weight: bold; padding: 14px 25px; border-radius: 5px; margin-top: 20px; }
    .footer { text-align: center; font-size: 12px; color: #888; background-color: #f1f1f1; padding: 20px; }
    .footer a { color: #888; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Ticket Escalation Alert ⚠️</h1>
    </div>
    <div class="content">
      <p>Dear Admin,</p>
      <p>A support ticket requires escalation.</p>
      <div class="details">
        <p><strong>Ticket ID:</strong> ${ticketId}</p>
        <p><strong>Customer Email:</strong> ${ticketDetails.customerEmail}</p>
        <p><strong>Issue:</strong> ${ticketDetails.issue}</p>
        <p><strong>Priority:</strong> ${ticketDetails.priority}</p>
      </div>
      <a href="${ticketLink}" class="cta-button" target="_blank">Review Ticket</a>
      <p style="margin-top: 25px;">Contact <a href="mailto:support@martxmart.com">support@martxmart.com</a> for assistance.</p>
    </div>
    <div class="footer">
      www.martxmart.com<br/>
      MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985<br/>
      📩 admin@martxmart.com
    </div>
  </div>
</body>
</html>`,
  });
};

// 10. New Content/Blog/FAQ Submitted (by Author)
const newContentSubmittedEmail = async (
  adminEmail: string,
  contentDetails: { type: 'blog' | 'faq'; title: string; author: string },
  contentLink: string
) => {
  const contentType = contentDetails.type.charAt(0).toUpperCase() + contentDetails.type.slice(1);
  const info = await transporter.sendMail({
    from: '"MartxMart Admin" <admin@martxmart.com>',
    to: adminEmail,
    subject: `New ${contentType} Submitted: ${contentDetails.title}`,
    text: `Dear Admin,

A new ${contentDetails.type} has been submitted:

- Title: ${contentDetails.title}
- Author: ${contentDetails.author}
- Type: ${contentType}

Please review the content: ${contentLink}

Contact support@martxmart.com for assistance.

MartxMart System
www.martxmart.com
MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>New ${contentType} Submitted: ${contentDetails.title}</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.07); }
    .header { background-color: #ff6f61; color: white; text-align: center; padding: 30px 20px; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px 20px; text-align: center; }
    .content p { font-size: 16px; line-height: 1.6; }
    .details { text-align: left; margin-top: 15px; font-size: 14px; line-height: 1.6; }
    .cta-button { display: inline-block; background-color: #ff6f61; color: white; text-decoration: none; font-weight: bold; padding: 14px 25px; border-radius: 5px; margin-top: 20px; }
    .footer { text-align: center; font-size: 12px; color: #888; background-color: #f1f1f1; padding: 20px; }
    .footer a { color: #888; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New ${contentType} Submitted 📝</h1>
    </div>
    <div class="content">
      <p>Dear Admin,</p>
      <p>A new ${contentDetails.type} has been submitted.</p>
      <div class="details">
        <p><strong>Title:</strong> ${contentDetails.title}</p>
        <p><strong>Author:</strong> ${contentDetails.author}</p>
        <p><strong>Type:</strong> ${contentType}</p>
      </div>
      <a href="${contentLink}" class="cta-button" target="_blank">Review Content</a>
      <p style="margin-top: 25px;">Contact <a href="mailto:support@martxmart.com">support@martxmart.com</a> for assistance.</p>
    </div>
    <div class="footer">
      www.martxmart.com<br/>
      MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985<br/>
      📩 admin@martxmart.com
    </div>
  </div>
</body>
</html>`,
  });
};

// 11. Monthly Revenue Summary
const monthlyRevenueSummaryEmail = async (
  adminEmail: string,
  month: string,
  revenueData: { totalRevenue: string; totalOrders: number; topCategory: string },
  reportLink: string
) => {
  const info = await transporter.sendMail({
    from: '"MartxMart Admin" <admin@martxmart.com>',
    to: adminEmail,
    subject: `MartxMart Monthly Revenue Summary – ${month}`,
    text: `Dear Admin,

Here’s the revenue summary for ${month}:

- Total Revenue: ₹${revenueData.totalRevenue}
- Total Orders: ${revenueData.totalOrders}
- Top Category: ${revenueData.topCategory}

View full report: ${reportLink}

Contact support@martxmart.com for assistance.

MartxMart System
www.martxmart.com
MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>MartxMart Monthly Revenue Summary – ${month}</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.07); }
    .header { background-color: #ff6f61; color: white; text-align: center; padding: 30px 20px; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px 20px; text-align: center; }
    .content p { font-size: 16px; line-height: 1.6; }
    .details { text-align: left; margin-top: 15px; font-size: 14px; line-height: 1.6; }
    .cta-button { display: inline-block; background-color: #ff6f61; color: white; text-decoration: none; font-weight: bold; padding: 14px 25px; border-radius: 5px; margin-top: 20px; }
    .footer { text-align: center; font-size: 12px; color: #888; background-color: #f1f1f1; padding: 20px; }
    .footer a { color: #888; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Monthly Revenue Summary – ${month} 💰</h1>
    </div>
    <div class="content">
      <p>Dear Admin,</p>
      <p>Here’s the revenue summary for ${month}:</p>
      <div class="details">
        <p><strong>Total Revenue:</strong> ₹${revenueData.totalRevenue}</p>
        <p><strong>Total Orders:</strong> ${revenueData.totalOrders}</p>
        <p><strong>Top Category:</strong> ${revenueData.topCategory}</p>
      </div>
      <a href="${reportLink}" class="cta-button" target="_blank">View Full Report</a>
      <p style="margin-top: 25px;">Contact <a href="mailto:support@martxmart.com">support@martxmart.com</a> for assistance.</p>
    </div>
    <div class="footer">
      www.martxmart.com<br/>
      MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985<br/>
      📩 admin@martxmart.com
    </div>
  </div>
</body>
</html>`,
  });
};

// 12. KYC/Compliance Not Completed by Vendor/Franchise
const kycComplianceNotCompletedEmail = async (
  adminEmail: string,
  entityDetails: { type: 'vendor' | 'franchise'; name: string; email: string },
  entityLink: string
) => {
  const entityType = entityDetails.type.charAt(0).toUpperCase() + entityDetails.type.slice(1);
  const info = await transporter.sendMail({
    from: '"MartxMart Admin" <admin@martxmart.com>',
    to: adminEmail,
    subject: `${entityType} KYC/Compliance Not Completed: ${entityDetails.name || entityDetails.email}`,
    text: `Dear Admin,

The KYC/compliance process for a ${entityDetails.type} has not been completed:

- Name: ${entityDetails.name || 'N/A'}
- Email: ${entityDetails.email}
- Type: ${entityType}

Please review: ${entityLink}

Contact support@martxmart.com for assistance.

MartxMart System
www.martxmart.com
MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${entityType} KYC/Compliance Not Completed</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.07); }
    .header { background-color: #ff6f61; color: white; text-align: center; padding: 30px 20px; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px 20px; text-align: center; }
    .content p { font-size: 16px; line-height: 1.6; }
    .details { text-align: left; margin-top: 15px; font-size: 14px; line-height: 1.6; }
    .cta-button { display: inline-block; background-color: #ff6f61; color: white; text-decoration: none; font-weight: bold; padding: 14px 25px; border-radius: 5px; margin-top: 20px; }
    .footer { text-align: center; font-size: 12px; color: #888; background-color: #f1f1f1; padding: 20px; }
    .footer a { color: #888; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${entityType} KYC/Compliance Not Completed ⚠️</h1>
    </div>
    <div class="content">
      <p>Dear Admin,</p>
      <p>The KYC/compliance process for a ${entityDetails.type} has not been completed.</p>
      <div class="details">
        <p><strong>Name:</strong> ${entityDetails.name || 'N/A'}</p>
        <p><strong>Email:</strong> ${entityDetails.email}</p>
        <p><strong>Type:</strong> ${entityType}</p>
      </div>
      <a href="${entityLink}" class="cta-button" target="_blank">Review ${entityType}</a>
      <p style="margin-top: 25px;">Contact <a href="mailto:support@martxmart.com">support@martxmart.com</a> for assistance.</p>
    </div>
    <div class="footer">
      www.martxmart.com<br/>
      MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985<br/>
      📩 admin@martxmart.com
    </div>
  </div>
</body>
</html>`,
  });
};

// 13. Policy Violation Detected
const policyViolationDetectedEmail = async (
  adminEmail: string,
  violationDetails: { entityType: 'vendor' | 'franchise' | 'user'; entityName: string; entityEmail: string; violation: string },
  violationLink: string
) => {
  const entityType = violationDetails.entityType.charAt(0).toUpperCase() + violationDetails.entityType.slice(1);
  const info = await transporter.sendMail({
    from: '"MartxMart Admin" <admin@martxmart.com>',
    to: adminEmail,
    subject: `Policy Violation Detected: ${violationDetails.entityName || violationDetails.entityEmail}`,
    text: `Dear Admin,

A policy violation has been detected:

- Entity Type: ${entityType}
- Name: ${violationDetails.entityName || 'N/A'}
- Email: ${violationDetails.entityEmail}
- Violation: ${violationDetails.violation}

Please review the violation: ${violationLink}

Contact support@martxmart.com for assistance.

MartxMart System
www.martxmart.com
MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Policy Violation Detected</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.07); }
    .header { background-color: #ff6f61; color: white; text-align: center; padding: 30px 20px; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px 20px; text-align: center; }
    .content p { font-size: 16px; line-height: 1.6; }
    .details { text-align: left; margin-top: 15px; font-size: 14px; line-height: 1.6; }
    .cta-button { display: inline-block; background-color: #ff6f61; color: white; text-decoration: none; font-weight: bold; padding: 14px 25px; border-radius: 5px; margin-top: 20px; }
    .footer { text-align: center; font-size: 12px; color: #888; background-color: #f1f1f1; padding: 20px; }
    .footer a { color: #888; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Policy Violation Detected ⚠️</h1>
    </div>
    <div class="content">
      <p>Dear Admin,</p>
      <p>A policy violation has been detected.</p>
      <div class="details">
        <p><strong>Entity Type:</strong> ${entityType}</p>
        <p><strong>Name:</strong> ${violationDetails.entityName || 'N/A'}</p>
        <p><strong>Email:</strong> ${violationDetails.entityEmail}</p>
        <p><strong>Violation:</strong> ${violationDetails.violation}</p>
      </div>
      <a href="${violationLink}" class="cta-button" target="_blank">Review Violation</a>
      <p style="margin-top: 25px;">Contact <a href="mailto:support@martxmart.com">support@martxmart.com</a> for assistance.</p>
    </div>
    <div class="footer">
      www.martxmart.com<br/>
      MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985<br/>
      📩 admin@martxmart.com
    </div>
  </div>
</body>
</html>`,
  });
};

// 1. Content Submission Received
const contentSubmissionReceivedEmail = async (
  authorName: string,
  authorEmail: string,
  contentTitle: string
) => {
  const unsubscribeLink = `https://www.martxmart.com/unsubscribe?email=${encodeURIComponent(authorEmail)}`;

  const info = await transporter.sendMail({
    from: '"MartxMart Editorial" <editorial@martxmart.com>',
    to: authorEmail,
    subject: `Content Submission Received: ${contentTitle}`,
    text: `Hi ${authorName},

Thank you for submitting "${contentTitle}" to MartxMart! 📝

Our editorial team is reviewing your submission. You’ll hear back within 3-5 business days with feedback or next steps.

Questions? Contact editorial@martxmart.com 📧

We appreciate your contribution! 😊
The MartxMart Editorial Team
www.martxmart.com

To unsubscribe: ${unsubscribeLink}
MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Content Submission Received: ${contentTitle}</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.07); }
    .header { background-color: #ff6f61; color: white; text-align: center; padding: 30px 20px; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px 20px; text-align: center; }
    .content p { font-size: 16px; line-height: 1.6; }
    .cta-button { display: inline-block; background-color: #ff6f61; color: white; text-decoration: none; font-weight: bold; padding: 14px 25px; border-radius: 5px; margin-top: 20px; }
    .footer { text-align: center; font-size: 12px; color: #888; background-color: #f1f1f1; padding: 20px; }
    .footer a { color: #888; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Content Submission Received 📝</h1>
    </div>
    <div class="content">
      <p>Hi ${authorName},</p>
      <p>Thank you for submitting "<strong>${contentTitle}</strong>" to MartxMart! Our editorial team is reviewing your submission. You’ll hear back within 3-5 business days with feedback or next steps.</p>
      <p>Questions? Reach us at <a href="mailto:editorial@martxmart.com">editorial@martxmart.com</a></p>
    </div>
    <div class="footer">
      www.martxmart.com<br/>
      MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985<br/>
      📩 editorial@martxmart.com<br/><br/>
      <a href="${unsubscribeLink}">Unsubscribe</a>
    </div>
  </div>
</body>
</html>`,
  });
};

// 2. Content Approved & Published
const contentApprovedPublishedEmail = async (
  authorName: string,
  authorEmail: string,
  contentTitle: string,
  contentLink: string
) => {
  const unsubscribeLink = `https://www.martxmart.com/unsubscribe?email=${encodeURIComponent(authorEmail)}`;

  const info = await transporter.sendMail({
    from: '"MartxMart Editorial" <editorial@martxmart.com>',
    to: authorEmail,
    subject: `Your Content "${contentTitle}" is Live!`,
    text: `Hi ${authorName},

Great news! Your submission "${contentTitle}" has been approved and is now live on MartxMart! 🎉

Check it out: ${contentLink}

Thank you for your amazing contribution. Questions? Contact editorial@martxmart.com 📧

Keep creating! 😊
The MartxMart Editorial Team
www.martxmart.com

To unsubscribe: ${unsubscribeLink}
MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Your Content "${contentTitle}" is Live!</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.07); }
    .header { background-color: #ff6f61; color: white; text-align: center; padding: 30px 20px; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px 20px; text-align: center; }
    .content p { font-size: 16px; line-height: 1.6; }
    .cta-button { display: inline-block; background-color: #ff6f61; color: white; text-decoration: none; font-weight: bold; padding: 14px 25px; border-radius: 5px; margin-top: 20px; }
    .footer { text-align: center; font-size: 12px; color: #888; background-color: #f1f1f1; padding: 20px; }
    .footer a { color: #888; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Your Content is Live! 🎉</h1>
    </div>
    <div class="content">
      <p>Hi ${authorName},</p>
      <p>Great news! Your submission "<strong>${contentTitle}</strong>" has been approved and is now live on MartxMart!</p>
      <a href="${contentLink}" class="cta-button" target="_blank">View Your Content</a>
      <p style="margin-top: 25px;">Thank you for your amazing contribution. Questions? Reach us at <a href="mailto:editorial@martxmart.com">editorial@martxmart.com</a></p>
    </div>
    <div class="footer">
      www.martxmart.com<br/>
      MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985<br/>
      📩 editorial@martxmart.com<br/><br/>
      <a href="${unsubscribeLink}">Unsubscribe</a>
    </div>
  </div>
</body>
</html>`,
  });
};

// 3. Content Rejected with Feedback
const contentRejectedEmail = async (
  authorName: string,
  authorEmail: string,
  contentTitle: string,
  feedback: string,
  submissionLink: string
) => {
  const unsubscribeLink = `https://www.martxmart.com/unsubscribe?email=${encodeURIComponent(authorEmail)}`;

  const info = await transporter.sendMail({
    from: '"MartxMart Editorial" <editorial@martxmart.com>',
    to: authorEmail,
    subject: `Feedback on Your Submission: ${contentTitle}`,
    text: `Hi ${authorName},

Thank you for submitting "${contentTitle}" to MartxMart.

After review, we’ve decided not to publish this submission. Here’s our feedback:
${feedback}

You’re welcome to revise and resubmit: ${submissionLink}

Questions? Contact editorial@martxmart.com 📧

We value your efforts! 😊
The MartxMart Editorial Team
www.martxmart.com

To unsubscribe: ${unsubscribeLink}
MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Feedback on Your Submission: ${contentTitle}</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.07); }
    .header { background-color: #ff6f61; color: white; text-align: center; padding: 30px 20px; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px 20px; text-align: center; }
    .content p { font-size: 16px; line-height: 1.6; }
    .details { text-align: left; margin-top: 15px; font-size: 14px; line-height: 1.6; }
    .cta-button { display: inline-block; background-color: #ff6f61; color: white; text-decoration: none; font-weight: bold; padding: 14px 25px; border-radius: 5px; margin-top: 20px; }
    .footer { text-align: center; font-size: 12px; color: #888; background-color: #f1f1f1; padding: 20px; }
    .footer a { color: #888; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Feedback on Your Submission 📝</h1>
    </div>
    <div class="content">
      <p>Hi ${authorName},</p>
      <p>Thank you for submitting "<strong>${contentTitle}</strong>" to MartxMart. After review, we’ve decided not to publish this submission.</p>
      <div class="details">
        <p><strong>Feedback:</strong> ${feedback}</p>
      </div>
      <a href="${submissionLink}" class="cta-button" target="_blank">Revise & Resubmit</a>
      <p style="margin-top: 25px;">Questions? Reach us at <a href="mailto:editorial@martxmart.com">editorial@martxmart.com</a></p>
    </div>
    <div class="footer">
      www.martxmart.com<br/>
      MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985<br/>
      📩 editorial@martxmart.com<br/><br/>
      <a href="${unsubscribeLink}">Unsubscribe</a>
    </div>
  </div>
</body>
</html>`,
  });
};

// 4. Revision Request for Submitted Article
const revisionRequestEmail = async (
  authorName: string,
  authorEmail: string,
  contentTitle: string,
  revisions: string,
  submissionLink: string
) => {
  const unsubscribeLink = `https://www.martxmart.com/unsubscribe?email=${encodeURIComponent(authorEmail)}`;

  const info = await transporter.sendMail({
    from: '"MartxMart Editorial" <editorial@martxmart.com>',
    to: authorEmail,
    subject: `Revision Request for "${contentTitle}"`,
    text: `Hi ${authorName},

Thank you for submitting "${contentTitle}" to MartxMart.

We’d like you to make some revisions before we can publish:
${revisions}

Please submit your revised content: ${submissionLink}

Questions? Contact editorial@martxmart.com 📧

We’re excited to work with you! 😊
The MartxMart Editorial Team
www.martxmart.com

To unsubscribe: ${unsubscribeLink}
MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Revision Request for "${contentTitle}"</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.07); }
    .header { background-color: #ff6f61; color: white; text-align: center; padding: 30px 20px; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px 20px; text-align: center; }
    .content p { font-size: 16px; line-height: 1.6; }
    .details { text-align: left; margin-top: 15px; font-size: 14px; line-height: 1.6; }
    .cta-button { display: inline-block; background-color: #ff6f61; color: white; text-decoration: none; font-weight: bold; padding: 14px 25px; border-radius: 5px; margin-top: 20px; }
    .footer { text-align: center; font-size: 12px; color: #888; background-color: #f1f1f1; padding: 20px; }
    .footer a { color: #888; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Revision Request 📝</h1>
    </div>
    <div class="content">
      <p>Hi ${authorName},</p>
      <p>Thank you for submitting "<strong>${contentTitle}</strong>" to MartxMart. We’d like you to make some revisions before we can publish.</p>
      <div class="details">
        <p><strong>Revisions:</strong> ${revisions}</p>
      </div>
      <a href="${submissionLink}" class="cta-button" target="_blank">Submit Revised Content</a>
      <p style="margin-top: 25px;">Questions? Reach us at <a href="mailto:editorial@martxmart.com">editorial@martxmart.com</a></p>
    </div>
    <div class="footer">
      www.martxmart.com<br/>
      MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985<br/>
      📩 editorial@martxmart.com<br/><br/>
      <a href="${unsubscribeLink}">Unsubscribe</a>
    </div>
  </div>
</body>
</html>`,
  });
};

// 5. Monthly Contribution Summary
const monthlyContributionSummaryEmail = async (
  authorName: string,
  authorEmail: string,
  month: string,
  contributionData: { totalSubmissions: number; published: number; pending: number },
  dashboardLink: string
) => {
  const unsubscribeLink = `https://www.martxmart.com/unsubscribe?email=${encodeURIComponent(authorEmail)}`;

  const info = await transporter.sendMail({
    from: '"MartxMart Editorial" <editorial@martxmart.com>',
    to: authorEmail,
    subject: `Your MartxMart Contribution Summary for ${month}`,
    text: `Hi ${authorName},

Here’s your contribution summary for ${month}:

- Total Submissions: ${contributionData.totalSubmissions}
- Published: ${contributionData.published}
- Pending: ${contributionData.pending}

View details: ${dashboardLink}

Thank you for your contributions! Questions? Contact editorial@martxmart.com 📧

Keep writing! 😊
The MartxMart Editorial Team
www.martxmart.com

To unsubscribe: ${unsubscribeLink}
MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Your Contribution Summary for ${month}</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.07); }
    .header { background-color: #ff6f61; color: white; text-align: center; padding: 30px 20px; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px 20px; text-align: center; }
    .content p { font-size: 16px; line-height: 1.6; }
    .details { text-align: left; margin-top: 15px; font-size: 14px; line-height: 1.6; }
    .cta-button { display: inline-block; background-color: #ff6f61; color: white; text-decoration: none; font-weight: bold; padding: 14px 25px; border-radius: 5px; margin-top: 20px; }
    .footer { text-align: center; font-size: 12px; color: #888; background-color: #f1f1f1; padding: 20px; }
    .footer a { color: #888; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Contribution Summary for ${month} 📊</h1>
    </div>
    <div class="content">
      <p>Hi ${authorName},</p>
      <p>Here’s your contribution summary for ${month}:</p>
      <div class="details">
        <p><strong>Total Submissions:</strong> ${contributionData.totalSubmissions}</p>
        <p><strong>Published:</strong> ${contributionData.published}</p>
        <p><strong>Pending:</strong> ${contributionData.pending}</p>
      </div>
      <a href="${dashboardLink}" class="cta-button" target="_blank">View Details</a>
      <p style="margin-top: 25px;">Thank you for your contributions! Questions? Reach us at <a href="mailto:editorial@martxmart.com">editorial@martxmart.com</a></p>
    </div>
    <div class="footer">
      www.martxmart.com<br/>
      MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985<br/>
      📩 editorial@martxmart.com<br/><br/>
      <a href="${unsubscribeLink}">Unsubscribe</a>
    </div>
  </div>
</body>
</html>`,
  });
};

// 6. Royalty/Payment Confirmation
const royaltyPaymentConfirmationEmail = async (
  authorName: string,
  authorEmail: string,
  paymentDetails: { amount: string; date: string; period: string },
  paymentLink: string
) => {
  const unsubscribeLink = `https://www.martxmart.com/unsubscribe?email=${encodeURIComponent(authorEmail)}`;

  const info = await transporter.sendMail({
    from: '"MartxMart Editorial" <editorial@martxmart.com>',
    to: authorEmail,
    subject: `Royalty Payment of ₹${paymentDetails.amount} Confirmed`,
    text: `Hi ${authorName},

We’re pleased to confirm your royalty payment for ${paymentDetails.period}:

- Amount: ₹${paymentDetails.amount}
- Date: ${paymentDetails.date}

View payment details: ${paymentLink}

Questions? Contact editorial@martxmart.com 📧

Thank you for your contributions! 😊
The MartxMart Editorial Team
www.martxmart.com

To unsubscribe: ${unsubscribeLink}
MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Royalty Payment of ₹${paymentDetails.amount} Confirmed</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.07); }
    .header { background-color: #ff6f61; color: white; text-align: center; padding: 30px 20px; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px 20px; text-align: center; }
    .content p { font-size: 16px; line-height: 1.6; }
    .details { text-align: left; margin-top: 15px; font-size: 14px; line-height: 1.6; }
    .cta-button { display: inline-block; background-color: #ff6f61; color: white; text-decoration: none; font-weight: bold; padding: 14px 25px; border-radius: 5px; margin-top: 20px; }
    .footer { text-align: center; font-size: 12px; color: #888; background-color: #f1f1f1; padding: 20px; }
    .footer a { color: #888; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Royalty Payment Confirmed 🎉</h1>
    </div>
    <div class="content">
      <p>Hi ${authorName},</p>
      <p>We’re pleased to confirm your royalty payment for ${paymentDetails.period}.</p>
      <div class="details">
        <p><strong>Amount:</strong> ₹${paymentDetails.amount}</p>
        <p><strong>Date:</strong> ${paymentDetails.date}</p>
      </div>
      <a href="${paymentLink}" class="cta-button" target="_blank">View Payment Details</a>
      <p style="margin-top: 25px;">Questions? Reach us at <a href="mailto:editorial@martxmart.com">editorial@martxmart.com</a></p>
    </div>
    <div class="footer">
      www.martxmart.com<br/>
      MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985<br/>
      📩 editorial@martxmart.com<br/><br/>
      <a href="${unsubscribeLink}">Unsubscribe</a>
    </div>
  </div>
</body>
</html>`,
  });
};

// 7. Content Performance Report (Views, Engagement)
const contentPerformanceReportEmail = async (
  authorName: string,
  authorEmail: string,
  contentTitle: string,
  performanceData: { views: number; likes: number; comments: number; period: string },
  reportLink: string
) => {
  const unsubscribeLink = `https://www.martxmart.com/unsubscribe?email=${encodeURIComponent(authorEmail)}`;

  const info = await transporter.sendMail({
    from: '"MartxMart Editorial" <editorial@martxmart.com>',
    to: authorEmail,
    subject: `Performance Report for "${contentTitle}"`,
    text: `Hi ${authorName},

Here’s the performance report for "${contentTitle}" for ${performanceData.period}:

- Views: ${performanceData.views}
- Likes: ${performanceData.likes}
- Comments: ${performanceData.comments}

View full report: ${reportLink}

Thank you for your amazing content! Questions? Contact editorial@martxmart.com 📧

Keep shining! 😊
The MartxMart Editorial Team
www.martxmart.com

To unsubscribe: ${unsubscribeLink}
MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Performance Report for "${contentTitle}"</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.07); }
    .header { background-color: #ff6f61; color: white; text-align: center; padding: 30px 20px; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px 20px; text-align: center; }
    .content p { font-size: 16px; line-height: 1.6; }
    .details { text-align: left; margin-top: 15px; font-size: 14px; line-height: 1.6; }
    .cta-button { display: inline-block; background-color: #ff6f61; color: white; text-decoration: none; font-weight: bold; padding: 14px 25px; border-radius: 5px; margin-top: 20px; }
    .footer { text-align: center; font-size: 12px; color: #888; background-color: #f1f1f1; padding: 20px; }
    .footer a { color: #888; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Content Performance Report 📊</h1>
    </div>
    <div class="content">
      <p>Hi ${authorName},</p>
      <p>Here’s the performance report for "<strong>${contentTitle}</strong>" for ${performanceData.period}:</p>
      <div class="details">
        <p><strong>Views:</strong> ${performanceData.views}</p>
        <p><strong>Likes:</strong> ${performanceData.likes}</p>
        <p><strong>Comments:</strong> ${performanceData.comments}</p>
      </div>
      <a href="${reportLink}" class="cta-button" target="_blank">View Full Report</a>
      <p style="margin-top: 25px;">Thank you for your amazing content! Questions? Reach us at <a href="mailto:editorial@martxmart.com">editorial@martxmart.com</a></p>
    </div>
    <div class="footer">
      www.martxmart.com<br/>
      MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985<br/>
      📩 editorial@martxmart.com<br/><br/>
      <a href="${unsubscribeLink}">Unsubscribe</a>
    </div>
  </div>
</body>
</html>`,
  });
};


// 1. Festive/Seasonal Campaign Announcement
const festiveCampaignAnnouncementEmail = async (
  recipientName: string,
  recipientEmail: string,
  campaignDetails: { name: string; startDate: string; endDate: string },
  campaignLink: string
) => {
  const unsubscribeLink = `https://www.martxmart.com/unsubscribe?email=${encodeURIComponent(recipientEmail)}`;

  const info = await transporter.sendMail({
    from: '"MartxMart Marketing" <marketing@martxmart.com>',
    to: recipientEmail,
    subject: `Celebrate with ${campaignDetails.name} at MartxMart! 🎉`,
    text: `Hi ${recipientName || 'Friend'},

Get ready for ${campaignDetails.name}! Enjoy exclusive deals and festive offers from ${campaignDetails.startDate} to ${campaignDetails.endDate}.

Shop now: ${campaignLink}

Questions? Contact support@martxmart.com 📧

Happy Shopping! 😊
The MartxMart Team
www.martxmart.com

To unsubscribe: ${unsubscribeLink}
MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Celebrate with ${campaignDetails.name}!</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.07); }
    .header { background-color: #ff6f61; color: white; text-align: center; padding: 30px 20px; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px 20px; text-align: center; }
    .content p { font-size: 16px; line-height: 1.6; }
    .cta-button { display: inline-block; background-color: #ff6f61; color: white; text-decoration: none; font-weight: bold; padding: 14px 25px; border-radius: 5px; margin-top: 20px; }
    .footer { text-align: center; font-size: 12px; color: #888; background-color: #f1f1f1; padding: 20px; }
    .footer a { color: #888; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${campaignDetails.name} is Here! 🎉</h1>
    </div>
    <div class="content">
      <p>Hi ${recipientName || 'Friend'},</p>
      <p>Get ready for <strong>${campaignDetails.name}</strong>! Enjoy exclusive deals and festive offers from ${campaignDetails.startDate} to ${campaignDetails.endDate}.</p>
      <a href="${campaignLink}" class="cta-button" target="_blank">Shop Now</a>
      <p style="margin-top: 25px;">Questions? Reach us at <a href="mailto:support@martxmart.com">support@martxmart.com</a></p>
    </div>
    <div class="footer">
      www.martxmart.com<br/>
      MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985<br/>
      📩 marketing@martxmart.com<br/><br/>
      <a href="${unsubscribeLink}">Unsubscribe</a>
    </div>
  </div>
</body>
</html>`,
  });
};

// 2. Flash Sale Notification
const flashSaleNotificationEmail = async (
  recipientName: string,
  recipientEmail: string,
  saleDetails: { name: string; endTime: string; discount: string },
  saleLink: string
) => {
  const unsubscribeLink = `https://www.martxmart.com/unsubscribe?email=${encodeURIComponent(recipientEmail)}`;

  const info = await transporter.sendMail({
    from: '"MartxMart Marketing" <marketing@martxmart.com>',
    to: recipientEmail,
    subject: `${saleDetails.name} Flash Sale – Up to ${saleDetails.discount} Off!`,
    text: `Hi ${recipientName || 'Friend'},

Hurry! The ${saleDetails.name} Flash Sale is on with up to ${saleDetails.discount} off! Ends at ${saleDetails.endTime}.

Shop now: ${saleLink}

Questions? Contact support@martxmart.com 📧

Don’t miss out! 😊
The MartxMart Team
www.martxmart.com

To unsubscribe: ${unsubscribeLink}
MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${saleDetails.name} Flash Sale</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.07); }
    .header { background-color: #ff6f61; color: white; text-align: center; padding: 30px 20px; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px 20px; text-align: center; }
    .content p { font-size: 16px; line-height: 1.6; }
    .cta-button { display: inline-block; background-color: #ff6f61; color: white; text-decoration: none; font-weight: bold; padding: 14px 25px; border-radius: 5px; margin-top: 20px; }
    .footer { text-align: center; font-size: 12px; color: #888; background-color: #f1f1f1; padding: 20px; }
    .footer a { color: #888; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${saleDetails.name} Flash Sale! ⚡</h1>
    </div>
    <div class="content">
      <p>Hi ${recipientName || 'Friend'},</p>
      <p>Hurry! The <strong>${saleDetails.name} Flash Sale</strong> is on with up to <strong>${saleDetails.discount} off</strong>! Ends at ${saleDetails.endTime}.</p>
      <a href="${saleLink}" class="cta-button" target="_blank">Shop Now</a>
      <p style="margin-top: 25px;">Questions? Reach us at <a href="mailto:support@martxmart.com">support@martxmart.com</a></p>
    </div>
    <div class="footer">
      www.martxmart.com<br/>
      MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985<br/>
      📩 marketing@martxmart.com<br/><br/>
      <a href="${unsubscribeLink}">Unsubscribe</a>
    </div>
  </div>
</body>
</html>`,
  });
};

// 3. New Category/Product Line Introduced
const newCategoryProductLineEmail = async (
  recipientName: string,
  recipientEmail: string,
  categoryDetails: { name: string; type: 'category' | 'product line' },
  categoryLink: string
) => {
  const unsubscribeLink = `https://www.martxmart.com/unsubscribe?email=${encodeURIComponent(recipientEmail)}`;
  const typeText = categoryDetails.type === 'category' ? 'Category' : 'Product Line';

  const info = await transporter.sendMail({
    from: '"MartxMart Marketing" <marketing@martxmart.com>',
    to: recipientEmail,
    subject: `Discover Our New ${typeText}: ${categoryDetails.name}!`,
    text: `Hi ${recipientName || 'Friend'},

Exciting news! We’ve launched a new ${categoryDetails.type} – ${categoryDetails.name} – on MartxMart!

Explore now: ${categoryLink}

Questions? Contact support@martxmart.com 📧

Happy Shopping! 😊
The MartxMart Team
www.martxmart.com

To unsubscribe: ${unsubscribeLink}
MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>New ${typeText}: ${categoryDetails.name}</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.07); }
    .header { background-color: #ff6f61; color: white; text-align: center; padding: 30px 20px; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px 20px; text-align: center; }
    .content p { font-size: 16px; line-height: 1.6; }
    .cta-button { display: inline-block; background-color: #ff6f61; color: white; text-decoration: none; font-weight: bold; padding: 14px 25px; border-radius: 5px; margin-top: 20px; }
    .footer { text-align: center; font-size: 12px; color: #888; background-color: #f1f1f1; padding: 20px; }
    .footer a { color: #888; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New ${typeText}: ${categoryDetails.name}! 🛍️</h1>
    </div>
    <div class="content">
      <p>Hi ${recipientName || 'Friend'},</p>
      <p>Exciting news! We’ve launched a new <strong>${categoryDetails.type}</strong> – <strong>${categoryDetails.name}</strong> – on MartxMart!</p>
      <a href="${categoryLink}" class="cta-button" target="_blank">Explore Now</a>
      <p style="margin-top: 25px;">Questions? Reach us at <a href="mailto:support@martxmart.com">support@martxmart.com</a></p>
    </div>
    <div class="footer">
      www.martxmart.com<br/>
      MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985<br/>
      📩 marketing@martxmart.com<br/><br/>
      <a href="${unsubscribeLink}">Unsubscribe</a>
    </div>
  </div>
</body>
</html>`,
  });
};

// 4. Referral Bonus Earned
const referralBonusEarnedEmail = async (
  recipientName: string,
  recipientEmail: string,
  bonusDetails: { amount: string; referredUser: string },
  dashboardLink: string
) => {
  const unsubscribeLink = `https://www.martxmart.com/unsubscribe?email=${encodeURIComponent(recipientEmail)}`;

  const info = await transporter.sendMail({
    from: '"MartxMart Marketing" <marketing@martxmart.com>',
    to: recipientEmail,
    subject: `You’ve Earned a ₹${bonusDetails.amount} Referral Bonus!`,
    text: `Hi ${recipientName || 'Friend'},

Great job! You’ve earned a ₹${bonusDetails.amount} referral bonus for inviting ${bonusDetails.referredUser} to MartxMart! 🎉

Check your rewards: ${dashboardLink}

Keep sharing and earn more! Questions? Contact support@martxmart.com 📧

The MartxMart Team
www.martxmart.com

To unsubscribe: ${unsubscribeLink}
MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>You’ve Earned a ₹${bonusDetails.amount} Referral Bonus!</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.07); }
    .header { background-color: #ff6f61; color: white; text-align: center; padding: 30px 20px; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px 20px; text-align: center; }
    .content p { font-size: 16px; line-height: 1.6; }
    .details { text-align: left; margin-top: 15px; font-size: 14px; line-height: 1.6; }
    .cta-button { display: inline-block; background-color: #ff6f61; color: white; text-decoration: none; font-weight: bold; padding: 14px 25px; border-radius: 5px; margin-top: 20px; }
    .footer { text-align: center; font-size: 12px; color: #888; background-color: #f1f1f1; padding: 20px; }
    .footer a { color: #888; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Referral Bonus Earned! 🎉</h1>
    </div>
    <div class="content">
      <p>Hi ${recipientName || 'Friend'},</p>
      <p>Great job! You’ve earned a <strong>₹${bonusDetails.amount} referral bonus</strong> for inviting <strong>${bonusDetails.referredUser}</strong> to MartxMart!</p>
      <div class="details">
        <p><strong>Bonus Amount:</strong> ₹${bonusDetails.amount}</p>
        <p><strong>Referred User:</strong> ${bonusDetails.referredUser}</p>
      </div>
      <a href="${dashboardLink}" class="cta-button" target="_blank">Check Your Rewards</a>
      <p style="margin-top: 25px;">Keep sharing and earn more! Questions? Reach us at <a href="mailto:support@martxmart.com">support@martxmart.com</a></p>
    </div>
    <div class="footer">
      www.martxmart.com<br/>
      MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985<br/>
      📩 marketing@martxmart.com<br/><br/>
      <a href="${unsubscribeLink}">Unsubscribe</a>
    </div>
  </div>
</body>
</html>`,
  });
};

// 5. Invite Friends & Earn Coupons
const inviteFriendsEarnCouponsEmail = async (
  recipientName: string,
  recipientEmail: string,
  referralDetails: { couponValue: string; referralLink: string }
) => {
  const unsubscribeLink = `https://www.martxmart.com/unsubscribe?email=${encodeURIComponent(recipientEmail)}`;

  const info = await transporter.sendMail({
    from: '"MartxMart Marketing" <marketing@martxmart.com>',
    to: recipientEmail,
    subject: `Invite Friends & Earn ₹${referralDetails.couponValue} Coupons!`,
    text: `Hi ${recipientName || 'Friend'},

Spread the word about MartxMart and earn ₹${referralDetails.couponValue} coupons for each friend who joins and shops!

Invite now: ${referralDetails.referralLink}

Questions? Contact support@martxmart.com 📧

Share the love! 😊
The MartxMart Team
www.martxmart.com

To unsubscribe: ${unsubscribeLink}
MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Invite Friends & Earn ₹${referralDetails.couponValue} Coupons!</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.07); }
    .header { background-color: #ff6f61; color: white; text-align: center; padding: 30px 20px; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px 20px; text-align: center; }
    .content p { font-size: 16px; line-height: 1.6; }
    .cta-button { display: inline-block; background-color: #ff6f61; color: white; text-decoration: none; font-weight: bold; padding: 14px 25px; border-radius: 5px; margin-top: 20px; }
    .footer { text-align: center; font-size: 12px; color: #888; background-color: #f1f1f1; padding: 20px; }
    .footer a { color: #888; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Invite Friends, Earn Coupons! 🎁</h1>
    </div>
    <div class="content">
      <p>Hi ${recipientName || 'Friend'},</p>
      <p>Spread the word about MartxMart and earn <strong>₹${referralDetails.couponValue} coupons</strong> for each friend who joins and shops!</p>
      <a href="${referralDetails.referralLink}" class="cta-button" target="_blank">Invite Now</a>
      <p style="margin-top: 25px;">Questions? Reach us at <a href="mailto:support@martxmart.com">support@martxmart.com</a></p>
    </div>
    <div class="footer">
      www.martxmart.com<br/>
      MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985<br/>
      📩 marketing@martxmart.com<br/><br/>
      <a href="${unsubscribeLink}">Unsubscribe</a>
    </div>
  </div>
</body>
</html>`,
  });
};

// 6. Newsletter Subscription Confirmation
const newsletterSubscriptionConfirmationEmail = async (
  recipientEmail: string
) => {
  const unsubscribeLink = `https://www.martxmart.com/unsubscribe?email=${encodeURIComponent(recipientEmail)}`;

  const info = await transporter.sendMail({
    from: '"MartxMart Marketing" <support@martxmart.com>',
    to: recipientEmail,
    subject: `Welcome to the MartxMart Newsletter!`,
    text: `Hi  'Friend',

Welcome to the MartxMart Newsletter! 🎉 You’re now subscribed to exclusive deals, updates, and tips from our marketplace.

Stay tuned for our next edition!

Questions? Contact support@martxmart.com 📧

Happy Shopping! 😊
The MartxMart Team
www.martxmart.com

To unsubscribe: ${unsubscribeLink}
MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Welcome to the MartxMart Newsletter!</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.07); }
    .header { background-color: #ff6f61; color: white; text-align: center; padding: 30px 20px; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px 20px; text-align: center; }
    .content p { font-size: 16px; line-height: 1.6; }
    .cta-button { display: inline-block; background-color: #ff6f61; color: white; text-decoration: none; font-weight: bold; padding: 14px 25px; border-radius: 5px; margin-top: 20px; }
    .footer { text-align: center; font-size: 12px; color: #888; background-color: #f1f1f1; padding: 20px; }
    .footer a { color: #888; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to Our Newsletter! 🎉</h1>
    </div>
    <div class="content">
      <p>Hi 'Friend',</p>
      <p>Welcome to the MartxMart Newsletter! You’re now subscribed to exclusive deals, updates, and tips from our marketplace.</p>
      <p>Stay tuned for our next edition!</p>
      <p style="margin-top: 25px;">Questions? Reach us at <a href="mailto:support@martxmart.com">support@martxmart.com</a></p>
    </div>
    <div class="footer">
      www.martxmart.com<br/>
      MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985<br/>
      📩 marketing@martxmart.com<br/><br/>
      <a href="${unsubscribeLink}">Unsubscribe</a>
    </div>
  </div>
</body>
</html>`,
  });
};

// 7. Unsubscribe Confirmation
const unsubscribeConfirmationEmail = async (
  recipientEmail: string
) => {
  const resubscribeLink = `https://www.martxmart.com/subscribe?email=${encodeURIComponent(recipientEmail)}`;

  const info = await transporter.sendMail({
    from: '"MartxMart Marketing" <support@martxmart.com>',
    to: recipientEmail,
    subject: `You’ve Unsubscribed from MartxMart Emails`,
    text: `Hi 'Friend',

We’ve processed your request to unsubscribe from MartxMart marketing emails. You’ll no longer receive our newsletters or promotional offers.

Changed your mind? Resubscribe here: ${resubscribeLink}

Questions? Contact support@martxmart.com 📧

Thank you! 😊
The MartxMart Team
www.martxmart.com
MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>You’ve Unsubscribed</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.07); }
    .header { background-color: #ff6f61; color: white; text-align: center; padding: 30px 20px; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px 20px; text-align: center; }
    .content p { font-size: 16px; line-height: 1.6; }
    .cta-button { display: inline-block; background-color: #ff6f61; color: white; text-decoration: none; font-weight: bold; padding: 14px 25px; border-radius: 5px; margin-top: 20px; }
    .footer { text-align: center; font-size: 12px; color: #888; background-color: #f1f1f1; padding: 20px; }
    .footer a { color: #888; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>You’ve Unsubscribed 📧</h1>
    </div>
    <div class="content">
      <p>Hi  'Friend',</p>
      <p>We’ve processed your request to unsubscribe from MartxMart marketing emails. You’ll no longer receive our newsletters or promotional offers.</p>
      <a href="${resubscribeLink}" class="cta-button" target="_blank">Resubscribe</a>
      <p style="margin-top: 25px;">Questions? Reach us at <a href="mailto:support@martxmart.com">support@martxmart.com</a></p>
    </div>
    <div class="footer">
      www.martxmart.com<br/>
      MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985<br/>
      📩 marketing@martxmart.com
    </div>
  </div>
</body>
</html>`,
  });
};

// 8. Re-engagement (Inactive User Reminder)
const reengagementEmail = async (
  recipientName: string,
  recipientEmail: string,
  offerDetails: { offer: string; endDate: string },
  shopLink: string
) => {
  const unsubscribeLink = `https://www.martxmart.com/unsubscribe?email=${encodeURIComponent(recipientEmail)}`;

  const info = await transporter.sendMail({
    from: '"MartxMart Marketing" <marketing@martxmart.com>',
    to: recipientEmail,
    subject: `We Miss You! Enjoy ${offerDetails.offer} Off`,
    text: `Hi ${recipientName || 'Friend'},

It’s been a while since you shopped with MartxMart! Come back and enjoy ${offerDetails.offer} off your next purchase, valid until ${offerDetails.endDate}.

Shop now: ${shopLink}

Questions? Contact support@martxmart.com 📧

Welcome back! 😊
The MartxMart Team
www.martxmart.com

To unsubscribe: ${unsubscribeLink}
MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>We Miss You! Enjoy ${offerDetails.offer} Off</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.07); }
    .header { background-color: #ff6f61; color: white; text-align: center; padding: 30px 20px; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px 20px; text-align: center; }
    .content p { font-size: 16px; line-height: 1.6; }
    .cta-button { display: inline-block; background-color: #ff6f61; color: white; text-decoration: none; font-weight: bold; padding: 14px 25px; border-radius: 5px; margin-top: 20px; }
    .footer { text-align: center; font-size: 12px; color: #888; background-color: #f1f1f1; padding: 20px; }
    .footer a { color: #888; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>We Miss You! 🛍️</h1>
    </div>
    <div class="content">
      <p>Hi ${recipientName || 'Friend'},</p>
      <p>It’s been a while since you shopped with MartxMart! Come back and enjoy <strong>${offerDetails.offer} off</strong> your next purchase, valid until ${offerDetails.endDate}.</p>
      <a href="${shopLink}" class="cta-button" target="_blank">Shop Now</a>
      <p style="margin-top: 25px;">Questions? Reach us at <a href="mailto:support@martxmart.com">support@martxmart.com</a></p>
    </div>
    <div class="footer">
      www.martxmart.com<br/>
      MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985<br/>
      📩 marketing@martxmart.com<br/><br/>
      <a href="${unsubscribeLink}">Unsubscribe</a>
    </div>
  </div>
</body>
</html>`,
  });
};

// 1. System Maintenance Alert
const systemMaintenanceAlertEmail = async (
  recipientName: string,
  recipientEmail: string,
  maintenanceDetails: { startTime: string; endTime: string; impact: string }
) => {
  // No unsubscribe link, as this is a critical notification
  const info = await transporter.sendMail({
    from: '"MartxMart Support" <support@martxmart.com>',
    to: recipientEmail,
    subject: `Scheduled System Maintenance on ${maintenanceDetails.startTime}`,
    text: `Hi ${recipientName || 'Valued User'},

We’ve scheduled system maintenance to keep MartxMart running smoothly.

- Start: ${maintenanceDetails.startTime}
- End: ${maintenanceDetails.endTime}
- Impact: ${maintenanceDetails.impact}

We apologize for any inconvenience. Questions? Contact support@martxmart.com 📧

Thank you for your understanding! 😊
The MartxMart Team
www.martxmart.com
MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Scheduled System Maintenance</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.07); }
    .header { background-color: #ff6f61; color: white; text-align: center; padding: 30px 20px; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px 20px; text-align: center; }
    .content p { font-size: 16px; line-height: 1.6; }
    .details { text-align: left; margin-top: 15px; font-size: 14px; line-height: 1.6; }
    .footer { text-align: center; font-size: 12px; color: #888; background-color: #f1f1f1; padding: 20px; }
    .footer a { color: #888; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>System Maintenance Alert ⚙️</h1>
    </div>
    <div class="content">
      <p>Hi ${recipientName || 'Valued User'},</p>
      <p>We’ve scheduled system maintenance to keep MartxMart running smoothly.</p>
      <div class="details">
        <p><strong>Start:</strong> ${maintenanceDetails.startTime}</p>
        <p><strong>End:</strong> ${maintenanceDetails.endTime}</p>
        <p><strong>Impact:</strong> ${maintenanceDetails.impact}</p>
      </div>
      <p style="margin-top: 25px;">We apologize for any inconvenience. Questions? Reach us at <a href="mailto:support@martxmart.com">support@martxmart.com</a></p>
    </div>
    <div class="footer">
      www.martxmart.com<br/>
      MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985<br/>
      📩 support@martxmart.com
    </div>
  </div>
</body>
</html>`,
  });
};

// 2. Privacy Policy / Terms Update
const policyTermsUpdateEmail = async (
  recipientName: string,
  recipientEmail: string,
  updateDetails: { type: 'Privacy Policy' | 'Terms of Service'; effectiveDate: string },
  policyLink: string
) => {
  // No unsubscribe link, as this is a critical notification
  const info = await transporter.sendMail({
    from: '"MartxMart Support" <support@martxmart.com>',
    to: recipientEmail,
    subject: `${updateDetails.type} Update Effective ${updateDetails.effectiveDate}`,
    text: `Hi ${recipientName || 'Valued User'},

We’ve updated our ${updateDetails.type}, effective ${updateDetails.effectiveDate}. These changes reflect our commitment to transparency and your trust.

Review the updates: ${policyLink}

Questions? Contact support@martxmart.com 📧

Thank you! 😊
The MartxMart Team
www.martxmart.com
MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${updateDetails.type} Update</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.07); }
    .header { background-color: #ff6f61; color: white; text-align: center; padding: 30px 20px; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px 20px; text-align: center; }
    .content p { font-size: 16px; line-height: 1.6; }
    .cta-button { display: inline-block; background-color: #ff6f61; color: white; text-decoration: none; font-weight: bold; padding: 14px 25px; border-radius: 5px; margin-top: 20px; }
    .footer { text-align: center; font-size: 12px; color: #888; background-color: #f1f1f1; padding: 20px; }
    .footer a { color: #888; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${updateDetails.type} Update 📜</h1>
    </div>
    <div class="content">
      <p>Hi ${recipientName || 'Valued User'},</p>
      <p>We’ve updated our <strong>${updateDetails.type}</strong>, effective ${updateDetails.effectiveDate}. These changes reflect our commitment to transparency and your trust.</p>
      <a href="${policyLink}" class="cta-button" target="_blank">Review Updates</a>
      <p style="margin-top: 25px;">Questions? Reach us at <a href="mailto:support@martxmart.com">support@martxmart.com</a></p>
    </div>
    <div class="footer">
      www.martxmart.com<br/>
      MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985<br/>
      📩 support@martxmart.com
    </div>
  </div>
</body>
</html>`,
  });
};

// 3. Data Export Request Confirmation
const dataExportRequestConfirmationEmail = async (
  recipientName: string,
  recipientEmail: string,
  requestDetails: { requestId: string; estimatedDelivery: string }
) => {
  // No unsubscribe link, as this is a user-initiated critical notification
  const info = await transporter.sendMail({
    from: '"MartxMart Support" <support@martxmart.com>',
    to: recipientEmail,
    subject: `Data Export Request #${requestDetails.requestId} Received`,
    text: `Hi ${recipientName || 'Valued User'},

We’ve received your data export request (ID: ${requestDetails.requestId}). You’ll receive your data by ${requestDetails.estimatedDelivery}.

Questions? Contact support@martxmart.com 📧

Thank you! 😊
The MartxMart Team
www.martxmart.com
MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Data Export Request #${requestDetails.requestId} Received</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.07); }
    .header { background-color: #ff6f61; color: white; text-align: center; padding: 30px 20px; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px 20px; text-align: center; }
    .content p { font-size: 16px; line-height: 1.6; }
    .details { text-align: left; margin-top: 15px; font-size: 14px; line-height: 1.6; }
    .footer { text-align: center; font-size: 12px; color: #888; background-color: #f1f1f1; padding: 20px; }
    .footer a { color: #888; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Data Export Request Received 📋</h1>
    </div>
    <div class="content">
      <p>Hi ${recipientName || 'Valued User'},</p>
      <p>We’ve received your data export request (ID: ${requestDetails.requestId}). You’ll receive your data by ${requestDetails.estimatedDelivery}.</p>
      <div class="details">
        <p><strong>Request ID:</strong> ${requestDetails.requestId}</p>
        <p><strong>Estimated Delivery:</strong> ${requestDetails.estimatedDelivery}</p>
      </div>
      <p style="margin-top: 25px;">Questions? Reach us at <a href="mailto:support@martxmart.com">support@martxmart.com</a></p>
    </div>
    <div class="footer">
      www.martxmart.com<br/>
      MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985<br/>
      📩 support@martxmart.com
    </div>
  </div>
</body>
</html>`,
  });
};

// 4. Account Data Deleted
const accountDataDeletedEmail = async (
  recipientName: string,
  recipientEmail: string,
  deletionDetails: { requestId: string; deletionDate: string }
) => {
  // No unsubscribe link, as this is a user-initiated critical notification
  const info = await transporter.sendMail({
    from: '"MartxMart Support" <support@martxmart.com>',
    to: recipientEmail,
    subject: `Account Data Deletion Completed (Request #${deletionDetails.requestId})`,
    text: `Hi ${recipientName || 'Valued User'},

Your account data deletion request (ID: ${deletionDetails.requestId}) was completed on ${deletionDetails.deletionDate}. All your personal data has been removed from MartxMart.

Questions? Contact support@martxmart.com 📧

Thank you! 😊
The MartxMart Team
www.martxmart.com
MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Account Data Deletion Completed</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.07); }
    .header { background-color: #ff6f61; color: white; text-align: center; padding: 30px 20px; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px 20px; text-align: center; }
    .content p { font-size: 16px; line-height: 1.6; }
    .details { text-align: left; margin-top: 15px; font-size: 14px; line-height: 1.6; }
    .footer { text-align: center; font-size: 12px; color: #888; background-color: #f1f1f1; padding: 20px; }
    .footer a { color: #888; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Account Data Deletion Completed 🗑️</h1>
    </div>
    <div class="content">
      <p>Hi ${recipientName || 'Valued User'},</p>
      <p>Your account data deletion request (ID: ${deletionDetails.requestId}) was completed on ${deletionDetails.deletionDate}. All your personal data has been removed from MartxMart.</p>
      <div class="details">
        <p><strong>Request ID:</strong> ${deletionDetails.requestId}</p>
        <p><strong>Deletion Date:</strong> ${deletionDetails.deletionDate}</p>
      </div>
      <p style="margin-top: 25px;">Questions? Reach us at <a href="mailto:support@martxmart.com">support@martxmart.com</a></p>
    </div>
    <div class="footer">
      www.martxmart.com<br/>
      MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985<br/>
      📩 support@martxmart.com
    </div>
  </div>
</body>
</html>`,
  });
};

// 5. App Update Notification
const appUpdateNotificationEmail = async (
  recipientName: string,
  recipientEmail: string,
  updateDetails: { version: string; features: string; platform: 'iOS' | 'Android' },
  downloadLink: string
) => {
  const unsubscribeLink = `https://www.martxmart.com/unsubscribe?email=${encodeURIComponent(recipientEmail)}`;

  const info = await transporter.sendMail({
    from: '"MartxMart Support" <support@martxmart.com>',
    to: recipientEmail,
    subject: `MartxMart App Update ${updateDetails.version} Available!`,
    text: `Hi ${recipientName || 'Valued User'},

A new MartxMart app update (Version ${updateDetails.version}) is available for ${updateDetails.platform}!

What’s New:
${updateDetails.features}

Update now: ${downloadLink}

Questions? Contact support@martxmart.com 📧

Enjoy the upgrade! 😊
The MartxMart Team
www.martxmart.com

To unsubscribe: ${unsubscribeLink}
MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>MartxMart App Update ${updateDetails.version}</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.07); }
    .header { background-color: #ff6f61; color: white; text-align: center; padding: 30px 20px; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px 20px; text-align: center; }
    .content p { font-size: 16px; line-height: 1.6; }
    .details { text-align: left; margin-top: 15px; font-size: 14px; line-height: 1.6; }
    .cta-button { display: inline-block; background-color: #ff6f61; color: white; text-decoration: none; font-weight: bold; padding: 14px 25px; border-radius: 5px; margin-top: 20px; }
    .footer { text-align: center; font-size: 12px; color: #888; background-color: #f1f1f1; padding: 20px; }
    .footer a { color: #888; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>App Update ${updateDetails.version} Available! 📱</h1>
    </div>
    <div class="content">
      <p>Hi ${recipientName || 'Valued User'},</p>
      <p>A new MartxMart app update (Version ${updateDetails.version}) is available for ${updateDetails.platform}!</p>
      <div class="details">
        <p><strong>What’s New:</strong> ${updateDetails.features}</p>
      </div>
      <a href="${downloadLink}" class="cta-button" target="_blank">Update Now</a>
      <p style="margin-top: 25px;">Questions? Reach us at <a href="mailto:support@martxmart.com">support@martxmart.com</a></p>
    </div>
    <div class="footer">
      www.martxmart.com<br/>
      MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985<br/>
      📩 support@martxmart.com<br/><br/>
      <a href="${unsubscribeLink}">Unsubscribe</a>
    </div>
  </div>
</body>
</html>`,
  });
};

// 6. Custom Quote Request Acknowledgement
const customQuoteRequestAcknowledgementEmail = async (
  recipientName: string,
  recipientEmail: string,
  quoteDetails: { requestId: string; product: string; responseTime: string }
) => {
  const unsubscribeLink = `https://www.martxmart.com/unsubscribe?email=${encodeURIComponent(recipientEmail)}`;

  const info = await transporter.sendMail({
    from: '"MartxMart Support" <support@martxmart.com>',
    to: recipientEmail,
    subject: `Custom Quote Request #${quoteDetails.requestId} Received`,
    text: `Hi ${recipientName || 'Valued User'},

Thank you for your custom quote request (ID: ${quoteDetails.requestId}) for ${quoteDetails.product}. We’ll respond with a quote within ${quoteDetails.responseTime}.

Questions? Contact support@martxmart.com 📧

We’re on it! 😊
The MartxMart Team
www.martxmart.com

To unsubscribe: ${unsubscribeLink}
MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Custom Quote Request #${quoteDetails.requestId} Received</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.07); }
    .header { background-color: #ff6f61; color: white; text-align: center; padding: 30px 20px; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px 20px; text-align: center; }
    .content p { font-size: 16px; line-height: 1.6; }
    .details { text-align: left; margin-top: 15px; font-size: 14px; line-height: 1.6; }
    .footer { text-align: center; font-size: 12px; color: #888; background-color: #f1f1f1; padding: 20px; }
    .footer a { color: #888; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Custom Quote Request Received 📝</h1>
    </div>
    <div class="content">
      <p>Hi ${recipientName || 'Valued User'},</p>
      <p>Thank you for your custom quote request (ID: ${quoteDetails.requestId}) for <strong>${quoteDetails.product}</strong>. We’ll respond with a quote within ${quoteDetails.responseTime}.</p>
      <div class="details">
        <p><strong>Request ID:</strong> ${quoteDetails.requestId}</p>
        <p><strong>Product:</strong> ${quoteDetails.product}</p>
      </div>
      <p style="margin-top: 25px;">Questions? Reach us at <a href="mailto:support@martxmart.com">support@martxmart.com</a></p>
    </div>
    <div class="footer">
      www.martxmart.com<br/>
      MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985<br/>
      📩 support@martxmart.com<br/><br/>
      <a href="${unsubscribeLink}">Unsubscribe</a>
    </div>
  </div>
</body>
</html>`,
  });
};

// 7. Bulk Order Inquiry Response
const bulkOrderInquiryResponseEmail = async (
  recipientName: string,
  recipientEmail: string,
  inquiryDetails: { inquiryId: string; product: string; quantity: number; nextSteps: string }
) => {
  const unsubscribeLink = `https://www.martxmart.com/unsubscribe?email=${encodeURIComponent(recipientEmail)}`;

  const info = await transporter.sendMail({
    from: '"MartxMart Support" <support@martxmart.com>',
    to: recipientEmail,
    subject: `Bulk Order Inquiry #${inquiryDetails.inquiryId} Response`,
    text: `Hi ${recipientName || 'Valued User'},

Thank you for your bulk order inquiry (ID: ${inquiryDetails.inquiryId}) for ${inquiryDetails.quantity} units of ${inquiryDetails.product}.

Next Steps: ${inquiryDetails.nextSteps}

Questions? Contact support@martxmart.com 📧

We’re here to help! 😊
The MartxMart Team
www.martxmart.com

To unsubscribe: ${unsubscribeLink}
MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Bulk Order Inquiry #${inquiryDetails.inquiryId} Response</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.07); }
    .header { background-color: #ff6f61; color: white; text-align: center; padding: 30px 20px; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px 20px; text-align: center; }
    .content p { font-size: 16px; line-height: 1.6; }
    .details { text-align: left; margin-top: 15px; font-size: 14px; line-height: 1.6; }
    .footer { text-align: center; font-size: 12px; color: #888; background-color: #f1f1f1; padding: 20px; }
    .footer a { color: #888; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Bulk Order Inquiry Response 📦</h1>
    </div>
    <div class="content">
      <p>Hi ${recipientName || 'Valued User'},</p>
      <p>Thank you for your bulk order inquiry (ID: ${inquiryDetails.inquiryId}) for <strong>${inquiryDetails.quantity} units</strong> of <strong>${inquiryDetails.product}</strong>.</p>
      <div class="details">
        <p><strong>Inquiry ID:</strong> ${inquiryDetails.inquiryId}</p>
        <p><strong>Next Steps:</strong> ${inquiryDetails.nextSteps}</p>
      </div>
      <p style="margin-top: 25px;">Questions? Reach us at <a href="mailto:support@martxmart.com">support@martxmart.com</a></p>
    </div>
    <div class="footer">
      www.martxmart.com<br/>
      MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985<br/>
      📩 support@martxmart.com<br/><br/>
      <a href="${unsubscribeLink}">Unsubscribe</a>
    </div>
  </div>
</body>
</html>`,
  });
};

// 8. Support Chat Transcript Summary
const supportChatTranscriptSummaryEmail = async (
  recipientName: string,
  recipientEmail: string,
  chatDetails: { ticketId: string; date: string; summary: string },
  ticketLink: string
) => {
  // No unsubscribe link, as this is a user-initiated critical notification
  const info = await transporter.sendMail({
    from: '"MartxMart Support" <support@martxmart.com>',
    to: recipientEmail,
    subject: `Support Chat Summary for Ticket #${chatDetails.ticketId}`,
    text: `Hi ${recipientName || 'Valued User'},

Thank you for reaching out to MartxMart Support on ${chatDetails.date}. Here’s a summary of your chat (Ticket #${chatDetails.ticketId}):

Summary: ${chatDetails.summary}

View full details: ${ticketLink}

Questions? Contact support@martxmart.com 📧

We’re here for you! 😊
The MartxMart Team
www.martxmart.com
MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Support Chat Summary for Ticket #${chatDetails.ticketId}</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.07); }
    .header { background-color: #ff6f61; color: white; text-align: center; padding: 30px 20px; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px 20px; text-align: center; }
    .content p { font-size: 16px; line-height: 1.6; }
    .details { text-align: left; margin-top: 15px; font-size: 14px; line-height: 1.6; }
    .cta-button { display: inline-block; background-color: #ff6f61; color: white; text-decoration: none; font-weight: bold; padding: 14px 25px; border-radius: 5px; margin-top: 20px; }
    .footer { text-align: center; font-size: 12px; color: #888; background-color: #f1f1f1; padding: 20px; }
    .footer a { color: #888; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Support Chat Summary 📞</h1>
    </div>
    <div class="content">
      <p>Hi ${recipientName || 'Valued User'},</p>
      <p>Thank you for reaching out to MartxMart Support on ${chatDetails.date}. Here’s a summary of your chat (Ticket #${chatDetails.ticketId}):</p>
      <div class="details">
        <p><strong>Summary:</strong> ${chatDetails.summary}</p>
      </div>
      <a href="${ticketLink}" class="cta-button" target="_blank">View Full Details</a>
      <p style="margin-top: 25px;">Questions? Reach us at <a href="mailto:support@martxmart.com">support@martxmart.com</a></p>
    </div>
    <div class="footer">
      www.martxmart.com<br/>
      MARTXMART RETAIL PRIVATE LIMITED, CIN: U47912BR2025PTC075985<br/>
      📩 support@martxmart.com
    </div>
  </div>
</body>
</html>`,
  });
};

export {
  welcomeEmail,
  newsletterEmail,
  orderConfirmationEmail,
  shippingConfirmationEmail,
  deliveryConfirmationEmail,
  cartAbandonmentEmail,
  paymentReminderEmail,
  promotionalEmail,
  reEngagementEmail,
  loyaltyProgramEmail,
  wishlistReminderEmail,
  ProductReview,
  otpVerificationEmail,
  vendorPolicyUpdateEmail,
  newOrderNotificationEmail,
  payoutConfirmationEmail,
  lowInventoryAlertEmail,
  newUserRegistrationEmail,
  dailySalesSummaryEmail,
  fraudDetectionAlertEmail,
  vendorApplicationReceivedEmail,
  vendorApplicationStatusEmail,
  newOrderReceivedEmail,
  orderCancellationEmail,
  payoutProcessedEmail,
  stockLowAlertEmail,
  productListingStatusEmail,
  monthlySalesReportEmail,
  disputeRaisedEmail,
  policyTermsUpdateEmail,
  kycComplianceRequestEmail,
  productPerformanceReportEmail,
  negativeReviewAlertEmail,
  franchiseApplicationReceivedEmail,
  franchiseOnboardingCompleteEmail,
  newLeadInquiryEmail,
  salesPerformanceReportEmail,
  commissionDisbursementEmail,
  franchiseAreaRequestEmail,
  policyChangesEmail,
  internalTrainingInviteEmail,
  inventoryRestockApprovedEmail,
  inventoryShipmentNotificationEmail,
  franchiseMeetingInviteEmail,
  newUserRegistrationAlertEmail,
  newVendorFranchiseSignupEmail,
  dailySystemSummaryEmail,
  fraudAlertNotificationEmail,
  failedPaymentAlertEmail,
  pendingReturnRequestEmail,
  refundApprovalRequiredEmail,
  ticketEscalationAlertEmail,
  newContentSubmittedEmail,
  monthlyRevenueSummaryEmail,
  kycComplianceNotCompletedEmail,
  policyViolationDetectedEmail,
  contentSubmissionReceivedEmail,
  contentApprovedPublishedEmail,
  contentRejectedEmail,
  revisionRequestEmail,
  monthlyContributionSummaryEmail,
  royaltyPaymentConfirmationEmail,
  contentPerformanceReportEmail,
  festiveCampaignAnnouncementEmail,
  flashSaleNotificationEmail,
  newCategoryProductLineEmail,
  referralBonusEarnedEmail,
  inviteFriendsEarnCouponsEmail,
  newsletterSubscriptionConfirmationEmail,
  unsubscribeConfirmationEmail,
  reengagementEmail,
  systemMaintenanceAlertEmail,
  dataExportRequestConfirmationEmail,
  accountDataDeletedEmail,
  appUpdateNotificationEmail,
  customQuoteRequestAcknowledgementEmail,
  bulkOrderInquiryResponseEmail,
  supportChatTranscriptSummaryEmail,
};