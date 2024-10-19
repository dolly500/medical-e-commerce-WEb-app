import React from "react";
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
    slidesToScroll: 1,
  };

  return (
    <div style={{ overflow: "hidden" }}>
      <Slider {...settings}>
        {/* Slide 1 */}
        <div
          className={`relative min-h-[40vh] 800px:min-h-[50vh] w-full bg-cover bg-center bg-no-repeat bg-[url(https://img.freepik.com/free-photo/metal-treatment-device-background-diagnostic_1232-4186.jpg?size=626&ext=jpg&ga=GA1.2.39547238.1724736152&semt=ais_hybrid)]`}
        >
          <div
            className={`relative z-10 ${styles.section} w-[90%] 800px:w-[60%] text-white`}
            style={{ marginTop: "60px", textAlign: "center" }}
          >
            <h1 className="text-[30px] 800px:text-[55px] font-extrabold leading-tight text-blue-700">
              Best Collection Of <br /> Medical Equipments
            </h1>
            <p className="pt-5 text-[16px] 800px:text-[20px] font-bold text-black">
              Explore medical equipment that meets top safety and reliability standards.
            </p>
          </div>
        </div>

        {/* Slide 2 */}
        <div
          className={`relative min-h-[40vh] 800px:min-h-[50vh] w-full bg-cover bg-center bg-no-repeat bg-[url(https://img.freepik.com/premium-photo/high-angle-view-drink-table_1048944-11933435.jpg?size=626&ext=jpg&ga=GA1.1.39547238.1724736152&semt=ais_hybrid)]`}
        >
          <div
            className={`relative z-10 ${styles.section} w-[90%] 800px:w-[60%] text-white`}
            style={{ marginTop: "60px", textAlign: "center" }}
          >
            <h1 className="text-[30px] 800px:text-[55px] font-extrabold leading-tight text-blue-700">
              Shop Anytime, Anywhere
            </h1>
            <p className="pt-5 text-[16px] 800px:text-[20px] font-bold text-black">
              Get high-quality medical equipment designed for durability and precision.
            </p>
          </div>
        </div>

        {/* Slide 3 */}
        <div
          className={`relative min-h-[40vh] 800px:min-h-[50vh] w-full bg-cover bg-center bg-no-repeat bg-[url(https://img.freepik.com/free-photo/medical-equipments-report-pills-isolated-white-background_23-2147941693.jpg?size=626&ext=jpg)]`}
        >
          <div
            className={`relative z-10 ${styles.section} w-[90%] 800px:w-[60%] text-white`}
            style={{ marginTop: "60px", textAlign: "center" }}
          >
            <h1 className="text-[30px] 800px:text-[55px] font-extrabold leading-tight text-blue-700">
              Affordable, Quality Products
            </h1>
            <p className="pt-5 text-[16px] 800px:text-[20px] font-bold text-black">
              Affordable and high-quality equipment tailored to your needs.
            </p>
          </div>
        </div>
      </Slider>
    </div>
  );
};

export default Hero;
