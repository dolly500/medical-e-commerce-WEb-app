const express = require("express");
const router = express.Router();
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const axios = require("axios");
const Order = require("../model/order");
const User = require("../model/user");

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;

// Function to get PayPal access token
const getAccessToken = async () => {
  const response = await axios({
    method: 'post',
    url: 'https://api.sandbox.paypal.com/v1/oauth2/token',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64')}`,
    },
    data: 'grant_type=client_credentials',
  });
  return response.data.access_token;
};

// Route to process the order
router.post(
  "/process/:orderId",
  catchAsyncErrors(async (req, res, next) => {
    try {
      console.log("Processing order:", req.params.orderId);
      const order = await Order.findOne({ _id: req.params.orderId });
      console.log("Order:", order);
      const amount = order.totalPrice; // Amount in currency unit
      console.log("Order amount:", amount);

      const accessToken = await getAccessToken();

      const paymentResponse = await axios.post(
        'https://api.sandbox.paypal.com/v1/payments/payment',
        {
          intent: 'sale',
          payer: {
            payment_method: 'paypal',
          },
          transactions: [{
            amount: {
              total: amount.toString(),
              currency: 'USD', // Change this according to your needs
            },
            description: `Order payment for order ID: ${order._id}`,
          }],
          redirect_urls: {
            return_url: `${process.env.FRONTEND_URL}/payment-success?type=order&orderId=${order._id}`,
            cancel_url: `${process.env.FRONTEND_URL}/payment-failure`,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const approvalUrl = paymentResponse.data.links.find(link => link.rel === 'approval_url').href;

      const data = {
        paymentInfo: {
          paypalId: paymentResponse.data.id,
        },
      };

      await Order.findByIdAndUpdate(req.params.orderId, data, { new: true });

      res.status(200).json({
        success: true,
        redirect_url: approvalUrl, // PayPal URL to redirect user to
      });

    } catch (error) {
      console.error("Error processing order:", error);
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  })
);

// Route to handle PayPal callback
router.get(
  "/payment/callback",
  catchAsyncErrors(async (req, res, next) => {
    const { paymentId, PayerID, type } = req.query;

    try {
      const accessToken = await getAccessToken();

      // Execute payment
      const executeResponse = await axios.post(
        `https://api.sandbox.paypal.com/v1/payments/payment/${paymentId}/execute`,
        {
          payer_id: PayerID,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const verificationData = executeResponse.data;
      console.log("Verification data:", verificationData);

      if (verificationData.state === "approved") {
        if (type === "order") {
          await Order.findOneAndUpdate(
            { "paymentInfo.paypalId": paymentId },
            { status: "Paid" },
            { new: true }
          );
          res.redirect(`${process.env.FRONTEND_URL}/payment-success`);
        } else if (type === "chat") {
          await User.findOneAndUpdate(
            { "paymentInfo.paypalId": paymentId },
            { "paymentInfo.status": "Paid" },
            { new: true }
          );
          res.redirect(`${process.env.FRONTEND_URL}/chat-payment-success`);
        }
      } else {
        res.redirect(`${process.env.FRONTEND_URL}/payment-failure`);
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      res.redirect(`${process.env.FRONTEND_URL}/payment-failure`);
    }
  })
);

// Routes for chat payment and verification remain similar, with adjustments for PayPal

router.post(
  "/chatpayment/:userId",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findOne({ _id: req.params.userId });
      const { amount } = req.body;

      const accessToken = await getAccessToken();

      const paymentResponse = await axios.post(
        'https://api.sandbox.paypal.com/v1/payments/payment',
        {
          intent: 'sale',
          payer: {
            payment_method: 'paypal',
          },
          transactions: [{
            amount: {
              total: amount.toString(),
              currency: 'USD', // Change this according to your needs
            },
            description: `Chat payment for user ID: ${user._id}`,
          }],
          redirect_urls: {
            return_url: `${process.env.FRONTEND_URL}/payment-success?type=chat&userId=${user._id}`,
            cancel_url: `${process.env.FRONTEND_URL}/payment-failure`,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const approvalUrl = paymentResponse.data.links.find(link => link.rel === 'approval_url').href;

      const data = {
        paymentInfo: {
          paypalId: paymentResponse.data.id,
        }
      };

      await User.findByIdAndUpdate(req.params.userId, data, { new: true });

      res.status(200).json({
        success: true,
        redirect_url: approvalUrl,
      });

    } catch (error) {
      console.error("Error processing chat payment:", error);
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  })
);

// Verification for chat payments would be similar to orders

router.put(
  "/verifyChatPayment/:userId",
  catchAsyncErrors(async (req, res, next) => {
    // Add logic for verifying chat payments if necessary
  })
);

// PayPal API key endpoint remains unchanged
router.get(
  "/paypalapikey",
  catchAsyncErrors(async (req, res, next) => {
    res.status(200).json({ paypalClientId: PAYPAL_CLIENT_ID });
  })
);

module.exports = router;
