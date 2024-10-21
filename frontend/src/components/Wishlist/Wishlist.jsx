import React, { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { BsCartPlus } from "react-icons/bs";
import styles from "../../styles/styles";
import { AiOutlineHeart } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { removeFromWishlist } from "../../redux/actions/wishlist";
import { addToCart } from "../../redux/actions/cart";

const Wishlist = ({ setOpenWishlist }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();

  const removeFromWishlistHandler = (data) => {
    dispatch(removeFromWishlist(data));
  };

  const addToCartHandler = (data) => {
    const newData = {...data, qty:1};
    dispatch(addToCart(newData));
    setOpenWishlist(false);
  }

  return (
    <div className="fixed top-0 left-0 w-full bg-[#0000004b] h-screen z-10">
      <div className="fixed top-0 right-0 h-full w-[80%] overflow-y-scroll 800px:w-[25%] bg-white flex flex-col justify-between shadow-sm">
        {wishlist && wishlist.length === 0 ? (
          <div className="w-full h-screen flex items-center justify-center">
            <div className="flex w-full justify-end pt-5 pr-5 fixed top-3 right-3">
              <RxCross1
                size={25}
                className="cursor-pointer"
                onClick={() => setOpenWishlist(false)}
              />
            </div>
            <h5>Wishlist Items is empty!</h5>
          </div>
        ) : (
          <>
            <div>
              <div className="flex w-full justify-end pt-5 pr-5">
                <RxCross1
                  size={25}
                  className="cursor-pointer"
                  onClick={() => setOpenWishlist(false)}
                />
              </div>
              {/* Item length */}
              <div className={`${styles.noramlFlex} p-4`}>
                <AiOutlineHeart size={25} />
                <h5 className="pl-2 text-[20px] font-[500]">
                  {wishlist && wishlist.length} items
                </h5>
              </div>

              {/* cart Single Items */}
              <br />
              <div className="w-full border-t">
                {wishlist &&
                  wishlist.map((i, index) => (
                    <CartSingle key={index} data={i} removeFromWishlistHandler={removeFromWishlistHandler} addToCartHandler={addToCartHandler} />
                  ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const CartSingle = ({ data, removeFromWishlistHandler, addToCartHandler }) => {
  const [value, setValue] = useState(1);
  const totalPrice = data.discountPrice * value;

  return (
    <div className="border-b p-2 800px:p-3">
      <div className="w-full flex items-center justify-between">
        {/* Remove from wishlist */}
        <RxCross1
          className="cursor-pointer mb-2 ml-2 800px:ml-0"
          onClick={() => removeFromWishlistHandler(data)}
        />

        {/* Product Image */}
        <img
          src={`${data?.images[0]?.url}`}
          alt=""
          className="w-[80px] h-[80px] 800px:w-[100px] 800px:h-[100px] rounded-[5px] ml-2 mr-2"
        />

        {/* Product Details */}
        <div className="flex flex-col justify-between pl-[5px] w-full">
          <h1 className="text-[14px] 800px:text-[16px]">{data.name}</h1>
          <h4 className="font-[600] text-[14px] text-[#d02222] font-Roboto pt-2 800px:pt-[3px]">
            ${totalPrice}
          </h4>
        </div>

        {/* Add to Cart Icon */}
        <div className="ml-2">
          <BsCartPlus
            size={20}
            className="cursor-pointer"
            title="Add to cart"
            onClick={() => addToCartHandler(data)}
          />
        </div>
      </div>
    </div>
  );
};


export default Wishlist;
