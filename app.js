var dotenv        = require('dotenv').config();
var express       = require("express");
var mongoose      = require("mongoose");
var passport      = require("passport");
var localStrategy = require("passport-local");
var bodyParser    = require("body-parser");
var nodeMailer    = require("nodemailer");
var port          = process.env.PORT || 5000;

// database configuration
mongoose.connect("mongodb://localhost:27017/eod", {useUnifiedTopology: true, useNewUrlParser: true});
mongoose.set('useFindAndModify', false);

var app = express();
app.set("view engine","ejs");
app.use(express.static("public"));




app.get("/",function(req,res){
	res.render("index");
});

app.listen(port,function(){
	console.log(`server started at port ${port}`);
});