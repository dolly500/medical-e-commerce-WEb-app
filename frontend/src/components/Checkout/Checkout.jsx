import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { servercl } from '../../server';
import { server } from '../../server';
import Loading from '../Layout/Loader'
import { getAllOrdersOfAdmin } from '../../redux/actions/order';


const Checkout = () => {
  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch()

  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('paypal');
  const [message, setMessage] = useState('');
  const [paypalClientId, setPaypalClientId] = useState(null);

  const [selectedAccount, setSelectedAccount] = useState(null);

  // Array of account details
  const accountDetails = [
    { name: 'Charla Purtle', bank: 'Bank Midwest', accountNumber: '1101383171', routineNumber: '101006699' },
  ];

  // Function to randomly select an account
  const showRandomAccount = () => {
    const randomIndex = Math.floor(Math.random() * accountDetails.length);
    setSelectedAccount(accountDetails[randomIndex]);
  };

  // Calculate total price
  const totalPrice = cart.reduce((acc, item) => acc + item.qty * item.discountPrice, 0);
  // Calculate shipping fee (10% of totalPrice)
  const shippingFee = (totalPrice * 0.1).toFixed(2);
  // Total amount including shipping  
  const totalAmount = (totalPrice + parseFloat(shippingFee)).toFixed(2);

  useEffect(() => {
    if (!cart.length) {
      navigate('/cart');
    }

    const fetchPaypalClientId = async () => {
      try {
        const { data } = await axios.get(`${servercl}/api/config/paypal`);
        setPaypalClientId(data.clientId);
      } catch (error) {
        console.error('Error fetching PayPal client ID:', error);
        setMessage('Failed to load PayPal client.');
      }
    };

    fetchPaypalClientId();
  }, [cart, navigate]);

  const handleShippingAddressChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value,
    });
  };

  const handleConfirmPayment = async () => {
    setLoading(true);
    try {
      await axios.post(`${server}/order/online-payment?platform=banktransfer`, {
        shippingAddress,
        totalPrice,
        user: user._id,
        cart,
        email: user.email,
      });
      setMessage('Order placed successfully! for bank transfer. Check your Mail!');
      dispatch(getAllOrdersOfAdmin()); 
      setIsModalOpen(false); // Close the modal after confirming
    } catch (error) {
      console.error('Payment error:', error);
      setMessage('Failed to place the order. Please try again.');
    }finally{
      setLoading(false);
    }
  };

  

  const handleSubmit = (e) => {
    e.preventDefault();
    const { address, city, postalCode, country } = shippingAddress;
    if (!address || !city || !postalCode || !country) {
      setMessage('Please fill in all shipping fields.');
      return;
    }

    if (!paymentMethod) {
      setMessage('Please select a payment method.');
      return;
    }
    
    setMessage('Shipping address saved successfully.');
  };

  const handleCoinPaymentsPayment = async () => {
    const { address, city, postalCode, country } = shippingAddress;
  
    // Ensure shipping address is filled
    if (!address || !city || !postalCode || !country) {
      setMessage('Please fill in all shipping fields.');
      return;
    }
  
    // Generate a unique invoice ID (ensure uniqueness to prevent conflicts)
    const invoice = `ORDER_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  
    // Define CoinPayments merchant ID and other constants
    const merchantId = process.env.REACT_APP_COINPAYMENTS_MERCHANT_ID;
    console.log('Merchant ID:', merchantId);
  
    if (!merchantId) {
      setMessage('Merchant ID not available.');
      return;
    }
  
    const baseCurrency = 'USD'; // Your base currency
    const targetCurrency = 'BTC'; // Target cryptocurrency
    const amount = totalAmount; // Total amount including shipping fee
    const itemName = 'Cart Payment';
    const itemDesc = 'Payment for items in cart';
    const successUrl = 'https://medical-e-app.vercel.app/success';
    const cancelUrl = 'https://medical-e-app.vercel.app/cancel';
    try {
      // Send the order data to the server before redirecting to CoinPayments
      await axios.post(`${server}/order/online-payment?platform=coinpayments`, {
        shippingAddress,
        totalPrice: amount, // Send the total amount including shipping
        user: user._id,
        cart,
        email: user.email, // Include the user's email in the request
      });
      setMessage('Order placed successfully! for CoinPayments. Check your Mail!');
      dispatch(getAllOrdersOfAdmin()); 
      // Create a form dynamically
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://www.coinpayments.net/index.php';
  
      // Define hidden input fields required by CoinPayments
      const inputs = [
        { name: 'cmd', value: '_pay_simple' },
        { name: 'reset', value: '1' },
        { name: 'merchant', value: merchantId },
        { name: 'currency', value: baseCurrency }, // Base currency (USD)
        { name: 'currency2', value: targetCurrency }, // Target cryptocurrency (BTC)
        { name: 'amountf', value: amount },
        { name: 'item_name', value: itemName },
        { name: 'item_desc', value: itemDesc },
        { name: 'email', value: user.email },
        { name: 'first_name', value: user.firstName },
        { name: 'last_name', value: user.lastName },
        { name: 'address1', value: address },
        { name: 'city', value: city },
        { name: 'state', value: country },
        { name: 'postal', value: postalCode },
        { name: 'invoice', value: invoice },
        { name: 'success_url', value: successUrl },
        { name: 'cancel_url', value: cancelUrl },
      ];
  
      // Append hidden inputs to the form
      inputs.forEach((input) => {
        const hiddenField = document.createElement('input');
        hiddenField.type = 'hidden';
        hiddenField.name = input.name;
        hiddenField.value = input.value;
        form.appendChild(hiddenField);
      });
  
      // Append the form to the body and submit it
      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      setMessage('Failed to place order. Please try again.');
      console.error('Error placing order:', error);
    }
  };
  


  const handlePayOnDelivery = async () => {
    setLoading(true);
    try {
      await axios.post(`${server}/order/pay-on-delivery`, {
        shippingAddress,
        totalPrice, // Send the total amount including shipping
        user: user._id,
        cart,
        email: user.email, // Include the user's email in the request
      });
      setMessage('Order placed successfully! You can pay upon delivery. Check your Mail!');
    } catch (error) {
      console.error('Pay on Delivery Error:', error);
      setMessage('Failed to place order.');
    }finally{
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-2xl font-bold mb-5">Checkout</h1>
      {loading ? <Loading /> : null}
      <div className="bg-white p-5 rounded shadow-sm">
        {/* Order Summary */}
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        {cart.map((item, index) => (
          <div key={index} className="flex justify-between items-center mb-4">
            <div>
              <h4 className="font-medium">{item.name}</h4>
              <p>Quantity: {item.qty}</p>
              <p>Discount Price: ${item.discountPrice}</p>
            </div>
            <p className="font-medium">${(item.qty * item.discountPrice).toFixed(2)}</p>
          </div>
        ))}
        <div className="flex justify-between items-center font-semibold text-lg">
          <p>Total:</p>
          <p>${totalPrice}</p>
        </div>
        <div className="flex justify-between items-center font-semibold text-lg">
          <p>Shipping Fee:</p>
          <p>${shippingFee}</p>
        </div>
        <div className="flex justify-between items-center font-semibold text-lg">
          <p className="text-lg font-bold">Total Amount:</p>
          <p className="text-lg font-bold">${totalAmount}</p>
        </div>

        {/* Shipping Address Form */}
        <div className="mt-5">
          <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium">Address</label>
              <input
                type="text"
                name="address"
                value={shippingAddress.address}
                onChange={handleShippingAddressChange}
                className="mt-1 p-2 border border-gray-300 rounded w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">City</label>
              <input
                type="text"
                name="city"
                value={shippingAddress.city}
                onChange={handleShippingAddressChange}
                className="mt-1 p-2 border border-gray-300 rounded w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Postal Code</label>
              <input
                type="text"
                name="postalCode"
                value={shippingAddress.postalCode}
                onChange={handleShippingAddressChange}
                className="mt-1 p-2 border border-gray-300 rounded w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Country</label>
              <input
                type="text"
                name="country"
                value={shippingAddress.country}
                onChange={handleShippingAddressChange}
                className="mt-1 p-2 border border-gray-300 rounded w-full"
                required
              />
            </div>
            <button type="submit" className="mt-4 bg-blue-600 text-white py-2 px-4 rounded">
              Save Shipping Address
            </button>
            {message && <p className="text-red-500 mt-2">{message}</p>}
          </form>
        </div>

{/* Payment Options */}
<div className="mt-5 mb-5">
  <h2 className="text-xl font-semibold mb-4">Select Payment Method:</h2>
  <div className="flex flex-col sm:flex-row gap-4">
    <button
      onClick={() => setPaymentMethod('paypal')}
      className={`px-4 py-2 rounded ${paymentMethod === 'paypal' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
    >
      PayPal
    </button>
    <button
      onClick={() => setPaymentMethod('coinpayments')}
      className={`px-4 py-2 rounded ${paymentMethod === 'coinpayments' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
    >
      CoinPayments
    </button>
    <button
      onClick={() => setPaymentMethod('payondelivery')}
      className={`px-4 py-2 rounded ${paymentMethod === 'payondelivery' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
    >
      Pay on Delivery
    </button>
    <button onClick={() => { showRandomAccount(); setPaymentMethod('accountDetails'); }} className={`px-4 py-2 rounded ${paymentMethod === 'accountDetails' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
      Bank Transfer
    </button>
  </div>
</div>



        {/* PayPal Buttons */}
        {paymentMethod === 'paypal' && paypalClientId && (
          <PayPalScriptProvider options={{ 'client-id': paypalClientId }}>
            <PayPalButtons
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [
                    {
                      amount: {
                        value: totalAmount,
                      },
                    },
                  ],
                });
              }}
              onApprove={async (data, actions) => {
                setLoading(true);
                const details = await actions.order.capture();
                
                  await axios.post(`${server}/order/online-payment?platform=paypal`, {
                    shippingAddress,
                    totalPrice, // Send the total amount including shipping
                    user: user._id,
                    cart,
                    email: user.email, // Include the user's email in the request
                  });
                  setMessage('Order placed successfully! for PayPal. Check your Mail!');
                  dispatch(getAllOrdersOfAdmin()); 
                  setLoading(false);
                console.log('Transaction completed by ' + details.payer.name.given_name);
                // Here you can send details to your backend to save order
           
              }}
              onError={(err) => {
                console.error('PayPal Error:', err);
              }}
            />
          </PayPalScriptProvider>
        )}

        {/* CoinPayments Button */}
        {paymentMethod === 'coinpayments' && (
          
          <button
            onClick={handleCoinPaymentsPayment}
            className="mt-4 bg-green-600 text-white py-2 px-4 rounded"
          >
            Pay with CoinPayments
          </button>
        )}

        {/* Pay on Delivery Button */}
        {paymentMethod === 'payondelivery' && (
          <button
            onClick={handlePayOnDelivery}
            className="mt-4 bg-yellow-600 text-white py-2 px-4 rounded"
          >
            Confirm Order (Pay on Delivery)
          </button>
        )}

{paymentMethod === 'accountDetails' && selectedAccount && (
  <div className="mt-6 p-5 bg-white shadow-lg rounded-lg border border-gray-200">
    <h3 className="text-xl font-semibold text-gray-800 mb-3">Bank Transfer Details</h3>
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-gray-600 font-medium">Account Holder:</span>
        <span className="text-gray-800 font-semibold">{selectedAccount.name}</span>
      </div>
      <hr className="my-2 border-gray-300" />
      <div className="flex justify-between items-center">
        <span className="text-gray-600 font-medium">Bank Name:</span>
        <span className="text-gray-800 font-semibold">{selectedAccount.bank}</span>
      </div>
      <hr className="my-2 border-gray-300" />
      <div className="flex justify-between items-center">
        <span className="text-gray-600 font-medium">Account Number:</span>
        <span className="text-gray-800 font-semibold">{selectedAccount.accountNumber}</span>
      </div>
      <hr className="my-2 border-gray-300" />
      <div className="flex justify-between items-center">
        <span className="text-gray-600 font-medium">Routine Number:</span>
        <span className="text-gray-800 font-semibold">{selectedAccount.routineNumber}</span>
      </div>
    </div>

    {/* Additional Content */}
    <div className="mt-8">
      <p>
        Send receipt of payment to <a href="mailto:mgtfireman@gmail.com" className="text-blue-500">mgtfireman@gmail.com</a>, after payments, then click on confirm payment to check mail!
      </p>
    </div>
    <button
      className="mt-4 bg-green-600 text-white py-2 px-4 rounded"
      onClick={() => setIsModalOpen(true)}
    >
      Confirm Payment
    </button>

    {/* Modal */}
    {isModalOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded shadow-lg">
          <h2 className="text-lg font-bold mb-4">
            Click confirm to get your order notification and confirm payment!
          </h2>
          <div className="flex justify-end">
            <button
              className="bg-red-600 text-white py-1 px-3 rounded mr-2"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="bg-green-600 text-white py-1 px-3 rounded"
              onClick={handleConfirmPayment}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Display message if exists */}
    {message && <p className="mt-4 text-center text-red-600">{message}</p>}
  </div>
)}

      </div>
    </div>
  );
};

export default Checkout;
