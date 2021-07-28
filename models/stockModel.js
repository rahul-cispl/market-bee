const mongoose = require('mongoose');
const validator = require('validator');

const stockSchema = new mongoose.Schema({
  sign: {
    type: String,
    required:true
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  }
});

const Stock = mongoose.model('stock', stockSchema);

module.exports = Stock;
