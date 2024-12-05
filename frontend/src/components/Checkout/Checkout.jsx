import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { servercl } from '../../server';
import { server } from '../../server';
import Loading from '../Layout/Loader'
import { toast } from 'react-toastify';
import { getAllOrdersOfAdmin } from '../../redux/actions/order';
import { AiOutlineCopy, AiOutlineCheck } from "react-icons/ai";
import { createBankTransfer } from '../../redux/actions/banktransfer'; // Adjust the action as necessary




const Checkout = () => {
  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch()
  const [isProcessing, setIsProcessing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");

  const countries = [
    "Afghanistan",
    "Albania",
    "Algeria",
    "Andorra",
    "Angola",
    "Antigua and Barbuda",
    "Argentina",
    "Armenia",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bhutan",
    "Bolivia",
    "Bosnia and Herzegovina",
    "Botswana",
    "Brazil",
    "Brunei",
    "Bulgaria",
    "Burkina Faso",
    "Burundi",
    "Cabo Verde",
    "Cambodia",
    "Cameroon",
    "Canada",
    "Central African Republic",
    "Chad",
    "Chile",
    "China",
    "Colombia",
    "Comoros",
    "Congo (Congo-Brazzaville)",
    "Costa Rica",
    "Croatia",
    "Cuba",
    "Cyprus",
    "Czechia (Czech Republic)",
    "Democratic Republic of the Congo",
    "Denmark",
    "Djibouti",
    "Dominica",
    "Dominican Republic",
    "Ecuador",
    "Egypt",
    "El Salvador",
    "Equatorial Guinea",
    "Eritrea",
    "Estonia",
    "Eswatini (fmr. Swaziland)",
    "Ethiopia",
    "Fiji",
    "Finland",
    "France",
    "Gabon",
    "Gambia",
    "Georgia",
    "Germany",
    "Ghana",
    "Greece",
    "Grenada",
    "Guatemala",
    "Guinea",
    "Guinea-Bissau",
    "Guyana",
    "Haiti",
    "Holy See",
    "Honduras",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran",
    "Iraq",
    "Ireland",
    "Israel",
    "Italy",
    "Jamaica",
    "Japan",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kiribati",
    "Kuwait",
    "Kyrgyzstan",
    "Laos",
    "Latvia",
    "Lebanon",
    "Lesotho",
    "Liberia",
    "Libya",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Madagascar",
    "Malawi",
    "Malaysia",
    "Maldives",
    "Mali",
    "Malta",
    "Marshall Islands",
    "Mauritania",
    "Mauritius",
    "Mexico",
    "Micronesia",
    "Moldova",
    "Monaco",
    "Mongolia",
    "Montenegro",
    "Morocco",
    "Mozambique",
    "Myanmar (formerly Burma)",
    "Namibia",
    "Nauru",
    "Nepal",
    "Netherlands",
    "New Zealand",
    "Nicaragua",
    "Niger",
    "Nigeria",
    "North Korea",
    "North Macedonia",
    "Norway",
    "Oman",
    "Pakistan",
    "Palau",
    "Palestine State",
    "Panama",
    "Papua New Guinea",
    "Paraguay",
    "Peru",
    "Philippines",
    "Poland",
    "Portugal",
    "Qatar",
    "Romania",
    "Russia",
    "Rwanda",
    "Saint Kitts and Nevis",
    "Saint Lucia",
    "Saint Vincent and the Grenadines",
    "Samoa",
    "San Marino",
    "Sao Tome and Principe",
    "Saudi Arabia",
    "Senegal",
    "Serbia",
    "Seychelles",
    "Sierra Leone",
    "Singapore",
    "Slovakia",
    "Slovenia",
    "Solomon Islands",
    "Somalia",
    "South Africa",
    "South Korea",
    "South Sudan",
    "Spain",
    "Sri Lanka",
    "Sudan",
    "Suriname",
    "Sweden",
    "Switzerland",
    "Syria",
    "Tajikistan",
    "Tanzania",
    "Thailand",
    "Timor-Leste",
    "Togo",
    "Tonga",
    "Trinidad and Tobago",
    "Tunisia",
    "Turkey",
    "Turkmenistan",
    "Tuvalu",
    "Uganda",
    "Ukraine",
    "United Arab Emirates",
    "United Kingdom",
    "United States of America",
    "Uruguay",
    "Uzbekistan",
    "Vanuatu",
    "Venezuela",
    "Vietnam",
    "Yemen",
    "Zambia",
    "Zimbabwe",
  ];
  


  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [image, setImage] = useState(null);



  const handleConfirmPayments = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false); // Reset processing state after 30 seconds
      setIsModalOpen(true); // Open the modal if necessary
    }, 10000); // 30 seconds delay
  };


  const handleSubmited = async (e) => {
    e.preventDefault();
  
    // Prepare form data for image upload
    const formData = new FormData();
    formData.append("email", email);
    formData.append("image", image);
  
    setIsProcessing(true); // Start processing state
  
    try {
      await dispatch(createBankTransfer(formData)); // Dispatching the action with FormData
  
      // Delay the order notification
      setTimeout(async () => {
        try {
          // Send order notification after delay
          await axios.post(`${server}/order/online-payment?platform=banktransfer`, {
            shippingAddress,
            totalPrice,
            user: user._id,
            cart,
            email: user.email,
          });
          setMessage('Order placed successfully on bank transfer, check your mail!');
        } catch (error) {
          console.error("Failed to send order notification:", error);
          setMessage("There was an issue placing your order. Please try again.");
        } finally {
          setIsProcessing(false); // Reset processing state after the request completes
          setIsModalOpen(true);   // Open the modal if necessary
        }
      }, 30000); // 10 seconds delay
    } catch (error) {
      toast.error("Failed to submit details");
      setIsProcessing(false); // Ensure processing state is reset on error
    }
  };
  


  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('paypal');
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
  // Calculate shipping fee (30% of totalPrice)
  const shippingFee = (totalPrice * 0.3).toFixed(2);
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
  
    // Ensure all required fields in the shipping address are filled
    if (!address || !city || !postalCode || !country) {
      setMessage('Please fill in all shipping fields.');
      return;
    }
  
    const invoice = `ORDER_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const merchantId = process.env.REACT_APP_COINPAYMENTS_MERCHANT_ID;
    
    if (!merchantId) {
      setMessage('Merchant ID not available.');
      return;
    }
  
    const baseCurrency = 'USD';
    const targetCurrency = 'BTC';
    const amount = totalAmount;
    const itemName = 'Cart Payment';
    const itemDesc = 'Payment for items in cart';
    const successUrl = 'https://medical-e-app.vercel.app/success';
    const cancelUrl = 'https://medical-e-app.vercel.app/cancel';
  
    try {
      // Send order details to backend
      await axios.post(`${server}/order/online-payment?platform=coinpayment`, {
        shippingAddress,
        totalPrice: amount,
        user: user._id,
        cart,
        email: user.email,
        invoice,
      });
      
      setMessage('Order placed successfully on CoinPayments, check your mail!');
  
      // Proceed to create a form for CoinPayments
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://www.coinpayments.net/index.php';
  
      const inputs = [
        { name: 'cmd', value: '_pay_simple' },
        { name: 'reset', value: '1' },
        { name: 'merchant', value: merchantId },
        { name: 'currency', value: baseCurrency },
        { name: 'currency2', value: targetCurrency },
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
  
      inputs.forEach((input) => {
        const hiddenField = document.createElement('input');
        hiddenField.type = 'hidden';
        hiddenField.name = input.name;
        hiddenField.value = input.value;
        form.appendChild(hiddenField);
      });
  
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


  const [timeLeft, setTimeLeft] = useState(30 * 60);

  useEffect(() => {
    if (timeLeft <= 0) return; // Stop if time is up

    const timerInterval = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    // Clear interval on component unmount
    return () => clearInterval(timerInterval);
  }, [timeLeft]);

  // Format timeLeft as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secondsLeft = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secondsLeft).padStart(2, '0')}`;
  };


  const [copiedText, setCopiedText] = useState("");

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedText(text);
      setTimeout(() => setCopiedText(""), 2000); // Reset after 2 seconds
    });
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
      <select
        name="country"
        value={shippingAddress.country}
        onChange={handleShippingAddressChange}
        className="mt-1 p-2 border border-gray-300 rounded w-full"
        required
      >
        <option value="" disabled>
          Select your country
        </option>
        {countries.map((country) => (
          <option key={country} value={country}>
            {country}
          </option>
        ))}
      </select>
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
       <>
      

       {paymentMethod === 'paypal' && paypalClientId && (
          <PayPalScriptProvider options={{ 'client-id': paypalClientId }}>
             <ul type='disc' className='mb-5'>
              <li>- you will receive order notification after paypal payment process, kindly reply the email to send proof of payment after payment! Thank you!.</li>
              <li>- failure to reply for proof of payment will be regarded as invalid payments.</li>
        </ul>
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
       </>

        {/* CoinPayments Button */}
        {paymentMethod === 'coinpayments' && (         
          <>
            <p>Note: 
            </p>
            <ul type='disc'>
              <li>- you will receive order notification after coinpayment payment process, kindly reply the email to send proof of payment after payment! Thank you!.</li>
              <li>- failure to reply for proof of payment will be regarded as invalid payments.</li>
            </ul>
            <button
            onClick={handleCoinPaymentsPayment}
            className="mt-4 bg-green-600 text-white py-2 px-4 rounded"
          >
            Pay with CoinPayments
          </button>
          </>
        )}

        {/* Pay on Delivery Button */}
        {paymentMethod === 'payondelivery' && (
         <>
          <div className="mt-6 p-5 bg-white shadow-lg rounded-lg border border-gray-200">
            Place Order on delivery by reaching out to <a href='#' style={{color: 'blue'}}>Medistorepro@outlook.com</a>
          </div>
         </>
        )}

{paymentMethod === 'accountDetails' && selectedAccount && (
  <div className="mt-6 p-5 bg-white shadow-lg rounded-lg border border-gray-200">
      <div>
      <div style={{ fontSize: '1.4rem', margin: '20px 0', color: 'red' }}>
        {timeLeft > 0 ? formatTime(timeLeft) : "Payment Timeout"}
      </div>
    </div>
    <h3 className="text-xl font-semibold text-gray-800 mb-3">Bank Transfer Details</h3>
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-gray-600 font-medium">Account Holder:</span>
        <span className="text-gray-800 font-semibold">{selectedAccount.name}</span>
        <button
          onClick={() => copyToClipboard(selectedAccount.name)}
          className="ml-2 text-gray-600 hover:text-blue-500"
        >
          {copiedText === selectedAccount.name ? (
            <AiOutlineCheck />
          ) : (
            <AiOutlineCopy />
          )}
        </button>
      </div>
      <hr className="my-2 border-gray-300" />
      <div className="flex justify-between items-center">
        <span className="text-gray-600 font-medium">Bank Name:</span>
        <span className="text-gray-800 font-semibold">{selectedAccount.bank}</span>
        <button
          onClick={() => copyToClipboard(selectedAccount.bank)}
          className="ml-2 text-gray-600 hover:text-blue-500"
        >
          {copiedText === selectedAccount.bank ? (
            <AiOutlineCheck />
          ) : (
            <AiOutlineCopy />
          )}
        </button>
      </div>
      <hr className="my-2 border-gray-300" />
      <div className="flex justify-between items-center">
        <span className="text-gray-600 font-medium">Account Number:</span>
        <span className="text-gray-800 font-semibold">{selectedAccount.accountNumber}</span>
        <button
          onClick={() => copyToClipboard(selectedAccount.accountNumber)}
          className="ml-2 text-gray-600 hover:text-blue-500"
        >
          {copiedText === selectedAccount.accountNumber ? (
            <AiOutlineCheck />
          ) : (
            <AiOutlineCopy />
          )}
        </button>
      </div>
      <hr className="my-2 border-gray-300" />
      <div className="flex justify-between items-center">
        <span className="text-gray-600 font-medium">Routine Number:</span>
        <span className="text-gray-800 font-semibold">{selectedAccount.routineNumber}</span>
        <button
          onClick={() => copyToClipboard(selectedAccount.routineNumber)}
          className="ml-2 text-gray-600 hover:text-blue-500"
        >
          {copiedText === selectedAccount.routineNumber ? (
            <AiOutlineCheck />
          ) : (
            <AiOutlineCopy />
          )}
        </button>
      </div>
      <hr className="my-2 border-gray-300" />
      <div className="flex justify-between items-center">
          <p className="text-lg font-bold">Total Amount:</p>
          <p className="text-lg font-bold">${totalAmount}</p>
      </div>
      
    </div>

    {/* Additional Content */}
  
   
    <div>
      {isProcessing ? (
         <button
         className="mt-4 bg-green-600 text-white py-2 px-4 rounded"
       >
         Processing Payment...
       </button>
      ) : (
        <button
          className="mt-4 bg-green-600 text-white py-2 px-4 rounded"
          onClick={handleConfirmPayments}
        >
          Confirm Payment
        </button>
      )}
    </div>

    {/* Modal */}
    {isModalOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded shadow-lg">
          <h2 className="text-lg font-bold mb-4">
            Upload Evidence of payment in the form below:
          </h2>
         <div>
         <ul type='disc'>
              <li>- you will receive order notification after bank transfer payment upload process, kindly reply the email to send proof of payment after uploading payment! Thank you!.</li>
              <li>- failure to reply for proof of payment will be regarded as invalid payments.</li>
            </ul>
         </div>
          <form onSubmit={handleSubmited} className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="email">
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Image Upload Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="image">
              Upload Image:
            </label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="flex justify-end mt-4">
            <Link to="/">
              <button
                type="button"
                className="bg-red-600 text-white py-1 px-3 rounded mr-2"
              >
                Cancel
              </button>
            </Link>
            <div>
                  {isProcessing ? (
                    <button 
                    className="mt-4 bg-green-600 text-white py-2 px-4 rounded"
                  >
                    Processing Payment...
                  </button>
                  ) : (
                    <>
                    <button
                      className="bg-green-600 text-white py-1 px-3 rounded"
                    >
                      Upload Payment
                    </button>

                    </>
                    
                  )}
                  
                  <p style={{color: 'blue'}}>{message}</p>
            </div>
          </div>
        </form>
  
        
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
