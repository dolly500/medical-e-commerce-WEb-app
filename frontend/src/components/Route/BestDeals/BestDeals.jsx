import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "../../../styles/styles";
import ProductCard from "../ProductCard/ProductCard";

const BestDeals = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // Number of products per page
  const { allProducts } = useSelector((state) => state.products);

  useEffect(() => {
    const allProductsData = allProducts ? [...allProducts] : [];
    const sortedData = allProductsData.sort((a, b) => b.sold_out - a.sold_out);
    setData(sortedData); // Handle pagination here
  }, [allProducts]);

  // Calculate pagination
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const currentData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className={`${styles.section} bg-white`}> {/* Background is white for both mobile and desktop */}
      <div className={`${styles.heading}`}>
        <h1 className="text-3xl font-bold text-blue-600 shadow-lg">Best Deals</h1>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"> {/* Two columns on mobile, four on larger screens */}
        {currentData && currentData.length !== 0 && (
          currentData.map((item, index) => (
            <div key={index} className="flex-shrink-0">
              <ProductCard data={item} />
            </div>
          ))
        )}
      </div>
      {/* Pagination Controls */}
      <div className="flex justify-center space-x-2 mt-4 mb-14">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`px-4 py-2 mb-14 rounded-full ${currentPage === index + 1 ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BestDeals;
