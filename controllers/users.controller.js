const { fetchUsers } = require("../models/users.model");

const getUsers = (req, res) => {
  fetchUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getUsers };
