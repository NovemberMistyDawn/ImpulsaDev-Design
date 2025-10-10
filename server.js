import express from "express";
import cors from "cors";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 🔹 Conexión a SQLite + inicialización automática
let db;
(async () => {
  console.log("🔹 Abriendo base de datos...");
  db = await open({
    filename: "./database.sqlite",
    driver: sqlite3.Database,
  });
  console.log("✅ Base de datos abierta.");

  // Crea la tabla si no existe
  await db.exec(`
    CREATE TABLE IF NOT EXISTS puestos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      descripcion TEXT
    );
  `);

  // Verificar si está vacía y rellenar
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
})();

// 🔹 Endpoint: obtener todos los puestos
app.get("/api/puestos", async (req, res) => {
  try {
    console.log("🔹 Consultando tabla puestos...");
    const puestos = await db.all("SELECT id, nombre, descripcion FROM puestos");
    res.json(puestos);
  } catch (err) {
    console.error("❌ Error al obtener puestos:", err);
    res.status(500).json({ error: "Error al obtener puestos" });
  }
});

// 🔹 Endpoint: detalle de puesto
app.get("/api/puesto/:id", async (req, res) => {
  try {
    const puesto = await db.get("SELECT * FROM puestos WHERE id = ?", [req.params.id]);
    if (!puesto) return res.status(404).json({ error: "No encontrado" });
    res.json(puesto);
  } catch (err) {
    res.status(500).json({ error: "Error interno" });
  }
});

// 🔹 Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});