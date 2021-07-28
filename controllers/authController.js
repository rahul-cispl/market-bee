const User = require('./../models/userModel');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Stock = require('./../models/stockModel');


const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });
  };
  
  const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true
    };
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  
    res.cookie('jwt', token, cookieOptions);
  
    // Remove password from output
  
    res.status(statusCode).json({
      status: 'success',
      token,
      data: {
        user
      }
    });
  };

exports.signup = catchAsync(async (req, res, next) => {
    const email = req.body.email;
    var newUser = await User.findOne({ email });
    if (!newUser) {
         newUser = await User.create({
            name: req.body.name,
            email: email
          });
    } 
    createSendToken(newUser, 201, res);
  });

  exports.protect = catchAsync(async (req, res, next) => {
    if (req.cookies.jwt) {    
      try {
        const decoded = await promisify(jwt.verify)(
          req.cookies.jwt,
          process.env.JWT_SECRET
        );
        const currentUser = await User.findById(decoded.id);
        if(!currentUser)
        {
          return next();
        }
        const email = currentUser.email;
        const allStocks = await Stock.find({ email }).sort( { _id: -1 } );

        req.user = currentUser;
        res.locals.user = currentUser;
        res.locals.allStocks = allStocks;
        return next();
      } catch (err) {
          return next();
        }
    }
      res.status(200).render('login', {
          title: 'Start'
      });
  });

  exports.isLoggedIn = async (req, res, next) => {
    if (req.cookies.jwt) {

    }
    next();
  };