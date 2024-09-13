import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { server } from '../../server'; // Your backend server URL

const Checkout = () => {
  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });
  const [message, setMessage] = useState('');
  const [paypalClientId, setPaypalClientId] = useState(null); // New state for PayPal client ID

  const totalPrice = cart.reduce((acc, item) => acc + item.qty * item.discountPrice, 0);

  // Fetch PayPal client ID from the backend when component mounts
  useEffect(() => {
    if (!cart.length) {
      navigate('/cart');
    }

    const fetchPaypalClientId = async () => {
      try {
        const { data } = await axios.get(`${server}/api/config/paypal`);
        setPaypalClientId(data.clientId); // Set PayPal client ID
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

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-2xl font-bold mb-5">Checkout</h1>
      <div className="bg-white p-5 rounded shadow-sm">
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

        <h2 className="text-xl font-semibold mb-4 mt-5">Shipping Address</h2>
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={shippingAddress.address}
          onChange={handleShippingAddressChange}
          className="mb-2 p-2 border rounded w-full"
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={shippingAddress.city}
          onChange={handleShippingAddressChange}
          className="mb-2 p-2 border rounded w-full"
        />
        <input
          type="text"
          name="postalCode"
          placeholder="Postal Code"
          value={shippingAddress.postalCode}
          onChange={handleShippingAddressChange}
          className="mb-2 p-2 border rounded w-full"
        />
        <input
          type="text"
          name="country"
          placeholder="Country"
          value={shippingAddress.country}
          onChange={handleShippingAddressChange}
          className="mb-2 p-2 border rounded w-full"
        />

        {/* PayPal Integration */}
        {paypalClientId && (
          <PayPalScriptProvider options={{ 'client-id': paypalClientId, currency: 'USD' }}>
            <PayPalButtons
              style={{
                shape: 'rect',
                layout: 'vertical',
                color: 'gold',
                label: 'paypal',
              }}
              createOrder={async () => {
                try {
                  const response = await axios.post(`${server}/api/orders`, {
                    cart,
                    shippingAddress,
                    user: user,
                    totalPrice,
                  });

                  const { orderID } = response.data;

                  return orderID; // Return the PayPal order ID from the backend
                } catch (error) {
                  console.error(error);
                  setMessage(`Could not initiate PayPal Checkout...${error}`);
                }
              }}
              onApprove={async (data) => {
                try {
                  const response = await axios.post(
                    `${server}/api/orders/${data.orderID}/capture`
                  );

                  const transaction = response.data;
                  setMessage(`Transaction ${transaction.status}: ${transaction.id}`);
                } catch (error) {
                  console.error(error);
                  setMessage(`Sorry, your transaction could not be processed...${error}`);
                }
              }}
            />
          </PayPalScriptProvider>
        )}

        {message && <p className="mt-5 text-red-500">{message}</p>}
      </div>
    </div>
  );
};

export default Checkout;
