// 用 fs/promises 跟 mysql2 取代自己包裝 promise
const axios = require("axios");
const moment = require("moment");
// const fs = require("fs");
const fs = require("fs/promises");
// const mysql = require("mysql");
const mysql = require("mysql2/promise");
// 只需要 require
require("dotenv").config();

function queryStockPricePromise(stockCode) {
  // moment().subtract(10, "days").format("YYYYMMDD"),
  return axios.get("https://www.twse.com.tw/exchangeReport/STOCK_DAY", {
    params: {
      response: "json",
      date: moment().format("YYYYMMDD"),
      stockNo: stockCode, // 長榮航空 2618  長榮航海王 2603
    },
  });
}

async function doWork() {
  let connection;
  try {
    // 設定連線資料
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // 1. 讀 stock.txt 把股票代碼讀進來
    let stockCode = await fs.readFile("stock.txt", "utf8");

    // 2. 去資料庫的 stock 表格查看看，這個代碼是不是在我們的服務範圍內
    const [dbResults] = await connection.execute(
      "SELECT * FROM stock WHERE stock_id = ?",
      [stockCode]
    );
    if (dbResults.length === 0) {
      throw "此股票代碼不在服務範圍內";
    }

    // 3. 如果是，才去證交所抓資料
    let response = await queryStockPricePromise(stockCode);

    // 4. 抓回來的資料存到資料庫的 stock_price 表格裡去
    const twseData = response.data;
    if (twseData.stat !== "OK") {
      throw "從證交所查到的資料有問題!";
    }

    let parsedData = twseData.data.map((item) => {
      // 針對 data 裡的每一組做資料處理

      // 處理日期: 民國年轉西元年
      // 處理千位符 ,
      // 處理 + - ===> parseInt 會處理
      item = item.map((value) => {
        return value.replace(/,/g, "");
      });

      //"110/08/05" replace to "1100805", parseInt轉數字 + 19110000
      item[0] = parseInt(item[0].replace(/\//g, ""), 10) + 19110000;

      // 把 stock_id 放進來（因為我們的資料庫需要）
      item.unshift(stockCode);
      return item;
    });
    console.log(parsedData);

    // [
    //   '日期',     '成交股數',
    //   '成交金額', '開盤價',
    //   '最高價',   '最低價',
    //   '收盤價',   '漲跌價差',
    //   '成交筆數'
    // ]

    // mysql2 的問題: bulk insert 的支援度不太好
    const [insertResult] = await connection.query(
      "INSERT IGNORE INTO stock_price (stock_id, date, volume, amount, open_price, high_price, low_price, close_price, delta_price, transactions) VALUES ?",
      [parsedData]
    );
    // 原來不用[[...parsedData]]？
    console.log(insertResult);  
  } catch (e) {
    console.error("***************");
    console.error(e);
  } finally {
    connection.end();
  }
}

doWork();