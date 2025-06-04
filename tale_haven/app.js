require('dotenv').config(); // carrega '.env'

var createError = require('http-errors');
var express = require('express');
const expressLayouts = require('express-ejs-layouts');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session')
const mongoose = require('mongoose');

// Importação das rotas
var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var signUpRouter = require('./routes/sign_up');
var logoutRouter = require('./routes/logout');
var profileRouter = require('./routes/profile');
//var categoriaProfile = require('./routes/categoriaProfile');
var app = express();

// Configuração do mecanismo de visualização (EJS com layouts)
app.use(expressLayouts);
app.set('layout', 'layout');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Conexão com o Banco de Dados MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Conectado ao MongoDB com sucesso!"))
  .catch((err) => console.error("❌ Erro ao conectar ao MongoDB:", err));

// Configuração do middleware de sessão
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // True se estiver usando HTTPS
}));

// Middleware para processar requisições com dados codificados na URL
app.use(express.urlencoded({ extended: true }));

app.use(logger('dev')); // Middleware de logging
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); // Middleware para servir arquivos estáticos da pasta 'public'

// Middleware para tornar a sessão disponível para todas as views
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// Middleware para esconder o header em páginas específicas. Define quando o cabeçalho será exibido ou ocultado.
app.use((req, res, next) => {
  const noHeaderPaths = ['/login', '/sign_up'];
  res.locals.showHeader = !noHeaderPaths.includes(req.path);
  next();
});

// Registro das rotas principais
app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/sign_up', signUpRouter);
app.use('/logout', logoutRouter);
app.use('/profile', profileRouter);
//ape.use('/categorias', categoriaProfile);

// Middleware para capturar erros 404 (rota não encontrada)
app.use(function(req, res, next) {
  next(createError(404));
});

// Middleware de tratamento de erros
app.use(function(err, req, res, next) {
  // Define variáveis locais de erro, apenas no ambiente de desenvolvimento
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // Renderiza a página de erro
  res.status(err.status || 500);
  res.render('error',  { title: 'Erro no sistema' });
});

module.exports = app;