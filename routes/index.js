var express = require('express');
var router = express.Router();
var { Book } = require('../models');

/* GET home page. */
router.get('/', async (req, res, next) => {
  const books = await Book.findAll();
  console.log(books.map((book) => book.toJSON()));
  res.render('index', { books, title: 'Books' });
});

module.exports = router;
