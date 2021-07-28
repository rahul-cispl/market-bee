const path = require('path');
const express = require('express');
var bodyParser = require('body-parser')
const AppError = require('./utils/appError');
const userRouter = require('./routes/userRoutes');
const globalErrorHandler = require('./controllers/errorController');
const viewRouter = require('./routes/viewRoutes');
const NodeCache = require('node-cache');
const cookieParser = require('cookie-parser');

const myCache = new NodeCache();
const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());


app.use('/', viewRouter);
app.use('/stock', userRouter);


app.use('/users', userRouter);
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  });
  
app.use(globalErrorHandler);
module.exports = app;