function verificarAutenticacao(req, res, next) {
  if (req.session && req.session.user && req.session.user.id) {
    next();
  } else {
    res.redirect('/login');
  }
}

module.exports = verificarAutenticacao;
