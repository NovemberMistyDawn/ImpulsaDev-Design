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


CREATE TABLE IF NOT EXISTS itinerario_conocimiento (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  itinerario_id INTEGER,
  conocimiento_id INTEGER,
  nivel INTEGER,
  FOREIGN KEY (itinerario_id) REFERENCES itinerarios(id),
  FOREIGN KEY (conocimiento_id) REFERENCES conocimientos(id)
);




    `);

    // Insertar datos iniciales si está vacía
    const count = await db.get("SELECT COUNT(*) as c FROM puestos");
    if (count.c === 0) {
      console.log("🌱 Insertando datos iniciales...");
      await db.exec(`
       INSERT INTO puestos (id, nombre, descripcion) VALUES (1, 'Desarrollador/a Front-End', 'Crea la parte visual de las aplicaciones web usando HTML, CSS y JavaScript.');
INSERT INTO puestos (id, nombre, descripcion) VALUES (2, 'Desarrollador/a Back-End', 'Diseña la lógica, bases de datos y servidores que hacen funcionar las aplicaciones.');
INSERT INTO puestos (id, nombre, descripcion) VALUES (3, 'Desarrollador/a Full-Stack', 'Combina las habilidades de front-end y back-end para crear aplicaciones completas.');
INSERT INTO puestos (id, nombre, descripcion) VALUES (4, 'Ingeniero/a de Software', 'Diseña, desarrolla y mantiene sistemas y aplicaciones informáticas complejas.');
INSERT INTO puestos (id, nombre, descripcion) VALUES (5, 'Desarrollador/a Mobile', 'Crea aplicaciones para dispositivos móviles Android o iOS.');
INSERT INTO puestos (id, nombre, descripcion) VALUES (6, 'Desarrollador/a de Videojuegos', 'Diseña y programa videojuegos, incluyendo la mecánica, gráficos e interacción.');
INSERT INTO puestos (id, nombre, descripcion) VALUES (7, 'Administrador/a de Sistemas', 'Configura y mantiene servidores, redes y sistemas operativos.');
INSERT INTO puestos (id, nombre, descripcion) VALUES (8, 'Ingeniero/a DevOps', 'Integra desarrollo y operaciones para automatizar despliegues y mejorar la eficiencia.');
INSERT INTO puestos (id, nombre, descripcion) VALUES (9, 'Arquitecto/a de Sistemas', 'Diseña la estructura tecnológica de una organización o proyecto.');
INSERT INTO puestos (id, nombre, descripcion) VALUES (10, 'Especialista en Cloud Computing', 'Gestiona servicios en la nube y optimiza recursos en plataformas como AWS o Azure.');
INSERT INTO puestos (id, nombre, descripcion) VALUES (11, 'Analista de Seguridad Informática', 'Monitorea sistemas en busca de amenazas y vulnerabilidades.');
INSERT INTO puestos (id, nombre, descripcion) VALUES (12, 'Ingeniero/a en Ciberseguridad', 'Implementa soluciones de seguridad, cifrado y políticas de protección.');
INSERT INTO puestos (id, nombre, descripcion) VALUES (13, 'Pentester / Hacker Ético', 'Realiza pruebas de penetración para detectar fallos de seguridad.');
INSERT INTO puestos (id, nombre, descripcion) VALUES (14, 'Consultor/a de Seguridad', 'Asesora a empresas sobre cómo proteger su información y cumplir normativas.');
INSERT INTO puestos (id, nombre, descripcion) VALUES (15, 'Analista de Datos', 'Extrae y analiza datos para generar informes y apoyar la toma de decisiones.');
INSERT INTO puestos (id, nombre, descripcion) VALUES (16, 'Científico/a de Datos', 'Aplica modelos estadísticos e inteligencia artificial para descubrir patrones complejos.');
INSERT INTO puestos (id, nombre, descripcion) VALUES (17, 'Ingeniero/a de Datos', 'Diseña y mantiene infraestructuras de almacenamiento y procesamiento de datos.');
INSERT INTO puestos (id, nombre, descripcion) VALUES (18, 'Especialista en Big Data', 'Gestiona grandes volúmenes de datos usando tecnologías como Hadoop o Spark.');
INSERT INTO puestos (id, nombre, descripcion) VALUES (19, 'Ingeniero/a de Machine Learning', 'Crea modelos predictivos y sistemas de aprendizaje automático.');
INSERT INTO puestos (id, nombre, descripcion) VALUES (20, 'Especialista en Procesamiento del Lenguaje Natural', 'Desarrolla sistemas que entienden y generan lenguaje humano.');
INSERT INTO puestos (id, nombre, descripcion) VALUES (21, 'Investigador/a en Inteligencia Artificial', 'Explora nuevos métodos y algoritmos de inteligencia artificial.');
INSERT INTO puestos (id, nombre, descripcion) VALUES (22, 'Técnico/a en Redes', 'Instala y mantiene redes de datos locales y remotas.');
INSERT INTO puestos (id, nombre, descripcion) VALUES (23, 'Ingeniero/a de Telecomunicaciones', 'Diseña infraestructuras de comunicación como fibra óptica o 5G.');
INSERT INTO puestos (id, nombre, descripcion) VALUES (24, 'Administrador/a de Red', 'Monitorea y gestiona el tráfico y la seguridad de las redes.');
INSERT INTO puestos (id, nombre, descripcion) VALUES (25, 'Técnico/a de Soporte Informático', 'Atiende incidencias de usuarios y resuelve problemas técnicos.');
INSERT INTO puestos (id, nombre, descripcion) VALUES (26, 'Especialista en Help Desk', 'Brinda soporte técnico remoto y seguimiento de incidencias.');
INSERT INTO puestos (id, nombre, descripcion) VALUES (27, 'Gestor/a de Activos TI', 'Controla el inventario de equipos y licencias de software.');
INSERT INTO puestos (id, nombre, descripcion) VALUES (28, 'Jefe/a de Proyecto TIC', 'Planifica, coordina y supervisa proyectos tecnológicos.');
INSERT INTO puestos (id, nombre, descripcion) VALUES (29, 'Chief Information Officer (CIO)', 'Dirige la estrategia tecnológica de una empresa.');
INSERT INTO puestos (id, nombre, descripcion) VALUES (30, 'Chief Technology Officer (CTO)', 'Lidera la innovación técnica y las decisiones de arquitectura tecnológica.');
INSERT INTO puestos (id, nombre, descripcion) VALUES (31, 'Consultor/a Tecnológico', 'Asesora empresas sobre adopción de soluciones TIC.');
INSERT INTO puestos (id, nombre, descripcion) VALUES (32, 'Diseñador/a UX', 'Optimiza la experiencia del usuario en productos digitales.');
INSERT INTO puestos (id, nombre, descripcion) VALUES (33, 'Diseñador/a UI', 'Diseña la apariencia visual de aplicaciones y sitios web.');
INSERT INTO puestos (id, nombre, descripcion) VALUES (34, 'Diseñador/a Multimedia', 'Crea elementos visuales, animaciones o contenidos interactivos.');
INSERT INTO puestos (id, nombre, descripcion) VALUES (35, 'Formador/a TIC', 'Imparte cursos y capacitaciones sobre herramientas tecnológicas.');
INSERT INTO puestos (id, nombre, descripcion) VALUES (36, 'Técnico/a de E-learning', 'Diseña y administra plataformas de educación virtual.');
INSERT INTO puestos (id, nombre, descripcion) VALUES (37, 'Especialista en Blockchain', 'Desarrolla soluciones basadas en cadenas de bloques y criptografía.');
INSERT INTO puestos (id, nombre, descripcion) VALUES (38, 'Ingeniero/a en Robótica', 'Diseña sistemas automatizados y robots inteligentes.');
INSERT INTO puestos (id, nombre, descripcion) VALUES (39, 'Especialista en IoT', 'Conecta dispositivos físicos a redes digitales para automatización y control.');
INSERT INTO puestos (id, nombre, descripcion) VALUES (40, 'Analista de Automatización / RPA', 'Crea bots que automatizan tareas repetitivas.');



      INSERT INTO cualidades (nombre, descripcion) VALUES
        ('Trabajo en equipo', 'Capacidad para colaborar eficazmente con otros profesionales.'),
        ('Resolución de problemas', 'Capacidad de analizar y solucionar incidencias.'),
        ('Comunicación', 'Habilidad para expresar ideas claramente.'),
        ('Adaptabilidad', 'Capacidad para ajustarse a entornos cambiantes.');

      INSERT INTO conocimientos (id, nombre, descripcion) VALUES (1, 'Python', 'Lenguaje versátil usado en desarrollo web, ciencia de datos, inteligencia artificial y automatización.');
