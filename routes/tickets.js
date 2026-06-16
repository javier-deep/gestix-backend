const express = require('express');
const Ticket = require('../models/Ticket');
const { getNextSequence } = require('../models/Counter');
const router = express.Router();

// GET /tickets - list all tickets
router.get('/', async (req, res, next) => {
  try {
    const tickets = await Ticket.find().sort({ id: 1 });
    res.json(tickets);
  } catch (err) {
    next(err);
  }
});

// POST /tickets - create a new ticket
router.post('/', async (req, res, next) => {
  try {
    const { titulo, descripcion, prioridad, fecha_creacion, usuario_autor_id, categoria_id, status } = req.body;
    if (!titulo || !usuario_autor_id) return res.status(400).json({ message: 'Faltan campos requeridos' });

    const nextId = await getNextSequence('tickets');

    const ticket = new Ticket({
      id: nextId,
      titulo,
      descripcion,
      prioridad,
      fecha_creacion: fecha_creacion ? new Date(fecha_creacion) : undefined,
      usuario_autor_id,
      categoria_id,
      status
    });

    await ticket.save();
    res.status(201).json(ticket);
  } catch (err) {
    if (err.name === 'ValidationError') return res.status(400).json({ message: err.message });
    next(err);
  }
});

// PATCH /tickets/:id - update priority or status
router.patch('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { prioridad, status } = req.body;
    if (!prioridad && !status) return res.status(400).json({ message: 'Nada para actualizar' });

    const update = {};
    if (prioridad) update.prioridad = prioridad;
    if (status) update.status = status;

    const ticket = await Ticket.findOneAndUpdate({ id }, { $set: update }, { new: true });
    if (!ticket) return res.status(404).json({ message: 'Ticket no encontrado' });

    res.json(ticket);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
