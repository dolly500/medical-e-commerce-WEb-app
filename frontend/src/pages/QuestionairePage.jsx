// src/components/QuestionnaireForm.js
import React, { useState } from 'react';
import { Link } from "react-router-dom";
import logo from '../static/imgs/logo.png';
import { FaHome } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { createQuestionaire } from '../redux/actions/questionaire';

const QuestionnaireForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await dispatch(createQuestionaire({ email, trackingNumber }));
      toast.success("Tracking Details submitted successfully, you'll receive your mail shortly!");
      navigate('/');
    } catch (error) {
      toast.error("Failed to submit details");
    }
  };

  return (
    <div className="w-full bg-white">
      <div className="max-w-md mx-auto mt-8 p-4 shadow-md rounded">
        <Link to="/">
          <img
            src={logo}
            alt="Logo"
            style={{ height: '60px', width: '160px', display: 'flex', margin: '0 auto' }}
          />
        </Link>
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/">
          {/* Home Icon Button */}
          <button className="absolute top-4 right-4 text-blue-600">
            <FaHome size={24} />
          </button>
        </Link>
          <h2 className="mb-6 text-center text-3xl font-extrabold text-gray-900">
            Fill in Tracking Details
          </h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="trackingNumber" className="block text-sm font-medium text-gray-600">
              Tracking Number
            </label>
            <input
              type="text"
              id="trackingNumber"
              name="trackingNumber"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default QuestionnaireForm;
