const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchma = new Schema({
    name : String,
    userid : String,
    email : String, 
    pass : String,
    passion : String
});

module.exports = mongoose.model("Users", userSchma); 