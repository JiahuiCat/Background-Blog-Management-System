var express = require("express");
var router = express.Router();
var markdown = require( "markdown" ).markdown;

var escapist = require('node-escapist');

// 数据表
var User = require("../models/User");
var Category = require("../models/Category");
var Content = require("../models/Content");

var data;

// 通用的数据
router.use(function(req,res,next){
    console.log(req.session);
    if(!req.session.userInfo){
        req.session.userInfo = null;
    }
    data = {
        userInfo:req.session.userInfo,
        categories:[]
    }
    Category.find().then(function(result){
        data.categories = result;
        next();
    })
})

router.get("/",function(req,res){
    data.category = req.query.category || "";
    var where = {};
    if(data.category){
        where.category =  data.category;
    }
    Content.where(where).find().then(function(contents){
        for(var key in contents){
            contents[key].description = markdown.toHTML(contents[key].description);
        }
        data.contents = contents;
        res.render("main/index",data);
    })
})

router.get("/view",function(req,res){
    var contentid = req.query.contentid;
    Content.findOne({
        _id:contentid
    }).then(function(result){
        result.description = markdown.toHTML(result.description);
        result.content = escapist.unescape(result.content);
        data.content = result;
        res.render("main/view",data);
    })
})

module.exports = router;