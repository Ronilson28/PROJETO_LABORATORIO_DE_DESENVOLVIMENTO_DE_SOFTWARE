const mongoose = require('mongoose');

const historiaSchema = new mongoose.Schema({
  id_autor: {  
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  titulo: { type: String, required: true },
  descricao: {type: String, default: ''},
  genero: {type: String, default: ''},
  tags: { type: [String], default: [] },
  status: { 
    type: String,
    enum: ['Em andamento', 'Concluído'], 
    default: 'Em andamento' 
  },
  data_criacao: { type: Date, default: Date.now },
  capa_url: {type: String, default: 'images/default-cover.jpg'},
  
  // Campos adicionais
  //capitulos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Capitulo' }],
  //curtidas: { type: Number, default: 0 },
  //visualizacoes: { type: Number, default: 0 },
  //comentarios: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comentario' }],
  atualizado_em: { type: Date, default: Date.now },
  //privado: { type: Boolean, default: false },
  //avaliacoes: [{ userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    //nota: Number, comentario: String
  //}],
  //slug: String
});

module.exports = mongoose.model('Historia', historiaSchema);
