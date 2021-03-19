
- About project: buy TUSD with low price then sell with high price. Create a runloop to check balance status to make sell or buy order.

Generate api key
- Go to binance website (https://www.binance.com/vi/my/settings/api-management) to generate api key
How to install:
- npm install
- npm install -s dotenv 
- npm install -s node-binance-api
- enter keypair into examples/.env file, config parameters (BUY_PRICE, SELL_PRICE, TIMELOOP in milisecond) to trade
- cd to folder `examples` run `node example.js`