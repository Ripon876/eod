var dotenv        = require('dotenv').config();
var express       = require("express");
var passport      = require("passport");
var mongoose      = require("mongoose");
var flash         = require("connect-flash");
var User          = require("./models/user");
var localStrategy = require("passport-local");
var bodyParser    = require("body-parser");
var nodeMailer    = require("nodemailer");
const crypto      = require('crypto');
var fileUpload    = require('express-fileupload');
var stripe        = require("stripe")("sk_test_51IT6NiI7ttdO5TTg8MKrPjljs8s0U0AwoibgwXRaoEKlK2npxTpBvZuYS6lhQnoRhmWw0eDtovrlHr3TcyWjLSsA00aBEu8f2W");
var fs            = require('fs');
var path          = require('path');
var ejs           = require("ejs");
var port          = process.env.PORT || 5000;



// database - configuration
mongoose.connect("mongodb://localhost:27017/eod", {useUnifiedTopology: true, useNewUrlParser: true});
mongoose.set('useFindAndModify', false);

// main - configuration

var app = express();
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(flash());
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : path.join(__dirname,'tmp'),
}));


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
	res.render("index",{message: req.flash("success"),c_email: req.flash("mes-send")});
	
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

             // console.log(user.verificationId);

              var id = crypto.randomBytes(20).toString('hex');
        	  // user.verificationId = id;
	           var email = req.body.username;
             
                var sortname = email.substring(0, email.lastIndexOf("@"));

	var newUser = new User({username: req.body.username, verificationId:id, sortName:sortname});

      User.register(newUser,req.body.password,function(err,user){
      	if(err){
      		console.log(err);

      	}else{
      		console.log(user);
          user.personalInformation.email = email;
          user.save(function(err){
            if (err) {
              console.log(err);
            }
            console.log(user.personalInformation);
          })
      		passport.authenticate("local")(req,res,function(){
            
               

var email = req.body.username;
var sub = "Please verify your email";
var mes = `<h1><a href="http://localhost:5000/verify/${id}">Verify</a></h1>`;


// node mailer

var transporter = nodeMailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_ADDRESS,
    pass: process.env.GMAIL_PASSWORD
  }
});
// mdforhadhossain297@gmail.com
var mailOptions = {
  from: process.env.GMAIL_ADDRESS,
  to: email,
  subject: sub,
  text: mes
};

transporter.sendMail(mailOptions, function(error, info){

  if (error) {
    console.log(error);

  } else {
    console.log('Verification Email sent: ' + info.response);

  }
})
             

        	  console.log(user.verificationId);
            	var email = req.user.username;
             
                var userName = email.substring(0, email.lastIndexOf("@"));
   

            	fs.mkdir(__dirname +'/' + 'public/uploads/' + userName,function(err){
              if (err) {                                                           
                  console.log(err);                                                
                };                                                                 
                console.log("Directory is created.");                              
                                                                                   
                     });                                                           
              req.flash("success","true");
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

app.get("/verify/:verifyId",function(req,res){

var oneTimeId = req.params.verifyId;

var update = {
	verified:true,
	verificationId:""
}

User.findOneAndUpdate({verificationId: oneTimeId},update, {new: true}, function (err, user) {


    if (err){
        console.log(err);
        res.send("something went wrong");
    }
    else{
        if(user == null){
        	console.log(" nullllllllllllll");
        	res.send("something went wrong");
        }else {
        	 console.log("Original Doc : ",user);
        	 res.send("email verified successfully..");
        }

    	
       
    }


	
});
});

app.get("/profile",isLoggedIn,function(req,res){
	res.render('profile');
});


app.get("/edit-profile/:id",isLoggedIn,function(req,res){




User.findById(req.params.id,function(err,user){

  if (err) {
    console.log(err);
  }else{
  	  console.log(user); 
      console.log(user.personalInformation.firstName); 
      console.log(typeof(user.personalInformation.email)); 
      


      if (user.personalInformation.firstName == undefined ) {
             console.log("fill personal information");
         req.flash("fill_data","true");

        res.render("edit-profile",{currentUser: user,fill_data: req.flash("fill_data")});
      }else{
       res.render("edit-profile",{currentUser: user});
      }

     

  }

})



});
app.get("/c",function(req,res){
  res.render("personal-details")
})

app.post("/edit-profile/:id",isLoggedIn,function(req,res){
	// console.log(req.files);
	console.log(req.body);

var id = req.params.id;
var user = req.body.user;
console.log(user)
	

    
User.findByIdAndUpdate(id,user,{new:true},function(err,user){
  if(err){
    console.log(err);
  }else{
    res.redirect("/");
  }
});
});

// contact us routs
app.get("/contact-us",function(req,res){
   res.render("contact-us");
});
app.post("/contact-us",function(req,res){
    


var name = req.body.name;
var email = req.body.email;
var sub = req.body.subject;
var mes = req.body.message;
var message = {
	name: name,
	email:email,
	sub:sub,
	mes:mes
}

console.log(email, sub, mes)

// node mailer

var transporter = nodeMailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_ADDRESS,
    pass: process.env.GMAIL_PASSWORD
  }
});
// mdforhadhossain297@gmail.com


ejs.renderFile(__dirname + "/views/contact-email-template.ejs", { message: message}, function (err, data) {
if (err) {
	console.log(err)
}else {
	var mailOptions = {
  from: process.env.GMAIL_ADDRESS,
  to: email,
  subject: sub,
  html: data
};


transporter.sendMail(mailOptions, function(error, info){

  if (error) {
    console.log(error);

  } else {
    console.log('Verification Email sent: ' + info.response);
    req.flash("mes-send","true");
    res.redirect("/");

  };
});


};

});






});

