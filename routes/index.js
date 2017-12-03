var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var User = require("../models/user");
var passport = require("passport");
//======================
//ROUTES
//======================
//Landing
router.get("/",function(req,res){
    res.render("landing");
});



//================
// AUTH ROUTES
//================ 
router.get("/register",function(req,res){
    res.render("register");
});

//SIGNUP
router.post("/register",function(req,res){
    var newUser = new User({username:req.body.username});
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            console.log(err);
            return res.render("register",{error:err.message});
        }else{
            passport.authenticate("local")(req,res,function(){
                req.flash("succes","Welcome to YelpCamp"+user.username);
                res.redirect("/campgrounds");
            });
        }
    });
});
//Login Form
router.get("/login",function(req,res){
    res.render("login");
});

//Login Logic
router.post("/login",passport.authenticate("local",{
        successRedirect:"/campgrounds",
        failureRedirect:"/login"
    }), function(req,res){
    
});
//Logout
router.get("/logout",function(req,res){
    req.logout();
    req.flash("succes","You're now logged out!")
    res.redirect("back");
})

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next()
    } else{
        res.redirect("/login");
    }
}

module.exports = router;