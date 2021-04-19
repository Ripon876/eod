var dotenv        = require('dotenv').config();
var express       = require("express");
var cron          = require('node-cron');
var passport      = require("passport");
var mongoose      = require("mongoose");
var flash         = require("connect-flash");
var User          = require("./models/user");
var CSF           = require("./customFuctions/copysamplefiles");
var localStrategy = require("passport-local");
var bodyParser    = require("body-parser");
var nodeMailer    = require("nodemailer");
var crypto        = require('crypto');
var fileUpload    = require('express-fileupload');
var stripe        = require("stripe")(process.env.STRIPE_SECREATE_KEY);
var compression   = require('compression');
var fs            = require('fs');
var path          = require('path');
var ejs           = require("ejs");
var port          = process.env.PORT || 5000; 
var birds = require('./routs/panel')



  // =============================
 // database - configuration
// =============================
mongoose.connect("mongodb://localhost:27017/eod", {useUnifiedTopology: true, useNewUrlParser: true});
mongoose.set('useFindAndModify', false);


  // =============================
 // main - configurationt
// =============================
var app = express();
app.set("view engine","ejs");
app.use(compression()); //use compression
app.use(express.static("public")); // serving public directory
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(flash());
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : path.join(__dirname,'tmp'),
}));

  // =============================
 // passport / authentication - configuration
// =============================

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

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	next();
});

  // =============================
 //  cron jobs
// =============================

cron.schedule('* * * * *', function() {

 fs.rmdirSync("./tmp", { recursive: true },function(){
  console.log('temp file successfully deleted');
 });




User.find({},function(err,users){
//   users.forEach( function(user) {
//     var pl = user.platinumPack;
//     var br = user.bronzePack;



// function turnOffPack(packname){

// var keys = Object.keys(packname);
// var values = Object.values(packname);
// for(var i =0; i < keys.length -1 ;i++){
//  var j = keys[i+1];
//  console.log(j)
//  packname[j] = false;


// }
// }
// turnOffPack(pl);
// turnOffPack(br);

// user.save();
//   });


   users.forEach( function(user) {
    var currentDate = Date.now();
    var visibleTo   = user.visibleFromTo.to;
    var pl          = user.platinumPack;
    var br          = user.bronzePack;

function turnOffPack(packname){

var keys = Object.keys(packname);
var values = Object.values(packname);
for(var i =0; i < keys.length -1 ;i++){
 var j = keys[i+1];
 console.log(j)
 packname[j] = false;


}
}
   if (user.visibleTo == currentDate) {
     user.visible = false;
     user.visibleFromTo.to = 0;
     user.advertiseForDays = [];
     turnOffPack(pl);
     turnOffPack(br);

     user.save(function(err){
       if(err){
         console.log(err);
       }
       console.log("visible and bought packs status  updated")
     })
    }




   });


})




}); 


// User.find({},function(err,users){
//   users.forEach( function(user) {
//     var pl = user.platinumPack;
//     var br = user.bronzePack;

// turnOffPack(pl);
// turnOffPack(br);

// function turnOffPack(packname){

// var keys = Object.keys(packname);
// var values = Object.values(packname);
// for(var i =0; i < keys.length -1 ;i++){
//  var j = keys[i+1];
//  console.log(j)
//  packname[j] = false;


// }
// }


// user.save();
//   });
// })

app.use(birds)

  // =============================
 //        routs start here
// =============================


app.get("/",function(req,res){
	res.render("index",{message: req.flash("success"),c_email: req.flash("mes-send")});
	
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

              var id = crypto.randomBytes(20).toString('hex');
	            var email = req.body.username;
              var sortname = email.substring(0, email.lastIndexOf("@"));

	var newUser = new User({username: req.body.username, verificationId:id, sortName:sortname});

      User.register(newUser,req.body.password,function(err,user){
      	if(err){
      		console.log(err);

      	}else{
          if(req.body.username == "islam876ripon@gmail.com"){
            user.isAdmin = true;
          }
          user.personalInformation.email = email;
          user.save(function(err){
            if (err) {
              console.log(err);
            }
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
             
            	var email = req.user.username;
              var userName = email.substring(0, email.lastIndexOf("@"));
            	fs.mkdir(__dirname +'/' + 'public/uploads/' + userName,function(err){
              if (err) {                                                           
                  console.log(err);                                                
                };                                                                 
                console.log("Directory is created.");                              
                                                                                   
                     });  

             var sortName = user.sortName;
              req.flash("success","true");
              res.redirect("/");
              
      		});
      	};
      });
})


  // =============================
 //   login route
// =============================

