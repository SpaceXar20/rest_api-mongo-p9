'use strict';

//Require packages
const bcryptjs = require('bcryptjs');
var express = require("express");
var router = express.Router();
const auth = require('basic-auth');

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
		req.course = doc; //if it exists set it on request object, so it can be used in other middle-where and route handlers that receive this request
		return next(); //call next to trigger next middle-where
	});
});





//This middle-where function will authenticate users
const authenticateUser = (req, res, next) => {
  let message = null;

  // Parse the user's credentials from the Authorization header.
  const credentials = auth(req);

  // If the user's credentials are available from the Authorization header...
  if (credentials) {
    console.log(credentials)
    // Attempt to retrieve the user from the data store
    // by their email (i.e. the user's "key"
    // from the Authorization header).
    const user = User.find({emailAddress: credentials.emailAddress}) 
      
    // If a user was successfully retrieved from the data store...
    if (user) {
      // Use the bcryptjs npm package to compare the user's password
      // (from the Authorization header) to the user's password
      // that was retrieved from the data store.
      const authenticated = bcryptjs
        .compareSync(credentials.pass, user.password);

      // If the passwords match...
      if (authenticated) {
        console.log(`Authentication successful for user: ${credentials.name} `);

        // Then store the retrieved user object on the request object
        // so any middleware functions that follow this middleware function
        // will have access to the user's information.
        req.currentUser = user;
      } else {
        message = `Authentication failure for user:  ${credentials.name} `;
      }
    } else {
      message = `User not found for email: ${credentials.name}`;
    }
  } else {
    message = 'Auth header not found';
  }

  // If user authentication failed...
  // Return a response with a 401 Unauthorized HTTP status code.
  if (message) {
    console.warn(message);

    // Return a response with a 401 Unauthorized HTTP status code.
    res.status(401).json({ message: 'Access Denied' });
  } else {
    // Or if user authentication succeeded...
    // Call the next() method.
    next();
  }
};


//---USER ROUTES


//GET /api/users 200, THIS WORKS IN POSTMAN
//This Route returns the currently authenticated user,     
router.get('/users', authenticateUser, (req, res) => {
  //within the route handler, the current authenticated user's information is retrieved from the Request object's currentUser property:
  const user = req.currentUser;
//we use the Response object's json() method to return the current user's information formatted as JSON:
  res.json({
    firstName: user.firstName
    
  });
});


//POST /api/users 201, THIS WORKS IN POSTMAN   
//This Route creates a user, sets the Location header to "/", and returns no content
router.post('/users',  (req, res, next) => {
  var user = new User(req.body); //create a new user document, and grab data for the user on request.body
  // Add the user to the `users` array.

  User.save(user, (err) => { //call save() on user to saved it to the database and pass a callback function
    if(err) return next(err); 
    res.location("/api/users"); //set location header
    res.status(201); //respond with a 201 code to indicate to the client that a document was saved successfully
    res.json(); //do not return anything on body
  });
});


//---COURSE ROUTES


//GET /api/courses 200, THIS WORKS IN POSTMAN
//This Route returns a list of courses (including the user that owns each course)
  router.get('/courses',  (req, res, next) => {
    Course.find({}) // call the find() on Course model to get all results
          .exec((err, courses) => { //call exec() on the builder and pass in a callback function into it
            if(err) return next(err); //this handles any errors that may result from executing the query, by using next() and hand it to express's error handler 
            res.json(courses);//if there are no errors, we can send results to client's request
          });
});


//GET /api/courses/:id 200, THIS WORKS IN POSTMAN
//This Route returns a course (including the user that owns the course) for the provided course ID
router.get('/courses/:id',  (req, res,next) => {
 res.json(req.course);
});



//POST /api/courses 201, THIS WORKS IN POSTMAN
//This Route creates a course, sets the Location header to the URI for the course, and returns no content
router.post("/courses", authenticateUser, (req, res, next) => {
	var course = new Course(req.body); //create a new course document from incoming json on the request.body
	course.save(function(err){ //call save() on course var and pass a callback function
    if(err) return next(err);
    res.location("/api/courses")
		res.status(201); //respond with a 201 code to indicate to the client that a document was saved successfully
		res.json(); //do not return anything on body
	});
});



//PUT /api/courses/:id 204, I tested with a course I created and call it web design, so it works on postman   
//This course  updates a course and returns no content
router.put("/courses/:id", authenticateUser, (req, res, next) => { //the param on line 12 pre-loads the course ID, allowing me to use it in this route 
  req.course.update(req.body, function(err){ //the update object will contain the properties and values we want to modify, which is req.body
    if(err) return next(err);
    res.status(204);
		res.json(); //send the results in question document to the client
  })   
});



//DELETE /api/courses/:id 204 , I created some courses and I was able to delete many of them, this works
// This route deletes a course and returns no content
router.delete("/courses/:id", authenticateUser, (req, res, next) => {
  req.course.remove(function(err){ //use mongoose's remove method on the req.course
  if(err) return next(err);
    res.json(); //do not return anything on body
  })   
});
  




//export router in order to use it in app.js
module.exports = router