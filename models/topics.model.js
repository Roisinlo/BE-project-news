const db = require("../db/connection");

exports.fetchTopic = () => {
    return db.query(`SELECT * FROM topics;`).then(({ rows }) => rows);
};
