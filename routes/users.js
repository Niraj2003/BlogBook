const express = require("express");
const app = express();
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Post = require("../models/Post");
const { requireLogin } = require("../middleware");

router.get('/register', function(req,res){
  if(req.session.user_id) return res.render('temp', {message:"Already Logged in"});
  res.render('register');
})

router.post('/register',async function(req,res){
  const {name, userid, passion, email, password} = req.body;
  const hash = bcrypt.hashSync(password,10);
  const user = new User({name, userid, passion, email, hash});
  const previousUser = await User.findOne({email});
  if(previousUser) return res.render('temp',{message:"Email Already Exits"});
  await user.save();
  Post.find({},function(err,posts){
    res.render("home",{
        posts: posts, message:"New User Registered Successfully"
    });
  });
})

router.get('/login', function(req,res){
  if(req.session.user_id) return res.render('temp', {message:"Already Logged in"});
  res.render('login',{message:null});
})

router.post('/login', async function(req,res){
  const {email, password} = req.body;
  const user = await User.findOne({email});
  if(!user) return res.render('temp',{message:"User not found"});
  const isValid = await bcrypt.compare(password, user.pass);
  if(isValid){
      req.session.user_id = user._id;
      Post.find({},function(err,posts){
        res.render("home",{
            posts: posts, message:"Login Successfully"
        });
      });
  } 
  else{
    res.render('temp',{message:"Wrong Credentials"});
  }
})

router.get('/profile',requireLogin, async function(req,res){
  const user = await User.findById(req.session.user_id);
  res.render('profile',{loggedUser:user});
})

router.post('/logout', requireLogin, function(req,res){
  req.session.user_id = null;
  Post.find({},function(err,posts){
    res.render("home",{
        posts: posts, message:"User Logged Out"
    });
  });
})

router.get("/compose", requireLogin, async function(req, res){
  const user = await User.findById(req.session.user_id);
  res.render('compose',{loggedUser:user})
});

router.post('/compose', function(req, res) {
  const post = new Post({
    name: req.body.name,
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save(function(err) {
    if (!err) {
      console.log("Post Added");
      res.redirect("/");
    }
  });
});

module.exports = router;