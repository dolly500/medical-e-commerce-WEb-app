// ForgotPassword.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../static/imgs/logo.png';
import { FaHome } from "react-icons/fa"; 
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { server } from '../../src/server'


const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
  
    const handleForgotPassword = async () => {
      try {
        const response = await axios.post(`${server}/user/forgot-password`, {
          email,
        });
  
        if (response.status === 200) {
          setMessage(response.data.message);
          toast.success('Check Email For Password Reset');
          navigate('/check-password')
        } else {
          setError(response.data.error);
        }
      } catch (error) {
        console.error('Error sending password reset request:', error);
        setError('Something went wrong. Please try again later.');
      }
    };  

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-white p-8 shadow-md rounded-md w-96">
      <Link to="/">
        <img src={logo} alt='' style={{ height: '60px', width: '160px', display: 'flex', margin: '0 auto' }}
        />
      </Link>

      <Link to="/">
          {/* Home Icon Button */}
          <button className="absolute top-4 right-4 text-blue-600">
            <FaHome size={24} />
          </button>
      </Link>
        <h2 className="text-2xl font-semibold mb-4" style={{textAlign: 'center'}}>Forgot Password</h2>

        {message && (
          <div className="mb-4 text-green-500">{message}</div>
        )}

        {error && (
          <div className="mb-4 text-red-500">{error}</div>
        )}

        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          className="w-full p-2 border border-gray-300 rounded mb-4"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          onClick={handleForgotPassword}
        >
          Send Reset Email
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ForgotPassword;
