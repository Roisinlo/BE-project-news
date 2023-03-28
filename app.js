const express = require("express");
const { getTopics } = require("./controllers/topics.controller");
const { getArticleById, getArticles, getComments } = require("./controllers/articles.controller");
const {
  handlePSQL400s,
  handleCustomErrors,
} = require("./controllers/errorhandler.controller");

const app = express();

app.get("/api/topics", getTopics);
app.get("/api/articles/:articles_id", getArticleById);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getComments);

app.use(handleCustomErrors);
app.use(handlePSQL400s);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
});

module.exports = app;
