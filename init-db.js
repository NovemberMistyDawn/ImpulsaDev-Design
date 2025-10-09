import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import { fileURLToPath } from "url";

// 🔹 Para tener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// IIFE (función que se ejecuta al cargar)
(async () => {
  // Abrir la base de datos (se crea si no existe)
  const db = await open({
    filename: path.join(__dirname, "database.sqlite"),
    driver: sqlite3.Database,
  });

  console.log("✅ Conectado a la base de datos.");

  // Crear tablas
  await db.exec(`
    CREATE TABLE IF NOT EXISTS puestos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      descripcion TEXT
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS cualidades (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      descripcion TEXT
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS conocimientos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      descripcion TEXT
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS itinerarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      descripcion TEXT
    );
  `);

  // Tablas intermedias N:M
  await db.exec(`
    CREATE TABLE IF NOT EXISTS puesto_cualidad (
      puesto_id INTEGER,
      cualidad_id INTEGER,
      FOREIGN KEY(puesto_id) REFERENCES puestos(id),
      FOREIGN KEY(cualidad_id) REFERENCES cualidades(id)
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS puesto_conocimiento (
      puesto_id INTEGER,
      conocimiento_id INTEGER,
      FOREIGN KEY(puesto_id) REFERENCES puestos(id),
      FOREIGN KEY(conocimiento_id) REFERENCES conocimientos(id)
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS puesto_itinerario (
      puesto_id INTEGER,
      itinerario_id INTEGER,
      FOREIGN KEY(puesto_id) REFERENCES puestos(id),
      FOREIGN KEY(itinerario_id) REFERENCES itinerarios(id)
    );
  `);

  console.log("📦 Tablas creadas o verificadas.");

  // Insertar datos iniciales
  await db.exec(`
    INSERT INTO puestos (nombre, descripcion) VALUES
      ('Desarrollador Frontend', 'Crea interfaces y componentes web'),
      ('Analista de Datos', 'Interpreta y analiza datos para tomar decisiones'),
      ('Administrador de Sistemas', 'Gestiona servidores y redes');
  `);

  await db.exec(`
    INSERT INTO cualidades (nombre, descripcion) VALUES
      ('Trabajo en equipo', 'Capacidad para colaborar con otros.'),
      ('Resolución de problemas', 'Encontrar soluciones de forma efectiva.'),
      ('Comunicación', 'Transmitir ideas con claridad.');
  `);

  await db.exec(`
    INSERT INTO conocimientos (nombre, descripcion) VALUES
      ('JavaScript', 'Lenguaje de programación para el desarrollo web.'),
      ('SQL', 'Lenguaje para bases de datos relacionales.'),
      ('Linux', 'Sistema operativo de código abierto.');
  `);

  await db.exec(`
    INSERT INTO itinerarios (nombre, descripcion) VALUES
      ('Itinerario Web', 'Aprende a crear aplicaciones web completas.'),
      ('Itinerario Datos', 'Domina análisis y visualización de datos.');
  `);

  console.log("🪄 Datos insertados correctamente.");

  await db.close();
  console.log("✅ Base de datos lista: database.sqlite");
})();