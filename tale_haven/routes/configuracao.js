var express = require('express');
const Autor = require('../models/Autor');
const Historia = require('../models/Historia');
const Genero = require('../models/Genero');
const Comentario = require('../models/Comentario');
const Interacao = require('../models/Interacao');
var router = express.Router();

router.get('/', async (req, res) => {  
  try {
    res.render('settings', {
      title: 'Configurações'
    });

  } catch (err) {
    console.error('Erro ao carregar as configurações:', err);
    res.status(500).render('index', {
      title: 'Tale Haven',
      mensagemErro: 'Erro ao carregar página inicial.'
    });
  }
});

module.exports = router;