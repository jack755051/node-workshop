const axios = require ("axios");
const moment = require ("moment");
//讀取檔案
const fs = require("fs");

function firstCode(){
    return new Promise((resolve,reject)=>{
        fs.readFile("stock.txt","utf-8",(err,stokeCode)=>{
            if(err){
                reject(err)
            }else{
                resolve(stokeCode)
            }
        });
    })
}

function secondCode(stokeCode){
    return axios.get("https://www.twse.com.tw/exchangeReport/STOCK_DAY",{
        params:{
            response:"json",
            Date:moment().format("YYYYMMDD"),
            stockNo:stokeCode,
        },
    })
}

async function thirdCode(){
    try{
        const firstC = await firstCode();
        const secondC = await secondCode(firstC);
        // const [firstData, secondData] = await Promise.all([firstC, secondC])
        console.log(secondC.data.title);
    }
    catch(e){
        console.log(e)
    }
}

thirdCode();
