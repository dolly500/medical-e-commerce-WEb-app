const mongoose = require("mongoose");

// Define MongoDB Schema and Model for CoinPayments transactions
const coinPaymentSchema = new mongoose.Schema({
  txn_id: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  currency1: { type: String, required: true },
  currency2: { type: String, required: true },
  buyer_email: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  postal_code: { type: String, required: true },
  country: { type: String, required: true },
  status: { type: String, required: true, default: "pending" },
  checkout_url: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("CoinPaymentTransaction", coinPaymentSchema );