import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSelector } from "react-redux";
import axios from 'axios';

import Header from '../components/Layout/Header';
import Hero from '../components/Route/Hero/Hero';
import Categories from '../components/Route/Categories/Categories';
import BestDeals from '../components/Route/BestDeals/BestDeals';
import FeaturedProduct from '../components/Route/FeaturedProduct/FeaturedProduct';
import Events from '../components/Events/Events';
import Footer from '../components/Layout/Footer';
import { server } from '../server';

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.user);

  const [categoriesData, setCategoriesData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Function to verify transaction reference
  const verifyTrxRef = async (trxRef, typeParam) => {
    setIsLoading(true);
    try {
      const response = await axios.put(`${server}/payment/verify/${trxRef}`);
      const data = response.data;

      if (response.status !== 200) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      if (typeParam === 'chat') {
        await handleChatTransaction(data);
        return;
      }

      if (data.success) {
        toast.success("Payment Successful!");
      } else {
        throw new Error(data.error || 'Verification failed'); 
      }

    } catch (error) {
      console.error('Error verifying trxRef:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle chat transaction
  const handleChatTransaction = async (data) => {
    const groupTitle = `${data._id}${user._id}`;
    const userId = user._id;
    const sellerId = data.shop._id;

    try {
      const res = await axios.post(`${server}/conversation/create-new-conversation`, {
        groupTitle,
        userId,
        sellerId,
      });
      toast.success("Payment Successful!");
      navigate(`/inbox?${res.data.conversation._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creating conversation');
    }
  };

  // Fetch categories data
  const fetchCategoriesData = async () => {
    try {
      const res = await axios.get(`${server}/category/`, { withCredentials: true });
      setCategoriesData(res?.data?.categorys || []);
    } catch (error) {
      console.error('Error fetching category data:', error);
    }
  };

  // Handle navigation based on URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const trxRefParam = urlParams.get('trxref'); 
    const typeParam = urlParams.get('type'); 

    if (trxRefParam) {
      verifyTrxRef(trxRefParam, typeParam);
    } else {
      console.info(`No "trxRef" ${!typeParam ? 'or "type"' : null} parameter was found in URL`);
    }
  }, []);

  // Fetch categories on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchCategoriesData();
  }, []);

  const handleFooterClick = () => {
    sessionStorage.setItem('scrollPosition', window.scrollY.toString());
  };

  const handleBackButtonClick = () => {
    const previousLocation = sessionStorage.getItem('previousLocation');
    if (previousLocation === 'footer') {
      const scrollPosition = sessionStorage.getItem('scrollPosition');
      if (scrollPosition) {
        window.scrollTo(0, parseInt(scrollPosition, 10));
      }
    }
  };

  useEffect(() => {
    handleBackButtonClick();
  }, [navigate]);

  // Add Tidio LiveChat script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '//code.tidio.co/jixrjaohqp6dcq85zcobusr92zkk7frg.js'; // Replace 'your-unique-id' with your Tidio public key
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Clean up script when component unmounts
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="bg-gradient-to-r from-white-50 to-white-100 min-h-screen">
      {isLoading && <div className="text-blue">Verifying Transaction...</div>}
      <Header activeHeading={1} categoriesData={categoriesData} />
      <div className="container mx-auto px-4 py-6">
        <Hero />
        <Categories />
        <BestDeals />
        <FeaturedProduct />
        <Events />
        <Footer onClick={handleFooterClick} />
      </div>
    </div>
  );
};

export default HomePage;
