import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "../../../styles/styles";
import ProductCard from "../ProductCard/ProductCard";

const BestDeals = () => {
  const [data, setData] = useState([]);
  const { allProducts } = useSelector((state) => state.products);

  useEffect(() => {
    const allProductsData = allProducts ? [...allProducts] : [];
    const sortedData = allProductsData?.sort((a, b) => b.sold_out - a.sold_out); 
    const firstFive = sortedData && sortedData.slice(0, 5);
    setData(firstFive);
  }, [allProducts]);

  return (
    <div className={`${styles.section}`}>
      <div className={`${styles.heading}`}>
        <h1 style={{ color: 'black' }}>Best Deals</h1>
      </div>
      <div className="flex space-x-[10px] overflow-x-auto scrollbar-hide mb-12 border-0">
        {data && data.length !== 0 && (
          <>
            {data.map((i, index) => (
              <div key={index} className="min-w-[200px]"> {/* Adjust width as needed */}
                <ProductCard data={i} />
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default BestDeals;
