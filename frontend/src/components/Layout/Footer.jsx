import React, { useRef }  from "react";
import emailjs from 'emailjs-com';
import {
  AiFillFacebook,
  AiFillInstagram,
  AiFillYoutube,
  AiOutlineTwitter,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import {
  footerProductLinks,
  footerSupportLinks,
  footercompanyLinks,
} from "../../static/data";
import logo from "../../static/imgs/logo.png";

const Footer = () => {
  const emailInputRef = useRef(null);

  const sendEmail = (e) => {
    e.preventDefault();

    // Replace these with your actual EmailJS IDs
    const serviceId = 'service_ris2vwj';
    const templateId = 'template_alo301e';
    const userId = 'Qr40OaloluqTkfltN';

    const emailContent = {
      email: emailInputRef.current.value // Capture the email content from the input field
    };

    emailjs.send(serviceId, templateId, emailContent, userId)
      .then((response) => {
        console.log('Email sent!', response);
        // Handle success, e.g., show a success message, clear form fields, etc.
      ////////////////////////////////////////  emailInputRef.current.value = '';
      })


      .catch((error) => {
        console.error('Error sending email:', error);
        // Handle error, e.g., show an error message to the user
      });
  };

  // const handleEmailChange = (e) => {
  //   setEmail(e.target.value);
  // };

  return (
    <div className="bg-white text-white">
      <div className="md:flex md:justify-between md:items-center sm:px-12 px-4 bg-blue-700 py-7">
        <h1 className="lg:text-4xl text-3xl md:mb-0 mb-6 lg:leading-normal font-semibold md:w-2/5">
          <span className="text-white">Subscribe</span> us for get news{" "}
          <br />
          events and offers
        </h1>
        <div>
        <form onSubmit={sendEmail}>
        <input
            type="email"
            ref={emailInputRef}
            required
            placeholder="Enter your email..."
            className="text-gray-800
                sm:w-72 w-full sm:mr-5 mr-1 lg:mb-0 mb-4 py-2.5 rounded px-2 focus:outline-none"
          />
              <button type="submit" className="hover:bg-[#000] bg-black hover:bg-blue-500 duration-300 px-5 py-2.5 rounded-md text-whie md:w-auto w-full">
            Submit
          </button>
        </form>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:gird-cols-3 lg:grid-cols-4 gap-6 sm:px-8 px-5 py-16 sm:text-center">
        <ul className="px-5 text-center sm:text-start flex sm:block flex-col items-center">
          <img
          className="h-15 w-3/5"
            src={logo}
            alt=""
            // style={{ filter: "brightness(0) invert(1)" }}
          />
          <br />
          <p>Buy Online.</p>
          <div className="flex items-center mt-[15px]">
            <AiFillFacebook size={25} className="cursor-pointer" />
            <AiOutlineTwitter
              size={25}
              style={{ marginLeft: "15px", cursor: "pointer" }}
            />
            <AiFillInstagram
              size={25}
              style={{ marginLeft: "15px", cursor: "pointer" }}
            />
            <AiFillYoutube
              size={25}
              style={{ marginLeft: "15px", cursor: "pointer" }}
            />
          </div>
        </ul>

        <ul className="text-center sm:text-start">
          <h1 className="mb-1 font-semibold">Company</h1>
          {footerProductLinks.map((link,index) => (
            <li key={index}>
              <Link
                className="text-gray-400 hover:text-teal-400 duration-300
                   text-sm cursor-pointer leading-6"
                to={link.link}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        <ul className="text-center sm:text-start">
          <h1 className="mb-1 font-semibold">Shop</h1>
          {footercompanyLinks.map((link,index) => (
            <li key={index}>
              <Link
                className="text-gray-400 hover:text-teal-400 duration-300
                   text-sm cursor-pointer leading-6"
                to={link.link}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        <ul className="text-center sm:text-start">
          <h1 className="mb-1 font-semibold">Support</h1>
          {footerSupportLinks.map((link,index) => (
            <li key={index}>
              <Link
                className="text-gray-400 hover:text-teal-400 duration-300
                   text-sm cursor-pointer leading-6"
                to={link.link}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10
         text-center pt-2 text-gray-400 text-sm pb-8"
      >
        <span>© 2024 . All rights reserved.</span>
        <span>Terms · Privacy Policy</span>
        <div className="sm:block flex items-center justify-center w-full">
          <img
            src="https://hamart-shop.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ffooter-payment.a37c49ac.png&w=640&q=75"
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default Footer;
