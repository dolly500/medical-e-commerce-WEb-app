import React, { useEffect, useState } from 'react';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { Link } from "react-router-dom";
import axios from 'axios';
import { server } from '../server'

const SuccessPage = () => {
  const [message, setMessage] = useState('Thank you for your purchase! Your order has been successfully placed.');

  useEffect(() => {
    const placeOrder = async () => {
      // Retrieve order data from localStorage
      const orderData = JSON.parse(localStorage.getItem('orderData'));

      if (!orderData) {
        setMessage('Order data not found.');
        return;
      }

      const { shippingAddress, totalPrice, userId, cart, email } = orderData;

      try {
        await axios.post(`${server}/order/online-payment?platform=coinpayments`, {
          shippingAddress,
          totalPrice,
          user: userId,
          cart,
          email,
        });
        setMessage('Order placed successfully on CoinPayments, check your mail!');
        localStorage.removeItem('orderData'); // Clear stored data after successful order
      } catch (error) {
        console.error('Error placing order:', error);
        setMessage('Failed to place order. Please try again.');
      }
    };

    placeOrder();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <AiOutlineCheckCircle className="text-green-500 text-6xl mb-4" />
        <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">{message}</p>
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
