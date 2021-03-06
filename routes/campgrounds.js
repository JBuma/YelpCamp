var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");
const { cloudinary, upload } = require('../middleware/cloudinary');
const NodeGeocoder = require('node-geocoder');
const options = {
  provider: 'google'
};
const geocoder = NodeGeocoder(options);

//======================
//CAMPGROUND ROUTES
//======================

//INDEX
router.get("/",function(req,res){
    // console.log(req.user);
    //Find Campgrounds
    Campground.find({},function(err,campgrounds){
        if(err){
            console.log(err);
        } else {
            res.render('campgrounds/index',{campgrounds,campgrounds, currentUser:req.user});
        }
    });
});

//CREATE
router.post("/",middleware.isLoggedIn, upload.single("image"), async (req, res) => {
    if(!req.file){
        req.flash("error","Please upload an image.");
        return res.redirect("back");
    }
    
    try {
       var name = req.body.name;
       var price = req.body.price;
    //   var image = req.body.formImage;
       var description = req.body.description;
       var author = {
           id: req.user._id,
           username: req.user.username
       };
       var result = await cloudinary.uploader.upload(req.file.path);
       var image = result.secure_url;
       var newCampground = {name: name, image: image, price:price, description:description, author:author};
       
      Campground.findOne({name:newCampground.name},function(err,existingCampground){
          if(err){
              console.log(err);
          }else if(existingCampground&&(newCampground.name&&existingCampground.price===newCampground.price&&existingCampground.description===newCampground.description)){
              console.log("CAMPGROUND ALREADY EXISTS")
                //   res.redirect("/campgrounds");
          } else {
              console.log("campground created");
              Campground.create(newCampground)
          }
      })
        // await Campground.create(newCampground);
    } catch (err){
            console.log(err);
    }
    res.redirect("/campgrounds");
});

//NEW
router.get("/new",middleware.isLoggedIn,function(req, res) {
    res.render("campgrounds/new.ejs");
});

//SHOW
router.get("/:id",function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
       if(err) {
           console.log(err);
       }else{
        //   console.log(foundCampground);
           res.render("campgrounds/show",{campground:foundCampground});
       }
    });
});

//Update/Edit
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
        Campground.findById(req.params.id,function(err,foundCampground){
                res.render("campgrounds/edit",{campground:foundCampground});
        });
});
//Put
router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
    console.log("PUT RECEIVED")
    Campground.findByIdAndUpdate(req.params.id, req.body.camp, function(err,updatedCampground){
        if(err){
            console.log(err);
        } else {
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
})

//Destroy
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err){
            console.log(err)
        }else{
            res.redirect("/campgrounds");
        }
    })
})

module.exports = router;