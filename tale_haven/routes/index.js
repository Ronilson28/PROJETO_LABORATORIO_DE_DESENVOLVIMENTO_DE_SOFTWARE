var express = require('express');
const session = require('express-session');
const Historia = require('../models/Historia');
var router = express.Router();

// Rota GET para a página inicial
// Exibe a história em destaque e as últimas 10 histórias de cada categoria
router.get('/', async (req, res) => {
  console.log('Sessão atual:', req.session);
  try {
    const destaque = await Historia.findOne().sort({ dataCriacao: -1 }).populate('id_autor');
    const categorias = ['Ação', 'Fantasia', 'Ficção Científica', 'Mistério', 'Romance', 'Suspense', 'Terror'];
    
    if (!destaque) {
      console.log('Nenhuma história encontrada para destaque.');
    } else {
      console.log('História em destaque:', destaque.titulo);
    }
    console.log('Categorias disponíveis:', categorias);
    
    // Busca as últimas 10 histórias de cada categoria
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
