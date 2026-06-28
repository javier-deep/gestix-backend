const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// POST /usuarios/login
router.post('/login', async (req, res, next) => {
  try {
    const { correo, contrasena } = req.body;
    if (!correo || !contrasena) return res.status(400).json({ message: 'Correo y contrasena son requeridos' });

    // Normalizar correo a minúsculas para evitar problemas de case-sensitivity
    const correoNormalizado = correo.toLowerCase().trim();
    const user = await User.findOne({ correo: correoNormalizado });
    if (!user) return res.status(401).json({ message: 'Credenciales inválidas' });

    // Support plaintext passwords or bcrypt hashes
    let passwordMatches = false;
    const stored = user.contrasena || '';
    if (stored.startsWith('$2')) {
      const bcrypt = require('bcryptjs');
      passwordMatches = await bcrypt.compare(contrasena, stored);
    } else {
      passwordMatches = contrasena === stored;
    }

    if (!passwordMatches) return res.status(401).json({ message: 'Credenciales inválidas' });

    const token = jwt.sign(
      { id: user.id, correo: user.correo, permisos: user.permisos },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '8h' }
    );

    const userObj = user.toObject();
    delete userObj.contrasena;

    res.json({ user: userObj, token });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
