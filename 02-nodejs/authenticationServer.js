/**
  You need to create a HTTP server in Node.js which will handle the logic of an authentication server.
  - Don't need to use any database to store the data.

  - Save the users and their signup/login data in an array in a variable
  - You can store the passwords in plain text (as is) in the variable for now

  The expected API endpoints are defined below,
  1. POST /signup - User Signup
    Description: Allows users to create an account. This should be stored in an array on the server, and a unique id should be generated for every new user that is added.
    Request Body: JSON object with username, password, firstName and lastName fields.
    Response: 201 Created if successful, or 400 Bad Request if the username already exists.
    Example: POST http://localhost:3000/signup

  2. POST /login - User Login
    Description: Gets user back their details like firstname, lastname and id
    Request Body: JSON object with username and password fields.
    Response: 200 OK with an authentication token in JSON format if successful, or 401 Unauthorized if the credentials are invalid.
    Example: POST http://localhost:3000/login

  3. GET /data - Fetch all user's names and ids from the server (Protected route)
    Description: Gets details of all users like firstname, lastname and id in an array format. Returned object should have a key called users which contains the list of all users with their email/firstname/lastname.
    The users username and password should be fetched from the headers and checked before the array is returned
    Response: 200 OK with the protected data in JSON format if the username and password in headers are valid, or 401 Unauthorized if the username and password are missing or invalid.
    Example: GET http://localhost:3000/data

  - For any other route not defined in the server return 404

  Testing the server - run `npm run test-authenticationServer` command in terminal
 */

const express = require("express")
const PORT = 3000;
const app = express();
// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server

var userData = [];
var autoId = 1;

app.use(express.json())
 
app.post('/signup', (req, res) => {
  const email = req.body.email || null;
  const password = req.body.password || null;
  const firstName = req.body.firstName || null;
  const lastName = req.body.lastName || null;
  if (!validateRequest(email, password, firstName, lastName)) { res.status(400).send('Bad Request'); return; }
  if (!getUserByEmail(email)) {
    const currentId = autoId++;
    userData.push({ id: currentId, email, password, firstName, lastName });
    res.status(201).send('Signup successful')
  }
  else {
    res.status(404).send('User Already Exist');
  }
})

app.post('/login', (req, res) => {
  const email = req.body.email || null;
  const password = req.body.password || null;
  validateRequest(email, password, "firstName", "lastName");
  const currentUser = getUserByEmail(email);
  if (currentUser) {
    if (currentUser.password === password) {
      const response = {
        id: currentUser.id,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email : currentUser.email,
        authToken: "tk_ijdfejwfi" 
      }
      res.status(200).json(response);
    }
    else
      res.status(401).send('Unauthorized');
  }
  else {
    res.status(404).send('User not found');
  }
})


// why are we not using authToken to login
app.get('/data', (req, res) => {
  const email = req.headers.email;
  const password = req.headers.password;
  const currentUser = getUserByEmail(email);
  if (currentUser.password !== password) {
    res.status(401).send('Unauthorized');
    return;
  }
  var response = [];
  userData.forEach((user) => {
    const currentUserDetail = {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      id: user.id
    }
    response.push(currentUserDetail);
  })
  res.status(200).json({ users: response })
})


function getUserByEmail(email) {
  const currentUser = userData.find((user) => {
    if (user.email === email)
      return true;
    return false;
  }) || null;
  return currentUser;
}

function validateRequest(email, password, firstName, lastName) {
  if (email && password && firstName && lastName) {
    return true;
  }
  return false;
}



// app.listen(PORT, () => {
//   console.log(`Example app listening on port ${PORT}`)
// })

module.exports = app;
