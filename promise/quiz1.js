// 請問下列程式碼印出的順序為何？

function syncF() {
    console.log(1);
  
    setTimeout(() => {
      console.log(2);
    }, 0);
    console.log(3);
  }
  
  console.log(4);
  syncF();
  console.log(5);

// 順序：4->1->3->5->2
// 同步函數

// 因為syncF()為調用函示
// 故代碼從12行開始於14行結束
// console.log(4)進入stack
// 調用syncF()
// console.log(1)進入stack
// console.log(2)進入web
// console.log(3)進入stack
// 函式調用完畢
// console.log(5)進入stack
// event loop 偵測stack內無工作
// 將console.log(2) 帶入stack 執行