function processStockData(stockCode,rawData){
    return rawData.map((item) => {
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
}

module.exports = {
    processStockData,
}