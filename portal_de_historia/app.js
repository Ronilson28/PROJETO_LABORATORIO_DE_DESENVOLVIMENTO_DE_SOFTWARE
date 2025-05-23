require('dotenv').config(); // carrega .env

var createError = require('http-errors');
var express = require('express');
const expressLayouts = require('express-ejs-layouts');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session')
const mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var signUpRouter = require('./routes/sign_up');
var logoutRouter = require('./routes/logout');
var profileRouter = require('./routes/profile');
var app = express();

// view engine setup
app.use(expressLayouts);
app.set('layout', 'layout');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Conexão com MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Conectado ao MongoDB com sucesso!"))
  .catch((err) => console.error("❌ Erro ao conectar ao MongoDB:", err));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // True se estiver usando HTTPS
}));

app.use(express.urlencoded({ extended: true }));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para disponibilizar a sessão na view
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// Middleware para esconder o header em páginas específicas
app.use((req, res, next) => {
  const noHeaderPaths = ['/login', '/sign_up'];
  res.locals.showHeader = !noHeaderPaths.includes(req.path);
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/sign_up', signUpRouter);
app.use('/logout', logoutRouter);
app.use('/profile', profileRouter);

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
  res.render('error',  { title: 'Erro no sistema' });
});

module.exports = app;