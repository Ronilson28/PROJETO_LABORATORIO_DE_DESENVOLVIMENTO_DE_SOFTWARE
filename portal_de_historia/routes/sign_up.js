const express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

router.get('/', (req, res) => {
  res.render('sign_up', {
    title: 'Cadastre-se - Portal de Histórias',
    mensagemErro: null
  });
});

router.post('/', async (req, res) => {
  const { nome, usuario, email, confirmEmail, senha, confirmSenha, dataNascimento, preferenciasGenero, biografia } = req.body;

  // Validação de campos obrigatórios
  if (!nome || !email || !confirmEmail || !senha || !confirmSenha) {
    return res.render('sign_up', {
      title: 'Cadastre-se - Portal de Histórias',
      mensagemErro: 'Todos os campos são obrigatórios'
    });
  }

  // Validação de correspondência de e-mails
  if (email !== confirmEmail) {
    return res.render('sign_up', {
      title: 'Cadastre-se - Portal de Histórias',
      mensagemErro: 'Os e-mails não coincidem'
    });
  }

  // Validação de correspondência de senhas
  if (senha !== confirmSenha) {
    return res.render('sign_up', {
      title: 'Cadastre-se - Portal de Histórias',
      mensagemErro: 'As senhas não coincidem'
    });
  }

  // Validação de formato de e-mail (simples)
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.render('sign_up', {
      title: 'Cadastre-se - Portal de Histórias',
      mensagemErro: 'Formato de e-mail inválido'
    });
  }

  // Validação de força da senha (mínimo 8 caracteres)
  if (senha.length < 8) {
    return res.render('sign_up', {
      title: 'Cadastre-se - Portal de Histórias',
      mensagemErro: 'A senha deve ter pelo menos 8 caracteres'
    });
  }

  // Garante que preferenciasGenero seja um array
  let preferencias = [];

  if (preferenciasGenero) {
    if (Array.isArray(preferenciasGenero)) {
      preferencias = preferenciasGenero.map(str => str.trim());//.filter(str => str !== '');
    } else {
      preferencias = [preferenciasGenero.trim()]; // caso tenha só um
    }
  }

  try {
    const usuarioExistente = await User.findOne({ email });
    if (usuarioExistente) {
      return res.render('sign_up', {
        title: 'Cadastre-se - Portal de Histórias',
        mensagemErro: 'Este e-mail já está cadastrado.' });
    }

    const novoUsuario = new User({
      nome,
      usuario,
      email,
      senha,
      dataNascimento,
      tipo_usuario: 'comun',
      biografia,
      preferenciasGenero: preferencias,
    });

    await novoUsuario.save();

    console.log('✅ Usuário cadastrado:', novoUsuario);
    res.redirect('/login');
  } catch (err) {
    console.error('❌ Erro ao cadastrar usuário:', err);
    res.status(500).render('sign_up', {
      title: 'Cadastre-se - Portal de Histórias',
      mensagemErro: 'Erro interno ao processar o cadastro. Tente novamente mais tarde.'});
  }
});

module.exports = router;