INSERT INTO conocimientos (id, nombre, descripcion) VALUES (2, 'Java', 'Lenguaje orientado a objetos utilizado en backend empresarial y desarrollo Android.');
INSERT INTO conocimientos (id, nombre, descripcion) VALUES (3, 'JavaScript', 'Lenguaje fundamental para desarrollo web en el lado del cliente y del servidor.');
INSERT INTO conocimientos (id, nombre, descripcion) VALUES (4, 'TypeScript', 'Superset de JavaScript que añade tipado estático para mejorar la calidad del código.');
INSERT INTO conocimientos (id, nombre, descripcion) VALUES (5, 'C#', 'Lenguaje de programación usado en entornos Microsoft, videojuegos y aplicaciones de escritorio.');
INSERT INTO conocimientos (id, nombre, descripcion) VALUES (6, 'C++', 'Lenguaje de alto rendimiento usado en software de sistemas, juegos y aplicaciones críticas.');
INSERT INTO conocimientos (id, nombre, descripcion) VALUES (7, 'PHP', 'Lenguaje de programación ampliamente utilizado en desarrollo web y sistemas CMS.');
INSERT INTO conocimientos (id, nombre, descripcion) VALUES (8, 'SQL', 'Lenguaje de consulta estructurado para gestionar bases de datos relacionales.');
INSERT INTO conocimientos (id, nombre, descripcion) VALUES (9, 'R', 'Lenguaje especializado en análisis estadístico y visualización de datos.');
INSERT INTO conocimientos (id, nombre, descripcion) VALUES (10, 'Go (Golang)', 'Lenguaje eficiente desarrollado por Google para backend y sistemas distribuidos.');
INSERT INTO conocimientos (id, nombre, descripcion) VALUES (11, 'Kotlin', 'Lenguaje moderno para desarrollo Android y multiplataforma.');
INSERT INTO conocimientos (id, nombre, descripcion) VALUES (12, 'Swift', 'Lenguaje oficial para el desarrollo en iOS y macOS.');
INSERT INTO conocimientos (id, nombre, descripcion) VALUES (13, 'React', 'Librería JavaScript para crear interfaces de usuario interactivas.');
INSERT INTO conocimientos (id, nombre, descripcion) VALUES (14, 'Angular', 'Framework front-end de Google para construir aplicaciones web dinámicas.');
INSERT INTO conocimientos (id, nombre, descripcion) VALUES (15, 'Vue.js', 'Framework progresivo para interfaces web reactivas y modulares.');
INSERT INTO conocimientos (id, nombre, descripcion) VALUES (16, 'Django', 'Framework de Python para desarrollo web rápido y seguro.');
INSERT INTO conocimientos (id, nombre, descripcion) VALUES (17, 'Flask', 'Microframework Python para crear aplicaciones web ligeras.');
INSERT INTO conocimientos (id, nombre, descripcion) VALUES (18, 'Spring Boot', 'Framework Java para construir aplicaciones empresariales modernas.');
INSERT INTO conocimientos (id, nombre, descripcion) VALUES (19, '.NET Core', 'Plataforma multiplataforma de Microsoft para desarrollo de software.');
INSERT INTO conocimientos (id, nombre, descripcion) VALUES (20, 'Node.js', 'Entorno de ejecución JavaScript para backend y aplicaciones en tiempo real.');
INSERT INTO conocimientos (id, nombre, descripcion) VALUES (21, 'Express.js', 'Framework minimalista para construir APIs con Node.js.');
INSERT INTO conocimientos (id, nombre, descripcion) VALUES (22, 'TensorFlow', 'Librería de aprendizaje automático desarrollada por Google.');
INSERT INTO conocimientos (id, nombre, descripcion) VALUES (23, 'PyTorch', 'Librería de deep learning muy usada en investigación e IA aplicada.');
INSERT INTO conocimientos (id, nombre, descripcion) VALUES (24, 'Unity', 'Motor de desarrollo de videojuegos multiplataforma.');
INSERT INTO conocimientos (id, nombre, descripcion) VALUES (25, 'Unreal Engine', 'Motor gráfico avanzado para videojuegos y simulaciones 3D.');
INSERT INTO conocimientos (id, nombre, descripcion) VALUES (26, 'MySQL', 'Sistema de gestión de bases de datos relacional de código abierto.');
INSERT INTO conocimientos (id, nombre, descripcion) VALUES (27, 'PostgreSQL', 'Base de datos relacional avanzada con soporte de tipos personalizados.');
INSERT INTO conocimientos (id, nombre, descripcion) VALUES (28, 'SQLite', 'Motor de base de datos ligero embebido en muchas aplicaciones.');
INSERT INTO conocimientos (id, nombre, descripcion) VALUES (29, 'MongoDB', 'Base de datos NoSQL orientada a documentos.');
INSERT INTO conocimientos (id, nombre, descripcion) VALUES (30, 'Redis', 'Sistema en memoria usado para caché, colas y mensajería.');
INSERT INTO conocimientos (id, nombre, descripcion) VALUES (31, 'Oracle Database', 'Base de datos empresarial robusta y segura.');
INSERT INTO conocimientos (id, nombre, descripcion) VALUES (32, 'Docker', 'Plataforma para crear, ejecutar y desplegar aplicaciones en contenedores.');
INSERT INTO conocimientos (id, nombre, descripcion) VALUES (33, 'Kubernetes', 'Sistema de orquestación de contenedores para despliegue escalable.');
INSERT INTO conocimientos (id, nombre, descripcion) VALUES (34, 'Git', 'Sistema de control de versiones distribuido para gestionar código fuente.');
INSERT INTO conocimientos (id, nombre, descripcion) VALUES (35, 'GitHub', 'Plataforma de alojamiento de código y colaboración basada en Git.');
INSERT INTO conocimientos (id, nombre, descripcion) VALUES (36, 'GitLab', 'Herramienta de DevOps para control de versiones, CI/CD y gestión de proyectos.');
INSERT INTO conocimientos (id, nombre, descripcion) VALUES (37, 'Bitbucket', 'Plataforma de gestión de repositorios Git con funciones empresariales.');
INSERT INTO conocimientos (id, nombre, descripcion) VALUES (38, 'Jenkins', 'Servidor de integración continua para automatizar despliegues.');
INSERT INTO conocimientos (id, nombre, descripcion) VALUES (39, 'AWS', 'Plataforma de servicios en la nube de Amazon.');
   





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

