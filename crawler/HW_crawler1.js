const axios = require ("axios");
const moment = require ("moment");
const fs = require("fs"); 
const mysql = require('mysql');
const { resolve } = require("path");
//僅需要require
require('dotenv').config();

//設定連線資料
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

connection.connect((err) => {
    if (err) {
        console.error("資料庫連不上");
    }
});

function readStockPromise(){
    return new Promise((resolve,reject)=>{
        fs.readFile("stock.txt","utf8",(err,stockCode)=>{
            if(err){
                reject(err);
            }else{
                resolve(stockCode);
            }
        });
    });
}

function queryStockPricePromise(stockCode){
    return axios.get("https://www.twse.com.tw/exchangeReport/STOCK_DAY",{
        params:{
            response:"json",
            date:moment().format("YYYYMMDD"),
            stockNo: stockCode, // 長榮航空 2618  長榮航海王 2603
        },
    });
}

function queryStockCodePromise(stockCode){
    return new Promise ((resolve,reject) => {
        connection.query(
            "SELECT * FROM stock WHERE stock_id =?",
            [stockCode], 
            function (error, results, fields) {
            if (error){
                reject(error);
            }
            if(results.length ===0){
                reject("資料庫中查無資料！！！！！");
            }
                //正確處理
                resolve(results);
        }
    );
    }); 
}

function insertDataPromise(parsedData){
    return new Promise ((resolve,reject)=>{
        connection.query("INSERT IGNORE INTO stock_price (stock_id, date, volume, amount, open_price, high_price, low_price, close_price, delta_price, transactions) VALUES ?",
        [parsedData],
        function(error,results,fields){
            if(error){
                reject(error);
            }
            resolve(results);
        }
        );
    })
}

async function doWork(){
    try{
        //1. 讀取stock.txt，將股票代碼讀入。
        let stokeCode = await readStockPromise();

        //2. 至資料庫的stock表格查看，這個代碼是否在我們的服務範圍內。
        let dbResults = await queryStockCodePromise(stokeCode);
        // if(dbResults.length === 0){
        //     // console.warn("此股票代碼不在服務範圍內")
        //     // return;
        //     throw "此股票代碼不在服務範圍內";
        // }
        console.info("有查到資料")
        //3.如果是，才去證交所抓資料
        let response = await queryStockPricePromise(stokeCode);

        // console.log(response.data.title);
        //4.將抓回後的資料存取到資料庫的stock_price表格中
        const twseData = response.data;
        if(twseData.stat !== "OK"){
            throw "從證交所查到的資料有問題"
        }

        let parsedData = twseData.data.map((item)=>{ 
            //item --> 代表每組陣列資料
            console.log("-------------");
            //item處理-->將千字符拿走
            item = item.map(value =>{
                return value.replace(/,/g, "");
            });
            //item處理-->將民國年轉西元年
            //parseInt(string, radix)->
            //         parseInt將字串轉為數字,radix為轉換進制,預設並非10
            item[0] = parseInt(item[0].replace(/\//g, ""),10) + 19110000;

            //把stock_id 放進來
            item.unshift(stokeCode);
            return item;
        });
        console.log(parsedData);

        let insertResult = await insertDataPromise(parsedData);
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

