const express = require('express');
const hbs = require('hbs'); // mockup template套件
// 要watch hbs跟express檔案的話
// 不能只用nodemon server.js
// 要用 nodemon server.js -e js,hbs
// -e可讓我們提供要watch的檔案類型

const fs = require('fs');

// 把express叫出
const app = express();

// 利用hbs的.registerPartials() method
// 來定義要重複使用的partials所在位置
// partial是可重複使用的在template區塊的模組
hbs.registerPartials(`${__dirname}/views/partials`);

// .set method可以設置express在一些地方的運作
// 第一個參數為我們要設置的描述
// 第二個參數為我們要使用的方式的檔案類型
// express會尋找views底下的檔案
app.set('view engine', 'hbs');



// 一般我們自己的middleware要求三個參數
// request, response跟next
// next是可以告訴我們express middleware該停止的參數
// 這樣我們就可以新增多個express middleware
// 像是db的、觀測reponse時間的....等
// 只有在呼叫next()後，接下來的express .get()或其他handler
// 才會開始啟動，不然以下的handler never gonna fire
// 這樣的話我們到browser要求此網頁時
// 請求會一直持續，卻得不到東西
// 因為這個express middleware一直處於激活狀態
app.use((req, res, next) => {
    const now = new Date().toString();
    // 寫一些log，當請求網站時才會印出
    // req.method可返回請求的方法，例如 GET或POST
    // req.url可返回目前的path
    // console.log(`目前時間為 ${now} ${req.method} ${req.url}`);
    // 下面我們將log用fs寫入檔案server.log
    // '\n'是在新的log進來時進行換行
    const log = `目前時間: ${now} 請求方法: ${req.method} 請求的path: ${req.url}`;
    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
        if(err) console.log('Unabled to create server.log file');
    });
    next();// 結束後將進入server process
});

// 這樣將會讓畫面停在這邊(maintan mode)，除了public底下的檔案外
// 因為public是在第一個app.use中的express.static被serve的
// 下面的mantaince handler是無法影響他的
// 除非將之移到底下，在運行前先停止運行此handler底下的server process
// app.use((req, res, next) => {
//     res.render('maintance.hbs');
// });

// app.use可以讓我們定義express與middleware之間的運作
// 讓express可以稍微改變其既有的運作方式
// 讓他更符合我們的需求
// express.static 是一個middle function
// 且要求一個絕對路徑
// 此絕對路徑所提供的檔案夾將是我們將serve的檔案夾
// 注意喔是檔案夾
// 但由於是絕對路徑的關係，路徑為hard drive中的絕對路徑
// 例如C://....../../public/help.html這樣
// 麻煩的是當我們將檔案移動到別的位置時
// 幸運的是我們有__dirname變數可以使用
// __dirname是儲存我們project dirctory的path的
// 在node的所有環境變數中可找到 可以看第一個練習專案
app.use(express.static(`${__dirname}/public`));


// hbs.registerHelper() 要求兩個arguments
// 第一個argument為此helper的name
// 第二個argument為此helper的function
// 定義好後，可以在hbs檔案template中呼叫此helper
// 呼叫方式則是用名字呼叫
hbs.registerHelper(
    'getCurrentYear', 
    () => new Date().getFullYear()
);

hbs.registerHelper(
    'screamIt',// 換大寫
    text => text.toUpperCase()
)

// app.get()可以讓我們setup一個處理http request的handler
// 這個.get method接受兩個arguments, 第一個是path
// 第二個是一個call back function並有參數request跟response
// request儲存了像是header path 之類的information
// response儲存了一些method讓我們在http request後進行操作
// 像是設置status code或是客製化我們的data....等
// app.get('/', (req, res) => {
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
//     res.send({
//         name: 'Paul',
//         age: 27,
//         hobby: ['basket ball', 'design', 'music']
//     });
// });
app.get('/', (req, res) => {
    res.render('home.hbs', {
        pageTitle: 'Home Page',
        welcomeMsg: 'Hey welcome to this site',
    });
});

app.get('/about', (req, res) => {
    // .render method可以讓我們印出我們已設置的template
    // 因為express預設會進去views dir下找
    // 所以我們只需打上檔案名稱即可
    // 第二個參數則將會傳一些data進去template
    // 第二個參數只接收object
    // 就是傳prop過去啦
    res.render('about.hbs', { pageTitle: 'About Page' });
})
app.get('/source', (req, res) => {
    res.render('source.hbs', {
        pageTitle: 'Source Page',
        pageLink: "https://github.com/MaGuangChen/node-web-server-test"
    });
})
app.get('/bad', (req, res) => {
    res.send({ errorMessage: 'Sorry, we have some error!' });
})

// .listen() method會bind一個port到我們的機器
// 第二個參數是選項的，可以console一些成功運行的訊息之類的
// 因為要讓heroku或其他platform可以server檔案
// 我們要設置一個環境變數代表著port
// 我們可以在command line中運行env看到相關資訊
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`server is up on port ${port}`);
});