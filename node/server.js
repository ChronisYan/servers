const express = require("express");
const helmet = require("helmet");
const MongoClient = require("mongodb").MongoClient;
const path = require("path");
const bodyParser = require("body-parser");
const { reset } = require("nodemon");

// express setup
const PORT = 4000;
const app = express();
const ApiRouter = express.Router();
app.use(helmet());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.get("/", (req, res) => {
  res.send({ msg: "Welcome!" });
});

// API Endpoints
app.use("/api", ApiRouter);

ApiRouter.get("/", (req, res) => {
  res.send({ msg: "API" });
});

ApiRouter.get("/posts", (req, res) => {
  let page = 0;
  if (parseInt(req.query.page) > 1) {
    page = (parseInt(req.query.page) - 1) * 10;
  }
  posts
    .find()
    .sort({ id: -1 }) // sort newest id first
    .limit(10) // send 10 posts per request
    .skip(page) // page option 10posts per page
    .toArray((err, data) => {
      if (err) return res.status(500).send({ err });

      res.send(data);
    });
});
ApiRouter.post("/posts", (req, res) => {
  res.send({});
});

ApiRouter.get("/posts/random", (req, res) => {
  const id = Math.floor(Math.random() * nPosts) + 1;

  posts.findOne({ id }, (err, data) => {
    if (err) return res.status(500).send({ err });
    if (!data) return res.status(202).send({ msg: "oops! Try again..." });
    return res.send(data);
  });
});

ApiRouter.get("/posts/:id", (req, res) => {
  const id = parseInt(req.params.id);
  posts.findOne({ id }, (err, data) => {
    if (err) return res.status(500).send({ err });
    if (!data)
      return res.status(404).send({ msg: `Post with id ${id} doesn't exist` });
    res.send(data);
  });
});
ApiRouter.patch("/posts/:id", (req, res) => {});
ApiRouter.delete("/posts/:id", (req, res) => {});

// mongoDB setup
const URL = "mongodb://127.0.0.1:27017";
const DB_NAME = "test";
let posts = [];
let nPosts = NaN;
MongoClient.connect(
  URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, client) => {
    if (err) return console.log("Unable to connect to the Database");

    // load quotes
    posts = client.db(DB_NAME).collection("posts");
    posts.countDocuments({}, (err, count) => {
      if (err) return console.log(err);
      nPosts = count;
    });
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  }
);
