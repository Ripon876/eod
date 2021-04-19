var express       = require('express');
var app           = express();
var router        = express.Router();
var mongoose      = require("mongoose");
var User          = require("../models/user");
var fs            = require('fs');
var path          = require('path');


router.get('/panel/user/ad/main/login',isLoggedIn, function (req, res) {

		  res.render("panel-login")

});

router.get('/panel/user/ad/main',isLoggedIn, function (req, res) {
 User.find({},function(err,users){
 	if(err){
 		console.log(err);
 	}
	if(req.user.isAdmin == true){
	  res.render("panel",{users: users})	
	}else {

	  res.redirect("/")
	}


 })

});

router.get("/delete_user/:id",isLoggedIn,function(req,res){

    User.findById(req.params.id,function(err,user){
    if (err) {
      console.log(err)
      res.redirect("/admin")
    }else{
      res.render("user_states",{user: user});
    };
  }); 
});

router.post("/admin/delete_user/:id",isLoggedIn,function(req,res){
  User.findById(req.params.id,function(err,user){
    if(err){
      console.log(err);
    }else{

if(user.isAdmin){
	   res.send("you can't delete admin");

}else {
	         fs.rmdir('public/uploads/' + user.sortName,function(){
             console.log("Directory Deleted");
         });
      
     

           User.findByIdAndRemove(user._id,function(err,user){
              if (err) {
                    console.log(err);
              }else{
                  console.log("successfully Deleted");
                  res.redirect("/panel/user/ad/main");
              };
            });
}
    };
  });

});
module.exports = router; 


function isLoggedIn(req,res,next){     // _____________________________________
	if(req.isAuthenticated()){        // |  this function used for preventing |  
		return next();               //  |  a logged out user to visite       |
	}else{                          //   |  the secreat pages                 |
		res.redirect("/");         //    |____________________________________|      
	}
}