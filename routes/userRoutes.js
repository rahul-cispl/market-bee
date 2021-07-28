const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const stockController = require('./../controllers/stockController');
const viewsController = require('../controllers/viewsController');

const router = express.Router();
router.get('/', authController.protect, stockController.getstockRedirect);
router.post('/info', authController.protect, stockController.stockAction);
router.get('/page', authController.protect, stockController.getstockPage);
router.get('/all', stockController.getAllStocks);

router
.route('/:sign')
.get(authController.protect, stockController.getstockPage)

router.post('/signup', authController.signup);
router.post('/login', authController.protect);


module.exports = router;
