import React from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "../../../styles/styles";

const Hero = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    autoplay: true,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  


  return (
    <div style={{ overflow: 'hidden' }}>
    <Slider {...settings}>
    <div
      className={`relative min-h-[70vh] 800px:min-h-[80vh] w-full bg-cover bg-center bg-no-repeat bg-center bg-[url(https://img.freepik.com/free-photo/metal-treatment-device-background-diagnostic_1232-4186.jpg?size=626&ext=jpg&ga=GA1.2.39547238.1724736152&semt=ais_hybrid)] bg-blend-darken ${styles.noramlFlex}`}
    >
      <div className={`${styles.section}  w-[90%] 800px:w-[60%]`} style={{marginTop: '100px'}}>
        <h1
          className={`text-[45px] leading-[1.2] 800px:text-[80px] 1200px:text-[80px] text-blue-700 font-[700] capitalize`}
        >
          Best Collection Of <br /> Medical Equipments
        </h1>
        <p className="pt-5 text-[16px] 800px:text-[16px] 1200px:text-[20px] font-[400] text-black">
        Our range of medical equipment is designed to meet the highest standards of safety, accuracy, and reliability.
        </p>
        <Link to="/products" className="inline-block">
          <div className={`${styles.button} mt-5`}>
            <span className="text-[#fff] text-[18px]">
              Shop Now
            </span>
          </div>
        </Link>
      </div>
    </div>
    <div
        className={`relative min-h-[83.5vh] 800px:min-h-[80vh] w-full bg-cover bg-center bg-no-repeat bg-center bg-[url(https://img.freepik.com/premium-photo/high-angle-view-drink-table_1048944-11933435.jpg?size=626&ext=jpg&ga=GA1.1.39547238.1724736152&semt=ais_hybrid)] bg-blend-darken ${styles.noramlFlex}`}
      >
        {/* Slide 2 content */}
        <div className={`${styles.section}  w-[90%] 800px:w-[60%]`} style={{marginTop: '100px'}}>
        <h1
          className={`text-[45px] leading-[1.2] 800px:text-[80px] 1200px:text-[80px] text-blue-700 font-[700] capitalize`}
        >
          Shop your Medical Equipment here anytime
        </h1>
        <p className="pt-5 text-[16px] 800px:text-[16px] 1200px:text-[20px] font-[400] text-black   ">
        Our equipment is manufactured using top-grade materials and cutting-edge technology to ensure durability and precision.
        </p>
        <Link to="/sign-up" className="inline-block">
          <div className={`${styles.button} mt-5`}>
            <span className="text-[#fff] text-[18px]">
              Register Now
            </span>
          </div>
        </Link>
        </div>
    </div>

    <div
        className={`relative min-h-[83.5vh] 800px:min-h-[80vh] w-full bg-cover bg-center bg-no-repeat bg-center bg-[url(https://img.freepik.com/free-photo/medical-equipments-report-pills-isolated-white-background_23-2147941693.jpg?size=626&ext=jpg)] bg-blend-darken ${styles.noramlFlex}`}
      >
        {/* Slide 3 content */}
        <div className={`${styles.section}  w-[90%] 800px:w-[60%]`} style={{marginTop: '100px'}}>
            <h1
              className={`text-[45px] leading-[1.2] 800px:text-[80px] 1200px:text-[80px] text-blue-700 font-[700] capitalize`}
            >
              Affordable quality products of Medical Equipments
            </h1>
            <p className="pt-5 text-[16px] 800px:text-[16px] 1200px:text-[20px] font-[400] text-[#000]">
            Affordable compared to other providers.
            </p>
            <Link to="/products" className="inline-block">
          <div className={`${styles.button} mt-5`}>
            <span className="text-[#fff] text-[18px]">
              Shop Now
            </span>
          </div>
        </Link>
        </div>
    </div>
    </Slider>
    </div>
  );
};

export default Hero;
