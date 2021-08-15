const express = require("express");

// 利用 express 建立了一個 express application
let app = express();

// HTTP Method: get, post, put, patch, delete
app.get("/", function (request, response, next) {
  response.send("Hello");
});
app.get("/about", function (request, response, next) {
    response.send("about");
  });


app.listen(3000, function () {
  console.log("我們的 web server 啟動了～");
});