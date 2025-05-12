const express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
  res.render('login', {
    title: 'Login - Portal de Histórias',
    mensagemErro: null
  });
});

router.post('/', (req, res) => {
  const { usuario, senha } = req.body;

  if (usuario === '@womhyung' && senha === '1234') {
    res.redirect('/');
  } else {
    res.render('login', {
      title: 'Login - Portal de Histórias',
      mensagemErro: 'Usuário ou senha inválidos.'
    });
  }
});

module.exports = router;