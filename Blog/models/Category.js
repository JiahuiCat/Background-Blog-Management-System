
var mongoose = require("mongoose");

// 分类表结构
var categorySchema = new mongoose.Schema({
    name: String
})

categorySchema.static.finds = function(callback){
    this.model("Category").find({},function(err,doc){
        callback(doc);
    })
}

module.exports = mongoose.model("Category",categorySchema);