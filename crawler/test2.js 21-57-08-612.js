let doWork = function (job, timer, isOK) {
    return new Promise((resolve, reject) => {
      // 模擬一個非同步工作
    console.log("in promise");
    setTimeout(() => {
    let dt = new Date();
    if (isOK) {
        resolve(`完成工作: ${job} at ${dt.toISOString()}`);
    } else {
        reject(`失敗了 ${job}`);
    }
    }, timer);
});
};

let dt = new Date();
console.log(`開始工作 at ${dt.toISOString()}`);

let job = doWork("刷牙", 1000, true);
job
  .then((result) => {
    console.log("second then", result);
    return doWork("洗臉", 1000, true);
  })
  .then((result) => {
    console.log("third then", result);  
    return doWork("吃早餐", 1000, true);
  })
  .then((result) => {
    console.log("forth then", result);  
    return doWork("放屁", 1000, false);
  })
  .then((result) => {
        console.log("fifth then", result);  
    return doWork("工作", 1000, false);
  })
  .catch((error) => {
    console.log("第 2 個函式被呼叫了", error);
  })
  .finally(()=>{
    console.log("回家睡覺");
  })