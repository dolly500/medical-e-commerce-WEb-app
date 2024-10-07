// frontend/src/components/Checkout.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { servercl } from '../../server';
import { server } from '../../server';

const Checkout = () => {
  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const [orderDetails, setOrderDetails] = useState(null);

  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('paypal');
  const [message, setMessage] = useState('');
  const [paypalClientId, setPaypalClientId] = useState(null);

  const totalPrice = cart.reduce((acc, item) => acc + item.qty * item.discountPrice, 0);

  useEffect(() => {
    if (!cart.length) {
      navigate('/cart');
    }

    const fetchPaypalClientId = async () => {
      try {
        const { data } = await axios.get(`${servercl}/api/config/paypal`);
        setPaypalClientId(data.clientId);
      } catch (error) {
        console.error('Error fetching PayPal client ID:', error);
        setMessage('Failed to load PayPal client.');
      }
    };

    fetchPaypalClientId();
  }, [cart, navigate]);

  const handleShippingAddressChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { address, city, postalCode, country } = shippingAddress;
    if (!address || !city || !postalCode || !country) {
      setMessage('Please fill in all shipping fields.');
      return;
    }

    if (!paymentMethod) {
      setMessage('Please select a payment method.');
      return;
    }
    setMessage('Shipping address saved successfully.');
  };

  const handleCoinPaymentsPayment = () => {
    const { address, city, postalCode, country } = shippingAddress;
  
    // Ensure shipping address is filled
    if (!address || !city || !postalCode || !country) {
      setMessage('Please fill in all shipping fields.');
      return;
    }
  
    // Generate a unique invoice ID (ensure uniqueness to prevent conflicts)
    const invoice = `ORDER_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  
    // Define CoinPayments merchant ID and other constants
    const merchantId = '74ee18106913738a4127a479f77c4fc4'; // Replace with your actual Merchant ID
    const baseCurrency = 'USD'; // Your base currency
    const targetCurrency = 'BTC'; // Target cryptocurrency
    const amount = totalPrice; // Total amount in base currency (USD)
    const itemName = 'Cart Payment';
    const itemDesc = 'Payment for items in cart';
    const successUrl = 'https://yourwebsite.com/success';
    const cancelUrl = 'https://yourwebsite.com/cancel';
  
    // Create a form dynamically
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://www.coinpayments.net/index.php';
  
    // Define hidden input fields required by CoinPayments
    const inputs = [
      { name: 'cmd', value: '_pay_simple' },
      { name: 'reset', value: '1' },
      { name: 'merchant', value: merchantId },
      { name: 'currency', value: baseCurrency }, // Base currency (USD)
      { name: 'currency2', value: targetCurrency }, // Target cryptocurrency (BTC)
      { name: 'amountf', value: amount },
      { name: 'item_name', value: itemName },
      { name: 'item_desc', value: itemDesc },
      { name: 'email', value: user.email },
      { name: 'first_name', value: user.firstName },
      { name: 'last_name', value: user.lastName },
      { name: 'address1', value: address },
      { name: 'city', value: city },
      { name: 'state', value: country },
      { name: 'postal', value: postalCode },
      { name: 'invoice', value: invoice },
      { name: 'success_url', value: successUrl },
      { name: 'cancel_url', value: cancelUrl },
      // Optionally, add more fields like 'custom' for additional data
    ];
  
    // Append hidden inputs to the form
    inputs.forEach((input) => {
      const hiddenField = document.createElement('input');
      hiddenField.type = 'hidden';
      hiddenField.name = input.name;
      hiddenField.value = input.value;
      form.appendChild(hiddenField);
    });
  
    // Append the form to the body and submit it
    document.body.appendChild(form);
    form.submit();
  };
  

const handlePayOnDelivery = async () => {
  try {
    await axios.post(`${servercl}/order/pay-on-delivery`, {
      shippingAddress,
      totalPrice,
      user: user._id,
      cart,
      email: user.email, // Include the user's email in the request
    });
    setMessage('Order placed successfully! You can pay upon delivery.');
  } catch (error) {
    console.error('Pay on Delivery Error:', error);
    setMessage('Failed to place order.');
  }
};

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-2xl font-bold mb-5">Checkout</h1>
      <div className="bg-white p-5 rounded shadow-sm">
        {/* Order Summary */}
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        {cart.map((item, index) => (
          <div key={index} className="flex justify-between items-center mb-4">
            <div>
              <h4 className="font-medium">{item.name}</h4>
              <p>Quantity: {item.qty}</p>
              <p>Discount Price: ${item.discountPrice}</p>
            </div>
            <p className="font-medium">${item.qty * item.discountPrice}</p>
          </div>
        ))}
        <div className="flex justify-between items-center font-semibold text-lg">
          <p>Total:</p>
          <p>${totalPrice}</p>
        </div>

        {/* Shipping Address Form */}
        <div className="mt-5">
          <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium">Address</label>
              <input
                type="text"
                name="address"
                value={shippingAddress.address}
                onChange={handleShippingAddressChange}
                className="mt-1 p-2 border border-gray-300 rounded w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">City</label>
              <input
                type="text"
                name="city"
                value={shippingAddress.city}
                onChange={handleShippingAddressChange}
                className="mt-1 p-2 border border-gray-300 rounded w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Postal Code</label>
              <input
                type="text"
                name="postalCode"
                value={shippingAddress.postalCode}
                onChange={handleShippingAddressChange}
                className="mt-1 p-2 border border-gray-300 rounded w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Country</label>
              <input
                type="text"
                name="country"
                value={shippingAddress.country}
                onChange={handleShippingAddressChange}
                className="mt-1 p-2 border border-gray-300 rounded w-full"
                required
              />
            </div>
            <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded">
              Save Address
            </button>
          </form>
        </div>

        {/* Payment Method Selection */}
        <div className="mt-5">
          <h2 className="text-xl font-semibold mb-4">Select Payment Method</h2>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                value="paypal"
                checked={paymentMethod === 'paypal'}
                onChange={() => setPaymentMethod('paypal')}
                className="mr-2"
              />
              PayPal
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                value="coinpayments"
                checked={paymentMethod === 'coinpayments'}
                onChange={() => setPaymentMethod('coinpayments')}
                className="mr-2"
              />
              CoinPayments
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                value="payondelivery"
                checked={paymentMethod === 'payondelivery'}
                onChange={() => setPaymentMethod('payondelivery')}
                className="mr-2"
              />
              Pay on Delivery
            </label>
          </div>
        </div>

        {/* PayPal Integration */}
        {paymentMethod === 'paypal' && paypalClientId && shippingAddress.address && (
          <PayPalScriptProvider options={{ 'client-id': paypalClientId, currency: 'USD' }}>
            <PayPalButtons
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [{
                    amount: {
                      currency_code: 'USD',
                      value: totalPrice,
                    },
                    shipping: {
                      address: {
                        address_line_1: shippingAddress.address,
                        admin_area_2: shippingAddress.city,
                        postal_code: shippingAddress.postalCode,
                        country_code: shippingAddress.country.substring(0, 2).toUpperCase(),
                      },
                    },
                  }],
                  payer: {
                    email_address: user.email,
                  },
                  application_context: {
                    shipping_preference: 'SET_PROVIDED_ADDRESS',
                  },
                });
              }}
              onApprove={(data, actions) => {
                return actions.order.capture().then((details) => {
                  alert('Transaction completed by ' + details.payer.name.given_name);
                  // Optionally, handle post-transaction actions like updating the order status
                });
              }}
              onError={(err) => {
                console.error('PayPal Error:', err);
                setMessage('PayPal payment failed.');
              }}
            />
          </PayPalScriptProvider>
        )}

        {/* CoinPayments Integration */}
        {paymentMethod === 'coinpayments' && (
          <button
            onClick={handleCoinPaymentsPayment}
            className="mt-4 bg-yellow-500 text-white p-2 rounded"
          >
            Pay with CoinPayments
          </button>
        )}

        {/* Pay on Delivery */}
        {paymentMethod === 'payondelivery' && (
          <button
            onClick={handlePayOnDelivery}
            className="mt-4 bg-green-500 text-white p-2 rounded"
          >
            Place Order and Pay on Delivery
          </button>
        )}

        {/* Display Message */}
        {message && <p className="mt-4 text-red-500">{message}</p>}
      </div>
    </div>
  );
};

export default Checkout;
