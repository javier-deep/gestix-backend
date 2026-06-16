# Gesticks Backend

API REST en Node.js (Express + Mongoose) para la gestión de incidencias "Gesticks".

Instalación:

```bash
npm install
cp .env.example .env
# Edita .env y añade tu MONGO_URI y JWT_SECRET
npm run dev
```

Endpoints principales:

- `POST /usuarios/login` - body: `{ correo, contrasena }` → retorna `user` y `token`.
- `GET /tickets` - Lista todos los tickets.
- `POST /tickets` - Crea ticket. Campos: `titulo`, `descripcion`, `prioridad`, `fecha_creacion`, `usuario_autor_id`, `categoria_id`, `status`.
- `PATCH /tickets/:id` - Actualiza `prioridad` o `status`.

Estructura de carpetas:

- `models/` - Mongoose schemas
- `routes/` - Rutas Express
- `server.js` - Punto de entrada
