import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { brandingData } from "../../../static/data";
import styles from "../../../styles/styles";
import { server } from "../../../server";
import axios from "axios";

const Categories = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const categoriesPerPage = 6; // Number of categories to show per page

  useEffect(() => {
    axios.get(`${server}/category`, { withCredentials: true }).then((res) => {
      setData(res.data.categorys);
    });
  }, []);

  // Get the current categories for the current page
  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = data.slice(indexOfFirstCategory, indexOfLastCategory);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate the total number of pages
  const totalPages = Math.ceil(data.length / categoriesPerPage);

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

      {/* Categories Section */}
      <div className="p-6 rounded-lg mb-12 max-w-screen-lg mx-auto"> {/* Added max width and centered */}
        <div className={`${styles.heading} mb-6`}>
          <h1 className="text-gray-800 text-3xl font-extrabold text-center">All Categories</h1>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {currentCategories.map((i) => {
            const handleSubmit = (i) => {
              navigate(`/products?category=${i.name}`);
            };
            return (
              <div
                className="category-card bg-white border border-gray-200 rounded-lg shadow-md cursor-pointer transition-transform transform hover:scale-105 p-3 text-center"
                key={i?._id}
                onClick={() => handleSubmit(i)}
              >
                <img
                  src={i?.images?.[0]?.url}
                  className="w-full h-28 object-cover rounded-t-lg mb-2"
                  alt={i.name}
                />
                <h5 className="mb-1 text-lg font-semibold text-gray-800">{i.name}</h5>
                <Link to={`/products?category=${i.name}`} className="inline-block">
                  <div className="mt-2 bg-blue-600 hover:bg-blue-500 transition rounded text-center py-1 px-3">
                    <span className="text-white text-sm font-semibold">Shop Now</span>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-6 mb-14">
          <ul className="inline-flex space-x-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <li key={index} className={`${currentPage === index + 1 ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-800"} rounded-full`}>
                <button
                  onClick={() => paginate(index + 1)}
                  className="w-8 h-8 text-center rounded-full focus:outline-none"
                >
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Categories;
