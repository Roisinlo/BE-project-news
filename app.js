const express = require("express");
const { getTopics } = require("./controllers/topics.controller");
const { getArticleById, getArticles, getComments, postComment } = require("./controllers/articles.controller");
const {
  handleCustomErrors,
  handlePSQLErrors
} = require("./controllers/errorhandler.controller");

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles/:articles_id", getArticleById);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getComments);

app.post("/api/articles/:article_id/comments", postComment)

app.use(handleCustomErrors);
app.use(handlePSQLErrors);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "status 404: Path not found" });
});

module.exports = app;
