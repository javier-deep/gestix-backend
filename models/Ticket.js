const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  titulo: { type: String, required: true },
  descripcion: { type: String },
  prioridad: { type: String, enum: ['baja', 'media', 'alta', 'crítica'], default: 'media' },
  fecha_creacion: { type: Date, default: Date.now },
  usuario_autor_id: { type: Number, required: true },
  categoria_id: { type: Number },
  status: { type: String, enum: ['Abierto', 'En proceso', 'Cerrado'], default: 'Abierto' }
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
