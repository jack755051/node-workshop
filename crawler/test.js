    // 1. 讀 stock.txt 把股票代碼讀進來
    // 2. 去資料庫的 stock 表格查看看，這個代碼是不是在我們的服務範圍內
    // 3. 如果是，才去證交所抓資料
    // 4. 抓回來的資料存到資料庫的 stock_price 表格裡去

    const fs = require("fs/promises");
    const connection = require("./untiles/db");
    const axios = require("axios");

    (async () => {
        try{
        // 1. 讀 stock.txt 把股票代碼讀進來
        let stockCode = await fs.readFile("stock.txt" ,"utf8")
        // console.log(stockCode);

        // 2. 去資料庫的 stock 表格查看看，這個代碼是不是在我們的服務範圍內
        //connectAsync / queryAsync 均為 bluebird 提供作為 promise版本
        await connection.connectAsync();
        let dbResult = await connection.queryAsync(
            "SELECT * FROM stock WHERE stock_id = ?",
            [stockCode]
        );
        // console.log(dbResult);

        // 3. 如果是，才去證交所抓資料
        let response = await axios.get("https://www.twse.com.tw/exchangeReport/STOCK_DAY",{
            params:{
                response:"json",
                date:moment().format("YYYYMMDD"),
                stockNo: stockCode, // 長榮航空 2618  長榮航海王 2603
            },
        });
        
        }
        catch(e){
            console.error(e)
        }
        finally {
            //關閉連線
            connection.end()
        }

    })();

