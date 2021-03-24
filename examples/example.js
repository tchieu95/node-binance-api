const Binance = require("node-binance-api");
require("dotenv").config();

const binance = new Binance().options({
  APIKEY: process.env.API_KEY,
  APISECRET: process.env.API_SECRET,
});

const pairName = process.env.PAIR_NAME;
const firstCurrency = process.env.FIRST;
const secondCurrency = process.env.SECOND;
const timeLoop = Number(process.env.TIMELOOP); // milisecond
const fee = Number(process.env.FEE);
const maxQuantity = Number(process.env.MAX_QUANTITY);
const minQuantity = Number(process.env.MIN_QUANTITY);
const buyPrice = Number(process.env.BUY_PRICE);
const sellPrice = Number(process.env.SELL_PRICE);

async function trading(buyPrice, sellPrice) {
  console.log(new Date().toLocaleTimeString());

  const prices = await binance.prices(pairName);
  let currentPrice = prices[pairName];
  console.log(`Current price ${pairName}: ${currentPrice}`);

  const balances = await binance.balance();
  const firstBalance = balances[firstCurrency];
  const firstBalanceAvailable = balances[firstCurrency].available;
  const secondBalance = balances[secondCurrency];
  const secondBalanceAvailable = balances[secondCurrency].available;

  console.log(`${firstCurrency} balance: ${firstBalanceAvailable}`);
  console.log(`${secondCurrency} balance: ${secondBalanceAvailable}`);

  const orders = await binance.openOrders(pairName);

  // Đã đặt lệnh rồi thì không làm gì cả
  if (Array.isArray(orders) && orders.length > 0) {
    console.log("Return because there are some existing orders");
    // return;
  }

  // Nếu còn tiền chưa đặt lệnh mua thì đặt lệnh mua
  if (secondBalanceAvailable > 0) {
    const optimiseBuyPrice = Math.min(buyPrice, Number(currentPrice));

    const quantity = Math.min(
      maxQuantity,
      Math.floor(
        (100 * secondBalanceAvailable) / optimiseBuyPrice / (1 + fee)
      ) / 100
    ); // floor 2 decimal numbers
    console.log("quantity " + quantity);
    console.log("price " + optimiseBuyPrice);

    if (quantity >= minQuantity) {
      binance.buy(pairName, quantity, optimiseBuyPrice).catch((e) => {
        console.log("------------------- buy error");
        console.log(e);
      });
    }
  }

  if (firstBalanceAvailable > 0) {
    const quantity = Math.min(
      maxQuantity,
      Math.floor(100 * firstBalanceAvailable) / 100
    );
    console.log("quantity " + quantity);
    console.log("price " + sellPrice);
    if (quantity >= minQuantity) {
      binance.sell(pairName, quantity, sellPrice).catch((e) => {
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
