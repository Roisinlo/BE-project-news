const {
  fetchArticle,
  fetchOrderedArticles,
  fetchComments,
  checkIdExists,
} = require("../models/articles.model");

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
    });
};

const getComments = (req, res, next) => {
  const { article_id } = req.params;

  const commentsPromises = fetchComments(article_id);
  const checkIdPromise = checkIdExists(article_id);
  Promise.all([commentsPromises, checkIdPromise])
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};
module.exports = { getArticleById, getArticles, getComments };

