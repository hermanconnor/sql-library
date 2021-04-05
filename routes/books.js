const express = require('express');
const router = express.Router();
const { Book } = require('../models');

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
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const books = await Book.findAll();
    res.render('books/index', { books, title: 'books' });
  })
);

/* GET create a new book form. */
router.get('/new', (req, res) => {
  res.render('books/new-book', { book: {}, title: 'Create New Book' });
});

/* POST a new book. */
router.post(
  '/new',
  asyncHandler(async (req, res) => {
    let book;
    try {
      book = await Book.create(req.body);
      res.redirect('/books');
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        book = await Book.build(req.body);
        res.render('books/new-book', {
          book,
          errors: error.errors,
          title: 'Create New Book',
        });
      } else {
        throw error;
      }
    }
  })
);

/* GET a single book. */
router.get(
  '/:id',
  asyncHandler(async (req, res, next) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      res.render('books/update-book', { book, title: 'Update Book' });
    } else {
      const err = new Error();
      err.status = 404;
      err.message = 'Page Not Found';
      next(err);
    }
  })
);

/* Update a book. */
router.post(
  '/:id',
  asyncHandler(async (req, res, next) => {
    let book;
    try {
      book = await Book.findByPk(req.params.id);
      if (book) {
        await book.update(req.body);
        res.redirect('/books');
      } else {
        const err = new Error();
        err.status = 404;
        err.message = 'Page Not Found';
        next(err);
      }
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        book = await Book.build(req.body);
        book.id = req.params.id;
        res.render('books/update-book', {
          book,
          errors: error.errors,
          title: 'Update Book',
        });
      } else {
        throw error;
      }
    }
  })
);

/* Delete a book. */
router.post(
  '/:id/delete',
  asyncHandler(async (req, res, next) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      await book.destroy();
      res.redirect('/books');
    } else {
      const err = new Error();
      err.status = 404;
      err.message = 'Page Not Found';
      next(err);
    }
  })
);

module.exports = router;
