const express = require('express');
const axios = require('axios');
const router = express.Router();

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
const PAYPAL_API = 'https://api-m.sandbox.paypal.com'; // Use sandbox for testing

const API_KEY = process.env.TREASURY_PRIME_API_KEY;
const API_SECRET = process.env.TREASURY_PRIME_API_SECRET;
const BASE_URL = 'https://api.treasuryprime.com';

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
    // Make a request to Treasury Prime to create a virtual account
    const response = await axios.post(
      `${BASE_URL}/accounts`, // Adjust the endpoint based on Treasury Prime documentation
      {
        account_type: "checking",
        user_id: userId, // Adjust this based on the API requirements
        currency: "USD",
        // Additional data may be required based on your use case
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "TP-API-SECRET": API_SECRET, // Add secret key to the request headers
          "Content-Type": "application/json",
        },
      }
    );

    const { account_number, routing_number } = response.data;

    res.json({ account_number, routing_number });
  } catch (error) {
    console.error("Error generating account:", error.response.data);
    res.status(500).send("Error generating account");
  }
});

module.exports = router;
