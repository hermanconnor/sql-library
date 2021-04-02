var express = require('express');
var router = express.Router();
var { Book } = require('../models');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.redirect('/books');
});

module.exports = router;
