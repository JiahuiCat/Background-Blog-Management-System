var express = require("express");
var router = express.Router();
var formidable = require("formidable");
var md5 = require("../function/md5");

// 数据表
var User = require("../models/User");
var Category = require("../models/Category");
var Content = require("../models/Content");
// Api 接口
// 根据自己项目不同需求，设计接口
// router.get("/login",function(req,res){
    
// })
// 注册功能


// 统一放回数据格式
var responseData;

router.use(function(req,res,next){
    responseData = {
        code:0, //为零，请求成功  1，2，3，4，5，6，7，8
        message:"" //信息提示
    };
    next();
})

// 1.用户名不能为空
// 2.密码不能为空
// 3.再次验证密码相同

// 数据库
// 用户名不能存在
// 更新数据库

router.post("/register",function(req,res){
    var form = new formidable.IncomingForm();

    form.parse(req,function(err,fields,files){
        if(err){
            throw new Error("错误信息");
        }

        var username = fields.username;
        var password = fields.password;
        var password2 = fields.password2;
        console.log(username);

        // 1.用户名不能为空
        if(username == ""){
            responseData.code = "1";
            responseData.message = "用户名不能为空";
            res.json(responseData);
            return;
        }

        // 密码不能为空
        if(password == ""){
            responseData.code = "2";
            responseData.message = "密码不能为空";
            res.json(responseData);
            return;
        }

        // 密码不能为空
        if(password != password2){
            responseData.code = "3";
            responseData.message = "两次输入密码不一致";
            res.json(responseData);
            return;
        }

        // 注册用户
        User.findOne({
            username:username
        }).then(function(userInfo){
            if(userInfo){
                //表示数据库有该数据
                responseData.code = "4";
                responseData.message = "用户名已被注册";
                res.json(responseData);
                return;
            }
            // 保存用户名
            var md5mima = md5(md5(password).substr(11,7) + md5(password));
            var user = new User({
                username:username,
                password:md5mima
            })
            return user.save();
        }).then(function(newUserInfo){
            responseData.message = "注册成功";
            res.json(responseData);
        })

    })
})


router.post("/login",function(req,res){
    var form = new formidable.IncomingForm();

    form.parse(req,function(err,fields,files){
        if(err){
            throw new Error("错误信息");
        }

        var username = fields.username;
        var password = fields.password;

        
        // 1.用户名不能为空
        if(username == ""){
            responseData.code = "1";
            responseData.message = "用户名不能为空";
            res.json(responseData);
            return;
        }

        // 密码不能为空
        if(password == ""){
            responseData.code = "2";
            responseData.message = "密码不能为空";
            res.json(responseData);
            return;
        }

        var md5mima = md5(md5(password).substr(11,7) + md5(password));
        // 登陆验证
        User.findOne({
            username:username,
            password:md5mima
        }).then(function(userInfo){
            if(!userInfo){
                //数据库没有数据
                responseData.code = "3";
                responseData.message = "用户名或密码错误";
                res.json(responseData);
                return;
            }
            // 用户名和密码正确

            req.session.login = "1";
            req.session.userInfo = userInfo;
            responseData.userInfo = {
                id:userInfo.id,
                username:userInfo.username,
                isAdmin:userInfo.isAdmin
            }
            res.json(responseData);
            return;
        })

    })
})


router.get("/out",function(req,res){
    req.session.login = "0";
    req.session.userInfo = null;
    res.json(responseData);
})


module.exports = router;