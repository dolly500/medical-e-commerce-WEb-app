// server/routes/paypal.js

const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

// Configure nodemailer using environment variables
const transporter = nodemailer.createTransport({
  service: process.env.SMPT_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Payment confirmation endpoint
router.post('/payment-confirmation', async (req, res) => {
  const { orderId, userEmail, orderDetails, trackingId } = req.body;

  // Create email content
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: `Order Confirmation - #${orderId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px; background-color: #f9f9f9;">
        <h2 style="text-align: center; color: #2c3e50;">Order Confirmation</h2>
        <p style="font-size: 16px; color: #333;">Dear Customer,</p>
        <p style="font-size: 16px; color: #333;">Thank you for your recent purchase! We're excited to let you know that your order has been successfully processed.</p>

        <div style="border-top: 1px solid #eaeaea; padding-top: 15px; margin-top: 20px;">
          <h3 style="color: #2c3e50; border-bottom: 1px solid #eaeaea; padding-bottom: 10px;">Order Summary</h3>
          <ul style="list-style: none; padding: 0;">
            <li style="font-size: 16px; color: #333; margin-bottom: 10px;"><strong>Order ID:</strong> ${orderId}</li>
            <li style="font-size: 16px; color: #333;"><strong>Tracking ID:</strong> ${trackingId}</li>
          </ul>
        </div>

        <div style="border-top: 1px solid #eaeaea; padding-top: 15px; margin-top: 20px;">
          <h3 style="color: #2c3e50; border-bottom: 1px solid #eaeaea; padding-bottom: 10px;">Order Details</h3>
          <p style="font-size: 16px; color: #333;">${orderDetails}</p>
        </div>

        <p style="font-size: 16px; color: #333;">You can track your order using the tracking ID provided above.</p>
        <p style="font-size: 16px; color: #333;">If you have any questions or need further assistance, feel free to contact our support team.</p>

        <p style="font-size: 16px; color: #333;">Thank you for choosing our service!</p>

        <p style="font-size: 16px; color: #333; text-align: center; margin-top: 40px;">Best regards,<br/><strong>The Medical E-commerce Team</strong></p>

        <div style="text-align: center; margin-top: 30px;">
          <a href="https://medical-e-app.vercel.app/" style="display: inline-block; padding: 10px 20px; background-color: #2c3e50; color: #fff; text-decoration: none; border-radius: 5px; font-size: 16px;">Visit Our Website</a>
        </div>
      </div>
    `,
  };

  try {
    // Send the email
    await transporter.sendMail(mailOptions);
    res.status(200).send('Receipt sent');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Error sending receipt');
  }
});

module.exports = router;