// term and condition rout
app.get("/term-conditions",function(req,res){
   res.render("term-conditions");
});

// advertise with us route
app.get("/advertise-with-us",function(req,res){

   res.render("advertise-with-us");

});

// elite escorts only rout
app.get("/elite-escorts-only",function(req,res){
	User.find({},function(err,users){
        if(err){
        	console.log(err);
        }else {
        	res.render("elite-escorts-only",{users: users});
        }
	});
});


// stripe route
app.get("/s",function(req,res){

   res.render("stripe");

});
// Charge Route
app.post('/charge', (req, res) => {
  const amount = 2500;
  
  stripe.customers.create({
    email: req.body.stripeEmail,
    source: req.body.stripeToken
  })
  .then(customer => stripe.charges.create({
    amount,
    description: 'Simple User',
    currency: 'usd',
    customer: customer.id
  }))
  .then(charge => res.render('success'));
});


app.post('/edit-profile/photos/:id',isLoggedIn,(req, res) => {
    var id = req.params.id;

	  User.findById(id,function(err,user){

      var email = user.username;
      var folderName = email.substring(0,email.indexOf('@'))


      if (err) {
      	console.log(err);
      	res.redirect('/profile');
      }else {
      	
if(req.files !== null){





      if(req.files.profilePic){
      	console.log("profilePic");
        var profilePic = req.files.profilePic;
      	profilePic.name = "profile_pic.png";
      	var p = profilePic.name;
      	moveFile(req.files.profilePic,user,p)
      }
      if(req.files.gallary_1){
      	console.log("gallary_1")
        var gallary_1 = req.files.gallary_1;
      	gallary_1.name = "gallary_1.png";
      	var p = gallary_1.name;
      		moveFile(req.files.gallary_1,user,p)
      }
      if(req.files.gallary_2){
      	console.log("gallary_2")
        var gallary_2 = req.files.gallary_2;
      	gallary_2.name = "gallary_2.png";
      	var p = gallary_2.name;
      		moveFile(req.files.gallary_2,user,p)
      }
      if(req.files.gallary_2){
      	console.log("gallary_3")
        var gallary_3 = req.files.gallary_3;
      	gallary_3.name = "gallary_3.png";
      	var p = gallary_3.name;
      		moveFile(req.files.gallary_3,user,p)
      };
      
   }



   res.redirect("/edit-profile");
      };
   

	});



});

// update info rout
app.post("/update-info")




app.listen(port,function(){
	console.log(`server started at port ${port}`);
});






function isLoggedIn(req,res,next){   // 
	if(req.isAuthenticated()){       //   this function used for preventing   
		return next();               //   a logged out user to visite   
	}else{                           //   the secreat pages      
		res.redirect("/");           //          
	}
}


function moveFile(img,user,p){
	console.log(user);
	  var email = user.username;
      var folderName = email.substring(0,email.indexOf('@'))

	 img.mv(path.join(__dirname, 'public/uploads/' + folderName, p), function(err){

        if (err){
         console.log(err);
        }        
        console.log('File uploaded!');
    });
}


Object.prototype.isEmpty = function() {
    for(var key in this) {
        if(this.hasOwnProperty(key))
            return false;
    }
    return true;
}