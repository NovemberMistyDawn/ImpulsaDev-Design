import express from "express";
import cors from "cors";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import { fileURLToPath } from "url";

// ------------------------------------------------------
// 🔹 Configuración inicial
// ------------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // servir frontend

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ------------------------------------------------------
// 🔹 Inicialización de la base de datos SQLite
// ------------------------------------------------------
let db;
(async () => {
  try {
    console.log("🔹 Abriendo base de datos...");
    db = await open({
      filename: "./database.sqlite",
      driver: sqlite3.Database,
    });
    console.log("✅ Base de datos abierta.");

    // 🔸 Crear tablas
    await db.exec(`
      CREATE TABLE IF NOT EXISTS puestos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        descripcion TEXT
      );
      CREATE TABLE IF NOT EXISTS conocimientos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT,
        descripcion TEXT
      );
      CREATE TABLE IF NOT EXISTS cualidades (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT,
        descripcion TEXT
      );
      CREATE TABLE IF NOT EXISTS itinerarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT,
        descripcion TEXT
      );
      CREATE TABLE IF NOT EXISTS puesto_conocimiento (
        puesto_id INTEGER,
        conocimiento_id INTEGER
      );
      CREATE TABLE IF NOT EXISTS puesto_cualidad (
        puesto_id INTEGER,
        cualidad_id INTEGER
      );
      CREATE TABLE IF NOT EXISTS puesto_itinerario (
        puesto_id INTEGER,
        itinerario_id INTEGER
      );
    `);

    // 🔸 Insertar datos de ejemplo si no hay nada
    const count = await db.get("SELECT COUNT(*) as c FROM puestos");
    if (count.c === 0) {
      console.log("🌱 Insertando datos iniciales...");

      await db.exec(`
        INSERT INTO puestos (nombre, descripcion) VALUES
          ('Frontend Developer', 'Crea interfaces web modernas'),
          ('Backend Developer', 'Desarrolla APIs y lógica del servidor'),
          ('Data Analyst', 'Analiza y visualiza datos');

        INSERT INTO conocimientos (nombre, descripcion) VALUES
          ('JavaScript', 'Lenguaje principal del frontend'),
          ('Node.js', 'Entorno de ejecución para JavaScript en backend'),
          ('SQL', 'Lenguaje para manejar bases de datos');

        INSERT INTO cualidades (nombre, descripcion) VALUES
          ('Trabajo en equipo', 'Colabora eficazmente con otros'),
          ('Comunicación', 'Explica ideas con claridad'),
          ('Pensamiento crítico', 'Analiza y soluciona problemas');

        INSERT INTO itinerarios (nombre, descripcion) VALUES
          ('Desarrollo Web', 'Ruta para aprender desarrollo frontend y backend'),
          ('Análisis de Datos', 'Ruta para aprender análisis, Python y SQL');

        -- Relaciones de ejemplo
        INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id) VALUES
          (1, 1), (1, 2), -- Frontend: JS y Node
          (2, 2), (2, 3), -- Backend: Node y SQL
          (3, 3);          -- Data Analyst: SQL

        INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES
          (1, 1), (1, 2),
          (2, 2), (2, 3),
          (3, 1), (3, 3);

        INSERT INTO puesto_itinerario (puesto_id, itinerario_id) VALUES
          (1, 1), (2, 1), (3, 2);
      `);

      console.log("✅ Datos iniciales insertados.");
    }

    const tablas = await db.all("SELECT name FROM sqlite_master WHERE type='table'");
    console.log("📋 Tablas existentes:", tablas.map(t => t.name));
  } catch (err) {
    console.error("❌ Error inicializando la base de datos:", err);
  }
})();

// ------------------------------------------------------
// 🔹 ENDPOINTS
// ------------------------------------------------------

// 🟢 Obtener todos los puestos
app.get("/api/puestos", async (req, res) => {
  try {
    const puestos = await db.all("SELECT id, nombre, descripcion FROM puestos");
    res.json(puestos);
  } catch (err) {
    console.error("❌ Error al obtener puestos:", err);
    res.status(500).json({ error: "Error al obtener puestos" });
  }
});

// 🟢 Detalle de puesto con relaciones
app.get("/api/puesto/:id", async (req, res) => {
  try {
    const puestoId = req.params.id;
    const query = `
      SELECT 
        p.id AS puesto_id,
        p.nombre AS puesto_nombre,
        p.descripcion AS puesto_descripcion,
        (
          SELECT GROUP_CONCAT(DISTINCT c.nombre, ', ')
          FROM conocimientos c
          JOIN puesto_conocimiento pc ON pc.id_conocimiento = c.id
          WHERE pc.id_puesto = p.id
        ) AS conocimientos,
        (
          SELECT GROUP_CONCAT(DISTINCT q.nombre, ', ')
          FROM cualidades q
          JOIN puesto_cualidad pq ON pq.id_cualidad = q.id
          WHERE pq.id_puesto = p.id
        ) AS cualidades,
        (
          SELECT GROUP_CONCAT(DISTINCT i.nombre, ', ')
          FROM itinerarios i
          JOIN puesto_itinerario pi ON pi.id_itinerario = i.id
          WHERE pi.id_puesto = p.id
        ) AS itinerarios
      FROM puestos p
      WHERE p.id = ?;
    `;
    const puesto = await db.get(query, [puestoId]);

    if (!puesto) return res.status(404).json({ error: "Puesto no encontrado" });

    // Parseamos los strings separados por coma a arrays
    puesto.conocimientos = puesto.conocimientos ? puesto.conocimientos.split(",").map(x => x.trim()) : [];
    puesto.cualidades = puesto.cualidades ? puesto.cualidades.split(",").map(x => x.trim()) : [];
    puesto.itinerarios = puesto.itinerarios ? puesto.itinerarios.split(",").map(x => x.trim()) : [];

    res.json(puesto);
  } catch (err) {
    console.error("❌ Error al obtener detalle del puesto:", err);
    res.status(500).json({ error: "Error interno al obtener puesto" });
  }
});

