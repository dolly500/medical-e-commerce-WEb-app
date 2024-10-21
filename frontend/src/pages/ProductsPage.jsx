import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import Loader from "../components/Layout/Loader";
import ProductCard from "../components/Route/ProductCard/ProductCard";
import styles from "../styles/styles";
import axios from "axios";
import { server } from "../server";

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const categoryData = searchParams.get("category");
  const { allProducts, isLoading } = useSelector((state) => state.products);
  const [data, setData] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  useEffect(() => {
    axios.get(`${server}/category`, { withCredentials: true }).then((res) => {
      setCategoriesData(res.data.categorys);
    });

    const filteredData = categoryData
      ? allProducts.filter((i) => i.category === categoryData)
      : allProducts;

    setData(filteredData);
  }, [allProducts, categoryData]);

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = data.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(data.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Header activeHeading={3} categoriesData={categoriesData} />
          <br />
          <br />
          <div className={`${styles.section}`}>
            <div className={`${styles.heading}`}>
              <h1 style={{ color: "black" }}>Shop</h1>
            </div>
            <div className="grid grid-cols-2 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12">
              {currentProducts.map((i, index) => (
                <ProductCard data={i} key={index} />
              ))}
            </div>
            {data.length === 0 && (
              <h1 className="text-center w-full pb-[100px] text-[#000] text-[20px]">
                No products Found!
              </h1>
            )}
            {/* Pagination */}
            <div className="flex justify-center mt-4 mb-14">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  className={`rounded-full mx-1 px-3 mb-14 py-1 border ${
                    currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-white text-black"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
          <Footer />
        </div>
      )}
    </>
  );
};

export default ProductsPage;
