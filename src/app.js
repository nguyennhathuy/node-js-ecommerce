const compression = require('compression');
const express = require('express');
const { default: helmet } = require('helmet');
const app = express();
const morgan = require('morgan');

//package khong the thieu (morgan)
//morgan la mot thu vien de in ra cac log cua 
//chung ta khi ma mot nguoi dung chay 1 request
//dev - trang thai
//combined - ip nguoi req -- time -- method
//common - ra nhat ky chung tieu chuan apache giong combined
//short - thong bao mac dinh ngan hon bao gom thoi gian phan hoi
//tiny - method + link req -- time

//helmet su dung y rang morgan
//la app middleware
//bao mat, khong cho nguoi khac biet minh su dung cong nghe gi de bao hiem
//ngan chan nhung trang thu 3 vao trang web cua chung ta


//compress
//khi mà chùng ta vận chuyển dữ liệu - payload, 
//khi gửi dữ liệu quá nhiều đến Mobile, web, ... 
//chúng ta gửi mấy mê thì sẽ tốn băng thông
//tốn cho người dùng và tốn cho chúng ta
//khi đó chúng ta dùng compress
//để giảm băng thông


//init middleWares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
//init DB

//init routes

app.get('/', (req, res, next) => {
    return res.status(200).json({
        message: 'Welcome Fantipjs'
    })
})

//handling error

module.exports = app;