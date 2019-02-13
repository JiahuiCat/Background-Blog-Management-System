var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
    username:String,
    password:String,
    isAdmin:{
        type:Boolean,
        default:false
    }
});


module.exports = mongoose.model("User",userSchema);