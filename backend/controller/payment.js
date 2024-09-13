const express = require("express");
const router = express.Router();
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const axios = require("axios")
const Order = require("../model/order")
const User = require("../model/user")
const paystack = require("paystack")(process.env.PAYSTACK_SECRET_KEY);


router.post(
  "/process/:orderId",
  catchAsyncErrors(async (req, res, next) => {
    try {
      console.log("Processing order:", req.params.orderId);
      const order = await Order.findOne({ _id: req.params.orderId });
      console.log("Order:", order);
      const amount = order.totalPrice * 100; // Ensure amount is in kobo (Paystack expects amount in the smallest currency unit)
      console.log("Order amount:", amount);


      const response = await axios.post(
        'https://api.paystack.co/transaction/initialize',
        {
          email: order.user.email,
          amount,
          // https://allsextoys.vercel.app/api/payment/callback?type=order&trxref=olv521cn7v&reference=olv521cn7v
          // callback_url: `localhost:3000/?type=order`, // Dynamic callback URL
          callback_url: `${process.env.FRONTEND_URL}?type=order`, // Dynamic callback URL
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const paystackReference = response.data.data.reference;
      console.log("Paystack reference:", paystackReference);

      const data = {
        paymentInfo: {
          paystackRef: paystackReference,
        },
      };

      await Order.findByIdAndUpdate(req.params.orderId, data, { new: true });

      res.status(200).json({
        success: true,
        client_secret: response.data,
        redirect_url: response.data.data.authorization_url, // Paystack URL to redirect user to
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

router.get(
  "/payment/callback",
  catchAsyncErrors(async (req, res, next) => {
    const { reference, type } = req.query;

    try {
      const response = await axios.get(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          },
        }
      );

      const verificationData = response.data;
      console.log("Verification data:", verificationData);

      if (verificationData.data.status === "success") {
        if (type === "order") {
          await Order.findOneAndUpdate(
            { "paymentInfo.paystackRef": reference },
            { status: "Paid" },
            { new: true }
          );
          // Redirect user to a success page for orders
          res.redirect(`${process.env.FRONTEND_URL}/payment-success`);
        } else if (type === "chat") {
          await User.findOneAndUpdate(
            { "paymentInfo.paystackRef": reference },
            { "paymentInfo.status": "Paid" },
            { new: true }
          );
          // Redirect user to a success page for chat payments
          res.redirect(`${process.env.FRONTEND_URL}/chat-payment-success`);
        }
      } else {
        // Redirect user to a failure page
        res.redirect(`${process.env.FRONTEND_URL}/payment-failure`);
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      // Redirect user to a failure page
      res.redirect(`${process.env.FRONTEND_URL}/payment-failure`);
    }
  })
);












router.put(
  "/verify/:reference",
  catchAsyncErrors(async (req, res, next) => {
    try {
      // const order = await Order.findOne({ _id: req.params.orderId });
      // const reference = order.paymentInfo.paystackRef;

      const reference = req.params.reference
      if (!reference)
        return res.status(400).send({ message: 'Reference not found' })
      const response = await axios.get(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = {
        paymentInfo: {
          status: response.data.data.status,
          paystackRef: response.data.data.reference
        },
        paidAt: response.data.data.paid_at,
      };

      await Order.findByIdAndUpdate(req.params.orderId, data);

      res.status(200).json({
        success: true,
        client_secret: response.data,
      });

    } catch (error) {
      // Handle errors here
      res.status(400).json({
        success: error.status,
        message: error.message,
      });;
    }
  })

);




router.post(
  "/chatpayment/:userId",
  catchAsyncErrors(async (req, res, next) => {
    try {
        const { cart } = req.body;
        const { jsonResponse, httpStatusCode } = await createOrder(cart);
        res.status(httpStatusCode).json(jsonResponse);
    } catch (error) {
        console.error("Failed to create order:", error);
        res.status(500).json({ error: "Failed to create order." });
    }
});

/**
 * Capture payment for the created order to complete the transaction.
 */
const captureOrder = async (orderID) => {
    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/orders/${orderID}/capture`;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });

    return handleResponse(response);
};

// captureOrder route
router.post("/orders/:orderID/capture", async (req, res) => {
    try {
        const { orderID } = req.params;
        const { jsonResponse, httpStatusCode } = await captureOrder(orderID);
        res.status(httpStatusCode).json(jsonResponse);
    } catch (error) {
        console.error("Failed to capture order:", error);
        res.status(500).json({ error: "Failed to capture order." });
    }
});

module.exports = router;
