const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// POST /usuarios/login
router.post('/login', async (req, res, next) => {
  try {
    const { correo, contrasena } = req.body;
    if (!correo || !contrasena) return res.status(400).json({ message: 'Correo y contrasena son requeridos' });

    // Normalizar correo y contraseña
    const correoNormalizado = correo.toLowerCase().trim();
    const contrasenaTrim = contrasena.trim();
    
    console.log('LOGIN ATTEMPT:', { correoNormalizado, contrasenaTrim });

    // Primero buscar en minúsculas
    let user = await User.findOne({ correo: correoNormalizado });
    
    // Si no encuentra, buscar case-insensitive en toda la BD
    if (!user) {
      user = await User.findOne({ correo: { $regex: `^${correoNormalizado}$`, $options: 'i' } });
      if (user) console.log('Usuario encontrado con búsqueda case-insensitive');
    }
    
    if (!user) {
      console.log('Usuario NO encontrado:', correoNormalizado);
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    console.log('Usuario encontrado, comparando contraseña...');

    // Support plaintext passwords or bcrypt hashes
    let passwordMatches = false;
    const stored = user.contrasena || '';
    console.log('Stored:', stored, 'Enviada:', contrasenaTrim);
    
    if (stored.startsWith('$2')) {
      const bcrypt = require('bcryptjs');
      passwordMatches = await bcrypt.compare(contrasenaTrim, stored);
    } else {
      passwordMatches = contrasenaTrim === stored;
      console.log('Comparación texto plano - Match:', passwordMatches);
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
