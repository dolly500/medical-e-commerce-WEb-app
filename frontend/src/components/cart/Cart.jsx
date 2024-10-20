import React, { useState, useEffect } from "react";
import { HiOutlineMinus, HiPlus } from "react-icons/hi";
import { IoBagHandleOutline } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { addToCart, removeFromCart, loadCartFromLocalStorage } from "../../redux/actions/cart";
import styles from "../../styles/styles";

const Cart = ({ setOpenCart, userId }) => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  useEffect(() => {
    if (userId) {
      dispatch(loadCartFromLocalStorage(userId));
    }
  }, [userId, dispatch]);

  const removeFromCartHandler = (data) => {
    dispatch(removeFromCart(data, userId));
  };

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.qty * item.discountPrice,
    0
  );

  const quantityChangeHandler = (data) => {
    dispatch(addToCart(data, userId));
  };

  return (
    <div className="fixed top-0 left-0 w-full bg-[#0000004b] h-screen z-10">
      <div className="fixed top-0 right-0 h-full w-[80%] 800px:w-[25%] bg-white flex flex-col overflow-y-scroll justify-between shadow-sm">
        {cart && cart.length === 0 ? (
          <div className="w-full h-screen flex items-center justify-center">
            <div className="flex w-full justify-end pt-5 pr-5 fixed top-3 right-3">
              <RxCross1
                size={25}
                className="cursor-pointer"
                onClick={() => setOpenCart(false)}
              />
            </div>
            <h5>Cart Items is empty!</h5>
          </div>
        ) : (
          <>
            <div>
              <div className="flex w-full justify-end pt-5 pr-5">
                <RxCross1
                  size={25}
                  className="cursor-pointer"
                  onClick={() => setOpenCart(false)}
                />
              </div>
              <div className={`${styles.noramlFlex} p-4`}>
                <IoBagHandleOutline size={25} />
                <h5 className="pl-2 text-[20px] font-[500]">
                  {cart && cart.length} items
                </h5>
              </div>
              <div className="w-full border-t">
                {cart &&
                  cart.map((i, index) => (
                    <CartSingle
                      key={index}
                      data={i}
                      quantityChangeHandler={quantityChangeHandler}
                      removeFromCartHandler={removeFromCartHandler}
                    />
                  ))}
              </div>
            </div>
            <div className="px-5 mb-3">
              <Link to="/checkout">
                <div
                  className={`h-[45px] flex items-center justify-center w-[100%] bg-[#e44343] rounded-[5px]`}
                >
                  <h1 className="text-[#fff] text-[18px] font-[600]">
                    Checkout Now (${totalPrice})
                  </h1>
                </div>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const CartSingle = ({ data, quantityChangeHandler, removeFromCartHandler }) => {
  const [value, setValue] = useState(data.qty);
  const totalPrice = data.discountPrice * value;

  const increment = () => {
    if (data.stock <= value) {
      toast.error("Product stock limited!");
    } else {
      setValue((prevValue) => {
        const newValue = prevValue + 1;
        quantityChangeHandler({ ...data, qty: newValue });
        return newValue;
      });
    }
  };

  const decrement = () => {
    setValue((prevValue) => {
      const newValue = prevValue === 1 ? 1 : prevValue - 1;
      quantityChangeHandler({ ...data, qty: newValue });
      return newValue;
    });
  };

  return (
    <div className="border-b p-3 sm:p-4 flex items-center justify-between">
      <div className="flex items-center space-x-2 sm:space-x-4">
        <div className="flex items-center">
          <div
            className="bg-[#e44343] rounded-full w-[20px] h-[20px] flex items-center justify-center cursor-pointer"
            onClick={increment}
          >
            <HiPlus size={16} color="#fff" />
          </div>
          <span className="px-2 text-sm">{value}</span>
          <div
            className="bg-[#a7abb14f] rounded-full w-[20px] h-[20px] flex items-center justify-center cursor-pointer"
            onClick={decrement}
          >
            <HiOutlineMinus size={16} color="#7d879c" />
          </div>
        </div>

        <img
          src={`${data?.images[0]?.url}`}
          alt={data.name}
          className="w-[60px] h-[60px] sm:w-[80px] sm:h-[80px] object-cover rounded-[5px]"
        />
      </div>

      <div className="flex flex-col items-end">
        <h1 className="text-sm sm:text-base font-medium">{data.name}</h1>
        <h4 className="text-xs sm:text-sm text-[#00000082]">
          ${data.discountPrice} * {value}
        </h4>
        <h4 className="text-sm sm:text-base font-semibold text-[#d02222]">
          ${totalPrice}
        </h4>
      </div>

      <RxCross1
        className="cursor-pointer text-[#d02222]"
        size={20}
        onClick={() => removeFromCartHandler(data)}
      />
    </div>
  );
};


export default Cart;
