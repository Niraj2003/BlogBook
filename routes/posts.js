const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

router.get('/', function(req,res){
    Post.find({},function(err,posts){
        res.render("home",{
            posts: posts, message:null
        });
    });
});
  
router.get("/posts/:postId", function(req,res){
    const requestedPostId = req.params.postId;
    Post.findOne({_id:requestedPostId}, function(err,post){
        res.render("post",{
            name : post.name,
            title: post.title,
            content: post.content
        });
    });
});

module.exports = router;