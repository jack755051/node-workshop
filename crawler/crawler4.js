const axios = require("axios");
const moment = require("moment");
const fs = require("fs");
const mysql = require("mysql");
// 只需要 require
require("dotenv").config();

// 設定連線資料
// const connection = mysql.createConnection({
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
// });
const connection = require("./untiles/db")

// 準備連線
connection.connect((err) => {
  if (err) {
    console.error("資料庫連不上");
  }
});

function readStockPromise() {
  return new Promise((resolve, reject) => {
    fs.readFile("stock.txt", "utf8", (err, stockCode) => {
      if (err) {
        reject(err);
      } else {
        // https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
        // trim 移除前後的空白字元，包括換行
        resolve(stockCode.trim());
      }
    });
  });
}
function queryStockPricePromise(stockCode) {
  return axios.get("https://www.twse.com.tw/exchangeReport/STOCK_DAY", {
    params:{
      response: "json",
      date: moment().format("YYYYMMDD"),
      stockNo: stockCode, // 長榮航空 2618  長榮航海王 2603
    },
  });
}

function queryStockCodePromise(stockCode) {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM stock WHERE stock_id = ?",
      [stockCode],
      function (error, results, fields) {
        if (error) {
          // 錯誤處理
          reject(error);
        }
        // if (results.length === 0) {
        //   reject("在資料查無資料!!!!!!");
        // }
        // 正確處理: 有資料
        resolve(results);
      }
    );
  });
}

// 要傳入 parsedData
function insertDataPromise(parsedData) {
  return new Promise((resolve, reject) => {
    connection.query(
      "INSERT IGNORE INTO stock_price (stock_id, date, volume, amount, open_price, high_price, low_price, close_price, delta_price, transactions) VALUES ?",
      [parsedData],
      function (error, results, fields) {
        if (error) {
          reject(error);
        }
        resolve(results);
      }
    );
  });
}

async function doWork() {
  try {
    // 1. 讀 stock.txt 把股票代碼讀進來
    let stockCode = await readStockPromise();

    // 2. 去資料庫的 stock 表格查看看，這個代碼是不是在我們的服務範圍內
    let dbResults = await queryStockCodePromise(stockCode);

    // A. 放在 reject (promise)
    // B. 放在外部這邊
    // 職責切割 -> 一個函式只做一件事
    if (dbResults.length === 0) {
      // console.warn("此股票代碼不在服務範圍內");
      // return;
      throw "此股票代碼不在服務範圍內";
    }
    console.info("在資料庫有查到資料");
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

      // 110/08/05 => [110, '08', '05'] => [2021, '08', '05'] => 20210805
      // 110/08/05 => 1100805 + 19110000
      //"110/08/05" replace to "1100805", parseInt轉數字
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

    let insertResult = await insertDataPromise(parsedData);
    console.log(insertResult);
  } catch (e) {
    console.error("***************");
    console.error(e);
  } finally {
    connection.end();
  }
}

doWork();