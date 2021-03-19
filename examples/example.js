const Binance = require("node-binance-api");
require("dotenv").config();

const binance = new Binance().options({
  APIKEY: process.env.API_KEY,
  APISECRET: process.env.API_SECRET,
});

const currencyName = "TUSDUSDT";
const timeLoop = process.env.TIMELOOP; // milisecond
const fee = process.env.FEE;
const minQuantity = process.env.MIN_QUANTITY;
const buyPrice = process.env.BUY_PRICE;
const sellPrice = process.env.SELL_PRICE;

async function trading(buyPrice, sellPrice) {
  console.log(new Date().toLocaleTimeString());

  const result = await binance.prices("TUSDUSDT");
  console.log("Price TUSD/USDT: " + result.TUSDUSDT);

  const balances = await binance.balance();

  const usdtBalance = balances.USDT.available;
  const tusdBalance = balances.TUSD.available;

  console.log("USDT balance: " + JSON.stringify(balances.USDT));
  console.log("TUSD balance: " + JSON.stringify(balances.TUSD));

  // Nếu còn tiền usdt chưa đặt lệnh mua thì đặt lệnh mua
  if (usdtBalance > 0 && balances.USDT.onOrder < 0.1) {
    const quantity =
      Math.floor((100 * usdtBalance) / buyPrice / (1 + fee)) / 100; // floor 2 decimal numbers
    console.log("quantity " + quantity);
    console.log("price " + buyPrice);

    if (quantity >= minQuantity) {
      binance.buy(currencyName, quantity, buyPrice).catch((e) => {
        console.log("------------------- buy error");
        console.log(e);
      });
    }
  }

  if (tusdBalance > 0 && balances.TUSD.onOrder < 0.1) {
    const quantity = Math.floor(100 * tusdBalance) / 100;
    console.log("quantity " + quantity);
    console.log("price " + sellPrice);
    if (quantity >= minQuantity) {
      binance.sell(currencyName, quantity, sellPrice).catch((e) => {
        console.log("------------------- sell error");
        console.log(e);
      });
    }
  }
}

function callTrading() {
  trading(buyPrice, sellPrice);
}

function run() {
  setInterval(callTrading, timeLoop);
}

run();

/*
const binance = require("../node-binance-api.js");
binance.options({
  APIKEY: "",
  APISECRET: "",
});

let ticker = binance.prices();
console.info(`Price of BNB: ${ticker.BNBUSDT}`);

// Get bid/ask prices
//binance.allBookTickers(function(error, json) {
//  console.log("allBookTickers",json);
//});

// Getting latest price of a symbol
binance.prices(function(error, ticker) {
  console.log("prices()", ticker);
  console.log("Price of BNB: ", ticker.BNBBTC);
});

// Getting list of current balances
binance.balance(function(error, balances) {
  console.log("balances()", balances);
  if (typeof balances.ETH !== "undefined") {
    console.log("ETH balance: ", balances.ETH.available);
  }
});

// Getting bid/ask prices for a symbol
//binance.bookTickers(function(error, ticker) {
//	console.log("bookTickers()", ticker);
//	console.log("Price of BNB: ", ticker.BNBBTC);
//});

// Get market depth for a symbol
//binance.depth("SNMBTC", function(error, json) {
//	console.log("market depth",json);
//});

// Getting list of open orders
//binance.openOrders("ETHBTC", function(error, json) {
//	console.log("openOrders()",json);
//});

// Check an order's status
//let orderid = "7610385";
//binance.orderStatus("ETHBTC", orderid, function(error, json) {
//	console.log("orderStatus()",json);
//});

// Cancel an order
//binance.cancel("ETHBTC", orderid, function(error, response) {
//	console.log("cancel()",response);
//});

// Trade history
//binance.trades("SNMBTC", function(error, json) {
//  console.log("trade history",json);
//});

// Get all account orders; active, canceled, or filled.
//binance.allOrders("ETHBTC", function(error, json) {
//	console.log(json);
//});

//Placing a LIMIT order
//binance.buy(symbol, quantity, price);
//binance.buy("ETHBTC", 1, 0.0679);
//binance.sell("ETHBTC", 1, 0.069);

//Placing a MARKET order
//binance.buy(symbol, quantity, price, type);
//binance.buy("ETHBTC", 1, 0, "MARKET")
//binance.sell(symbol, quantity, 0, "MARKET");

// Periods: 1m,3m,5m,15m,30m,1h,2h,4h,6h,8h,12h,1d,3d,1w,1M
binance.candlesticks("BNBBTC", "5m", function(error, ticks) {
  console.log("candlesticks()", ticks);
  let last_tick = ticks[ticks.length - 1];
  let [
    time,
    open,
    high,
    low,
    close,
    volume,
    closeTime,
    assetVolume,
    trades,
    buyBaseVolume,
    buyAssetVolume,
    ignored,
  ] = last_tick;
  console.log("BNBBTC last close: " + close);
});

// Maintain Market Depth Cache Locally via WebSocket
binance.websockets.depthCache(["BNBBTC"], function(symbol, depth) {
  let max = 10; // Show 10 closest orders only
  let bids = binance.sortBids(depth.bids, max);
  let asks = binance.sortAsks(depth.asks, max);
  console.log(symbol + " depth cache update");
  console.log("asks", asks);
  console.log("bids", bids);
  console.log("ask: " + binance.first(asks));
  console.log("bid: " + binance.first(bids));
});
*/
