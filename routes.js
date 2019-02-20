'use strict';

//Require modules
var express = require("express");
var router = express.Router();

//Require models from models.js
var Course = require("./models").Course
var User = require("./models").User


//---USER ROUTES


//GET /api/users 200
//This Route returns the currently authenticated user
router.get('/users', function (req, res) {
    res.json({response: "You sent me a GET request to return users"});
});


//POST /api/users 201
//This Route creates a user, sets the Location header to "/", and returns no content
router.post('/users', function (req, res) {
  res.json({
    response: "You sent me a POST request to create a user",
    body: req.body
   });
});


//---COURSE ROUTES


//GET /api/courses 200
//This Route returns a list of courses (including the user that owns each course)
router.get('/courses', function (req, res) {
  res.json({response: "You sent me a GET request to show the list of courses"});
});


//GET /api/courses/:id 200
//This Route returns a course (including the user that owns the course) for the provided course ID
router.get('/courses/:id', function (req, res) {
  res.json({
    response: "You sent me a GET request to return a course (including the user that owns the course)the course ID is: " + req.params.id
  });
});


//POST /api/courses 201
//This Route creates a course, sets the Location header to the URI for the course, and returns no content
router.post("/courses", function(req, res){
	res.json({
		response: "You sent me a POST request to create a course",
		courseId: req.params.courseID,
		body: req.body
	});
});


//PUT /api/courses/:id 204
//This course  updates a course and returns no content
router.put("/courses/:id", function (req, res) {
  res.json({
    response:"You sent me a PUT request to update a course, the updated course is:",
    courseID: req.params.id,
    body: req.body 
  })   
});


//DELETE /api/courses/:id 204 
// This route deletes a course and returns no content
router.delete("/courses/:id", function (req, res) {
  res.json({
    response:"You sent me a DELETE request to delete a course, the deleted course is:",
    courseID: req.params.id,
    body: req.body 
  })   
});
  




//export router in order to use it in app.js
module.exports = router