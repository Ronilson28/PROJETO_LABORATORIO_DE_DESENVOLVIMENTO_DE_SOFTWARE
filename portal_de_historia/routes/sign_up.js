const express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
  res.render('sign_up', {
    title: 'Cadastre-se - Portal de Histórias',
    mensagemErro: null
  });
});

router.post('/', (req, res) => {
  const { nome, email, confirmEmail, senha, confirmSenha } = req.body;

  // Validação básica
  if (email !== confirmEmail || senha !== confirmSenha) {
    return res.render('sign_up', {
      mensagemErro: 'Os e-mails ou as senhas não coincidem. Tente novamente.'
    });
  }

  // Aqui você salvaria os dados no banco (ex: MongoDB, MySQL, etc)
  console.log('Usuário cadastrado:', req.body);

  // Redireciona para o login após cadastro
  res.redirect('login');
});

module.exports = router;