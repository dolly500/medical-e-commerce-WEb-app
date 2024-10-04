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
    setMessage('Shipping address saved successfully.');
  };

  const handleCoinPaymentsPayment = async () => {
    try {
      // Ensure shipping address is saved
      const { address, city, postalCode, country } = shippingAddress;
      if (!address || !city || !postalCode || !country) {
        setMessage('Please fill in all shipping fields.');
        return;
      }

      // Prepare the cart details (assuming 'cart' is available in your component state)
      const cartDetails = cart.map(item => ({
        productName: item.name,
        quantity: item.qty,
        discountPrice: item.discountPrice,
        totalPriceForItem: item.qty * item.discountPrice
      }));

      const response = await axios.post(`${server}/payment/coinpayment/create`, {
        amount: totalPrice,
        currency1: 'USD',  // Your base currency
        currency2: 'BTC',  // Target cryptocurrency (e.g., Bitcoin)
        buyer_email: user.email,
        shippingAddress,
        cart: cartDetails  // Send the cart details to the backend
      });

      const { checkout_url, txn_id, order_id, address: dynamicAddress } = response.data;

      console.log(`Order ID: ${order_id}`); // Log or use the Order ID
      console.log(`Pay with this address: ${dynamicAddress}`); // For debug or display
  
      // Optionally store order details in local state or global state (e.g., Redux)
      setOrderDetails({
        txn_id,
        order_id,        // Save the order ID in your state
        checkout_url,
        dynamicAddress
      });
  
      // Redirect to the CoinPayments checkout URL
      window.location.href = checkout_url;
    } catch (error) {
      console.error('CoinPayments Error:', error);
      setMessage('Failed to initiate CoinPayments payment.');
    }
  };

  const handlePayOnDelivery = async () => {
    try {
      await axios.post(`${servercl}/api/order/create`, {
        shippingAddress,
        paymentMethod: 'Pay on Delivery',
        totalPrice,
        user: user._id,
        cart,
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
