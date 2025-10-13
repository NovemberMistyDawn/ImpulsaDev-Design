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