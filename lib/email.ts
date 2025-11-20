import transporter from '@/utils/nodemailer'

type EmailParams = {
  to: string
  subject: string
  html: string
  from?: string
  text?: string
  attachments?: any[]
}

export async function sendEmail({ to, subject, html, from, text, attachments }: EmailParams) {
  const mailOptions = {
    from: from || `"martxmart Private Limited" <${process.env.SMTP_USER}>`,
    to,
    subject,
    text: text || '',
    html,
    attachments: attachments || [],
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}


export const emailTemplates = {
  orderConfirmation: (orderData: any) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #f97316;">Order Confirmation</h2>
      <p>Dear ${orderData.customerName},</p>
      <p>Thank you for your order! Your order #${orderData.orderNumber} has been confirmed.</p>
      
      <div style="background: #f9f9f9; padding: 20px; margin: 20px 0;">
        <h3>Order Details:</h3>
        <p><strong>Order Number:</strong> ${orderData.orderNumber}</p>
        <p><strong>Total Amount:</strong> ₹${orderData.totalAmount}</p>
        <p><strong>Payment Method:</strong> ${orderData.paymentMethod}</p>
      </div>
      
      <p>We'll send you another email when your order ships.</p>
      <p>Thank you for shopping with MartXMart!</p>
    </div>
  `,

  orderShipped: (orderData: any) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #f97316;">Order Shipped</h2>
      <p>Dear ${orderData.customerName},</p>
      <p>Great news! Your order #${orderData.orderNumber} has been shipped.</p>
      
      <div style="background: #f9f9f9; padding: 20px; margin: 20px 0;">
        <h3>Tracking Information:</h3>
        <p><strong>Tracking Number:</strong> ${orderData.trackingNumber}</p>
        <p><strong>Courier:</strong> ${orderData.courier}</p>
        <p><strong>Expected Delivery:</strong> ${orderData.expectedDelivery}</p>
      </div>
      
      <p>You can track your order using the tracking number above.</p>
      <p>Thank you for shopping with MartXMart!</p>
    </div>
  `,
}
