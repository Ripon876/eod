var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var visibility_Controler_Schema = new mongoose.Schema({
visibleToFrom: {
	userId:Number,
	visibleTo: Number,
	visibleFrom: Number
}


});

var Visibility_Controler = mongoose.model("Visibility_Controler",visibility_Controler_Schema);

module.exports = Visibility_Controler;