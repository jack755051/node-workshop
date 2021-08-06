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


let job1 = doWork("刷牙", 3000, true);
job1
  .then((result) => {
    console.log("第 1 個函式被呼叫了", result);
  })
  .catch((error) => {
    console.log("第 2 個函式被呼叫了", error);
  })
  .finally(()=>{
    console.log("完成");
  })

// job.then(()=>{處理成功}).catch(()=>{處理失敗});

let job2 = doWork("洗澡", 3000, false);
job2
  .then((result) => {
    console.log("第 1 個函式被呼叫了", result);
  })
  .catch((error) => {
    console.log("第 2 個函式被呼叫了", error);
  })
  .finally(()=>{
    console.log("完成");
  })