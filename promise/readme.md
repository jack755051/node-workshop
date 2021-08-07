# Promise與async/await

Promise 是一個表示**非同步**運算的**最終**完成或失敗的物件。

- 非同步
- 物件 --> new Promise()
- 最終完成
- 最終失敗

>JS本身是同步語言遇到非同步的事件時,   
>就會將非同步的事件移動到程式碼的最後方,  
>等到所有的原始碼運行完以後才會執行非同步的事件。

Promise 本身是一個==建構函式==,函式屬於物件的一種,附加其它屬性方法。
- Promise.all
- Promise.race
- Promise.resolve
- Promise.reject

promise 建構一個new物件,可以使用其中的原型方法,
這些方法則必須在==新產生的物件==下才能呼叫。
- then
- catch
- finally

函式建立同時，必須傳入一個函式作為參數(executor function),
此函式的參數包含: 
- resolve
- reject


### promise 三種狀態
- 擱置（pending）：初始狀態，不是 fulfilled 與 rejected。
- 實現（fulfilled）：表示操作成功地完成。
- 拒絕（rejected）：表示操作失敗了。



---

## then/catch

用以取得成功或失敗的結果。

### Promise.then
然後做什麼是（兩個參數：第一個負責成功、第二個負責失敗）
會回傳一個 Promise

### Promise.catch
負責捕捉失敗
也會回傳 promise

### Promise.finally

### promise chain
以return回傳，並進入下一個then

## Async / Await

基於 promise 的語法糖

語法糖 -> 有一些繁瑣的寫法，或是每次都要這做
       --> 做成該程式語言內建的用法