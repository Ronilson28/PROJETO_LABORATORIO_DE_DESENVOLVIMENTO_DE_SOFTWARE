const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Equivalente a "id_usuario" — o _id do Mongo já cobre isso.
  nome: { type: String, required: true },
  usuario: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  tipo_usuario: { type: String, enum: ['comun', 'admin'], default: 'comun' },
  dataNascimento: { type: Date, required: true },
  biografia: { type: String },
  fotoPerfil: { type: String, default: 'images/default-profile.png' },
  redesSociais: {
    twitter: {type: String, default: ''}, 
    instagram: {type: String, default: ''},
    facebook: {type: String, default: ''},
    sitePessoal: {type: String, default: ''}
  },
  preferenciasGenero: { type: [String], default: [] },
  dataCriacao: { type: Date, default: Date.now },
  historias: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Historia' }]
}, { timestamps: true });

// Hash da senha antes de salvar
userSchema.pre('save', async function (next) {
  if (!this.isModified('senha')) return next();
  this.senha = await bcrypt.hash(this.senha, 10);
  next();
});

// Método para verificar senha
userSchema.methods.compararSenha = function (senhaDigitada) {
  return bcrypt.compare(senhaDigitada, this.senha);
};

module.exports = mongoose.model('User', userSchema);