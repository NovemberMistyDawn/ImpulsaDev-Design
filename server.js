import express from "express";
import cors from "cors";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import { fileURLToPath } from "url";

// 🔹 Para tener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔹 Crear app y puerto
const app = express();
const PORT = process.env.PORT || 8080;

// 🔹 Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // servir frontend

// 🔹 Servir index.html en la raíz
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 🔹 Inicialización de SQLite
let db;
(async () => {
  try {
    console.log("🔹 Abriendo base de datos...");
    db = await open({
      filename: "./database.sqlite",
      driver: sqlite3.Database,
    });
    console.log("✅ Base de datos abierta.");

    // Crear tabla puestos si no existe
    await db.exec(`
      CREATE TABLE IF NOT EXISTS puestos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        descripcion TEXT
      );

        CREATE TABLE IF NOT EXISTS cualidades (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        descripcion TEXT
      );

      CREATE TABLE IF NOT EXISTS conocimientos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        descripcion TEXT
      );

      CREATE TABLE IF NOT EXISTS itinerarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        descripcion TEXT
      );

      CREATE TABLE IF NOT EXISTS puesto_cualidad (
        puesto_id INTEGER,
        cualidad_id INTEGER,
        FOREIGN KEY(puesto_id) REFERENCES puestos(id),
        FOREIGN KEY(cualidad_id) REFERENCES cualidades(id)
      );

      CREATE TABLE IF NOT EXISTS puesto_conocimiento (
        puesto_id INTEGER,
        conocimiento_id INTEGER,
        FOREIGN KEY(puesto_id) REFERENCES puestos(id),
        FOREIGN KEY(conocimiento_id) REFERENCES conocimientos(id)
      );

      CREATE TABLE IF NOT EXISTS puesto_itinerario (
        puesto_id INTEGER,
        itinerario_id INTEGER,
        FOREIGN KEY(puesto_id) REFERENCES puestos(id),
        FOREIGN KEY(itinerario_id) REFERENCES itinerarios(id)
      );
    `);

    // Insertar datos iniciales si está vacía
    const count = await db.get("SELECT COUNT(*) as c FROM puestos");
    if (count.c === 0) {
      console.log("🌱 Insertando datos iniciales...");
      await db.exec(`
        INSERT INTO puestos (nombre, descripcion) VALUES
          ('Frontend Developer', 'Crea interfaces web modernas'),
          ('Backend Developer', 'Desarrolla APIs y lógica del servidor'),
          ('Data Analyst', 'Analiza y visualiza datos');


      INSERT INTO cualidades (nombre, descripcion) VALUES
        ('Trabajo en equipo', 'Capacidad para colaborar eficazmente con otros profesionales.'),
        ('Resolución de problemas', 'Capacidad de analizar y solucionar incidencias.'),
        ('Comunicación', 'Habilidad para expresar ideas claramente.'),
        ('Adaptabilidad', 'Capacidad para ajustarse a entornos cambiantes.');
      `);
     
      console.log("✅ Datos insertados.");
    }

    const tablas = await db.all("SELECT name FROM sqlite_master WHERE type='table'");
    console.log("📋 Tablas existentes:", tablas.map(t => t.name));
  } catch (err) {
    console.error("❌ Error inicializando la base de datos:", err);
  }
})();

// 🔹 Endpoint: listar todos los puestos
app.get("/api/puestos", async (req, res) => {
  try {
    const puestos = await db.all("SELECT id, nombre, descripcion FROM puestos");
    res.json(puestos);
  } catch (err) {
    console.error("❌ Error al obtener puestos:", err);
    res.status(500).json({ error: "Error al obtener puestos" });
  }
});

// 🔹 Endpoint: detalle completo de un puesto
app.get("/api/puesto/:id", async (req, res) => {
  try {
    // Consulta ejemplo: aquí puedes añadir joins si implementas relaciones
    const puesto = await db.get("SELECT * FROM puestos WHERE id = ?", [req.params.id]);
    if (!puesto) return res.status(404).json({ error: "No encontrado" });

    // Si tienes relaciones con soft skills, conocimientos e itinerarios:
    // Aquí se podrían poblar arrays de ejemplo, luego reemplaza por joins reales
    puesto.cualidades = ["Trabajo en equipo", "Resolución de problemas"];
    puesto.conocimientos = ["JavaScript", "SQL"];
    puesto.itinerarios = ["Desarrollo Web"];

    res.json(puesto);
  } catch (err) {
    console.error("❌ Error al obtener detalle del puesto:", err);
    res.status(500).json({ error: "Error interno" });
  }
});


// 🔹 Obtener detalle de una soft skill (cualidad) por nombre
app.get("/api/cualidad/:nombre", async (req, res) => {
  const nombreCualidad = req.params.nombre;

  try {
    const cualidad = await db.get(
      `SELECT id, nombre, descripcion FROM cualidades WHERE nombre = ?`,
      [nombreCualidad]
    );

    if (!cualidad) {
      return res.status(404).json({ message: "Cualidad no encontrada" });
    }

    // Estructura de respuesta esperada por el front
    res.json({
      cualidad_id: cualidad.id,
      cualidad_nombre: cualidad.nombre,
      cualidad_descripcion: cualidad.descripcion,
    });
  } catch (err) {
    console.error("❌ Error al obtener cualidad:", err);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});


// 🔹 Obtener detalle de un conocimiento por nombre
app.get("/api/conocimiento/:nombre", async (req, res) => {
  const nombreConocimiento = req.params.nombre;

  try {
    const conocimiento = await db.get(
      `SELECT id, nombre, descripcion FROM conocimientos WHERE nombre = ?`,
      [nombreConocimiento]
    );

    if (!conocimiento) {
      return res.status(404).json({ message: "Conocimiento no encontrado" });
    }

    // 🔗 Aquí podrías hacer joins reales, pero de momento lo dejamos con datos simulados:
    const puestosRelacionados = ["Frontend Developer", "Backend Developer"];
    const itinerariosRelacionados = ["Desarrollo Web", "Ciencia de Datos"];

    // Respuesta que espera tu front
    res.json({
      conocimiento_id: conocimiento.id,
      conocimiento_nombre: conocimiento.nombre,
      conocimiento_descripcion: conocimiento.descripcion,
      puestos: puestosRelacionados,
      itinerarios: itinerariosRelacionados,
    });
  } catch (err) {
    console.error("❌ Error al obtener conocimiento:", err);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});




// 🔹 Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});

// 🔹 Manejo global de errores
process.on("unhandledRejection", (reason, promise) => {
  console.error("🚨 Unhandled Rejection:", reason);
});
process.on("uncaughtException", (err) => {
  console.error("🔥 Uncaught Exception:", err);
});