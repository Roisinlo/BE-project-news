const { fetchArticle, fetchOrderedArticles } = require("../models/articles.model");

const getArticleById = (req, res, next) => {
  const { articles_id } = req.params;
  fetchArticle(articles_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

const getArticles = (req, res, next) => {
  fetchOrderedArticles()
  .then((articles) => {
    res.status(200).send({ articles });
  })
  .catch((err) => {
    next(err);
  })
}
module.exports = { getArticleById, getArticles };
