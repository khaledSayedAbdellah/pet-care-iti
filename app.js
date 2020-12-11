var createError = require('http-errors');
var express = require('express');
var logger = require('morgan');

var cors = require('cors')


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var doctorsRouter = require('./routes/doctors');
var reervationRouter = require('./routes/reservation');
var serviceRouter = require('./routes/doctor_services');
var uploadRouter = require('./routes/upload_files');


var app = express();

app.use(cors())
app.use(logger('dev'));

app.use(express.urlencoded({extended: true}));
app.use(express.json());


app.use('/', indexRouter);
app.use('/images', express.static('upload/images'));
app.use('/api/users', usersRouter);
app.use('/api/doctors', doctorsRouter);
app.use('/api/reservations', reervationRouter);
app.use('/api/services', serviceRouter);
app.use('/files', uploadRouter);





//tempelete to use 
//************************************************* */
//************************************************* */

// router.route('/book')
//   .get(function (req, res) {
//     res.send('Get a random book')
//   })
//   .post(function (req, res) {
//     res.send('Add a book')
//   })
//   .put(function (req, res) {
//     res.send('Update the book')
//   })

//************************************************* */
//************************************************* */


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({
    status: false,
    message: err.message
  });
});

module.exports = app;
