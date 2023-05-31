module.exports.requireLogin = (req,res,next) =>{
    if(!req.session.user_id){
        return res.render('login',{message:"You have to login first"});
    }
    next();
}