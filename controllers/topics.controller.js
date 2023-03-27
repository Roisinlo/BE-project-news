const { fetchTopic } = require("../models/topics.model");

exports.getTopics = (req, res, next) => {
    const { topics } = req.params;
    fetchTopic(topics)
    .then((topic) => {
        console.log(topic);
        res.status(200).send({ topics: topic })
    })
    .catch((err) => {
        next(err);
    });
};
