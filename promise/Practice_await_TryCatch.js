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

async function doAllWorks(){
  try{
    let result1 = await doWork("刷牙", 1000, true);
    console.log(result1); 
    let result2 = await doWork("洗臉", 1000, true);
    console.log(result2);
    let result3 = await doWork("沖澡", 1000, false);
    console.log(result3);  
  }
  catch(err){
    console.log("第 2 個函式被呼叫了",err);  
  }
}

doAllWorks();

// let job1 = doWork("刷牙", 1000, true);
// job1
//   .then((result) => {
//     console.log("第 1 個函式被呼叫了", result);
//   })
//   .catch((error) => {
//     console.log("第 2 個函式被呼叫了", error);
//   })
//   .finally(()=>{
//     console.log("完成");
//   })

// // job.then(()=>{處理成功}).catch(()=>{處理失敗});

// let job2 = doWork("洗澡", 1000, false);
// job2
//   .then((result) => {
//     console.log("第 1 個函式被呼叫了", result);
//   })
//   .catch((error) => {
//     console.log("第 2 個函式被呼叫了", error);
//   })
//   .finally(()=>{
//     console.log("完成");
//   })