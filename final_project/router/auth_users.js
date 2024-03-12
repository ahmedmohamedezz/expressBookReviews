//? routes for authenticated users only

const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

//* Check if username is valid(unique) before registration
const isValid = (username) => {
  // returns true, if the provided username does not exist
  let matchedUser = users.filter((user) => user.username === username);
  if (matchedUser.length) {
    // repeated name => not valid
    return false;
  } else {
    // unique name => valid
    return true;
  }
};

//* chech that a user is registered before login
const authenticatedUser = (username, password) => {
  // returns true if found a match
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  if (validusers.length) {
    return true;
  } else {
    return false;
  }
};

//* only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Please provide username & password" });
  }

  if (authenticatedUser(username, password)) {
    accessToken = jwt.sign({ data: password }, "access", {
      expiresIn: 60 * 60,
    });

    req.session.authorization = {
      accessToken,
      username,
    };

    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({
      message: "Invalid Login. Check username and password",
    });
  }
});

//* Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization["username"];
  let book = books[isbn];

  if (!review) {
    res.status(400).send("Review is not provided");
  }

  if (!book) {
    res.status(400).send("Book Not Found");
  }

  book["reviews"][username] = review;
  res.status(200).send("Success");
});

//* Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization["username"];

  delete books[isbn]["reviews"][username];
  res.status(200).send("Review deleted successfully");
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
