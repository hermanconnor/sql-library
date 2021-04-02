var express = require('express');
var router = express.Router();
var { Book } = require('../models');

/* HANDLER FUNCTION TO WRAP EACH ROUTE */
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      // Forward error to the global error handler
      next(error);
    }
  };
}

/* GET books listing. */
router.get('/', (req, res) => {
  res.redirect('../views/books');
});

router.get(
  '/books',
  asyncHandler(async (req, res) => {
    const books = await Book.findAll();
    res.render('../views/books', { books, title: 'Books' });
  })
);

module.exports = router;
