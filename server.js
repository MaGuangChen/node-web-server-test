const express = require('express');

// 把express叫出
const app = express();

// 可以讓我們setup一個處理http request的handler
// 這個.get method接受兩個arguments, 第一個是path
// 第二個是一個call back function並有參數request跟response
// request儲存了像是header path 之類的information
// response儲存了一些method讓我們在http request後進行操作
// 像是設置status code或是客製化我們的data....等
app.get('/', (req, res) => {
    // .send() method
    // 可以在別人向我們發出http請求時，送出data
    // 送出的data會作為網頁body
    // express預設送出的為html
    // 所以我們如送出
    // res.send('Hello Express!');
    // 將會被視為p tag
    // 也可以直接送出html tag 或 json
    // res.send('<h1>Hello Express!</h1>');
    // 當我們.send會應請求一個js object時
    // express會自動將之傳換為json 檔案
    res.send({
        name: 'Paul',
        age: 27,
        hobby: ['basket ball', 'design', 'music']
    });
});

app.get('/about', (req, res) => {
    res.send('This is about page')
})

app.get('/bad', (req, res) => {
    res.send({ errorMessage: 'Sorry, we have some error!' });
})

// .listen() method會bind一個port到我們的機器
app.listen(3000);