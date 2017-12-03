require("dotenv").config();

var express = require("express"),
app         = express(),
bodyParser  = require("body-parser"),
mongoose    = require("mongoose"),
seedDb      = require("./seeds"),
flash       = require("connect-flash"),
passport    = require("passport"),
LocalStrategy = require("passport-local"),
methodOverride = require("method-override");

mongoose.connect("mongodb://localhost/yelp_camp");

//seedDb(); //Seed Database

//Model imports
var Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    User        = require("./models/user");

//Require Routes
var commentRoutes       = require("./routes/comments"),
    campgroundRoutes    = require("./routes/campgrounds"),
    authRoutes          = require("./routes/index");

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());

//======================
//PASSPORT CONFIGURATION
//======================
app.use(require('express-session')({
    secret: "passport secret phrase",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Check User Login on every page
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.succes = req.flash("succes");
    next();
});

app.use(authRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds",campgroundRoutes);

//============
//SERVER START
//============
app.listen(process.env.PORT,process.env.IP,function(){
    console.log("YelpCamp Server Started");
});