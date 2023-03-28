const db = require("../db/connection");

exports.fetchArticle = (articles_id) => {
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
