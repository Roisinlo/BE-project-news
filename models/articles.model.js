const db = require("../db/connection");

const fetchArticle = (articles_id) => {
  return db
    .query(
      `SELECT * 
    FROM articles 
    WHERE article_id = $1;`,
      [articles_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      } else {
        return result.rows;
      }
    });
};

const fetchOrderedArticles = () => {
  return db
    .query(
      `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, 
  COUNT (comments.comment_id) AS comment_count
  FROM articles 
  LEFT JOIN comments ON comments.article_id = articles.article_id
  GROUP BY articles.article_id
  ORDER BY created_at DESC`
    )
    .then((result) => {
      return result.rows;
    });
};

const fetchComments = (article_id) => {
  return db
    .query(
      `SELECT * FROM comments 
  WHERE article_id = $1 
  ORDER BY created_at DESC`,
      [article_id]
    )
    .then((result) => {
      return result.rows;
      })
    };

const checkIdExists = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
    });
};

module.exports = {
  fetchArticle,
  fetchOrderedArticles,
  fetchComments,
  checkIdExists,
};
