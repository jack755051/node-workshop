 
async function asyncF() {
    console.log(1);
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log(2);
        resolve();
      }, 0);
    });
    console.log(3);
  }
  
  console.log(4);
  asyncF();
  console.log(5);

  //順序 : 1->2->3->4->5
  //非同步函數

  //因為async / await 關係,會等到接收完回傳值後繼續函式運行