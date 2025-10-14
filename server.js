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

// 🔹 Servir las páginas de detalle (para que funcionen las rutas del front)
app.get("/detalle-puesto", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "detalle-puesto.html"));
});

app.get("/detalle-itinerario", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "detalle-itinerario.html"));
});

app.get("/detalle-conocimiento", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "detalle-conocimiento.html"));
});

app.get("/detalle-cualidad", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "detalle-cualidad.html"));
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

         INSERT INTO conocimientos (nombre, descripcion) VALUES
      ('JavaScript', 'Lenguaje base para desarrollo web frontend.'),
      ('Python', 'Lenguaje de programación versátil, usado en backend y análisis de datos.'),
      ('SQL', 'Lenguaje para gestión y consultas a bases de datos.'),
      ('Linux', 'Sistema operativo común en entornos de servidores.');

    INSERT INTO itinerarios (nombre, descripcion) VALUES
      ('Desarrollo Web', 'Ruta para aprender desarrollo fullstack con JS.'),
      ('Ciencia de Datos', 'Ruta enfocada en análisis, estadística y machine learning.'),
      ('Administración de Sistemas', 'Ruta orientada a redes, servidores y seguridad.');
      `);


      await db.exec(`
  INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES
    (1, 1), (1, 2), (1, 3),
    (2, 2), (2, 4),
    (3, 2), (3, 3),
    (4, 1), (4, 4);

  INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id) VALUES
    (1, 1), (1, 3),
    (2, 2), (2, 3),
    (3, 2), (3, 3),
    (4, 4), (4, 3);

  INSERT INTO puesto_itinerario (puesto_id, itinerario_id) VALUES
    (1, 1),
    (2, 1),
    (3, 2),
    (4, 3);
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
    const puestoId = req.params.id;

    // 1️⃣ Obtener el puesto principal
    const puesto = await db.get("SELECT * FROM puestos WHERE id = ?", [puestoId]);
    if (!puesto) return res.status(404).json({ error: "No encontrado" });

    // 2️⃣ Obtener las cualidades (soft skills) asociadas
    const cualidades = await db.all(
      `SELECT c.nombre
       FROM cualidades c
       INNER JOIN puesto_cualidad pc ON c.id = pc.cualidad_id
       WHERE pc.puesto_id = ?`,
      [puestoId]
    );

    // 3️⃣ Obtener los conocimientos asociados
    const conocimientos = await db.all(
      `SELECT con.nombre
       FROM conocimientos con
       INNER JOIN puesto_conocimiento pc ON con.id = pc.conocimiento_id
       WHERE pc.puesto_id = ?`,
      [puestoId]
    );

    // 4️⃣ Obtener los itinerarios asociados
    const itinerarios = await db.all(
      `SELECT i.nombre
       FROM itinerarios i
       INNER JOIN puesto_itinerario pi ON i.id = pi.itinerario_id
       WHERE pi.puesto_id = ?`,
      [puestoId]
    );

    // 5️⃣ Formatear la respuesta con arrays planos
    puesto.cualidades = cualidades.map(c => c.nombre);
    puesto.conocimientos = conocimientos.map(c => c.nombre);
    puesto.itinerarios = itinerarios.map(i => i.nombre);

    // 6️⃣ Devolver resultado
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

// 🔹 Obtener detalle de un itinerario por nombre
app.get("/api/itinerario/:nombre", async (req, res) => {
  const nombreItinerario = req.params.nombre;

  try {
    // 1️⃣ Buscar el itinerario
    const itinerario = await db.get(
      `SELECT id, nombre, descripcion FROM itinerarios WHERE nombre = ?`,
      [nombreItinerario]
    );

    if (!itinerario) {
      return res.status(404).json({ message: "Itinerario no encontrado" });
    }

 // Conocimientos relacionados
    const conocimientos = await db.all(
      `SELECT DISTINCT con.nombre
       FROM conocimientos con
       INNER JOIN puesto_conocimiento pc ON con.id = pc.conocimiento_id
       INNER JOIN puesto_itinerario pi ON pc.puesto_id = pi.puesto_id
       WHERE pi.itinerario_id = ?`,
      [itinerario.id]
    );

    // Puestos relacionados (ahora con id y nombre)
    const puestos = await db.all(
      `SELECT DISTINCT p.id, p.nombre
       FROM puestos p
       INNER JOIN puesto_itinerario pi ON p.id = pi.puesto_id
       WHERE pi.itinerario_id = ?`,
      [itinerario.id]
    );

    res.json({
      id: itinerario.id,
      nombre: itinerario.nombre,
      descripcion: itinerario.descripcion,
      conocimientos: conocimientos.map(c => c.nombre),
      puestos: puestos,  // devolvemos objetos con id y nombre
    });

  } catch (err) {
    console.error("❌ Error al obtener itinerario:", err);
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