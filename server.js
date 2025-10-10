import path from "path";
import { fileURLToPath } from "url";
import { open } from "sqlite";
import sqlite3 from "sqlite3";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db;
(async () => {
  try {
    console.log("🔹 Abriendo base de datos...");
    db = await open({
      filename: path.join(__dirname, "database.sqlite"), // ruta absoluta segura
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
    console.error("❌ Error al abrir/inicializar base de datos:", err);
  }
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
    console.error("❌ Error al obtener puesto por ID:", err);
    res.status(500).json({ error: "Error interno" });
  }
});

// 🔹 Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});

// Manejo global de errores no atrapados
process.on("unhandledRejection", (reason, promise) => {
  console.error("🚨 Unhandled Rejection:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("🔥 Uncaught Exception:", err);
});
