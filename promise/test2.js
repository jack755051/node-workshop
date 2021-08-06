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
  .then((resolve) => {
    console.log("first", resolve);
    return doWork("洗臉", 1000, true);
  })
  .then((resolve) => {
    console.log("first", resolve);  
    return doWork("吃早餐", 1000, true);
  })
  .catch((error) => {
    console.log("第 2 個函式被呼叫了", error);
  })
  .finally(()=>{
    console.log("完成");
  })