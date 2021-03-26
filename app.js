var dotenv        = require('dotenv').config();
var express       = require("express");
var passport      = require("passport");
var mongoose      = require("mongoose");
var flash         = require("connect-flash");
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
app.use(flash());


// passport / authentication - configuration
app.use(require('express-session')({ secret: "My nafdgdfgfsd dfsh gdgh gfhfghon Islam",resave: false,saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());
passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	next();
})




app.get("/",function(req,res){
	res.render("index",{message: req.flash("success")});
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


app.post("/register",function(req,res){
  var Rtitle = "EOD | HOME";

 

	var newUser = new User({username: req.body.username});
      User.register(newUser,req.body.password,function(err,user){
      	if(err){
      		console.log(err);
      		// res.render("index",{title: Rtitle})
      	}else{
      		console.log(user);
      		passport.authenticate("local")(req,res,function(){

        		      
            	var email = req.user.username;
             
                var userName = email.substring(0, email.lastIndexOf("@"));
   

            	fs.mkdir(__dirname +'/' + 'public/uploads/' + userName,function(err){
              if (err) {                                                           
                  console.log(err);                                                
                };                                                                 
                console.log("Directory is created.");                              
                                                                                   
                     });                                                           
              req.flash("success","successfully signed up");
              res.redirect("/");
             
             
      		});
      	};
      });


})
app.get("/login",function(req,res){
	res.send("something went wrong...");
})

app.post("/login",passport.authenticate("local",{successRedirect: "/",failureRedirect: "/",failureFlash: 'Invalid username or password.'}),function(req,res){
	console.log(req,res);
	console.log("successfully logged in");
});

app.get("/logout",function(req,res){

	req.logout();
	res.redirect("/");
});

app.listen(port,function(){
	console.log(`server started at port ${port}`);
});