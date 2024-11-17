import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "../../../styles/styles";
import ProductCard from "../ProductCard/ProductCard";

const BestDeals = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // Number of products per page
  const { allProducts } = useSelector((state) => state.products);

  // Function to shuffle array
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  useEffect(() => {
    const allProductsData = allProducts ? [...allProducts] : [];
    const shuffledData = shuffleArray(allProductsData);
    setData(shuffledData); // Set randomized data
  }, [allProducts]);

  // Calculate pagination
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const currentData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className={`${styles.section} bg-white`}>
      <div className={`${styles.heading}`}>
        <h1 className="text-3xl font-bold text-blue-600 shadow-lg">Best Deals</h1>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {currentData && currentData.length !== 0 && (
          currentData.map((item, index) => (
            <div key={index} className="flex-shrink-0">
              <ProductCard data={item} />
            </div>
          ))
        )}
      </div>
      {/* Responsive Pagination Controls */}
      <div className="flex flex-wrap justify-center gap-2 mt-4 mb-14">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`px-3 py-1 text-sm sm:text-base rounded-full transition-all ${
              currentPage === index + 1 ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-blue-500 hover:text-white"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BestDeals;
