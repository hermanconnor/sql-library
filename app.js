const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const booksRouter = require('./routes/books');
const { sequelize } = require('./models');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/books', booksRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error();
  err.status = 404;
  err.message = `Oops! The page you're looking for does not exist.`;
  next(err);
});

// Global Error Handler
app.use((err, req, res, next) => {
  if (err.status === 404) {
    res.status(404).render('page-not-found', { err, title: 'Page Not Found' });
  } else {
    err.message =
      err.message || `Uh Oh! There was an unexpected error on the server.`;
    // render the error page
    res.status(err.status || 500);
    res.render('error', { err, title: 'Page Not Found' });
    console.log(`${err.message} Status: ${err.status}`);
  }
});

// TEST DB CONNECTION
(async () => {
  await sequelize.sync();
  try {
    await sequelize.authenticate();
    console.log('Connection to the database successful!');
  } catch (error) {
    console.error('Error connecting to the database', error);
  }
})();

module.exports = app;
