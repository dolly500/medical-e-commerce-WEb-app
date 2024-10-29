const mongoose = require('mongoose');

const bankTransferSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    match: /.+\@.+\..+/ // Ensures the format is a valid email
  },
  file: {
    type: String, // Store the file path or filename
    required: true
  }
});

module.exports = mongoose.model('BankTransfer', bankTransferSchema);
