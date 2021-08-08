
const axios = require ("axios");
const moment = require ("moment");
//讀取檔案
const fs = require("fs"); 
const mysql = require('mysql');
require('dotenv').config();

// function firstCode(){
//     return new Promise((resolve,reject)=>{
//         fs.readFile("stock.txt","utf-8",(err,stokeCode)=>{
//             if(err){
//                 reject(err)
//             }else{
//                 resolve(stokeCode)
//             }
//         });
//     })
// }

// function secondCode(stokeCode){
//     return axios.get("https://www.twse.com.tw/exchangeReport/STOCK_DAY",{
//         params:{
//             response:"json",
//             Date:moment().format("YYYYMMDD"),
//             stockNo:(stokeCode.trim()),
//         },
//     })
// }



// async function thirdCode(){
//     try{
//         const firstC = await firstCode();
//         const secondC = await secondCode(firstC);
//         // const [firstData, secondData] = await Promise.all([firstC, secondC])
//         console.log(secondC.data.title);
//     }
//     catch(e){   
//         console.log(e)
//     }
// }

// thirdCode();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port:process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

connection.connect((err) => {
if (err) {
    console.error("資料庫連不上");
}
});

// 不關閉連線，認為程式一直在執行
connection.end();