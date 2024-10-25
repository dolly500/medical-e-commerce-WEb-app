// models/Account.js
const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  account_type: { type: String, default: 'savings' },
  bank_id: { type: String, default: 'bank_treasuryprime' },
  currency: { type: String, default: null },
  routing_number: { type: String, required: true },
  account_number: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const Account = mongoose.model('Account', accountSchema);
module.exports = Account;
