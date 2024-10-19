import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { brandingData } from "../../../static/data";
import styles from "../../../styles/styles";
import { server } from "../../../server";
import axios from "axios";

const Categories = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get(`${server}/category`, { withCredentials: true }).then((res) => {
      setData(res.data.categorys);
    });
  }, []);

  return (
    <>
      {/* Branding Section */}
      <div className={`${styles.section} hidden sm:block`}>
        <div className="branding my-12 flex justify-between w-full shadow-sm bg-white p-5 rounded-md">
          {brandingData &&
            brandingData.map((i, index) => (
              <div className="flex items-start" key={index}>
                {i.icon}
                <div className="px-3">
                  <h3 className="font-bold text-sm md:text-base">{i.title}</h3>
                  <p className="text-xs md:text-sm">{i.Description}</p>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Categories Section without Background */}
      <div className="p-6 rounded-lg mb-12">
        <div className={`${styles.heading} mb-6`}>
          <h1 className="text-gray-800 text-3xl font-extrabold text-center">Discover All Categories</h1>
        </div>

        {/* Mobile-Responsive Category Slider with Scroll */}
        <div className="overflow-x-auto flex snap-x snap-mandatory scrollbar-hide"> {/* Ensure scrollbar is hidden */}
          {data &&
            data.map((i) => {
              const handleSubmit = (i) => {
                navigate(`/products?category=${i.name}`);
              };
              return (
                <div
                  className="category-card flex-shrink-0 w-40 max-w-xs bg-white border border-gray-200 rounded-lg shadow-md cursor-pointer transition-transform transform hover:scale-105 snap-start mx-2"
                  key={i?._id}
                  onClick={() => handleSubmit(i)}
                >
                  <img
                    src={i?.images?.[0]?.url}
                    className="w-full h-28 object-cover rounded-t-lg"
                    alt={i.name}
                  />
                  <div className="p-2 text-center">
                    <h5 className="mb-1 text-lg font-semibold text-gray-800">{i.name}</h5>
                    <Link to={`/products?category=${i.name}`} className="inline-block">
                      <div className="mt-2 bg-blue-600 hover:bg-blue-500 transition rounded text-center py-1 px-3">
                        <span className="text-white text-sm font-semibold">Shop Now</span>
                      </div>
                    </Link>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default Categories;
