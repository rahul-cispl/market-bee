
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');




exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Start'
  });
};

// exports.getstockRedirect = (req, res) => {
//   res.status(200).render('stock', {
//     title: 'Scan'
//   });
// };