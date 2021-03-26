var dotenv        = require('dotenv').config();
var express       = require("express");
var passport      = require("passport");
var mongoose      = require("mongoose");
var User          = require("./models/user");
var localStrategy = require("passport-local");
var bodyParser    = require("body-parser");
var nodeMailer    = require("nodemailer");
var fs            = require('fs');
var path          = require('path');
var port          = process.env.PORT || 5000;

// database - configuration
mongoose.connect("mongodb://localhost:27017/eod", {useUnifiedTopology: true, useNewUrlParser: true});
mongoose.set('useFindAndModify', false);

// main - configuration

var app = express();
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));


// passport / authentication - configuration
app.use(require('express-session')({ secret: "My nafdgdfgfsd dfsh gdgh gfhfghon Islam",resave: false,saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// passport.serializeUser(function(user, cb) {
//   cb(null, user);
// });

// passport.deserializeUser(function(obj, cb) {
//   cb(null, obj);
// });





app.get("/",function(req,res){
	res.render("index");
});

app.get("/terms_conditions",function(req,res){
  res.render("term-conditions");
});
app.get("/advertise-with-us",function(req,res){
  res.render("advertise-with-us");
});


app.post("/sign-up",function(req,res){
   var user = {
   	email: req.body.email,
   	password: req.body.password
   }
   console.log(user);
});

// app.post("/register",function(req,res,next){
//   var Rtitle = "EOD| Home";
     
//     var email = req.body.email;

//    var name   = email.substring(0, email.lastIndexOf("@"));
       
//        console.log(name);


// 	var newUser = new User({username: name,email: req.body.email});
//       User.register(newUser,req.body.password,function(err,user){
//       	if(err){
//       		console.log(err);
//       		res.send("something went wrong...")
//       	}else{
//       		console.log(user);
//       		passport.authenticate("local",)(req,res,function(){
            
//             	fs.mkdir('public/uploads/' + req.user.username, function(err){
//               if (err) {
//                   console.log(err);
//                 };
//                 console.log("Directory is created.");
              
//                      });
            	
//             //  if (req.body.username == "ripon") {

//             //   var doAuthor = {isAdmin: true};
//             // User.findByIdAndUpdate(req.user._id,doAuthor,{new: true},function(err,user){
//             //        if (err) {
//             //         console.log(err);
//             //        }else{
//             //           console.log(user);
//             //           res.redirect("/admin");
//             //        };
//             //      });
//             //  }else{
//               res.send("successfully registered");
//              // };
             
//       		});
//       	};
//       });

// });


app.post("/register",function(req,res){
  var Rtitle = "EOD | HOME";

          // var email = req.body.email;

          // var username   = email.substring(0, email.lastIndexOf("@"));
       
          // console.log(name);

	var newUser = new User({username: req.body.username});
      User.register(newUser,req.body.password,function(err,user){
      	if(err){
      		console.log(err);
      		// res.render("index",{title: Rtitle})
      	}else{
      		console.log(user);
      		passport.authenticate("local")(req,res,function(){

      			var email = req.user.username;
             
               var folderName = email.substring(0, email.lastIndexOf("@"));

            	fs.mkdir(__dirname +'/' + 'public/uploads/' + folderName,function(err){
              if (err) {                                                           
                  console.log(err);                                                
                };                                                                 
                console.log("Directory is created.");                              
                                                                                   
                     });                                                           
        
              res.redirect("/");
             
             
      		});
      	};
      });


})



app.listen(port,function(){
	console.log(`server started at port ${port}`);
});