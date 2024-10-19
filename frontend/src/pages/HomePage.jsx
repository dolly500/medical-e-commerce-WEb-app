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
import SlideInOnScroll from './SlideInOnScroll'; 
import { server } from '../server';

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.user);

  const [categoriesData, setCategoriesData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const trxRefParam = urlParams.get('trxref'); 
    const typeParam = urlParams.get('type'); 

    const verifyTrxRef = async (trxRef) => {
      setIsLoading(true);
      try {
        const response = await axios.put(`${server}/payment/verify/${trxRef}`);
        const data = response.data;

        if (response.status !== 200) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        if (typeParam === 'chat') {
          if (isAuthenticated) {
            const groupTitle = data._id + user._id;
            const userId = user._id;
            const sellerId = data.shop._id;

            await axios.post(`${server}/conversation/create-new-conversation`, {
              groupTitle,
              userId,
              sellerId,
            })
              .then((res) => {
                toast.success("Payment Successful!");
                navigate(`/inbox?${res.data.conversation._id}`);
              })
              .catch((error) => {
                toast.error(error.response.data.message);
              });
            return;
          } else {
            toast.success("Payment Successful!");
            navigate('/inbox');
            return;
          }
        }

        if (data.success) {
          toast.success("Payment Successful!");
          return;
        } else {
          throw new Error(data.error || 'Verification failed'); 
        }

      } catch (error) {
        console.error('Error verifying trxRef:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (trxRefParam) {
      verifyTrxRef(trxRefParam); 
    } else {
      console.info(`No "trxRef" ${!typeParam ? 'or "type"' : null}  parameter was found in URL`);
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    axios.get(`${server}/category/`, { withCredentials: true })
      .then((res) => {
        setCategoriesData(res?.data?.categorys);
      })
      .catch((error) => {
        console.error('Error fetching category data:', error);
      });
  }, []);

  const handleFooterClick = () => {
    sessionStorage.setItem('scrollPosition', window.scrollY.toString());
  };

  const handleBackButtonClick = () => {
    if (navigate) {
      const previousLocation = sessionStorage.getItem('previousLocation');
      if (previousLocation === 'footer') {
        const scrollPosition = sessionStorage.getItem('scrollPosition');
        if (scrollPosition) {
          window.scrollTo(0, parseInt(scrollPosition, 10));
        }
      }
    }
  };

  useEffect(() => {
    handleBackButtonClick();
  }, [navigate]);

  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 min-h-screen">
      {isLoading && <div className="text-blue">Verifying Transaction...</div>}
      <Header activeHeading={1} categoriesData={categoriesData} />
      <div className="container mx-auto px-4 py-6">
        <SlideInOnScroll>
          <Hero />
        </SlideInOnScroll>
        <SlideInOnScroll>
          <Categories />
        </SlideInOnScroll>
        <SlideInOnScroll>
          <BestDeals />
        </SlideInOnScroll>
        <SlideInOnScroll>
          <Events />
        </SlideInOnScroll>
        <SlideInOnScroll>
          <FeaturedProduct />
        </SlideInOnScroll>
        <SlideInOnScroll>
          <Footer onClick={handleFooterClick} />
        </SlideInOnScroll>
      </div>
    </div>
  );
};

export default HomePage;
