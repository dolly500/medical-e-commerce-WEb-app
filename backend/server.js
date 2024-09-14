const app = require("./app");
const connectDatabase = require("./db/Database");
const cloudinary = require("cloudinary");
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;




// Handling uncaught Exception
// process.on("uncaughtException", (err) => {
//   console.log(`Error: ${err.message}`);
//   console.log(`shutting down the server for handling uncaught exception`);
// });

// config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: ".env",
  });
}

// Route to get PayPal Client ID
app.get('/api/config/paypal', (req, res) => {
  console.log("PayPal Client ID: ", PAYPAL_CLIENT_ID); // Debug log
  res.send({ clientId: PAYPAL_CLIENT_ID });
});
// connect db 
connectDatabase();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})


// create server


const PORT = process.env.PORT || 3000; // Set the PORT to the environment variable PORT or default to 3000
app.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`)); // Start the server on the specified PORT


// unhandled promise rejection
// process.on("unhandledRejection", (err) => {
//   console.log(`Shutting down the server for ${err.message}`);
//   console.log(`shutting down the server for unhandle promise rejection`);

//   server.close(() => {
//     process.exit(1);
//   });
// });
