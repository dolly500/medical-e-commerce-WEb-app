const express = require("express");
const ErrorHandler = require("./middleware/error");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const fileUpload = require('express-fileupload');
const morgan = require("morgan");
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');





app.use(cors({
  origin: ['https://www.medistorepro.com', 'https://medical-e-app.vercel.app', 'http://localhost:3000'],
  credentials: true,
  domain: 'https://www.medistorepro.com'
}));

// app.use(express.bodyParser({limit: '50mb'}))

app.use(morgan("dev"));
app.use(express.json({ limit: '100mb' }));
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));
app.use(cookieParser());
app.use("/", express.static(path.join(__dirname, "./uploads")));


app.get("/", async (req, res, next) => {
  res.send({ message: "Welcome🚀" });
});

// app.use(fileUpload({
//   limits: { fileSize: 100 * 1024 * 1024 },  // Set limit to 100MB
// }));





app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use(bodyParser.urlencoded({ extended: true, limit: "52428800" }));

// config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: ".env",
  });
}

// import routes
const paypal = require("./controller/paypal")
const user = require("./controller/user");
const shop = require("./controller/shop");
const product = require("./controller/product");
const category = require("./controller/category");
const event = require("./controller/event");
const post = require("./controller/post");
const coupon = require("./controller/coupounCode");
const payment = require("./controller/payment");
const order = require("./controller/order");
const conversation = require("./controller/conversation");
const message = require("./controller/message");
const withdraw = require("./controller/withdraw");
const questionaire = require("./controller/questionaire");
const coinpayment = require("./controller/coinpayments");
const banktransfer = require("./controller/banktransfer")


app.use("/api/v2/user", user);
app.use("/api/v2/conversation", conversation);
app.use("/api/v2/message", message);
app.use("/api/v2/order", order);
app.use("/api/v2/shop", shop);
app.use("/api/v2/product", product);
app.use("/api/v2/category", category);
app.use("/api/v2/event", event);
app.use("/api/v2/post", post);
app.use("/api/v2/coupon", coupon);
app.use("/api/v2/payment", payment);
app.use("/api/v2/withdraw", withdraw);
app.use("/api/v2/questionaire", questionaire);
app.use("/api/v2/banktransfer", banktransfer)
app.use("/api/v2/paypal", paypal);
app.use("/api/v2/payment/coinpayment", coinpayment);

// app.use("/api/v2/", require("../backend/routes/admin.route"));

// it's for ErrorHandling
// app.use(ErrorHandler);

module.exports = app;
