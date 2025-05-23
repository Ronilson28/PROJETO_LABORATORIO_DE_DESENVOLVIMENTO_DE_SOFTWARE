const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Historia = require('../models/Story');
const verificarAutenticacao = require('../middlewares/auth');

// Rota GET para exibir o perfil do autor
router.get('/', verificarAutenticacao, async (req, res) => {
  console.log('Sessão atual:', req.session); 
  try {
    const user = await User.findById(req.session.user.id).populate('historias');
    if (!user) {
      return res.status(404).send("Usuário não encontrado.");
    }
    res.render('profile', {
      title: 'Perfil de ' + req.session.user.nome + ' - Portal de Histórias',
      user,
      mensagemError: null
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao carregar o perfil.');
  }
});

// Rota POST para processar dados enviados pelo formulário
router.post('/', (req, res) => {
  const { titulo, categoria, novaCategoria } = req.body;

  // TODO: lógica para salvar história com base no usuário
  // Exemplo: UserModel.createStory(userId, { titulo, categoria })
  // Aqui você pode adicionar lógica para salvar a nova história
  // Por exemplo, adicionar a história a um array ou banco de dados

  // Após processar os dados, você pode redirecionar ou renderizar a página novamente
  res.redirect('profile', {
    title: 'Perfil de ' + req.session.user.nome + ' - Portal de Histórias',
    mensagemError: null
  }
  );
});

module.exports = router;