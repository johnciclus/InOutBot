module.exports = function() {
  return function webhook(req, res) {
    res.status(200).send('hello world')
  };
};
