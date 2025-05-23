var express = require('express');
const session = require('express-session');
const Historia = require('../models/Story');
var router = express.Router();

/* GET home page. */
router.get('/', async (req, res) => {
  console.log('Sessão atual:', req.session);
  try {
    const destaque = await Historia.findOne().sort({ dataCriacao: -1 }).populate('id_autor');

    const categorias = ['Ação', 'Fantasia', 'Ficção Científica', 'Mistério', 'Romance', 'Suspense', 'Terror'];
    
    const categoriasComHistorias = await Promise.all(
      categorias.map(async (cat) => {
        const historias = await Historia.find({ genero: cat }).limit(10).populate('id_autor');
        return { nome: cat, historias };
      })
    );

    res.render('index', {
      title: 'Portal de Histórias',
      destaque,
      categorias: categoriasComHistorias,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao carregar página inicial.");
  }
});

module.exports = router;
