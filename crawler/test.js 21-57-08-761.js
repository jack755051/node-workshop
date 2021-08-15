let doWork = ((job,timer,isOk)=>{
    
})


let executor = (resolve,reject) =>{
    setTimeout(()=>{
        let dt = new Date();
        if(isOk){
            resolve(`work done: ${job} at ${dt.toDateString()}`);
        }else{
            reject(`false ${job}`);
        }
    },timer);

    return new Promise(executor);
};

let job1 = doWork("刷牙",3000,true);
// console.log(job1);
job1.then(
    (message)=>{`${message} -promise resolve`},
    ()=>{}
)
