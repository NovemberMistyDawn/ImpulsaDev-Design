import sqlite3 from "sqlite3";
import { open } from "sqlite";

(async () => {
  const db = await open({
    filename: "./database.sqlite",
    driver: sqlite3.Database,
  });

  console.log("✅ Conectado a la base de datos.");

  // 🧱 Crear tablas principales
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

    -- Relaciones N:M
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

  console.log("📦 Tablas creadas o verificadas.");

  // 🧹 Vaciar tablas (opcional, para reiniciar)
  await db.exec(`
    DELETE FROM puesto_cualidad;
    DELETE FROM puesto_conocimiento;
    DELETE FROM puesto_itinerario;
    DELETE FROM puestos;
    DELETE FROM cualidades;
    DELETE FROM conocimientos;
    DELETE FROM itinerarios;
  `);

  console.log("🧹 Datos antiguos eliminados.");

  // 🌱 Insertar datos base
  await db.exec(`
    INSERT INTO puestos (nombre, descripcion) VALUES
      ('Desarrollador Frontend', 'Crea interfaces de usuario interactivas con HTML, CSS y JS.'),
      ('Desarrollador Backend', 'Construye APIs y maneja la lógica del servidor.'),
      ('Analista de Datos', 'Analiza grandes volúmenes de datos para generar insights.'),
      ('Administrador de Sistemas', 'Gestiona servidores, redes y entornos de despliegue.');

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

  console.log("🪴 Datos principales insertados.");

  // 🔗 Crear relaciones entre tablas
  await db.exec(`
    -- Relaciones puestos ↔ cualidades
    INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES
      (1, 1), (1, 2), (1, 3),
      (2, 2), (2, 4),
      (3, 2), (3, 3),
      (4, 1), (4, 4);

    -- Relaciones puestos ↔ conocimientos
    INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id) VALUES
      (1, 1), (1, 3),
      (2, 2), (2, 3),
      (3, 2), (3, 3),
      (4, 4), (4, 3);

    -- Relaciones puestos ↔ itinerarios
    INSERT INTO puesto_itinerario (puesto_id, itinerario_id) VALUES
      (1, 1),
      (2, 1),
      (3, 2),
      (4, 3);
  `);

  console.log("🔗 Relaciones insertadas correctamente.");
  console.log("✅ Base de datos lista: database.sqlite");

  await db.close();
})();