// var createError = require('http-errors');
// var express = require('express');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

// var app = express();

// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

// module.exports = app;

const session =require('express-session')
require('dotenv').config()
const express =require('express')
const mongoose = require('mongoose')
const path = require('path')

const app = express()
const PORT =process.env.PORT||7000

//database connection

mongoose.connect("mongodb://localhost:27017/labelleDB") 

.then(()=>{
  console.log('mongoDB connected');
})
.catch((err)=>{
  console.error("Error connecting mongoDB",err);
  
})

//middlewares
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(express.static(path.join(__dirname,'public')))

app.use(session({
  secret:"labellesecretkey",
  saveUninitialized:true,
  resave:false,
  cookie:{maxAge:1000*60*60},
 })
);

app.use((req,res,next)=>{
  res.locals.message = req.session.message;
  delete req.session.message;
  next()
});

app.get('/',(req,res)=>{
  res.render('user/home')
})

//set template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
//route prefix
app.use('/',require("./routes/users"))
app.use('/admin',require("./routes/admin"))

app.listen(PORT,()=>{
  console.log(`server starting at http://localhost:${PORT}`);
})