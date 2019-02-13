// 配置模块
// 加载模块
var express = require("express");
var ejs = require("ejs");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var session = require("express-session");


// 创建引用
var app = express();
// 静态文件
app.use(express.static("./public"));

// session配置
app.use(session({
    secret: 'keyboard cat',//验证 data+keyboard cat
    resave: false,
    saveUninitialized: true,
}))

// ejs模板配置把后缀名改html
app.engine("html",ejs.__express);
app.set("view engine","html");



//后台首页
app.use("/admin",require("./routers/admin"));
//前台首页
app.use("/",require("./routers/main"));
// Api
app.use("/api",require("./routers/Api"));
// bibiApi
// app.use("/bibiapi",require("./routers/bibiapi"));


// 数据库连接信息
mongoose.connect("mongodb://localhost:27017/blogCase", { useNewUrlParser: true },function(err){
    if(err){
        console.log("数据库连接失败");
    }else{
        app.listen("3000",()=>console.log("服务器开启成功,请访问:http://localhost:3000"));
    }
} );


