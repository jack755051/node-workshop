const axios = require ("axios");
const moment = require ("moment");
const fs = require("fs/promises"); 
const mysql = require('mysql2/promise');
const { resolve } = require("path");
//僅需要require
require('dotenv').config();

function queryStockPricePromise(stockCode){
    return axios.get("https://www.twse.com.tw/exchangeReport/STOCK_DAY",{
        params:{
            response:"json",
            date:moment().format("YYYYMMDD"),
            stockNo: stockCode, // 長榮航空 2618  長榮航海王 2603
        },
    });
}

async function doWork(){
    let connection
    try{
        //設定連線資料
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });
        //1. 讀取stock.txt，將股票代碼讀入。
        let stockCode = await fs.readFile("stock.txt","utf8");

        //2. 至資料庫的stock表格查看，這個代碼是否在我們的服務範圍內。
        let [dbResults] = await connection.execute(
            "SELECT * FROM stock WHERE stock_id =?",
            [stockCode]
        ) ;

        if(dbResults.length === 0){
            throw "此股票代碼不在服務範圍內";
        }
        //3.如果是，才去證交所抓資料
        let response = await queryStockPricePromise(stockCode);

        //4.將抓回後的資料存取到資料庫的stock_price表格中
        const twseData = response.data;
        
        if(twseData.stat !== "OK"){
            throw "從證交所查到的資料有問題"
        }
        let parsedData = twseData.data.map((item)=>{ 
            item = item.map(value =>{
                return value.replace(/,/g, "");
            });
            item[0] = parseInt(item[0].replace(/\//g, ""),10) + 19110000;
            item.unshift(stockCode);
            return item;
        });
        console.log(parsedData);

        const [insertResult] = await connection.query(
            "INSERT IGNORE INTO stock_price (stock_id, date, volume, amount, open_price, high_price, low_price, close_price, delta_price, transactions) VALUES ?",
        [parsedData]);
        
        console.log(insertResult); 
    }
    catch(e){  ;
        console.error("*****************");
        console.error(e)
    }
    finally{
        connection.end();
    }
}
doWork();

