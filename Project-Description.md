# rest_api-mongo-p9
This is a REST API created with Node.js,Express,Mongo, and the Mongoose ORM. 

The API will provide a way for users to administer a school database containing information about courses: users will be able to interact with the database by retrieving a list of courses, as well as adding, updating and deleting courses in the database. 

In addition, the project will require users to create an account and log-in to make changes to the database. 

In order to have the best results for testing this REST API in postman do the following:

Step 1: Create a new user by going to POST localhost:5000/api/users, in the body create a new user by having the required fields made as shown on line 10 of models.js

Step 2: Authenticate the user you created by going to GET localhost:5000/api/users and try to login on POSTMAN  using the credentials for the user you created on the Authorization tab, choose Basic Auth

Step 3: After getting a message of successful authentication, you should now be able to  create, update, delete info about any courses you make  

