import React from 'react';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { Link} from "react-router-dom";


const SuccessPage = () => {
 
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <AiOutlineCheckCircle className="text-green-500 text-6xl mb-4" />
        <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase! Your order has been successfully placed.
        </p>
       <Link to='/'>
       <button className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition duration-300">
          Continue Shopping
        </button>
       </Link>
      </div>
    </div>
  );
};

export default SuccessPage;
