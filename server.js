// 참조 : https://velopert.com/379

var express = require('express');
var app = express();
var bodyParser = require('body-parser'); // POST 데이터 처리
var session = require('express-session'); // 세션 관리, 쿠키 접근
var fs = require('fs');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

var server = app.listen(3000, function() {
    console.log('epxress server start');
});

app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(session({
    secret: '!secretkey#', // 쿠키 변조 방지를 위한 sign 값, 원하는 값 할당
    resave: false, // 세션을 언제나 저장할 지 정하는 값
    saveUninitialized: true // 
}));

var router = require('./router/main') (app);