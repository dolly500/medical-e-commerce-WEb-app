import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { servercl } from '../../server';

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
  const [paypalClientId, setPaypalClientId] = useState(null);

  const totalPrice = cart.reduce((acc, item) => acc + item.qty * item.discountPrice, 0);

  useEffect(() => {
    if (!cart.length) {
      navigate('/cart');
    }

    // Fetch PayPal client ID from backend
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
    setMessage('');
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
                placeholder="Enter address"
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
                placeholder="Enter city"
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
                placeholder="Enter postal code"
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
                placeholder="Enter country"
              />
            </div>
            <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded mb-5">
              Save Address
            </button>
          </form>
        </div>

        {/* PayPal Integration */}
      
          <PayPalScriptProvider options={{'client-id': 'AZ7RR3vamknNm726JI4Jz-lOlRWDvV6GtRxrEmAHWvM6cptl76diS78FHfUPw3dmzgLyUScPmZWVJ1gQ', currency: 'USD'}}>
            <PayPalButtons
              style={{ shape: 'rect', layout: 'vertical', color: 'blue', label: 'paypal' }}
              createOrder={async (data, actions) => {
                return actions.order.create({
                  purchase_units: [{
                    amount: {
                      currency_code: 'USD',
                      value: totalPrice,
                    },
                    shipping: {
                      address: {
                        address_line_1: shippingAddress.address,
                        admin_area_2: shippingAddress.city,  // City
                        postal_code: shippingAddress.postalCode,  // Postal code
                        country_code: shippingAddress.country.substring(0, 2).toUpperCase() || 'XX', // Default to 'XX' if unsupported
                      },    
                    },
                  }],
                  application_context: {
                    shipping_preference: 'SET_PROVIDED_ADDRESS',
                  }
                });
              }}
              onApprove={async (data, actions) => {
                return actions.order.capture().then((details) => {
                  alert('Transaction completed by ' + details.payer.name.given_name);
                  // Handle post-payment processing here
                });
              }}
              onError={(err) => {
                console.error('PayPal error:', err);
              }}
            />
          </PayPalScriptProvider>
          
              

        {message && <p className="mt-5 text-red-500">{message}</p>}
      </div>
    </div>
  );
};

export default Checkout;