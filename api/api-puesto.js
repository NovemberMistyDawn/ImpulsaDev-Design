const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors'); // Para que puedas llamar desde frontend

const app = express();
app.use(cors());

const pool = mysql.createPool({
  host: 'localhost',  // Cambia si usas otro host
  user: 'root', // Tu usuario MySQL
  password: 'Albahaca06*', // Tu contraseña MySQL
  database: 'datatest', // Tu base de datos
});


app.get('/api/puestos', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT id, nombre, descripcion FROM puesto');
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
app.get('/puesto/:id', async (req, res) => {
    const puestoId = req.params.id;
  
    try {
      const [rows] = await pool.query(`
        SELECT 
            p.id AS puesto_id,
            p.nombre AS puesto_nombre,
            p.descripcion AS puesto_descripcion,
            GROUP_CONCAT(DISTINCT c.nombre SEPARATOR ', ') AS conocimientos,
            GROUP_CONCAT(DISTINCT q.nombre SEPARATOR ', ') AS cualidades,
            GROUP_CONCAT(DISTINCT i.nombre SEPARATOR ', ') AS itinerarios
        FROM puesto p
        LEFT JOIN puesto_conocimiento pc ON p.id = pc.puesto_id
        LEFT JOIN conocimiento c ON pc.conocimiento_id = c.id
        LEFT JOIN puesto_cualidad pq ON p.id = pq.puesto_id
        LEFT JOIN cualidad q ON pq.cualidad_id = q.id
        LEFT JOIN puesto_itinerario pi ON p.id = pi.puesto_id
        LEFT JOIN itinerario_formativo i ON pi.itinerario_id = i.id
        WHERE p.id = ?
        GROUP BY p.id
      `, [puestoId]);
  
      if (rows.length === 0) {
        return res.status(404).json({ message: 'Puesto no encontrado' });
      }
  
      res.json(rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  });
  
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`API escuchando en puerto ${PORT}`);
  });