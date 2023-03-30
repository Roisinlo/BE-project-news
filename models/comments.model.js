const db = require("../db/connection");

const removeComment = (comment_id) => {
    return db.query(`DELETE FROM comments
    WHERE comment_id = $1 
    RETURNING*`, [comment_id]
    ).then((result) => {
        if (result.rowCount === 0) {
          return Promise.reject({
            status: 404,
            msg: "status 404: Comment not found",
          });
        } 
      });
};

module.exports = { removeComment }