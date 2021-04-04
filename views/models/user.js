var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    name: String,
    username: String,
    password: String,
    sortName: String,
    age: Number,
    hairColour: String,
    cupSize: String,
    dressSize: String,
    eyeColour: String,
    height: String,
    nationality: String,
    location: String,
    area: String,
    inCall: String,
    outCall: String,
    hour: String,
    liaiseWith:[{ type: String }],
    thingCan: String,
    about: String,
    email: String,
    phoneNumber: Number,
    websiteUrl: String,
    PreferredContactMethod: String,
    avilable: { type: Boolean, default: false },
    instagramUrl: String,
    followMe: String,
    isUser: { type: Boolean, default: true },
    isAdmin: { type: Boolean, default: false },
    verified: { type: Boolean, default: false },
    verificationId:String,
    bronzeMember:{ type: Boolean, default: false },
    premiumMember:{ type: Boolean, default: false },
    eliteMember:{ type: Boolean, default: false },
    personalInformation:{
        firstName: { type: String },
        lastName: { type: String },
        address: { type: String },
        contactNumber: { type: String },
        email: { type: String },
        birthDate:{type: Date},
        
    }
});

userSchema.plugin(passportLocalMongoose);

var User = mongoose.model("User",userSchema);

module.exports = User;