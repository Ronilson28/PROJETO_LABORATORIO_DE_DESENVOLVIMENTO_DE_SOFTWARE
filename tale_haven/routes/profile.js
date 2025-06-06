const express = require('express');
const router = express.Router();
const Autor = require('../models/Autor');
const Historia = require('../models/Historia');
const verificarAutenticacao = require('../middlewares/auth');

// Rota GET para exibir o perfil do autor
router.get('/', verificarAutenticacao, async (req, res) => {
  console.log('Sessão atual:', req.session); 
  try {
    const autor = await Autor.findById(req.session.autor.id).populate('historias');
    if (!autor) {
      return res.status(404).send("Autor não encontrado.");
    }
    res.render('profile', {
      title: 'Perfil de ' + req.session.autor.nome + ' - Portal de Histórias',
      autor,
      mensagemError: null
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao carregar o perfil.');
  }
});

// Rota GET - Formulário de edição de perfil
router.get('/editar', verificarAutenticacao, async (req, res) => {
  try {
    const autor = await Autor.findById(req.session.autor.id);
    if (!autor) {
      return res.status(404).send('Autor não encontrado.');
    }
    res.render('edit_profile', { 
      title: 'Editar Perfil - ' + autor.nome, 
      autor, 
      mensagemError: null 
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao carregar o formulário de edição.');
  }
});

// Rota POST - Processa edição de perfil
router.post('/editar', verificarAutenticacao, async (req, res) => {
  try {
    const { nome, usuario, biografia, twitter, instagram, facebook, sitePessoal, fotoPerfil } = req.body;

    const autor = await Autor.findById(req.session.autor.id);
    if (!autor) {
      return res.status(404).send('Autor não encontrado.');
    }
    
    if (fotoPerfil) {
      // Salvar a foto em um diretório e atualizar o caminho no banco de dados

      autor.fotoPerfil = fotoPerfil; // Atualiza o campo com a nova foto
    }

    // Atualiza os campos do autor
    autor.nome = nome || autor.nome;
    autor.usuario = usuario || autor.usuario;
    autor.biografia = biografia || autor.biografia;

    // Atualiza as redes sociais
    autor.redesSociais = {
      twitter,
      instagram,
      facebook,
      sitePessoal
    };

    await autor.save();

    res.redirect('/profile');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao atualizar perfil.');
  }
});

module.exports = router;