const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

mongoose.connect(process.env.DATABASE, {useNewUrlParser: true});

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const postSchema = {
    name : String,
    title: String,
    content : String
};

const Post = mongoose.model("Post", postSchema);

app.get('/', function(req,res){
    Post.find({},function(err,posts){
        res.render("home",{
            posts: posts
        });
    });
});

app.get("/compose", function(req, res){
    res.render("compose");
});

app.post('/compose', function(req,res){
    const post = new Post({
        name : req.body.name,
        title : req.body.postTitle,
        content : req.body.postBody
    });

    post.save(function(err){
        if(!err){
            console.log("Post Added");
            res.redirect("/");
        }
    });
});

app.get("/posts/:postId", function(req,res){
    const requestedPostId = req.params.postId;

    Post.findOne({_id:requestedPostId}, function(err,post){
        res.render("post",{
            name : post.name,
            title: post.title,
            content: post.content
        });
    });
});

app.listen(3000, function(){
    console.log("Server stated at 3000");
})
