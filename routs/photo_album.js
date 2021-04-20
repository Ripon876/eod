var express       = require('express');
var app           = express();
var router        = express.Router();
var mongoose      = require("mongoose");
var User          = require("../models/user");
var fs            = require('fs');
var path          = require('path');


router.get("/photo_album/:id",function(req,res){
	var title = "EOD | Edit Photo Album"
	res.render("edit_photo_album",{title: title});
});









module.exports = router; 


function isLoggedIn(req,res,next){     // _____________________________________
	if(req.isAuthenticated()){        // |  this function used for preventing |  
		return next();               //  |  a logged out user to visite       |
	}else{                          //   |  the secreat pages                 |
		res.redirect("/");         //    |____________________________________|      
	}
}