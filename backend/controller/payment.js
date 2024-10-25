const express = require('express');
const axios = require('axios');
const router = express.Router();
const Account = require('../model/account'); 

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
const PAYPAL_API = 'https://api-m.sandbox.paypal.com'; // Use sandbox for testing

const API_KEY = process.env.TREASURY_PRIME_API_KEY;
const API_SECRET = process.env.TREASURY_PRIME_API_SECRET;
const BASE_URL = process.env.TREASURY_PRIME_BASE_URL;

// // Route to get PayPal Client ID
// router.get('/api/config/paypal', (req, res) => {
//   res.send({ clientId: PAYPAL_CLIENT_ID });
// });

// Create order
router.post('/orders', async (req, res) => {
  const { cart, shippingAddress, totalPrice } = req.body;

  try {
    const accessToken = await getPayPalAccessToken();

    const order = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders`,
      {
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: totalPrice,
            },
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    res.json({ orderID: order.data.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Capture payment
router.post('/orders/:orderID/capture', async (req, res) => {
  const { orderID } = req.params;

  try {
    const accessToken = await getPayPalAccessToken();

    const capture = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders/${orderID}/capture`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    res.json(capture.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function getPayPalAccessToken() {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString(
    'base64'
  );

  const response = await axios.post(
    `${PAYPAL_API}/v1/oauth2/token`,
    'grant_type=client_credentials',
    {
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  return response.data.access_token;
}

router.post("/generate-account", async (req, res) => {
  const { userId } = req.body;

  try {
    // Make a request to Treasury Prime to create a new account
    const response = await axios.post(
      `${BASE_URL}/accounts`,
      {
        account_type: "savings", // or "checking", based on your use case
        user_id: userId,
        currency: null, // You can set this to a specific currency if needed
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "TP-API-SECRET": API_SECRET,
          "Content-Type": "application/json",
        },
      }
    );

    // Get relevant account details from the response
    const accountDetails = response.data;

    // Create a new account record in the database
    const newAccount = new Account({
      userId: userId,
      account_type: accountDetails.account_type || "savings",
      currency: accountDetails.currency || null,
      routing_number: accountDetails.routing_number,
      account_number: accountDetails.account_number,
      created_at: accountDetails.created_at || new Date(),
      updated_at: accountDetails.updated_at || new Date(),
    });

    // Save the new account to the database
    await newAccount.save();

    // Create a response object that matches the required format
    const formattedResponse = {
      account_type: newAccount.account_type,
      bank_id: newAccount.bank_id,
      updated_at: newAccount.updated_at,
      currency: newAccount.currency,
      routing_number: newAccount.routing_number,
      account_number: newAccount.account_number,
      id: newAccount._id, // MongoDB generates this ID
      created_at: newAccount.created_at,
      userdata: accountDetails.userdata || null,
    };

    // Return the formatted response
    res.json(formattedResponse);
  } catch (error) {
    console.error("Error generating account:", error.response?.data || error.message);
    res.status(500).send("Error generating account");
  }
});

module.exports = router;