INSERT INTO itinerario_conocimiento (itinerario_id, conocimiento_id, nivel) VALUES
    (1, 1, 0), -- JavaScript nivel 0 en "Desarrollo Web"
    (1, 2, 1), -- Python nivel 1
    (1, 3, 2), -- SQL nivel 2
    (2, 2, 0), -- Ciencia de Datos: Python nivel 0
    (2, 3, 1), -- SQL nivel 1
    (2, 4, 2); -- Linux nivel 2



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

  // 🔸 Conocimientos con nivel
    const conocimientos = await db.all(
      `SELECT con.nombre, con.descripcion, ic.nivel
       FROM conocimientos con
       INNER JOIN itinerario_conocimiento ic ON ic.conocimiento_id = con.id
       WHERE ic.itinerario_id = ?
       ORDER BY ic.nivel ASC`,
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
  conocimientos: conocimientos, // ahora incluye { nombre, descripcion, nivel }
  puestos: puestos, // sigue igual
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

    // 🔍 Obtener puestos relacionados
    const puestos = await db.all(
      `SELECT p.id, p.nombre
       FROM puestos p
       INNER JOIN puesto_conocimiento pc ON p.id = pc.puesto_id
       WHERE pc.conocimiento_id = ?`,
      [conocimiento.id]
    );

    // 🔍 Obtener itinerarios relacionados (vía puestos → itinerarios)
    const itinerarios = await db.all(
      `SELECT DISTINCT i.id, i.nombre
       FROM itinerarios i
       INNER JOIN puesto_itinerario pi ON i.id = pi.itinerario_id
       INNER JOIN puesto_conocimiento pc ON pi.puesto_id = pc.puesto_id
       WHERE pc.conocimiento_id = ?`,
      [conocimiento.id]
    );

    res.json({
      conocimiento_id: conocimiento.id,
      conocimiento_nombre: conocimiento.nombre,
      conocimiento_descripcion: conocimiento.descripcion,
      puestos,
      itinerarios
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