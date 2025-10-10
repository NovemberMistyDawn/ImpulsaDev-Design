import express from "express";
import cors from "cors";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public")); // sirve tu frontend

import path from "path";
import { fileURLToPath } from "url";

// Para tener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir index.html en la raíz
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Abrir DB
let db;
(async () => {
  try {
    console.log("🔹 Abriendo base de datos...");
    db = await open({
      filename: path.join(__dirname, "database.sqlite"),
      driver: sqlite3.Database,
    });
    console.log("✅ Base de datos abierta.");

    // Verificar que la tabla existe
    const tables = await db.all(
      "SELECT name FROM sqlite_master WHERE type='table';"
    );
    console.log("📋 Tablas existentes:", tables.map(t => t.name));

  } catch (err) {
    console.error("❌ Error abriendo la base de datos:", err);
  }
})();

// 🔹 Endpoint: obtener todos los puestos
app.get("/api/puestos", async (req, res) => {
  try {
    console.log("🔹 Consultando tabla puestos...");
    const puestos = await db.all("SELECT id, nombre, descripcion FROM puestos");
     console.log(`✅ Se encontraron ${puestos.length} puestos.`);
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
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
