var express = require('express');
var app = express();
var router = express.Router();
var mongoose      = require("mongoose");
var User          = require("../models/user");


router.get('/panel/user/ad/main/login',isLoggedIn, function (req, res) {

		  res.render("panel-login")

});

router.get('/panel/user/ad/main',isLoggedIn, function (req, res) {
 console.log(req.user)
 User.find({},function(err,users){
 	if(err){
 		console.log(err);
 	}
	if(req.user.isAdmin  !== true){
		  res.redirect("/")
	}
res.render("panel",{users: users})

 })

});
module.exports = router; 


function isLoggedIn(req,res,next){     // _____________________________________
	if(req.isAuthenticated()){        // |  this function used for preventing |  
		return next();               //  |  a logged out user to visite       |
	}else{                          //   |  the secreat pages                 |
		res.redirect("/");         //    |____________________________________|      
	}
}