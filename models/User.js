const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  nombre: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  contrasena: { type: String, required: true },
  estatus: { type: Number, default: 1 },
  departamento_id: { type: Number },
  permisos: { type: [Number], default: [] }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
