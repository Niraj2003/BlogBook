const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();
var isLogin = false;

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
            posts: posts,
            isLogin
        });
    });
});

app.get("/compose", function(req, res){
    res.render("compose", {isLogin});
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

const userSchma = {
    name : String,
    userid : String,
    email : String, 
    pass : String,
    passion : String
};

const Users = mongoose.model("Users", userSchma); 

app.get("/login", function(req,res){
    res.render("login");
});

var loggedUser = {
    name : "",
    email : "",
    passion : "",
    userid : ""
}

app.post("/login", function(req, res){
    Users.findOne({email : req.body.email}, function(err, foundUser){
        if(foundUser.pass == req.body.password){
            isLogin = true;
            loggedUser.name = foundUser.name;
            loggedUser.email = foundUser.email;
            loggedUser.passion = foundUser.passion;
            loggedUser.userid = foundUser.userid;
            console.log(loggedUser.name, loggedUser.email);
            res.render("temp", {message : "Login Successfully"});
        }
        else{
            res.send("Wrong ID and Password");
        }
    })
    
})

app.get("/register", function(req,res){
    res.render("register");
})

app.post("/register", function(req, res){
    const NewUser = new Users({
        name : req.body.name,
        userid : req.body.userid,
        email : req.body.email,
        pass : req.body.password,
        passion : req.body.passion
    });
        NewUser.save(function(err){
            if(!err){
                res.render("temp", {message: "Registered Successfully"});
            }
        });
})

app.get("/logout", function(req,res){
    if(isLogin) {
        isLogin = false;
        res.render("temp", {message: "User Logouted"});
    }
    else{
        res.render("temp", {message: "Login First"});
    }
});

app.get("/profile", function(req,res){
    if(isLogin){
        res.render("profile",{loggedUser});
    }
    else{
        res.render("temp", {message: "User Not Logged in"})
    }
})

app.listen(3000, function(){
    console.log("Server stated at 3000");
})
