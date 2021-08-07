const axios = require ("axios");
const moment = require ("moment");
//讀取檔案
const fs = require("fs");
const { resolve } = require("path");
const { rejects } = require("assert");


new Promise((resolve,rejects)=>{
    fs.readFile("stock.txt","utf-8",(err,stokeCode)=>{
        if(err){
            rejects(err)
        }else{
            resolve(stokeCode)
        }
    })
})
.then((stokeCode)=>{
    return axios.get("https://www.twse.com.tw/exchangeReport/STOCK_DAY",{
        params:{
            response:"json",
            Date:moment().format("YYYYMMDD"),
            stockNo:stokeCode,
        },
    })
})
.then((response)=>{
    console.log(response.data.title);
})
.catch((err)=>{
    console.log(err);
})



// fs.readFile("stock.txt","utf-8",(err,stokeCode)=>{
//     axios
//     .get("https://www.twse.com.tw/exchangeReport/STOCK_DAY",{
//         params:{
//             response:"json",
//             Date:moment().format("YYYYMMDD"),
//             stockNo:stokeCode,
//         },
//     })
//     .then((response)=>{
//         console.log(response.data);
//     });
// });

// https://www.twse.com.tw/exchangeReport/STOCK_DAY?response=json&date=20210807&stockNo=2330