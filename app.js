// import necessary node modules
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const dotenv = require('dotenv');
const session = require('express-session');
const nocache = require('nocache');
const twilio = require('twilio');
const notifier = require('node-notifier');
// const easyzoom = require('easyzoom');


// DB Connection Import
const db = require('./config/connection');

//Routes imports
const adminRouter = require('./routes/adminRoutes');
const usersRouter = require('./routes/usersRoutes');

//App initialization
const app = express();

//env configuration
dotenv.config();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout','layouts/userlayout')

// Initializing the Middilewares
app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
app.use(session({
  secret: process.env.SCERET,  
  resave: false,  
  saveUninitialized: true,  
  cookie: { secure: false , maxAge: 60*60*1000}  
}))
app.use(nocache());

//setting static paths
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, "public/admin-assets")));
app.use('/uploads',express.static(path.join(__dirname,'/uploads')))
// db connection initializing
db.connect();

// initializing the routes
app.use('/admin', adminRouter);
app.use('/', usersRouter);


// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
  
// });
// //                  404 handler  page



// app.use(function(req, res, next) {
//   res.status(404);
//   res.render('404');
  
// });


app.use(function(req, res, next) {
  res.status(404);
  res.render('404');
});

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
