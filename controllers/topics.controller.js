const { fetchTopic } = require("../models/topics.model");

const getTopics = (req, res, next) => {
  const { topics } = req.params;
  fetchTopic(topics)
    .then((topics) => {
      res.status(200).send({ topics: topics });
    })
    .catch((err) => {
      next(err);
    });
};



module.exports = { getTopics };
