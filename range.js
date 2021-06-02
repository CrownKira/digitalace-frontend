module.exports = (req, res, next) => {
  res.header('Access-Control-Expose-Headers', 'Content-Range');
  res.header('Content-Range', 'items 0-24/71');
  next();
};
