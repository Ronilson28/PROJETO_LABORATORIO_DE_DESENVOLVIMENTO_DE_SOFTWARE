const mongoose = require('mongoose');
const Autor = require('../models/Autor');
const Historia = require('../models/Historia');
const Capitulo = require('../models/Capitulo');

require('dotenv').config();

async function criarHistoriaDeExemplo() {
  await mongoose.connect(process.env.MONGODB_URI_LOCAL || 'mongodb://localhost:27017/tale-haven');

  // Busca um autor existente ou criar um fictício
  let autor = await Autor.findOne({ usuario: 'talehaven' });

  if (!autor) {
    autor = await Autor.create({
      nome: 'Autor Anônimo',
      usuario: 'anonimo',
      email: 'talehavenadm@gmail.com',
      senha: 'Anonimoth'
    });
  }

  // Criar a história
  const historia = new Historia({
    titulo: 'A Lenda do Guardião',
    genero: ['Fantasia', 'Aventura'],
    resumo: 'Uma jornada épica por reinos esquecidos.',
    id_autor: autor._id,
    capa_url: '/images/book-cover-default.jpg'
  });
  await historia.save();

  // Criar capítulos
  const cap1 = await Capitulo.create({
    titulo: 'O Despertar',
    numero: 1,
    conteudo: 'No início, havia trevas...',
    id_historia: historia._id
  });

  const cap2 = await Capitulo.create({
    titulo: 'A Jornada Começa',
    numero: 2,
    conteudo: 'Com uma mochila nas costas, ele partiu...',
    id_historia: historia._id
  });

  // Relacionar os capítulos à história
  historia.capitulos = [cap1._id, cap2._id];
  await historia.save();

  // Adicionar a história ao autor
  autor.historias.push(historia._id);
  await autor.save();

  console.log('📖 História de exemplo criada com sucesso!');
  await mongoose.disconnect();
}

criarHistoriaDeExemplo().catch(err => {
  console.error('❌ Erro ao criar história:', err);
  mongoose.disconnect();
});
