const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
app.use(cors());
app.use(express.static('public'));

const port = 3000;

// Endpoint para listar puestos
app.get('/api/puestos', (req, res) => {
  try {
    const rows = db.prepare('SELECT id, nombre, descripcion FROM puesto').all();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Detalle de un puesto
app.get('/api/puesto/:id', (req, res) => {
  const id = req.params.id;
  try {
    const puesto = db.prepare(`
      SELECT 
        p.id AS puesto_id,
        p.nombre AS puesto_nombre,
        p.descripcion AS puesto_descripcion,
        GROUP_CONCAT(DISTINCT c.nombre) AS conocimientos,
        GROUP_CONCAT(DISTINCT q.nombre) AS cualidades,
        GROUP_CONCAT(DISTINCT i.nombre) AS itinerarios
      FROM puesto p
      LEFT JOIN puesto_conocimiento pc ON p.id = pc.id_puesto
      LEFT JOIN conocimiento c ON pc.id_conocimiento = c.id
      LEFT JOIN puesto_cualidad pq ON p.id = pq.id_puesto
      LEFT JOIN cualidad q ON pq.id_cualidad = q.id
      LEFT JOIN puesto_itinerario pi ON p.id = pi.id_puesto
      LEFT JOIN itinerario_formativo i ON pi.id_itinerario = i.id
      WHERE p.id = ?
      GROUP BY p.id
    `).get(id);

    if (!puesto) {
      return res.status(404).json({ message: 'Puesto no encontrado' });
    }

    puesto.conocimientos = puesto.conocimientos ? puesto.conocimientos.split(',') : [];
    puesto.cualidades = puesto.cualidades ? puesto.cualidades.split(',') : [];
    puesto.itinerarios = puesto.itinerarios ? puesto.itinerarios.split(',') : [];

    res.json(puesto);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// (Y así igual para /api/cualidad/:nombre, /api/conocimiento/:nombre, /api/itinerario/:nombre)
// Puedes mantener exactamente la misma lógica de tus queries MySQL,
// solo adaptando a db.prepare().get() o db.prepare().all() según el caso.

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
