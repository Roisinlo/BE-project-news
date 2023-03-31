const db = require("../db/connection");

const fetchArticle = (articles_id, topic) => {
  if (topic) {
    return db
      .query(`SELECT * FROM articles WHERE topic = $1`, [topic])
      .then((result) => {
        return result.rows;
      });
  } else {
    return db
      .query(
        `SELECT * 
    FROM articles 
    WHERE article_id = $1;`,
        [articles_id]
      )
      .then((result) => {
        if (result.rows.length === 0) {
          return Promise.reject({
            status: 404,
            msg: "status 404: not found",
          });
        } else {
          console.log(result.rows)
          return result.rows;
        }
      });
  }
};

const fetchOrderedArticles = (topic, sort_by = 'created_at', order= 'desc') => {
  let selectArticlesQuery = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url,
    COUNT (comments.comment_id)::INT AS comment_count 
    FROM articles 
    LEFT JOIN comments 
    ON comments.article_id = articles.article_id`;
  const queryParams = [];

  if (topic) {
    selectArticlesQuery += ` WHERE articles.topic = $1`;
    queryParams.push(topic);
  }

selectArticlesQuery += ` GROUP BY articles.article_id`;

  if (sort_by) {
    selectArticlesQuery += ` ORDER BY ${sort_by}`;
  }

  selectArticlesQuery += ` ${order}`;

  return db.query(selectArticlesQuery, queryParams).then((result) => {
    // if(result.rows.length === 0){
    //   return Promise.reject({
    //     status: 404,
    //     msg: "status 404: not found",
    //   });
    // }
    return result.rows;
  });
}


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
    });
};

const checkExists = (article_id, topic) => {
  if(article_id){
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: "status 404: Article not found",
        });
      }
    }
    )
  }
  if(topic){
    return db
    .query(`SELECT * FROM topics WHERE slug = $1`, [topic])
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: "status 404: not found",
        });
      } 
    }
    )
  }
};

const insertComment = (body, username, article_id) => {
  if (body === "" || username === "") {
    return Promise.reject({
      status: 404,
      msg: "status 404: Article not found for this ID number",
    });
  } else {
    return db.query(
      `INSERT INTO comments (body, author, article_id) 
  VALUES ($1, $2, $3) RETURNING *`,
      [body, username, article_id]
    );
  }
};

const addVote = (article_id, inc_votes) => {
  return db
    .query(
      `UPDATE articles
   SET 
   votes = votes + $2
   WHERE article_id = $1
  RETURNING*`,
      [article_id, inc_votes]
    )
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: "status 404: Article not found",
        });
      } else {
        return result.rows[0];
      }
    });
};

module.exports = {
  fetchArticle,
  fetchOrderedArticles,
  fetchComments,
  checkExists,
  insertComment,
  addVote,
};

// if (
//   sort_by &&
//   sort_by !== "title" &&
//   sort_by !== "article_id" &&
//   sort_by !== "topic" &&
//   sort_by !== "article_img_url" &&
//   sort_by !== "author" &&
//   sort_by !== "votes" &&
//   sort_by !== "comment_count" &&
//   sort_by !== "created_at"
// ) {
//   return Promise.reject({ status: 400, msg: "Invalid query!" });
// }
// if (order && order !== "desc") {
//   return Promise.reject({ status: 400, msg: "Invalid query!" });
// }
