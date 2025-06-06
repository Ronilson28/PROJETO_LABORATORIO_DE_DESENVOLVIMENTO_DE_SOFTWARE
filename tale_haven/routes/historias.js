const express = require('express');
const router = express.Router();
const Autor = require('../models/Autor');
const Historia = require('../models/Historia');
const verificarAutenticacao = require('../middlewares/auth');

// Visualização da História
router.get('/:id/ler', async (req, res) => {
  try {
    const historia = await Historia.findById(req.params.id).populate('id_autor');
    
    if (!historia) {
      return res.status(404).render('error', { message: 'História não encontrada.' });
    }

    const origem = req.query.from || 'index';

    res.render('ler_historia',{
      title: historia.titulo,
      historia,
      origem
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { message: 'Erro ao carregar a história.' });
  }
});

// GET /historias/nova-historia
router.get('/nova-historia', verificarAutenticacao, (req, res) => {
  res.render('nova_historia', {
    title: 'Criar Nova História',
    mensagemErro: null,
  });
});

// Criar nova história (POST /historias/nova-historia)
router.post('/nova-historia', verificarAutenticacao, async (req, res) => {
  try {
    const { titulo, genero, resumo, capitulo} = req.body;
    
    // Convertendo string em array
    const generosArray = (genero || "")
      .split(',')
      .map(g => g.trim())
      .filter(g => g);

      console.log('titulo:', titulo);
      console.log('genero (bruto):', genero);
      console.log('generosArray:', generosArray);
      
    // Verifica se o título e pelo menos um gênero foram fornecidos
      if (!titulo || generosArray.length === 0) {
      return res.status(400).render('nova_historia', {
        title: 'Criar Nova História',
        mensagemErro: 'Título e pelo menos um gênero são obrigatórios.'
      });
    }
    
    const novaHistoria = new Historia({
      titulo,
      genero: generosArray,
      resumo,
      capitulo,
      id_autor: req.session.autor.id
    });
    await novaHistoria.save();
    console.log('Nova história criada:', novaHistoria);
    
    // Aqui atualiza o array 'historias' no Autor
    await Autor.findByIdAndUpdate(
      req.session.autor.id,
      { $push: { historias: novaHistoria._id } }
    );
    console.log('Autor atualizado com nova história:', req.session.autor.id);

    // Redirecionar para o perfil após criar
    res.redirect('/profile');
  } catch (error) {
    console.error(error);
    res.status(500).render('nova_historia', {
      title: 'Criar Nova História',
      mensagemErro: 'Erro ao criar a história. Tente novamente.'
    });
  }
});

// Excluir história (DELETE /historias/:id)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const historia = await Historia.findById(id);

    if (!historia) {
      return res.status(404).json({ message: 'História não encontrada.' });
    }

    // Se quiser proteger: verificar se req.user é autor
    // if (!historia.autor.equals(req.user._id)) return res.status(403).json({ message: 'Sem permissão.' });

    await Historia.findByIdAndDelete(id);
    res.json({ message: 'História excluída com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao excluir história.' });
  }
});

// GET /historias/editar/:id
router.get('/editar/:id', verificarAutenticacao, async (req, res) => {
  try {
    const historia = await Historia.findById(req.params.id);
    if (!historia) {
      return res.status(404).render('404', { mensagem: 'História não encontrada' });
    }
    res.render('editar_historia', {
      title: 'Editar História',
      historia,
      mensagemErro: null
    });
  } catch (err) {
    console.error(error);
    res.status(500).render('nova_historia', {
      title: 'Editar História',
      mensagemErro: 'Erro ao editar a história. Tente novamente.'
    });
  }
});

// POST /historias/editar/:id
router.post('/editar/:id', verificarAutenticacao, async (req, res) => {
  try {
    const { titulo, genero, resumo, capitulo } = req.body;
    const generosArray = (genero || "").split(',').map(g => g.trim()).filter(Boolean);

    const historiaAtualizada = await Historia.findByIdAndUpdate(
      req.params.id,
      {
        titulo,
        genero: generosArray,
        resumo,
        capitulo,
        atualizado_em: new Date(Date.now())
      },
      { new: true, runValidators: true }
    );

    if (!historiaAtualizada) {
      return res.status(404).render('erro', { mensagem: 'História não encontrada.' });
    }

    res.redirect('/profile');
  } catch (err) {
    console.error(err);
    res.status(500).render('editar_historia', {
      mensagemErro: 'Erro ao atualizar a história.',
      historia: req.body
    });
  }
});

// Atualizar história (PUT /historias/:id)
router.put('/:id', async (req, res) => {
  try {
    const { titulo, categorias } = req.body;
    await Historia.findByIdAndUpdate(req.params.id, {
      titulo,
      categorias
    });
    res.json({ message: 'História atualizada com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao atualizar história.' });
  }
});

module.exports = router;