// 🟢 Detalle de una cualidad
app.get("/api/cualidad/:nombre", async (req, res) => {
  const nombreCualidad = req.params.nombre;
  try {
    const query = `
      SELECT 
        q.id AS cualidad_id,
        q.nombre AS cualidad_nombre,
        q.descripcion AS cualidad_descripcion,
        GROUP_CONCAT(DISTINCT p.nombre, ', ') AS puestos,
        GROUP_CONCAT(DISTINCT i.nombre, ', ') AS itinerarios
      FROM cualidades q
      LEFT JOIN puesto_cualidad pq ON q.id = pq.cualidad_id
      LEFT JOIN puestos p ON pq.puesto_id = p.id
      LEFT JOIN puesto_itinerario pi ON p.id = pi.puesto_id
      LEFT JOIN itinerarios i ON pi.itinerario_id = i.id
      WHERE q.nombre = ?
      GROUP BY q.id;
    `;
    const cualidad = await db.get(query, [nombreCualidad]);
    if (!cualidad) return res.status(404).json({ message: "Cualidad no encontrada" });

    cualidad.puestos = cualidad.puestos ? cualidad.puestos.split(",").map(p => p.trim()) : [];
    cualidad.itinerarios = cualidad.itinerarios ? cualidad.itinerarios.split(",").map(i => i.trim()) : [];

    res.json(cualidad);
  } catch (err) {
    console.error("Error al obtener cualidad:", err);
    res.status(500).json({ message: "Error interno" });
  }
});

// 🟢 Detalle de conocimiento
app.get("/api/conocimiento/:nombre", async (req, res) => {
  const conocimientoNombre = req.params.nombre;
  try {
    const query = `
      SELECT 
        c.id AS conocimiento_id,
        c.nombre AS conocimiento_nombre,
        c.descripcion AS conocimiento_descripcion,
        GROUP_CONCAT(DISTINCT p.nombre, ', ') AS puestos,
        GROUP_CONCAT(DISTINCT i.nombre, ', ') AS itinerarios
      FROM conocimientos c
      LEFT JOIN puesto_conocimiento pc ON c.id = pc.conocimiento_id
      LEFT JOIN puestos p ON pc.puesto_id = p.id
      LEFT JOIN puesto_itinerario pi ON p.id = pi.puesto_id
      LEFT JOIN itinerarios i ON pi.itinerario_id = i.id
      WHERE c.nombre = ?
      GROUP BY c.id;
    `;
    const conocimiento = await db.get(query, [conocimientoNombre]);
    if (!conocimiento)
      return res.status(404).json({ message: "Conocimiento no encontrado" });

    conocimiento.puestos = conocimiento.puestos ? conocimiento.puestos.split(",").map(p => p.trim()) : [];
    conocimiento.itinerarios = conocimiento.itinerarios ? conocimiento.itinerarios.split(",").map(i => i.trim()) : [];

    res.json(conocimiento);
  } catch (err) {
    console.error("Error al obtener conocimiento:", err);
    res.status(500).json({ message: "Error interno" });
  }
});

// 🟢 Detalle de itinerario
app.get("/api/itinerario/:nombre", async (req, res) => {
  const nombreItinerario = req.params.nombre;
  try {
    const query = `
      SELECT 
        i.id AS itinerario_id,
        i.nombre AS itinerario_nombre,
        i.descripcion AS itinerario_descripcion,
        GROUP_CONCAT(DISTINCT c.nombre, ', ') AS conocimientos
      FROM itinerarios i
      LEFT JOIN puesto_itinerario pi ON i.id = pi.itinerario_id
      LEFT JOIN puesto_conocimiento pc ON pi.puesto_id = pc.puesto_id
      LEFT JOIN conocimientos c ON pc.conocimiento_id = c.id
      WHERE i.nombre = ?
      GROUP BY i.id;
    `;
    const itinerario = await db.get(query, [nombreItinerario]);
    if (!itinerario)
      return res.status(404).json({ message: "Itinerario no encontrado" });

    itinerario.conocimientos = itinerario.conocimientos
      ? itinerario.conocimientos.split(",").map(c => c.trim())
      : [];

    res.json(itinerario);
  } catch (err) {
    console.error("Error al obtener itinerario:", err);
    res.status(500).json({ message: "Error interno" });
  }
});

// ------------------------------------------------------
// 🔹 Iniciar servidor
// ------------------------------------------------------
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});

process.on("unhandledRejection", reason => console.error("🚨 Unhandled:", reason));
process.on("uncaughtException", err => console.error("🔥 Uncaught:", err));