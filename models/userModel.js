const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required:false,
    default:'random'
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  active: {
    type: Boolean,
    default: true,
    select: false
  }
});

const User = mongoose.model('user', userSchema);

module.exports = User;
