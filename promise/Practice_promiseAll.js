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

let job1=doWork("刷牙", 1000, true);
let job2=doWork("洗臉", 1000, true);
let job3=doWork("吃早餐", 1000, true);
let job4=doWork("放屁", 1000, false);

let job=[{job1,job2,job3,job4}]

Promise.all(job)
    .then((result)=>{
        console.log(result);
}); 