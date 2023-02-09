const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')

const app = express();

const homeStartingContent = "lll";

mongoose.connect("mongodb://127.0.0.1/blogDB", {useNewUrlParser: true});
mongoose.set('strictQuery', true);
app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const postSchema = {
    title: String,
    content : String
};

const Post = mongoose.model("Post", postSchema);

app.get('/', function(req,res){
    Post.find({},function(err,posts){
        res.render("home",{
            startingContent : homeStartingContent,
            posts: posts
        });
    });
});

app.get("/compose", function(req, res){
    res.render("compose");
});

app.post('/compose', function(req,res){
    const post = new Post({
        title : req.body.postTitle,
        content : req.body.postBody
    });

    post.save(function(err){
        if(!err){
            res.redirect("/");
        }
    });
});

app.get("/posts/:postId", function(req,res){
    const requestedPostId = req.params.postId;

    Post.findOne({_id:requestedPostId}, function(err,post){
        res.render("post",{
            title:post.title,
            content:post.content
        });
    });
});

app.listen(4000, function(){
    console.log("Server stated at 4000");
})
