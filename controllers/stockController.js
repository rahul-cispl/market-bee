var axios = require('axios');
const Stock = require('./../models/stockModel');
const catchAsync = require('./../utils/catchAsync');
const NodeCache = require('node-cache');

const myCache = new NodeCache();


const getStock = async (sign,email) => {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${sign}&outputsize=compact&apikey=U83XUYUSWT14SZSP`;
    try {
      const result = await axios({
        method: 'GET',
        url: url
      });
      return result.data;
    } catch (err) {
        console.log(err);
    }
  };

  exports.stockAction = catchAsync(async (req, res, next) => {
    const email = req.user.email;
    if (!email) {
      res.status(401).json({
          status: 'error',
          message:'please login first'
        });
    }
    const sign = req.body.stock;
    var stockInfo = await getStock(sign,email);
    if (stockInfo['Error Message']) {
        return res.status(401).json({
            status: 'error',
            message: 'Please Provide the Correct Stock Script'
          });
    }
   const newStock = await Stock.create({
        sign: sign,
        email: email
      });
    var i = 1;
    var array = [];
    var graphLabel = [];
    var graphdata = [];
    for (const property in stockInfo['Time Series (Daily)']) {
        item = {
            date : `${property}`,
            max : `${stockInfo['Time Series (Daily)'][property]['2. high']}`,
            close : `${stockInfo['Time Series (Daily)'][property]['4. close']}`,
            volume : `${stockInfo['Time Series (Daily)'][property]['6. volume']}`,
            dividend : `${stockInfo['Time Series (Daily)'][property]['7. dividend amount']}`
        }
        graphItem1 = `${property}`;
        graphItem2 = `${stockInfo['Time Series (Daily)'][property]['2. high']}`;

        array.push(item);
        graphLabel.push(graphItem1);
        graphdata.push(graphItem2);
        if (i == 5) break;
        i++;
    }
    myCache.set('sign', sign);
    myCache.set(sign, array);
    myCache.set(sign+'_graphLabel', graphLabel);
    myCache.set(sign+'_graphdata', graphdata);
    res.status(200).json({
      status: 'success'
    });
  });

  exports.getAllStocks = catchAsync(async (req, res) => {
  });

  exports.getstockRedirect = (req, res) => {
    res.status(200).render('stock', {
      title: 'Scan'
    });
  };

  exports.getstockPage = (req, res) => {
    if(myCache.has('sign')){
      let sign;
      if (req.params.sign) {
        sign = req.params.sign;
      }
      else {
        sign = myCache.get('sign');
      }
      const result = myCache.get(sign);

      if(myCache.has(sign+'_graphLabel')) {
        const graphLabel = myCache.get(sign+'_graphLabel');
        const graphdata = myCache.get(sign+'_graphdata');
        res.status(200).render('stockbar', {
          title: 'result',
          sign:sign,
          scanResult:result,
          graphdata:JSON.stringify(graphdata),
          graphLabel:JSON.stringify(graphLabel)
        });
      }
      else
      {
        res.status(200).render('stockbar', {
          title: 'result',
          sign:sign,
          scanResult:result,
          graphdata:JSON.stringify([110, 200, 150, 130, 160, 160, 170,140, 120, 190]),
        graphLabel:JSON.stringify(["8.30", "9.30", "10.30", "11.30", "12.30", "13.30", "14.30", "15.30", "16.30", "17.30"])
        });
      }
    }
    else
    {
      res.status(200).render('stockbar', {
        title: 'result',
        graphdata:JSON.stringify([110, 200, 150, 130, 160, 160, 170,140, 120, 190]),
        graphLabel:JSON.stringify(["8.30", "9.30", "10.30", "11.30", "12.30", "13.30", "14.30", "15.30", "16.30", "17.30"])
      });
    }
  };