//?  routes that every user can access

const express = require("express");
let books = require("./booksdb.js");
const axios = require("axios");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

//* Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    res.status(400).send("Make sure to provide username & password");
  }
  if (!isValid(username)) {
    res.status(400).send(`user ${username} already exists`);
  }

  users.push({ username: username, password: password });
  res.status(200).send("User successfully registred");
});

//* Get the book list available in the shop
public_users.get("/", async function (req, res) {
  try {
    const response = await axios.get("url");
    res.status(200).send(JSON.stringify(response.data));
  } catch (err) {
    res.status(500).send("Error fetching books");
  }
});

//* Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get(`url/${isbn}`);
    res.status(200).send(JSON.stringify(response.data));
  } catch (err) {
    res.status(500).send("Error fetching books with isbn");
  }
});

//* Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  const author = req.params.author;
  try {
    const response = await axios.get(`url/${author}`);
    res.status(200).send(JSON.stringify(response.data));
  } catch (err) {
    res.status(500).send("Error fetching books with auther");
  }
});

//* Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  const title = req.params.title;
  try {
    const response = await axios.get(`url/${title}`);
    res.status(200).send(JSON.stringify(response.data));
  } catch (err) {
    res.status(500).send("Error fetching books with title");
  }
});

//*  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  let book = books[isbn];

  if (book) {
    res.status(200).send(JSON.stringify(book.reviews, null, 4));
  } else {
    res.status(404).send("Book Not Found");
  }
});

module.exports.general = public_users;
