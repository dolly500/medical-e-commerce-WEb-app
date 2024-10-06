const express = require("express");
const router = express.Router();
const Coinpayments = require("coinpayments");
const CoinPaymentTransaction = require("../model/coinpayment");
const crypto = require('crypto');
const getRawBody = require("raw-body");
const contentType = require("content-type");

const validBitcoinAddress = "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa";
const success_url = "http://localhost:3000/success";
const cancel_url = "http://localhost:3000/cancel";

const client = new Coinpayments({
  key: process.env.COINPAYMENTS_PUBLIC_KEY,
  secret: process.env.COINPAYMENTS_PRIVATE_KEY,
});

router.post("/create", async (req, res) => {
  console.log(req.body, "body");
  try {
    const { amount, currency1, currency2, buyer_email, shippingAddress, cart } =
      req.body;
    const transaction = await client.createTransaction({
      amount: amount,
      currency1: currency1,
      currency2: currency2,
      buyer_email: buyer_email,
      address: validBitcoinAddress, // Use a valid Bitcoin address here
      city: shippingAddress.city,
      postal_code: shippingAddress.postalCode,
      country: shippingAddress.country,
      success_url: success_url,
      cancel_url: cancel_url,
    });

    // Save transaction details to your database
    const newTransaction = new CoinPaymentTransaction({
      txn_id: transaction.txn_id,
      amount: amount,
      currency1: currency1,
      currency2: currency2,
      buyer_email: buyer_email,
      address: validBitcoinAddress,
      city: shippingAddress.city,
      postal_code: shippingAddress.postalCode,
      country: shippingAddress.country,
      status: "pending",
      checkout_url: transaction.checkout_url,
      cart: cart, // Store the cart items
    });

    await newTransaction.save();
    console.log(transaction);
    res.json({
      checkout_url: transaction.checkout_url,
      txn_id: transaction.txn_id,
    });
  } catch (error) {
    console.log("CoinPayments error:", error);
    res.status(500).json({ message: error.message });
  }
});

// Handle IPN (Instant Payment Notifications)
router.post("/ipn", async (req, res) => {
  try {
    // Capture the raw body
    const raw = await getRawBody(req, {
      length: req.headers['content-length'],
      limit: '1mb',
      encoding: contentType.parse(req).parameters.charset || 'utf-8'
    });

    // Calculate HMAC using the raw body
    const hmac = req.headers["hmac"];
    const calculatedHmac = crypto
      .createHmac("sha512", process.env.COINPAYMENTS_IPN_SECRET)
      .update(raw)
      .digest("hex");

    if (hmac !== calculatedHmac) {
      console.error("Invalid HMAC:", { received: hmac, calculated: calculatedHmac });
      return res.status(401).send("Invalid HMAC");
    }

    // Parse the raw body as JSON
    const parsedBody = JSON.parse(raw);

    const { txn_id, status, amount1, amount2, currency1, currency2 } = parsedBody;

    // Update transaction status in your database
    await CoinPaymentTransaction.findOneAndUpdate(
      { txn_id: txn_id },
      {
        status: status,
        updated_at: Date.now(),
      }
    );

    // Trigger any necessary actions based on the new status
    res.sendStatus(200);
  } catch (error) {
    console.error("IPN Error:", error);
    res.status(500).send("Error processing IPN");
  }
});

// Get transaction status
router.get("/status/:txn_id", async (req, res) => {
  try {
    const { txn_id } = req.params;

    // First, check our database
    const transaction = await CoinPaymentTransaction.findOne({
      txn_id: txn_id,
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // If the transaction is not in a final state, check with CoinPayments
    if (["pending", "processing"].includes(transaction.status)) {
      const cpResult = await client.getTx({ txid: txn_id });

      // Update our database if the status has changed
      if (cpResult.status !== transaction.status) {
        transaction.status = cpResult.status;
        transaction.updated_at = Date.now();
        await transaction.save();
      }

      res.json(cpResult);
    } else {
      // If the transaction is in a final state, just return our database info
      res.json(transaction);
    }
  } catch (error) {
    console.error("CoinPayments error:", error);
    res.status(500).json({ message: "Failed to get transaction status" });
  }
});

module.exports = router;
