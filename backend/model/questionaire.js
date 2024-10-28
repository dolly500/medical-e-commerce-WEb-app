const mongoose = require('mongoose');

const questionnaireSchema = new mongoose.Schema({
  trackingNumber: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    match: /.+\@.+\..+/ // Ensures the format is a valid email
  }
});

module.exports = mongoose.model('Questionnaire', questionnaireSchema);
