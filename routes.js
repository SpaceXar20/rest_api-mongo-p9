'use strict';

//Require modules
var express = require("express");
var router = express.Router();

//Require models from models.js
var Course = require("./models").Course
var User = require("./models").User


/*param () takes two parameters, name of route parameter  as a string and a callback
function, the callback will be executed when (id) is present,
the  id parameter takes a value from id*/
router.param("id", function(req,res,next,id){ 
	Course.findById(id, function(err, doc){ //load the course document by id
		if(err) return next(err); //if there is an error, pass it to the error handler
		if(!doc) { //if the document can't be found, return a 404 error to the client  
			err = new Error("Not Found");
			err.status = 404; //set status property on error object
			return next(err);
		}
		req.course = doc; //if it exists set it on request object, so it can be used in other middlewhere and route handlers that receive this request
		return next(); //call next to trigger next middlewhere
	});
});


//---USER ROUTES


//GET /api/users 200, THIS WORKS IN POSTMAN
//This Route returns the currently authenticated user
router.get('/users', function (req, res, next) {
    User.find({}) // call the find() on User model to get all results
          .exec(function(err, users){ //call exec() on the builder and pass in a callback function into it
            if(err) return next(err); //this handles any errors that may result from executing the query, by using next() and hand it to express's error handler 
            res.json(users);//if there are no errors, we can send results to client's request
          });
});


//POST /api/users 201, THIS WORKS IN POSTMAN
//This Route creates a user, sets the Location header to "/", and returns no content
router.post('/users', function (req, res, next) {
  var user = new User(req.body); //create a new user document from incoming json on the request.body
  user.save(function(err, user){ //call save() on user var and pass a callback function
    if(err) return next(err);  
    res.status(201); //respond with a 201 code to indicate to the client that a document was saved successfully
    res.json(user); //return document as json to client
  });
});


//---COURSE ROUTES


//GET /api/courses 200, THIS WORKS IN POSTMAN
//This Route returns a list of courses (including the user that owns each course)
  router.get('/courses', function (req, res, next) {
    Course.find({}) // call the find() on Course model to get all results
          .exec(function(err, courses){ //call exec() on the builder and pass in a callback function into it
            if(err) return next(err); //this handles any errors that may result from executing the query, by using next() and hand it to express's error handler 
            res.json(courses);//if there are no errors, we can send results to client's request
          });
});


//GET /api/courses/:id 200, THIS WORKS IN POSTMAN
//This Route returns a course (including the user that owns the course) for the provided course ID
router.get('/courses/:id', function (req, res,next) {
 res.json(req.course);
});


//POST /api/courses 201, THIS WORKS IN POSTMAN
//This Route creates a course, sets the Location header to the URI for the course, and returns no content
router.post("/courses", function(req, res, next){
	var course = new Course(req.body); //create a new course document from incoming json on the request.body
	course.save(function(err, course){ //call save() on course var and pass a callback function
		if(err) return next(err);
		res.status(201); //respond with a 201 code to indicate to the client that a document was saved successfully
		res.json(course); //return document as json to client
	});
});


//PUT /api/courses/:id 204, I tested with a course I created and call it web design, so it works on postman
//This course  updates a course and returns no content
router.put("/courses/:id", function (req, res, next) { //the param on line 12 pre-loads the course ID, allowing me to use it in this route 
  req.course.update(req.body, function(err, result){ //the update object will contain the properties and values we want to modify, which is req.body
    if(err) return next(err);
    res.status(204);
		res.json(result); //send the results in question document to the client
  })   
});


//DELETE /api/courses/:id 204 , I created some courses and I was able to delete many of them, this works
// This route deletes a course and returns no content
router.delete("/courses/:id", function (req, res, next) {
  req.course.remove(function(err){ //use mongoose's remove method on the req.course
  if(err) return next(err);
  })   
});
  




//export router in order to use it in app.js
module.exports = router