//in this file I wil create the schema and model

'use strict'

var mongoose = require('mongoose'); //require mongoose
var Schema = mongoose.Schema; //store schema constructor as a local variable


//Create User schema
var UserSchema = new Schema({
  firstName: { type: String, required: true }, //require makes it so that the fields can't be left blank
  lastName: {type: String, required: true},
  emailAddress: {type: String, required: true},
  password: {type: String, required: true}      
});

//create the user model using Mongoose's model()
var User = mongoose.model("User", UserSchema);


//create Course schema
var CourseSchema = new Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'UserSchema'}, // (_id from the users collection) , I used a code snippet fom here https://stackoverflow.com/a/31538204/10043628
  title:{type: String, required: true},
  description: {type: String, required: true},
  estimatedTime: String,
  materialsNeeded: String
});

//create the course model using using Mongoose's model()
var Course = mongoose.model("Course", CourseSchema);



//export Course model, require the Course model into the routes file
module.exports.Course = Course;

//export Course model, require the Course model into the routes file
module.exports.User = User;