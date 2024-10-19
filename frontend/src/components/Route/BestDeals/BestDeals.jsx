import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "../../../styles/styles";
import ProductCard from "../ProductCard/ProductCard";

const BestDeals = () => {
  const [data, setData] = useState([]);
  const { allProducts } = useSelector((state) => state.products);

  useEffect(() => {
    const allProductsData = allProducts ? [...allProducts] : [];
    const sortedData = allProductsData.sort((a, b) => b.sold_out - a.sold_out);
    const firstFive = sortedData.slice(0, 5);
    setData(firstFive);
  }, [allProducts]);

  return (
    <div className={`${styles.section} background`}>
      <div className={`${styles.heading}`}>
        <h1 className="text-2xl font-bold text-gray-800">Best Deals</h1>
      </div>
      <div className="flex space-x-2 overflow-x-auto scrollbar-hide mb-12">
        {data && data.length !== 0 && (
          data.map((item, index) => (
            <div key={index} className="flex-shrink-0 w-[150px] md:w-[180px] lg:w-[200px]">
              <ProductCard data={item} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BestDeals;
