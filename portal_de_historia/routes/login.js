const express = require('express');
var router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

router.get('/', (req, res) => {
  res.render('login', {
    title: 'Login - Portal de Histórias',
    mensagemErro: null
  });
});

router.post('/', async (req, res) => {
  console.log('REQ.BODY:', req.body);

  const { email, senha } = req.body;

  try {
    // Verifica se existe usuário com esse e-mail
    const usuario = await User.findOne({ email });
    if (!usuario) {
      return res.render('login', {
        title: 'Login - Portal de Histórias',
        mensagemErro: 'E-mail não cadastrado'
      });
    }

    console.log('Senha digitada:', req.body.senha);
    console.log('Usuário encontrado:', usuario);
    console.log('Senha armazenada (hash):', usuario?.senha);


    const senhaCorreta = await usuario.compararSenha(senha);
    if (!senhaCorreta) {
      return res.render('login', {
        title: 'Login - Portal de Histórias',
        mensagemErro: 'Senha incorreta'
      });
    }

    // Login bem-sucedido → cria sessão
    req.session.user = {
      id: usuario._id,
      nome: usuario.nome,
      usuario: usuario.usuario,
      FotoPerfil: usuario.fotoPerfil
    }

    res.redirect('/');
  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).render('login', {
      title: 'Login - Portal de Histórias',
      mensagemErro: 'Ocorreu um erro ao tentar fazer login. Tente novamente mais tarde.'
    });
  }
});

module.exports = router;