const handlePSQL400s = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "status 400: Invalid article ID" });
  } else if (err.code === "23502") {
    res.status(400).send({ msg: "status 400: invalid request, missing information" });
  } else {
    next(err);
   }
};

const handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

const error500s = (err, req, res, next) => {
  console.log(err);
  res.status(500).send('Server Error!');
};

module.exports = { handlePSQL400s, handleCustomErrors };
