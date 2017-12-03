//================
// COMMENTS ROUTES
//================ 
var express = require("express");
var router = express.Router({mergeParams:true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// function isLoggedIn(req,res,next){
//     if(req.isAuthenticated()){
//         return next()
//     } else{
//         res.redirect("/login");
//     }
// }

// function checkOwnership(req,res,next){
//     if(req.isAuthenticated()){
//         Comment.findById(req.params.comment_id,function(err,foundComment){
//         if(err){
//             console.log(err);
//             res.redirect("back");
//         }else{
//             //Is campground owned by user?
//             console.log(foundComment)
//             if(foundComment.author.id.equals(req.user._id)){
//                 next();
//             } else {
//                 console.log("This comment is not yours.")
//                 res.redirect("back");
//             }
//         }
//     });
//     } else {
//         res.redirect("back");
//     }
// }

//NEW
router.get("/new",middleware.isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new",{campground:campground});
        }
    });
});
//CREATE
router.post("/",middleware.isLoggedIn,function(req,res){
    //Find campground
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            Comment.findOne({text:req.body.comment["text"],author:req.body.username},function(err,existingComment){
                if(err){
                    console.log(err);
                }else if(existingComment){
                    console.log("comment already exists");
                } else if(!existingComment){
                    Comment.create({text:req.body.comment["text"],author:req.user.username},function(err,comment){
                    if(err){
                        console.log(err);
                    }else{
                        //add username+id
                        comment.author.id = req.user._id;
                        comment.author.username = req.user.username;
                        comment.save();
                                
                        campground.comments.push(comment);
                        campground.save();
                    }
                            // req.flash("error","This comment already exists")
                        })
                        res.redirect("/campgrounds/"+campground._id);
                        }
                    });
                }
            })
            // console.log(req.body.comment);
            // Comment.create({text:req.body.comment["text"],author:req.user.username},function(err,comment){
            //     if(err){
            //         console.log(err);
            //     }else{
            //         Comment.findById(comment._id,function(err,existingComment){
            //             if(err){
            //             console.log(err);
            //             } else if(existingComment){
            //                 console.log("comment already exists")
            //             } else{
            //                 //add username+id
            //                 comment.author.id = req.user._id;
            //                 comment.author.username = req.user.username;
            //                 comment.save();
                            
            //                 campground.comments.push(comment);
            //                 campground.save();
            //             }
            //             // req.flash("error","This comment already exists")
            //         })

            //         res.redirect("/campgrounds/"+campground._id);
            //     }
            // });
        // }
    // });
});

//Edit Route
router.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
    Comment.findById(req.params.comment_id,function(err,foundComment){
        if(err){
            console.log(err)
        }else{
            Campground.findById(req.params.id,function(err,foundCampground){
                if(err){
                    console.log(err);
                } else {
                    res.render("comments/edit",{comment:foundComment,campground:foundCampground});
                }
            })
            
        }
    })
})

//Update route
router.put("/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
        if(err){
            console.log(err);
            res.redirect("/campgrounds/"+req.params.id);
        }else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
})

//Destroy Route
router.delete("/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err){
            console.log(err);
        }
        req.flash("succes","Comment deleted.")
        res.redirect("/campgrounds/"+req.params.id);
    })
})

module.exports = router;