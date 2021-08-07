const axios = require ("axios");
const moment = require ("moment");

// https://www.twse.com.tw/exchangeReport/STOCK_DAY?response=json&date=20210807&stockNo=2330
axios
    .get("https://www.twse.com.tw/exchangeReport/STOCK_DAY",{
        params:{
            response:"json",
            Date:moment().format("YYYYMMDD"),
            stockNo:"2330",
        },
    })
    .then((response)=>{
        console.log(response.data);
    })