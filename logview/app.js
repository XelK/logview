var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var basicAuth = require('express-basic-auth');

var indexRouter = require('./routes/index');


//var apiRouter = require('./routes/api');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');


// session usage
app.use(session({
	secret: "password",
	resave: false,
	saveUninitialized: false,
	maxAge: 3600000 //in millisecondi
}));


// basic auth
app.use(basicAuth({
	users: {'admin': 'pwm'},
	challenge: true,
	realm: 'Administrator',
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', express.static('public'));
app.use('/', indexRouter);
//app.use('/api', apiRouter); // routes for api requests



app.get('/api', function (req, res,next) {
  console.log("type: " + req.query["type"] +
              "\nfrom: " + req.query["from"] + 
              "\nto: "+req.query["to"]);
  res.send('Got a GET request at /api');
})

// app.post('/api', function (req, res) {
//   res.send('Got a POST request at /api')
// })
// app.put('/api', function (req, res) {
//   res.send('Got a PUT request at /api')
// })
// app.delete('/api', function (req, res) {
//   res.send('Got a DELETE request at /api')
// })





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
  res.render('error');
});

module.exports = app;


