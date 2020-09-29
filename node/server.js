const express = require("express");
const helmet = require("helmet");
const MongoClient = require("mongodb").MongoClient;
const path = require("path");
const bodyParser = require("body-parser");

// express setup
const PORT = 4000;
const app = express();
app.use(helmet());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.get("/", (req, res) => {
  res.send({ msg: "Welcome!" });
});

// mongoDB setup
const URL = "mongodb://127.0.0.1:27017";
const DB_NAME = "test";
let quotes = [];
let topQuote = "";
MongoClient.connect(
  URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, client) => {
    if (err) return console.log("Unable to connect to the Database");

    // load quotes
    quotes = client.db(DB_NAME).collection("posts");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  }
);
