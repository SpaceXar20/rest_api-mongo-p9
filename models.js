//in this file I wil create the schema and model


//require packages
var mongoose = require('mongoose'), //require mongoose
  Schema = mongoose.Schema //store schema constructor as a local variable
 

//***CREATE USER SCHEMA***
var UserSchema = new Schema({
  firstName: { type: String, required: true }, //require makes it so that the fields can't be left blank
  lastName: {type: String, required: true},
  emailAddress: {type: String, required: true},
  password: {type: String, required: true}      
});

//create the user model using Mongoose's model()
var User = mongoose.model("User", UserSchema);

//export Course model, then require the Course model into the routes file
module.exports.User = User;



//***CREATE COURSE SCHEMA***
var CourseSchema = new Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}, // (_id from the users collection) by using population
  title: {type: String, required: true},
  description: {type: String, required: true},
  estimatedTime: String,
  materialsNeeded: String
});

//create the course model using using Mongoose's model()
var Course = mongoose.model("Course", CourseSchema);



//export Course model, then require the Course model into the routes file
module.exports.Course = Course;

