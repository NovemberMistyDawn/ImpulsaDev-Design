// database.js
const Database = require('better-sqlite3');

// Puedes usar ':memory:' para no guardar nada en disco
// o 'datatest.sqlite' para mantenerlo persistente localmente
const db = new Database('datatest.sqlite');

// Crear tablas si no existen (equivalentes a tus tablas MySQL)
db.exec(`
CREATE TABLE IF NOT EXISTS categoria (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT
);

CREATE TABLE IF NOT EXISTS conocimiento (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT,
  descripcion TEXT
);

CREATE TABLE IF NOT EXISTS cualidad (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT,
  descripcion TEXT
);

CREATE TABLE IF NOT EXISTS itinerario_formativo (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT,
  descripcion TEXT
);

CREATE TABLE IF NOT EXISTS puesto (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT,
  descripcion TEXT
);

CREATE TABLE IF NOT EXISTS categoria_conocimiento (
  id_categoria INTEGER,
  id_conocimiento INTEGER,
  PRIMARY KEY (id_categoria, id_conocimiento)
);

CREATE TABLE IF NOT EXISTS itinerario_conocimiento (
  id_itinerario INTEGER,
  id_conocimiento INTEGER,
  orden INTEGER,
  mca_llave INTEGER,
  mca_opcional INTEGER,
  PRIMARY KEY (id_itinerario, id_conocimiento)
);

CREATE TABLE IF NOT EXISTS puesto_conocimiento (
  id_puesto INTEGER,
  id_conocimiento INTEGER,
  nivel INTEGER DEFAULT 1,
  mca_opcional INTEGER DEFAULT 0,
  PRIMARY KEY (id_puesto, id_conocimiento),
  FOREIGN KEY(id_puesto) REFERENCES puestos(id),
  FOREIGN KEY(id_conocimiento) REFERENCES conocimientos(id)
);

CREATE TABLE IF NOT EXISTS puesto_cualidad (
  id_puesto INTEGER,
  id_cualidad INTEGER,
  PRIMARY KEY (id_puesto, id_cualidad)
);

CREATE TABLE IF NOT EXISTS puesto_itinerario (
  id_puesto INTEGER,
  id_itinerario INTEGER,
  PRIMARY KEY (id_puesto, id_itinerario)
);
`);

module.exports = db;