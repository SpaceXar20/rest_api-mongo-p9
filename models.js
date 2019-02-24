//in this file I wil create the schema and model



//require packages
var mongoose = require('mongoose'), //require mongoose
 Schema = mongoose.Schema, //store schema constructor as a local variable
 bcrypt = require("bcryptjs"),
SALT_WORK_FACTOR = 10;

//***CREATE USER SCHEMA***
var UserSchema = new Schema({
  firstName: { type: String, required: true }, //require makes it so that the fields can't be left blank
  lastName: {type: String, required: true},
  emailAddress: {type: String, required: true},
  password: {type: String, required: true}      
});


// //Add a mongoose middleware that wil automatically hash the password before its saved to the database, I used a code snippet from https://stackoverflow.com/a/14595363/10043628 
// UserSchema.pre('save', function(next) {
//   var user = this;

//   // only hash the password if it has been modified (or is new)
//   if (!user.isModified('password')) return next();

//   // generate a salt
//   bcrypt.genSalt(SALT_WORK_FACTOR , function(err, salt) {
//       if (err) return next(err);

//       // hash the password using our new salt
//       bcrypt.hash(user.password, salt, function(err, hash) {
//           if (err) return next(err);

//           // override the cleartext password with the hashed one
//           user.password = hash;
//           next();
//       });
//   });
// })



//create the user model using Mongoose's model()
var User = mongoose.model("User", UserSchema);

//export Course model, require the Course model into the routes file
module.exports.User = User;



//***CREATE COURSE SCHEMA***
var CourseSchema = new Schema({
  user: {type: mongoose.Schema.Types.ObjectId, default: UserSchema._id}, // (_id from the users collection) , I used a code snippet fom here https://stackoverflow.com/a/31538204/10043628
  title:{type: String, required: true},
  description: {type: String, required: true},
  estimatedTime: String,
  materialsNeeded: String
});

//create the course model using using Mongoose's model()
var Course = mongoose.model("Course", CourseSchema);



//export Course model, require the Course model into the routes file
module.exports.Course = Course;

