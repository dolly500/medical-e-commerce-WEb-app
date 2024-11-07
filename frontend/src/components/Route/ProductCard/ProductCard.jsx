import React, { useState } from "react";
import {
  AiFillHeart,
  AiFillStar,
  AiOutlineEye,
  AiOutlineHeart,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import styles from "../../../styles/styles";
import { useDispatch, useSelector } from "react-redux";
import ProductDetailsCard from "../ProductDetailsCard/ProductDetailsCard";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../../redux/actions/wishlist";
import { useEffect } from "react";
import { addToCart } from "../../../redux/actions/cart";
import { toast } from "react-toastify";
import Ratings from "../../Products/Ratings";

const ProductCard = ({ data,isEvent }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const [click, setClick] = useState(false);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (wishlist && wishlist.find((i) => i._id === data?._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [wishlist]);

  const removeFromWishlistHandler = (data) => {
    setClick(!click);
    dispatch(removeFromWishlist(data));
  };

  const addToWishlistHandler = (data) => {
    setClick(!click);
    dispatch(addToWishlist(data));
  };

  const addToCartHandler = (id) => {
    const isItemExists = cart && cart.find((i) => i._id === id);
    if (isItemExists) {
      toast.error("Item already in cart!");
    } else {
      if (data?.stock < 1) {
        toast.error("Product stock limited!");
      } else {
        const cartData = { ...data, qty: 1 };
        dispatch(addToCart(cartData));
        toast.success("Item added to cart successfully!");
      }
    }
  };

  return (
    <>
     <div className="w-full h-[310px] bg-white-200 rounded-lg shadow-sm p-3 relative cursor-pointer">
  <div className="flex justify-end"></div>
  <Link to={`${isEvent === true ? `/product/${data?._id}?isEvent=true` : `/product/${data?._id}`}`}>
    <img
      src={`${data?.images && data?.images[0]?.url}`}
      alt=""
      className="w-full h-[170px] object-contain"
    />
  </Link>
  
  <Link to={`${isEvent === true ? `/product/${data?._id}?isEvent=true` : `/product/${data?._id}`}`}>
    <h4 className="pb-3 font-[200] text-[11px] leading-snug text-ellipsis overflow-hidden">
      {data?.name?.length > 40 ? data?.name?.slice(0, 40) + "..." : data?.name}
    </h4>

    <div className="py-2 flex items-center justify-between">
      <div className="flex">
        <h4 className={`${styles.price} text-[10px] ml-2`}>
          {data?.originalPrice ? `${data?.originalPrice} $` : null}
        </h4>
      </div>
      {/* <span className="font-[400] text-[10px] text-[#0000FF]">
        {data?.sold_out} sold
      </span> */}
    </div>
  </Link>

  <div>
    {click ? (
      <AiFillHeart 
        size={22}
        className="cursor-pointer absolute right-2 top-48 mt-6"
        onClick={() => removeFromWishlistHandler(data)}
        color="red"
        title="Remove from wishlist"
      />
    ) : (
      <AiOutlineHeart
        size={22}
        className="cursor-pointer absolute right-2 top-48 mt-6"
        onClick={() => addToWishlistHandler(data)}
        color="#0000FF"
        title="Add to wishlist"
      />
    )}
    {open ? <ProductDetailsCard setOpen={setOpen} data={data} /> : null}
  </div>
  
  <div className="absolute bottom-3 w-full flex justify-center">
    <button
      className="bg-blue-700 text-white px-2 py-2 rounded text-[12px]"
      onClick={() => addToCartHandler(data?._id)}
    >
      Add to Cart
    </button>
  </div>
</div>

    </>
  );
};

export default ProductCard;
