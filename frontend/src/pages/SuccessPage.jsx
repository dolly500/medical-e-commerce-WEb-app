import React, { useEffect, useState } from 'react';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { Link } from "react-router-dom";
import { server } from '../server';
import axios from 'axios';

const SuccessPage = ({ shippingAddress, totalAmount, user, cart }) => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const sendOrderNotification = async () => {
      try {
        const response = await axios.post(`${server}/order/online-payment?platform=coinpayments`, {
          shippingAddress,
          totalPrice: totalAmount, // Send the total amount including shipping
          user: user._id,
          cart,
          email: user.email, // Include the user's email in the request
        });

        console.log('Order notification sent:', response.data);
        setMessage('Order placed successfully! Check your email for confirmation.');
      } catch (error) {
        console.error('Error sending order notification:', error.response ? error.response.data : error.message);
        setMessage('Failed to send order notification.');
      }
    };

    sendOrderNotification();
  }, [shippingAddress, totalAmount, user, cart]); // Make sure these dependencies are included if they are dynamic

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <AiOutlineCheckCircle className="text-green-500 text-6xl mb-4" />
        <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase! Your order has been successfully placed.
        </p>
        {message && (
          <p className={`mb-6 ${message.includes('successfully') ? 'text-green-500' : 'text-red-500'}`}>
            {message}
          </p>
        )}
        <Link to='/'>
          <button className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition duration-300">
            Continue Shopping
          </button>
        </Link>
      </div>
    </div>
  );
};

export default SuccessPage;
