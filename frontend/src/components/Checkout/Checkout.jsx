import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { server } from '../../server';

const Checkout = () => {
  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);

  const userId = user._id;
  const userEmail = user.email;
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });

  const totalPrice = cart.reduce((acc, item) => acc + item.qty * item.discountPrice, 0);

  useEffect(() => {
    if (!cart.length) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  const handleShippingAddressChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value,
    });
  };

  // PayPal Order Creation and Payment Handling
  const createOrder = async () => {
    try {
      const createOrderResponse = await axios.post(`${server}/order/create-order`, {
        cart,
        shippingAddress,
        user: user,
        totalPrice,
      });

      const { orders } = createOrderResponse.data;
      setOrders(orders);

      return orders[0]._id; // Assuming you're creating a single order
    } catch (error) {
      console.error(error);
      toast.error("Failed to create order!");
    }
  };

  const handleApprove = async (data, actions) => {
    try {
      const response = await axios.post(
        `${server}/order/complete-order/${data.orderID}`, // Adjust route based on your backend
        { orderID: data.orderID },
      );
      const result = response.data;
      if (result.success) {
        toast.success("Payment successful!");
        navigate("/order-confirmation"); // Redirect to order confirmation
      } else {
        toast.error("Payment failed.");
      }
    } catch (error) {
      console.error("Error capturing order", error);
      toast.error("Payment could not be processed.");
    }
  };

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-2xl font-bold mb-5">Checkout</h1>
      <div className="bg-white p-5 rounded shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        {cart.map((item, index) => (
          <div key={index} className="flex justify-between items-center mb-4">
            <div>
              <h4 className="font-medium">{item.name}</h4>
              <p>Quantity: {item.qty}</p>
              <p>Price: ${item.discountPrice}</p>
            </div>
            <p className="font-medium">${item.qty * item.discountPrice}</p>
          </div>
        ))}
        <div className="flex justify-between items-center font-semibold text-lg">
          <p>Total:</p>
          <p>${totalPrice}</p>
        </div>

        <h2 className="text-xl font-semibold mb-4 mt-5">Shipping Address</h2>
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={shippingAddress.address}
          onChange={handleShippingAddressChange}
          className="mb-2 p-2 border rounded w-full"
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={shippingAddress.city}
          onChange={handleShippingAddressChange}
          className="mb-2 p-2 border rounded w-full"
        />
        <input
          type="text"
          name="postalCode"
          placeholder="Postal Code"
          value={shippingAddress.postalCode}
          onChange={handleShippingAddressChange}
          className="mb-2 p-2 border rounded w-full"
        />
        <input
          type="text"
          name="country"
          placeholder="Country"
          value={shippingAddress.country}
          onChange={handleShippingAddressChange}
          className="mb-2 p-2 border rounded w-full"
        />

        <PayPalScriptProvider options={{ "client-id": "AZ7RR3vamknNm726JI4Jz-lOlRWDvV6GtRxrEmAHWvM6cptl76diS78FHfUPw3dmzgLyUScPmZWVJ1gQ" }}>
          <PayPalButtons
            createOrder={(data, actions) => createOrder()}
            onApprove={handleApprove}
            style={{
              shape: "rect",
              layout: "vertical",
              color: "blue",
              label: "paypal",
            }}
          />
        </PayPalScriptProvider>
      </div>
    </div>
  );
};

export default Checkout;
