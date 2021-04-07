var express    = require("express");
var mongoose   = require("mongoose");
var fileUpload = require('express-fileupload');
var User       = require("../models/user");
var flash      = require("connect-flash");
var CSF        = require("../customFuctions/copysamplefiles");
var bodyParser = require("body-parser");
var fs         = require('fs');
var path       = require('path');
var passport      = require("passport");
var localStrategy = require("passport-local");
var ejs        = require("ejs");
var app        = express();
var router = express.Router();

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(flash());
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : path.join(__dirname,'tmp'),
}));


// authentication - configuration
app.use(require('express-session')({ secret: "My nafdgdfgfsd dfsh gdgh gfhfghon Islam",resave: false,saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

router.get("/edit-profile/:id",isLoggedIn,function(req,res){

var title = "EOD | Edit Profile";


User.findById(req.params.id,function(err,user){

  if (err) {
    console.log(err);
  }else{
  	  console.log(user); 
      console.log(user.personalInformation.firstName); 
      console.log(typeof(user.personalInformation.email)); 
      


      if (user.personalInformation.firstName == undefined ) {
             console.log("fill personal information");
         var reIn = true;

        res.render("edit-profile",{currentUser: user,fill_data: reIn,title: title});
      }else{
        var reIn = false;
       res.render("edit-profile",{currentUser: user,fill_data: reIn,title: title});
      }

     

  }

})

});




function isLoggedIn(req,res,next){     // _____________________________________
	if(req.isAuthenticated()){        // |  this function used for preventing |  
		return next();               //  |  a logged out user to visite       |
	}else{                          //   |  the secreat pages                 |
		res.redirect("/");         //    |____________________________________|      
	}
}




module.exports = router;