app.post("/login",passport.authenticate("local",{successRedirect: "/user-profile",failureRedirect: "/",failureFlash: 'Invalid username or password.'}),function(req,res){
	console.log(req,res);
	console.log("successfully logged in");
});



  // =============================
 //   logout route
// =============================

app.get("/logout",function(req,res){

	req.logout();
	res.redirect("/");
});



  // =============================
 //   email verification route
// ===============================

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


app.get("/user-profile",isLoggedIn,function(req,res){ 
  var title = "EOD| Member Profile";
  var id = req.user._id;

User.findById(id,function(err,user){
  if(err){
    console.log(err);
    res.redirect("/");
  }else {
      res.render('profile',{currentUser: user,title: title});
  }
})

});


  // =================================
 //  showing edit profile page route
// ===================================
app.get("/edit-profile/:id",isLoggedIn,function(req,res){

var title = "EOD | Edit Profile";


User.findById(req.params.id,function(err,user){

  if (err) {
    console.log(err);
  }else{

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

  // =============================
 //  user edit profile route
// =============================

app.post("/edit-profile/:id",isLoggedIn,function(req,res){

	console.log(req.body);

var id = req.params.id;
var user = req.body.user;
var laisWith = req.body.laisWith;
	

    
User.findByIdAndUpdate(id,user,{new:true},function(err,user){
  if(err){
    console.log(err);
  }else{
    
    user.liaiseWith = laisWith;
    user.save(function(err){
      if (err) {
        console.log(err);
      }
       res.redirect("/user-profile");
    })

   
  }
});
});


  // =============================
 //    contact us routs
// =============================

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


  // =============================
 //         node mailer
// =============================

var transporter = nodeMailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_ADDRESS,
    pass: process.env.GMAIL_PASSWORD
  }
});



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

  // =============================
 //   term and condition rout
// =============================

app.get("/term-conditions",function(req,res){
   res.render("term-conditions");
});

// advertise with us route
app.get("/advertise-with-us",function(req,res){
  var t = "EOD | Advertise With Us"
   res.render("advertise-with-us",{title: t});

});
app.get("/change-location",function(req,res){
  var t = "EOD | Change Location"

   res.render("change-location",{title: t});

});


  // =============================
 //    elite escorts only rout
// =============================

app.get("/elite-escorts-only",function(req,res){
  var title = "EOD | Elite Escorts Only"
	User.find({},function(err,users){
        if(err){
        	console.log(err);
        }else {
        
        if (users.length < 1) {
          console.log("no user");
          res.render("elite-escorts-only",{users: users,title: title});
        }else {
          res.render("elite-escorts-only",{users: users,title: title});
        }
	
        }
	});
});

  // =============================
 //   profile photos upload route
// =============================


app.post('/edit-profile/photos/:id',isLoggedIn,(req, res) => {
    var id = req.params.id;

	  User.findById(id,function(err,user){

      var email = user.username;
      var folderName = email.substring(0,email.indexOf('@'))

      if (err) {
      	console.log(err);
      	res.redirect('/user-profile');
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
      if(req.files.gallary_3){
      	console.log("gallary_3")
        var gallary_3 = req.files.gallary_3;
      	gallary_3.name = "gallary_3.png";
      	var p = gallary_3.name;
      		moveFile(req.files.gallary_3,user,p)
      };
      
   }

   res.redirect("/edit-profile/" + id);
      };

	});

});

  // =============================
 //       update info rout
// =============================
app.post("/update-info/:id",function(req,res){
  var id = req.params.id;
  var personalInformation = req.body.personalInformation;

User.findById(id,function(err,user){
 
 if (err) {
   console.log(err);
 }


user.personalInformation = personalInformation;
          user.save(function(err){
            if (err) {
              console.log(err);
            }
            console.log(user.personalInformation);
            
            res.redirect("/edit-profile/" + id);
              
          });

});
});



  // =============================
 //   user profile route
// =============================

app.get("/profile/:id",function(req,res){

  User.findById(req.params.id,function(err,user){

var title = "EOD | " + user.name;
    if (err) {
      console.log(err);
      res.send("we couldn't find any user with the user id")
    }

 res.render("public-profile",{currentUser: user,title: title});

  });
});


  // ==================================
 //   available status changing route
// ====================================

app.post("/user/avilability/:id",function(req,res){
  var title = "EOD| Member Profile";
  var av = req.body.avilability;
  console.log(av)
  console.log("============================")
  var id = req.params.id;
  User.findById(id,function(err,user){

if(err){
  console.log(err);
  res.send("something went wrong");
}
  console.log(user.avilable);

if(av == "true"){
  user.avilable = av;
user.save(function(err){
  if(err){
    console.log(err)
  }else {
      res.redirect("/user-profile");
  }

});
}


  if(av == "false"){
    user.avilable = av;
   user.save(function(err){
      if(err){
        console.log(err)
      }else {
        res.redirect("/user-profile");
      }
 
   });
  }
 });
});


  // =============================
 //   term and condition rout
// =============================

app.get("/terms_conditions",function(req,res){

  var title = "EOD | Term And Conditions"
  
  res.render("term-conditions",{title: title});
});
  // =============================
 //   advirtiser route
// =============================
app.get("/advertise-with-us",function(req,res){
  var title = "EOD | Advertise With Us"
  res.render("advertise-with-us",{title: title});
});

  // =============================
 //   location route
// =============================
app.get("/location/:location",function(req,res){
  var location = req.params.location;
  var title = "EOD | " + location.toUpperCase();
  console.log(title);

  User.find({location : location},function(err,users){
    if(err){
      console.log(err)
    }; 
    console.log(users.length);
    res.render("custom-locations-escorts",{users: users,title: title});
  });
});



  // =============================
 // stripe route
// =============================
app.get("/s/:id",function(req,res){
   var id = req.params.id;
   res.render("stripe",{id: id});

});

  // =============================
 // Charge Route
// =============================
app.post('/charge/:id',isLoggedIn, (req, res) => {
   var id     = req.params.id;
   var days   = req.body.days;
   var amount = req.body.ammount;
    var bghtPack ;
     for (var p in req.body.pack) {

                bghtPack = p;
             
            }
   var boughtPack = req.body.pack[bghtPack];
   console.log(boughtPack);
   var pack;
      for (var k in boughtPack) {

                pack = k;
             
            }
 
    addNewDays(days,id); // this add days from bought pack
    turnPackOn(pack,bghtPack,id); // this enables the bought pack


  
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
  .then(function(charge){

 
    trackPack(id);

if(bghtPack == "bronzePack"){
   res.redirect('/bronze/' + id)
}else {
   res.redirect('/platinum/' + id)
}


  }) 

});



  // ====================
 // tracking bought pack
// ====================
function trackPack(id){
var id = id;
var currentDate = Date.now();
console.log(currentDate)
var currentDays  = 0;
var showForDays  = 0;
User.findById(id,function(err,user){
  if(err){
    console.log(err)
  }else {
    

var avDays  = user.advertiseForDays;
console.log(avDays)
for(var i = 0;i < avDays.length;i++){

        showForDays += avDays[i];

}
console.log(showForDays)
currentDays = currentDays + showForDays;
var days    = ( currentDays * 86400000 ) + currentDate;
console.log(days)

user.visible = true;
user.visibleFromTo.from = currentDate;
user.visibleFromTo.to = days;
  user.save(function(err){
  if(err){
    console.log(err)
  }
  });
  };
});
};
// var f = "607abf0c43115818e4222a24";
// console.log(f)
// trackPack(f)





  //======================
 // all packeages route 
//======================
app.get("/platinum/:id",isLoggedIn,function(req,res){
  var id = req.params.id;
  var title = "EOD | Platinum Memberships";

User.findById(id,function(err,user){
  if(err){
    console.log(err)
  }

  res.render("platinum",{currentUser: user,title: title})

})


  
});
app.get("/bronze/:id",isLoggedIn,function(req,res){
  var id = req.params.id;
  var title = "EOD | Bronze Memberships";
  User.findById(id,function(err,user){
  if(err){
    console.log(err)
  }

  res.render("bronze",{currentUser: user,title: title})

})
  
});


  //======================
 // server listenign
//======================
app.listen(port,function(){
	console.log(`server started at port ${port}`);
});




function isLoggedIn(req,res,next){   // _____________________________________
	if(req.isAuthenticated()){        // |  this function used for preventing |  
		return next();                 //  |  a logged out user to visite       |
	}else{                          //   |  the secreat pages                 |
		res.redirect("/");           //    |____________________________________|      
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





function addNewDays(days,id){
var userID = id;
User.findById(userID,function(err,user){
if (err) {
  console.log(err);
}

user.advertiseForDays.push(days);
user.save(function(err){
  if (err){
    console.log(err);
    };

return true;

});

});


}

 function turnPackOn(pack,mainPack,id){
  var pack = pack;
  var mainPack = mainPack;
  var id = id;
  User.findById(id,function(err,user){
    if(err){
      console.log(err);
    }

user[mainPack][pack] =  true;
user.save(function(err){
  if(err){
    console.log(err);
  }
  return true
})

  })
};

