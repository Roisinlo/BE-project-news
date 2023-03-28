const { fetchArticle } = require("../models/articles.model");

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

module.exports = { getArticleById };
