var express = require("express");
var router = express.Router();
var formidable = require("formidable");
var md5 = require("../function/md5");
// node-escapist 转义 安全问题
var escapist = require('node-escapist');


// 数据表
var User = require("../models/User");
var Category = require("../models/Category");
var Content = require("../models/Content");

// 登陆页验证
router.post("/login",function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        if(err){
            throw new Error("登陆表单提交错误");
        }
        var username = fields.username;
        var password = fields.password;
        // md5加密
        var md5mima = md5(md5(password).substr(11,7) + md5(password));
        // 5yFK9LJOOYwjh9yZ6mJ2MA==     ==> 123123
        // 查找数据
        User.findOne({"username":username},function(err,result){
            // 密码配对
            if(result != null && md5mima == result.password && result.isAdmin === true){
                req.session.login = "1";
                req.session.users = result;
                req.session.username = result.username;
                res.render("admin/index",{userInfo:req.session.username});
            }else{
                res.render("admin/err",{err:"用户名或密码错误！！！",url:"/admin/login",date:4000});
            }
        })
        


    });
    
})
// 判断用户是否登陆方法
router.use(function(req,res,next){
    if(req.session.login == '1'){
        next();
    }else{  
        res.render("admin/login");
    }
})

// 后台首页
router.get("/",function(req,res){

    // 测试数据库是否可用，为user是表添加一条用户。后台登陆验证
    // var md5mima = md5(md5("123123").substr(11,7) + md5("123123"));
    // User.insertMany({"username":"admin","password":md5mima,"isAdmin":true},function(error, docs){
    //     console.log(docs);
    // })
    res.render("admin/index",{userInfo:req.session.username});
})
// 退出登陆
router.get("/out",function(req,res){
    req.session.login = "0";
    req.session.users = null;
    res.render("admin/login");
})


// 博客分类
router.get("/category",function(req,res){

    Category.find({},function(err,result){
        res.render("admin/category",{userInfo:req.session.username,result:result});
    })

})
// 博客分类添加页面
router.get("/category/add",function(req,res){
    res.render("admin/category_add",{userInfo:req.session.username});
})
// 博客分类添加页面
router.post("/category/add",function(req,res){
    var form = new formidable.IncomingForm();

    form.parse(req,function(err,fields,files){
        if(err){
            throw new Error("错误信息");
        }
        Category.insertMany({"name":fields.name},function(err,doc){
            if(err){
                throw new Error("分类添加失败");
            }
            res.render("admin/err",{err:"数据添加成功！！！",url:"/admin/category",date:4000});
        })
    })

})
// 博客分类删除功能
router.get("/category/del/:id",function(req,res){
    var id = req.params.id;
    Category.deleteOne({_id:id},function(err){ //null
        if(err){
            res.render("admin/err",{err:"数据删除失败！！！",url:"/admin/category",date:4000});
        }else{
            res.render("admin/err",{err:"数据删除成功！！！",url:"/admin/category",date:4000});
        }
    })
})

// 博客内容页
router.get("/content",function(req,res){

    // 数据库读取数据，遍历到页面中
    Content.find().then(function(result){
        res.render("admin/content",{userInfo:req.session.username,result:result})
    })

    
})

// 内容添加页面
router.get("/content/add",function(req,res){

    Category.find().sort({_id:-1}).then(function(categoryData){
        console.log(categoryData);
        res.render("admin/content_add",{
            userInfo:req.session.username,
            Datas:categoryData
        })
    })
    
})
// 内容数据提交
router.post("/content/add",function(req,res){
    var form = new formidable.IncomingForm();

    form.parse(req,function(err,fields,files){
        if(err){
            throw new Error("错误信息");
        }
        console.log(fields);

        // 数据添加数据库
        Content.insertMany({
            category:fields.category,
            content:escapist.escape(fields.content),
            description:fields.description,
            title:fields.title
        }).then(function(err){
            res.render("admin/err",{err:"数据添加成功！！！",url:"/admin/content",date:4000});
        })


    })
})

// 内容修改
router.get("/content/edit/:id",function(req,res){
    var id = req.params.id;
    var categories = [];
    Category.find().sort({_id:-1}).then(function(rs){
        categories = rs;
        return Content.findOne({_id:id}).populate("category");
    }).then(function(content){
        content.content = escapist.unescape(content.content);
        res.render("admin/content_edit",{userInfo:req.session.username,result:content,Datas:categories})
    })
})

// 内容修改
router.post("/content/edit",function(req,res){
    var form = new formidable.IncomingForm();

    form.parse(req,function(err,fields,files){
        if(err){
            throw new Error("错误信息");
        }
        var id = fields.id;
        Content.update({_id:id},{
            category: fields.category,
            title: fields.title,
            description: fields.description,
            content: escapist.escape(fields.content),
        }).then(function(){
            res.render("admin/err",{err:"数据修改成功！！！",url:"/admin/content",date:3000});
        })


    })  
})
// 内容删除
router.get("/content/del/:id",function(req,res){
    var id = req.params.id;
    Content.deleteOne({_id:id},function(err){ //null
        if(err){
            res.render("admin/err",{err:"数据删除失败！！！",url:"/admin/content",date:4000});
        }else{
            res.render("admin/err",{err:"数据删除成功！！！",url:"/admin/content",date:4000});
        }
    })
})

module.exports = router;