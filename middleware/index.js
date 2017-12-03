var middlewareObj = {};
var Campground = require("../models/campground");
var Comment = require("../models/comment");

middlewareObj.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        return next()
    } else{
        req.flash("error","You have to be logged in to do that.")
        res.redirect("/login");
    }
}

middlewareObj.isLoggedOut = function(req,res,next){
    if(req.user){
        req.flash("error","You're already logged in!")
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id,function(err,foundComment){
        if(err||!foundComment){
            req.flash("error","Comment not found.")
            res.redirect("/campgrounds/"+Campground._id);
        }else{
            //Is campground owned by user?
            console.log(foundComment)
            if(foundComment.author.id.equals(req.user._id)){
                next();
            } else {
                req.flash("error","You don't have permission to do that.");
                res.redirect("/campgrounds/"+Campground._id);
            }
        }
    });
    } else {
        req.flash("error","You need to be logged in to do that.")
        res.redirect("/login");
    }
}

middlewareObj.checkCampgroundOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id,function(err,foundCampground){
        if(err||!foundCampground){
            req.flash("error","Campground not found.")
            res.redirect("/campgrounds");
        }else{
            //Is campground owned by user?
            if(foundCampground.author.id.equals(req.user._id)){
                next();
            } else {
                req.flash("error","You don't have permission to do that.")
                res.redirect("back");
            }
        }
    });
    } else {
        req.flash("error","You have to be logged in to do that.")
        res.redirect("/login");
    }
}

module.exports = middlewareObj;