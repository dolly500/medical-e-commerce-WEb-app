
import React, { useState } from "react";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import styles from "../styles/styles";
import SlideInOnScroll from "./SlideInOnScroll";


const FAQPage = ({ categoriesData }) => {
  return (
    <div>
      <Header activeHeading={5} categoriesData={categoriesData} />
      <div className={`bg-white`}>

        <SlideInOnScroll>
          <AboutUs />
        </SlideInOnScroll>
        <SlideInOnScroll>
          <Faq />
        </SlideInOnScroll>
        <SlideInOnScroll>
          <TermsAndConditions />
        </SlideInOnScroll>
      </div>
      <SlideInOnScroll>
        <Footer />
      </SlideInOnScroll>
    </div>
  );
};

const Faq = () => {
  const [activeTab, setActiveTab] = useState(0);

  const toggleTab = (tab) => {
    if (activeTab === tab) {
      setActiveTab(0);
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <div className={`${styles.section} my-8`}>
      <h2 className="text-3xl font-bold text-black mb-8">FAQ</h2>
      <div className="mx-auto space-y-4">
        {/* single Faq */}

        <div className="border-b border-gray-200 pb-4">
          <button
            className="flex items-center justify-between w-full"
            onClick={() => toggleTab(2)}
          >
            <span className="text-lg font-medium text-black">
              What is your return policy?
            </span>
            {activeTab === 2 ? (
              <svg
                className="h-6 w-6 text-black"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6 text-black"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            )}
          </button>
          {activeTab === 2 && (
            <div className="mt-4">
              <p className="text-base text-black">
                If you're not satisfied with your purchase, we accept returns
                within 30 days of delivery. To initiate a return, please email
                us  with your order number and a
                brief explanation of why you're returning the item.
              </p>
            </div>
          )}
        </div>

        <div className="border-b border-gray-200 pb-4">
          <button
            className="flex items-center justify-between w-full"
            onClick={() => toggleTab(3)}
          >
            <span className="text-lg font-medium text-black">
              How do I track my order?
            </span>
            {activeTab === 3 ? (
              <svg
                className="h-6 w-6 text-black"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6 text-black"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            )}
          </button>
          {activeTab === 3 && (
            <div className="mt-4">
              <p className="text-base text-black">
                You can track your order by clicking the tracking link in your
                shipping confirmation email, or by logging into your account on
                our website and viewing the order details.
              </p>
            </div>
          )}
        </div>

        <div className="border-b border-gray-200 pb-4">
          <button
            className="flex items-center justify-between w-full"
            onClick={() => toggleTab(4)}
          >
            <span className="text-lg font-medium text-black">
              How do I contact customer support?
            </span>
            {activeTab === 4 ? (
              <svg
                className="h-6 w-6 text-black"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6 text-black"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            )}
          </button>
          {activeTab === 4 && (
            <div className="mt-4">
              <p className="text-base text-black">
                You can contact our customer support team by emailing us at
                support@myecommercestore.com, between the hours of 9am and 5pm EST, Monday through Friday.
              </p>
            </div>
          )}
        </div>

        <div className="border-b border-gray-200 pb-4">
          <button
            className="flex items-center justify-between w-full"
            onClick={() => toggleTab(5)}
          >
            <span className="text-lg font-medium text-black">
              Can I change or cancel my order?
            </span>
            {activeTab === 5 ? (
              <svg
                className="h-6 w-6 text-black"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6 text-black"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            )}
          </button>
          {activeTab === 5 && (
            <div className="mt-4">
              <p className="text-base text-black">
                Unfortunately, once an order has been placed, we are not able to
                make changes or cancellations. If you no longer want the items
                you've ordered, you can return them for a refund within 30 days
                of delivery.
              </p>
            </div>
          )}
        </div>

        <div className="border-b border-gray-200 pb-4">
          <button
            className="flex items-center justify-between w-full"
            onClick={() => toggleTab(6)}
          >
            <span className="text-lg font-medium text-black">
              Do you offer international shipping?
            </span>
            {activeTab === 6 ? (
              <svg
                className="h-6 w-6 text-black"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6 text-black"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            )}
          </button>
          {activeTab === 6 && (
            <div className="mt-4">
              <p className="text-base text-black">
                Currently, we only offer shipping within the Nigeria.
              </p>
            </div>
          )}
        </div>

        <div className="border-b border-gray-200 pb-4">
          <button
            className="flex items-center justify-between w-full"
            onClick={() => toggleTab(7)}
          >
            <span className="text-lg font-medium text-black">
              What payment methods do you accept?
            </span>
            {activeTab === 7 ? (
              <svg
                className="h-6 w-6 text-black"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6 text-black-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            )}
          </button>
          {activeTab === 7 && (
            <div className="mt-4">
              <p className="text-base text-black-500">
                We accept visa,mastercard,paypal payment method also we have
                cash on delivery system.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};



const AboutUs = () => {
  return (
    <div className="bg-white text-black">
      <div className="container mx-auto space-y-4 md:p-12 mt-10">
        <div className="md:flex md:items-center md:justify-center">
          <div>
            <h2 className="text-5xl font-bold mb-4">About Us</h2>
            <p className="text-lg md:mr-6">
              Medistorepro is a trusted healthcare provider committed to enhancing the well-being of individuals and communities. We offer a wide range of medical services, from primary care to specialized treatments, aimed at helping people live healthier lives. With a team of experienced healthcare professionals, we provide personalized and accessible care tailored to each patient's needs. Our goal is to ensure that every patient receives the highest standard of medical care in a compassionate and supportive environment.
            </p>
          </div>

          <img className="rounded-sm sm:w-48 sm:h-48 md:w-64 md:h-64 lg:w-96 lg:h-96 xl:w-full xl:h-100" src="data:image/jpeg;base64,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" alt="Medical professionals" />
        </div>

        <div className="pt-14">
          <h3 className="text-5xl font-bold mb-10">Our Services</h3>
          <div className="md:flex md:items-center md:justify-center">
            <div className="rounded-sm p-4 md:p-10 mb-6 md:w-1/2 md:mr-10 bg-[#1D4ED8] text-white">
              <h4 className="font-bold mb-2">What We Offer</h4>
              <ul className="list-disc pl-6">
                <li>Comprehensive primary care services</li>
                <li>Specialized medical treatments</li>
                <li>24/7 emergency care</li>
                <li>Telemedicine consultations</li>
                <li>Affordable healthcare solutions</li>
                <li>Experienced and certified medical professionals</li>
                <li>State-of-the-art medical facilities</li>
                <li>Supportive and compassionate patient care</li>
              </ul>
            </div>

            <div className="rounded-sm p-4 md:p-10 mb-6 md:w-1/2 text-[#000] bg-[#E0F2FE]">
              <h4 className="font-bold mb-2">Our Commitment</h4>
              <ul className="list-disc pl-6">
                <li>Patient-centered approach to healthcare</li>
                <li>Confidential and personalized care</li>
                <li>Holistic treatment plans tailored to individual needs</li>
                <li>Advanced diagnostic and treatment technologies</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-xl font-bold">Our Mission: Providing quality healthcare, dedicated to your well-being.</p>
        </div>
      </div>
    </div>
  );
};




const TermsAndConditions = () => {
  return (
    <div className="bg-blue-700 text-white mb-10">
      <div className="container mx-auto space-y-4 md:p-12">
        <h2 className="text-3xl font-bold mb-6">Terms and Conditions</h2>
        <div className="prose">
          <h3 className="text-xl font-bold my-4">Introduction</h3>
          <p>
            - These terms and conditions outline the rules and regulations for the use of AllSexToys, located at www.allsextoys.online.
          </p>

          <h3 className="text-xl font-bold my-4"> Intellectual Property Rights</h3>
          <p>
            - Other than the content you own, under these terms, AllSexToys and/or its licensors own all the intellectual property rights and materials contained in this Website.
          </p>

          <h3 className="text-xl font-bold my-4"> Disclaimer</h3>
          <p>
            - To the maximum extent permitted by applicable law, we exclude all representations, warranties, and conditions relating to AllSexToys
          </p>

          {/* Add more sections such as Privacy Policy, Limitations, Governing Law, etc. */}
        </div>
      </div>
    </div>
  );
};




export default FAQPage;
