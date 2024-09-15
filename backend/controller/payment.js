const express = require('express');
const axios = require('axios');
const router = express.Router();

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
const PAYPAL_API = 'https://api-m.sandbox.paypal.com'; // Use sandbox for testing

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

module.exports = router;
