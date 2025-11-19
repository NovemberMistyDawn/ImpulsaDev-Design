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



     INSERT INTO cualidades (id, nombre, descripcion) VALUES (1, 'Comunicación efectiva', 'Capacidad para transmitir ideas técnicas y no técnicas con claridad, tanto oral como escrita, adaptando el lenguaje al interlocutor.');
INSERT INTO cualidades (id, nombre, descripcion) VALUES (2, 'Trabajo en equipo', 'Colaborar con otros perfiles técnicos y no técnicos para alcanzar objetivos comunes y compartir conocimiento.');
INSERT INTO cualidades (id, nombre, descripcion) VALUES (3, 'Resolución de problemas', 'Analizar fallos o retos técnicos y encontrar soluciones prácticas, rápidas y bien fundamentadas.');
INSERT INTO cualidades (id, nombre, descripcion) VALUES (4, 'Pensamiento crítico', 'Evaluar información, distinguir supuestos de hechos y tomar decisiones basadas en evidencia y lógica.');
INSERT INTO cualidades (id, nombre, descripcion) VALUES (5, 'Adaptabilidad', 'Ajustarse rápidamente a cambios en tecnologías, requisitos o metodologías de trabajo.');
INSERT INTO cualidades (id, nombre, descripcion) VALUES (6, 'Aprendizaje continuo', 'Motivación por aprender nuevas herramientas, lenguajes y buenas prácticas de forma constante.');
INSERT INTO cualidades (id, nombre, descripcion) VALUES (7, 'Gestión del tiempo', 'Priorizar tareas, cumplir plazos y administrar el tiempo eficientemente en entornos dinámicos.');
INSERT INTO cualidades (id, nombre, descripcion) VALUES (8, 'Capacidad de priorización', 'Identificar las tareas más valiosas o críticas y organizarlas según su impacto.');
INSERT INTO cualidades (id, nombre, descripcion) VALUES (9, 'Atención al detalle', 'Revisar y verificar el trabajo técnico con precisión para garantizar calidad y fiabilidad.');
INSERT INTO cualidades (id, nombre, descripcion) VALUES (10, 'Empatía', 'Comprender las necesidades y perspectivas de usuarios y compañeros para colaborar mejor.');
INSERT INTO cualidades (id, nombre, descripcion) VALUES (11, 'Orientación al cliente', 'Diseñar soluciones pensando en la experiencia y necesidades del usuario o cliente final.');
INSERT INTO cualidades (id, nombre, descripcion) VALUES (12, 'Liderazgo técnico', 'Guiar decisiones tecnológicas y apoyar el desarrollo profesional del equipo.');
INSERT INTO cualidades (id, nombre, descripcion) VALUES (13, 'Mentoría', 'Compartir conocimiento, enseñar y ayudar al crecimiento profesional de otros.');
INSERT INTO cualidades (id, nombre, descripcion) VALUES (14, 'Negociación', 'Lograr acuerdos entre distintas partes interesadas equilibrando prioridades técnicas y de negocio.');
INSERT INTO cualidades (id, nombre, descripcion) VALUES (15, 'Gestión de proyectos', 'Planificar entregas, coordinar tareas y supervisar el progreso de iniciativas tecnológicas.');
INSERT INTO cualidades (id, nombre, descripcion) VALUES (16, 'Comunicación en remoto', 'Documentar y comunicar avances de forma efectiva en equipos distribuidos o asincrónicos.');
INSERT INTO cualidades (id, nombre, descripcion) VALUES (17, 'Toma de decisiones bajo incertidumbre', 'Elegir la mejor alternativa ante escenarios con información incompleta o ambigua.');
INSERT INTO cualidades (id, nombre, descripcion) VALUES (18, 'Creatividad e innovación', 'Proponer soluciones originales o nuevas formas de abordar problemas técnicos o de negocio.');
INSERT INTO cualidades (id, nombre, descripcion) VALUES (19, 'Resiliencia', 'Mantener la calma, el enfoque y el rendimiento ante presión, errores o plazos ajustados.');
INSERT INTO cualidades (id, nombre, descripcion) VALUES (20, 'Ética profesional', 'Tomar decisiones responsables, respetando la privacidad, la seguridad y el impacto social de la tecnología.');
INSERT INTO cualidades (id, nombre, descripcion) VALUES (21, 'Capacidad de síntesis', 'Resumir información compleja y comunicar conclusiones de forma clara y estructurada.');
INSERT INTO cualidades (id, nombre, descripcion) VALUES (22, 'Habilidades de presentación', 'Exponer ideas, resultados o proyectos de manera clara y persuasiva ante equipos o clientes.');
INSERT INTO cualidades (id, nombre, descripcion) VALUES (23, 'Resolución de conflictos', 'Medir y gestionar desacuerdos de manera constructiva para mantener relaciones productivas.');
INSERT INTO cualidades (id, nombre, descripcion) VALUES (24, 'Proactividad', 'Tomar la iniciativa para anticipar problemas, proponer mejoras y generar valor.');
INSERT INTO cualidades (id, nombre, descripcion) VALUES (25, 'Pensamiento sistemático', 'Comprender las interdependencias entre los distintos componentes de un sistema.');
INSERT INTO cualidades (id, nombre, descripcion) VALUES (26, 'Capacidad analítica', 'Interpretar datos, métricas o evidencias para tomar decisiones técnicas informadas.');
INSERT INTO cualidades (id, nombre, descripcion) VALUES (27, 'Documentación clara', 'Redactar especificaciones, guías y documentación técnica útil, precisa y mantenible.');
INSERT INTO cualidades (id, nombre, descripcion) VALUES (28, 'Sensibilidad cultural', 'Respetar la diversidad y fomentar la inclusión en equipos multiculturales.');
INSERT INTO cualidades (id, nombre, descripcion) VALUES (29, 'Habilidades comerciales básicas', 'Comprender el impacto económico de las decisiones técnicas y comunicar beneficios al negocio.');
INSERT INTO cualidades (id, nombre, descripcion) VALUES (30, 'Orientación a la calidad', 'Impulsar la mejora continua y aplicar buenas prácticas para elevar la calidad de procesos y productos.');







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
INSERT INTO conocimientos (id, nombre, descripcion) VALUES (40, 'Microsoft Azure', 'Plataforma de servicios cloud de Microsoft.');
INSERT INTO conocimientos (id, nombre, descripcion) VALUES (41, 'Google Cloud Platform', 'Plataforma en la nube de Google con servicios escalables.');
INSERT INTO conocimientos (id, nombre, descripcion) VALUES (42, 'Terraform', 'Herramienta para definir y gestionar infraestructura como código.');
INSERT INTO conocimientos (id, nombre, descripcion) VALUES (43, 'Ansible', 'Herramienta para automatizar configuración y despliegue de sistemas.');
INSERT INTO conocimientos (id, nombre, descripcion) VALUES (44, 'Wireshark', 'Analizador de protocolos de red para inspección de tráfico.');
INSERT INTO conocimientos (id, nombre, descripcion) VALUES (45, 'Metasploit', 'Framework para realizar pruebas de penetración y seguridad.');
INSERT INTO conocimientos (id, nombre, descripcion) VALUES (46, 'Nmap', 'Herramienta de escaneo de redes para descubrir dispositivos y servicios.');
INSERT INTO conocimientos (id, nombre, descripcion) VALUES (47, 'Kali Linux', 'Distribución especializada en pruebas de seguridad y hacking ético.');
INSERT INTO conocimientos (id, nombre, descripcion) VALUES (48, 'Burp Suite', 'Plataforma para pruebas de seguridad en aplicaciones web.');
INSERT INTO conocimientos (id, nombre, descripcion) VALUES (49, 'Snort', 'Sistema de detección y prevención de intrusiones en redes.');
INSERT INTO conocimientos (id, nombre, descripcion) VALUES (50, 'Power BI', 'Herramienta de análisis y visualización de datos de Microsoft.');
INSERT INTO conocimientos (id, nombre, descripcion) VALUES (51, 'Tableau', 'Plataforma para visualización e inteligencia de negocios.');
INSERT INTO conocimientos (id, nombre, descripcion) VALUES (52, 'Excel Avanzado', 'Uso de funciones, tablas dinámicas y macros para análisis de datos.');
INSERT INTO conocimientos (id, nombre, descripcion) VALUES (53, 'Jupyter Notebook', 'Entorno interactivo para desarrollo y análisis en Python.');
INSERT INTO conocimientos (id, nombre, descripcion) VALUES (54, 'Apache Spark', 'Framework de procesamiento masivo de datos.');
INSERT INTO conocimientos (id, nombre, descripcion) VALUES (55, 'Figma', 'Herramienta colaborativa de diseño de interfaces y prototipos.');
INSERT INTO conocimientos (id, nombre, descripcion) VALUES (56, 'Adobe XD', 'Software para diseño de experiencia de usuario e interfaces.');
INSERT INTO conocimientos (id, nombre, descripcion) VALUES (57, 'Adobe Photoshop', 'Editor de imágenes y gráficos.');
INSERT INTO conocimientos (id, nombre, descripcion) VALUES (58, 'Illustrator', 'Herramienta profesional para diseño vectorial.');
INSERT INTO conocimientos (id, nombre, descripcion) VALUES (59, 'Sketch', 'Aplicación de diseño de interfaces para macOS.');
INSERT INTO conocimientos (id, nombre, descripcion) VALUES (60, 'Linux / Unix', 'Sistemas operativos de uso común en servidores y entornos técnicos.');
INSERT INTO conocimientos (id, nombre, descripcion) VALUES (61, 'Windows Server', 'Sistema operativo empresarial de Microsoft para servidores.');
INSERT INTO conocimientos (id, nombre, descripcion) VALUES (62, 'Cisco IOS', 'Sistema operativo usado en routers y switches de Cisco.');
INSERT INTO conocimientos (id, nombre, descripcion) VALUES (63, 'VMware', 'Plataforma de virtualización para servidores y escritorios.');
INSERT INTO conocimientos (id, nombre, descripcion) VALUES (64, 'VirtualBox', 'Software libre para virtualización de sistemas operativos.');
INSERT INTO conocimientos (id, nombre, descripcion) VALUES (65, 'Active Directory', 'Servicio de gestión de usuarios y políticas en red.');
INSERT INTO conocimientos (id, nombre, descripcion) VALUES (66, 'Scrum', 'Marco ágil para gestión de proyectos mediante iteraciones.');
INSERT INTO conocimientos (id, nombre, descripcion) VALUES (67, 'Kanban', 'Método visual para gestionar el flujo de trabajo.');
INSERT INTO conocimientos (id, nombre, descripcion) VALUES (68, 'Jira', 'Herramienta de Atlassian para gestión ágil y seguimiento de tareas.');
INSERT INTO conocimientos (id, nombre, descripcion) VALUES (69, 'Trello', 'Aplicación visual de gestión de proyectos basada en tableros.');
INSERT INTO conocimientos (id, nombre, descripcion) VALUES (70, 'Confluence', 'Plataforma colaborativa para documentación y conocimiento.');
INSERT INTO conocimientos (id, nombre, descripcion) VALUES (71, 'ITIL', 'Conjunto de buenas prácticas para la gestión de servicios de TI.');
INSERT INTO conocimientos (id, nombre, descripcion) VALUES (72, 'COBIT', 'Marco de referencia para el gobierno y control de TI.');
INSERT INTO conocimientos (id, nombre, descripcion) VALUES (73, 'Arduino', 'Plataforma de hardware y software para proyectos electrónicos.');
INSERT INTO conocimientos (id, nombre, descripcion) VALUES (74, 'Raspberry Pi', 'Microordenador utilizado en proyectos de IoT y robótica.');
INSERT INTO conocimientos (id, nombre, descripcion) VALUES (75, 'Robot Operating System (ROS)', 'Framework para desarrollo y control de robots.');
INSERT INTO conocimientos (id, nombre, descripcion) VALUES (76, 'Hyper-V', 'Tecnología de virtualización de Microsoft para servidores.');
INSERT INTO conocimientos (id, nombre, descripcion) VALUES (77, 'VPN', 'Tecnología que permite conexiones seguras a redes remotas.');
INSERT INTO conocimientos (id, nombre, descripcion) VALUES (78, 'PowerShell', 'Lenguaje de automatización y administración de sistemas de Microsoft.');
INSERT INTO conocimientos (id, nombre, descripcion) VALUES (79, 'Bash', 'Intérprete de comandos de Unix/Linux para automatización.');
INSERT INTO conocimientos (id, nombre, descripcion) VALUES (80, 'MATLAB', 'Entorno de cálculo numérico usado en ingeniería y ciencia.');   





INSERT INTO itinerarios (id, nombre, descripcion) VALUES (1, 'Itinerario Desarrollador Front-End', 'Formación en HTML, CSS, JavaScript, frameworks modernos (React, Angular, Vue), control de versiones y diseño responsive.');
INSERT INTO itinerarios (id, nombre, descripcion) VALUES (2, 'Itinerario Desarrollador Back-End', 'Aprendizaje en lenguajes de servidor (Python, Java, PHP, Node.js), bases de datos SQL/NoSQL, APIs REST y seguridad web.');
INSERT INTO itinerarios (id, nombre, descripcion) VALUES (3, 'Itinerario Desarrollador Full-Stack', 'Combinación de desarrollo Front-End y Back-End, incluyendo despliegue de aplicaciones y arquitectura cliente-servidor.');
INSERT INTO itinerarios (id, nombre, descripcion) VALUES (4, 'Itinerario Ingeniero de Software', 'Formación en principios SOLID, patrones de diseño, testing automatizado, metodologías ágiles y gestión del ciclo de vida del software.');
INSERT INTO itinerarios (id, nombre, descripcion) VALUES (5, 'Itinerario Desarrollador Mobile', 'Aprendizaje de desarrollo nativo (Kotlin, Swift) y multiplataforma (Flutter, React Native), junto con buenas prácticas de UX móvil.');
INSERT INTO itinerarios (id, nombre, descripcion) VALUES (6, 'Itinerario Desarrollador de Videojuegos', 'Enseñanza de motores de juego (Unity, Unreal), programación en C# y C++, modelado 3D y principios de diseño de videojuegos.');
INSERT INTO itinerarios (id, nombre, descripcion) VALUES (7, 'Itinerario Administrador de Sistemas', 'Configuración de sistemas operativos (Windows Server, Linux), redes, scripting Bash y PowerShell, y gestión de usuarios y permisos.');
INSERT INTO itinerarios (id, nombre, descripcion) VALUES (8, 'Itinerario Ingeniero DevOps', 'Automatización con CI/CD, infraestructura como código (Docker, Kubernetes, Terraform), monitorización y prácticas ágiles.');
INSERT INTO itinerarios (id, nombre, descripcion) VALUES (9, 'Itinerario Arquitecto de Sistemas', 'Diseño de arquitecturas escalables, integración de servicios, gestión de microservicios, y liderazgo técnico en infraestructura TI.');
INSERT INTO itinerarios (id, nombre, descripcion) VALUES (10, 'Itinerario Especialista en Cloud Computing', 'Formación en AWS, Azure o GCP, administración de recursos en la nube, seguridad, facturación y despliegue automatizado.');
INSERT INTO itinerarios (id, nombre, descripcion) VALUES (11, 'Itinerario Analista de Seguridad Informática', 'Auditoría de sistemas, gestión de vulnerabilidades, análisis de riesgos, políticas de seguridad y herramientas SIEM.');
INSERT INTO itinerarios (id, nombre, descripcion) VALUES (12, 'Itinerario Ingeniero en Ciberseguridad', 'Criptografía, detección de intrusos, protección de redes, hacking ético y cumplimiento normativo (ISO 27001, GDPR).');
INSERT INTO itinerarios (id, nombre, descripcion) VALUES (13, 'Itinerario Pentester / Hacker Ético', 'Hacking ético, técnicas de explotación, análisis forense, OSINT, Kali Linux y herramientas de penetración.');
INSERT INTO itinerarios (id, nombre, descripcion) VALUES (14, 'Itinerario Consultor de Seguridad', 'Gestión de proyectos de seguridad, asesoría en cumplimiento, comunicación de riesgos y auditoría técnica.');
INSERT INTO itinerarios (id, nombre, descripcion) VALUES (15, 'Itinerario Analista de Datos', 'Estadística, SQL, Python (pandas, NumPy), visualización (Tableau, Power BI) y análisis exploratorio de datos.');
INSERT INTO itinerarios (id, nombre, descripcion) VALUES (16, 'Itinerario Científico de Datos', 'Machine Learning, Deep Learning, Python avanzado, modelos predictivos y tratamiento de grandes volúmenes de datos.');
INSERT INTO itinerarios (id, nombre, descripcion) VALUES (17, 'Itinerario Ingeniero de Datos', 'ETL, bases de datos distribuidas, BigQuery, Spark, pipelines de datos y almacenamiento escalable.');
INSERT INTO itinerarios (id, nombre, descripcion) VALUES (18, 'Itinerario Especialista en Big Data', 'Arquitectura de datos masivos, procesamiento paralelo, Hadoop, Spark y sistemas distribuidos.');
INSERT INTO itinerarios (id, nombre, descripcion) VALUES (19, 'Itinerario Ingeniero de Machine Learning', 'Fundamentos matemáticos de IA, entrenamiento de modelos, TensorFlow, PyTorch y MLOps.');
INSERT INTO itinerarios (id, nombre, descripcion) VALUES (20, 'Itinerario Especialista en NLP', 'Procesamiento del lenguaje natural, tokenización, embeddings, modelos LLM, análisis semántico y chatbots.');
INSERT INTO itinerarios (id, nombre, descripcion) VALUES (21, 'Itinerario Investigador en IA', 'Aprendizaje profundo, algoritmos evolutivos, papers científicos, ética de IA y experimentación avanzada.');
INSERT INTO itinerarios (id, nombre, descripcion) VALUES (22, 'Itinerario Técnico en Redes', 'Topologías de red, TCP/IP, routers y switches, protocolos de comunicación y configuración básica de redes.');
INSERT INTO itinerarios (id, nombre, descripcion) VALUES (23, 'Itinerario Ingeniero de Telecomunicaciones', 'Diseño de redes, fibra óptica, sistemas inalámbricos, comunicación digital y administración de ancho de banda.');
INSERT INTO itinerarios (id, nombre, descripcion) VALUES (24, 'Itinerario Administrador de Red', 'Gestión de infraestructura LAN/WAN, seguridad de red, herramientas de monitorización y mantenimiento de equipos.');
INSERT INTO itinerarios (id, nombre, descripcion) VALUES (25, 'Itinerario Técnico de Soporte Informático', 'Diagnóstico de hardware/software, atención al usuario, instalación de sistemas y mantenimiento de equipos.');
INSERT INTO itinerarios (id, nombre, descripcion) VALUES (26, 'Itinerario Especialista en Help Desk', 'Gestión de incidencias, atención remota, documentación técnica y herramientas ITSM.');
INSERT INTO itinerarios (id, nombre, descripcion) VALUES (27, 'Itinerario Gestor de Activos TI', 'Inventariado de hardware y software, gestión de licencias, ciclo de vida de activos y auditoría tecnológica.');
INSERT INTO itinerarios (id, nombre, descripcion) VALUES (28, 'Itinerario Jefe de Proyecto TIC', 'Gestión de proyectos ágiles (Scrum, Kanban), liderazgo de equipos, control de plazos y presupuestos.');
INSERT INTO itinerarios (id, nombre, descripcion) VALUES (29, 'Itinerario CIO', 'Gobierno de TI, estrategia digital, gestión presupuestaria, liderazgo organizativo y transformación tecnológica.');
INSERT INTO itinerarios (id, nombre, descripcion) VALUES (30, 'Itinerario CTO', 'Dirección técnica, innovación, gestión de arquitectura empresarial y estrategia tecnológica global.');
INSERT INTO itinerarios (id, nombre, descripcion) VALUES (31, 'Itinerario Consultor Tecnológico', 'Análisis de necesidades, diseño de soluciones, documentación funcional y comunicación con stakeholders.');
INSERT INTO itinerarios (id, nombre, descripcion) VALUES (32, 'Itinerario Diseñador UX', 'Investigación de usuarios, arquitectura de información, diseño de experiencias y prototipado con Figma.');
INSERT INTO itinerarios (id, nombre, descripcion) VALUES (33, 'Itinerario Diseñador UI', 'Diseño visual, tipografía, guías de estilo, diseño responsivo y herramientas como Adobe XD y Figma.');
INSERT INTO itinerarios (id, nombre, descripcion) VALUES (34, 'Itinerario Diseñador Multimedia', 'Creación audiovisual, animación, edición de video, diseño 2D/3D y herramientas de producción digital.');
INSERT INTO itinerarios (id, nombre, descripcion) VALUES (35, 'Itinerario Formador TIC', 'Pedagogía digital, creación de contenidos, LMS, evaluación en línea y estrategias de aprendizaje activo.');
INSERT INTO itinerarios (id, nombre, descripcion) VALUES (36, 'Itinerario Técnico de E-learning', 'Diseño instruccional, herramientas SCORM, Moodle, desarrollo de materiales y soporte técnico educativo.');
INSERT INTO itinerarios (id, nombre, descripcion) VALUES (37, 'Itinerario Especialista en Blockchain', 'Fundamentos de blockchain, contratos inteligentes, Solidity, Ethereum y aplicaciones descentralizadas.');
INSERT INTO itinerarios (id, nombre, descripcion) VALUES (38, 'Itinerario Ingeniero en Robótica', 'Electrónica, control de motores, visión artificial, ROS, sensores y programación de robots.');
INSERT INTO itinerarios (id, nombre, descripcion) VALUES (39, 'Itinerario Especialista en IoT', 'Redes de sensores, dispositivos conectados, MQTT, edge computing y seguridad en IoT.');
INSERT INTO itinerarios (id, nombre, descripcion) VALUES (40, 'Itinerario Analista de Automatización / RPA', 'Automatización de procesos, herramientas RPA (UiPath, Automation Anywhere), diseño de flujos y análisis de eficiencia.');

      `);


      await db.exec(`
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (1, 1);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (1, 2);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (1, 3);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (1, 5);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (1, 9);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (1, 24);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (1, 30);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (2, 2);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (2, 3);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (2, 4);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (2, 7);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (2, 9);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (2, 30);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (3, 2);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (3, 3);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (3, 5);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (3, 7);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (3, 9);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (3, 24);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (3, 30);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (4, 3);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (4, 4);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (4, 7);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (4, 9);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (4, 24);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (4, 30);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (5, 1);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (5, 2);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (5, 3);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (5, 5);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (5, 7);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (5, 24);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (6, 2);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (6, 3);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (6, 5);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (6, 18);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (6, 24);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (6, 19);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (7, 2);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (7, 3);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (7, 5);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (7, 7);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (7, 9);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (7, 19);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (8, 2);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (8, 3);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (8, 4);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (8, 7);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (8, 19);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (8, 24);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (8, 30);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (9, 3);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (9, 4);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (9, 7);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (9, 25);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (9, 26);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (9, 30);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (10, 3);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (10, 4);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (10, 7);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (10, 25);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (10, 26);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (10, 30);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (11, 3);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (11, 4);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (11, 7);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (11, 19);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (11, 20);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (11, 26);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (12, 3);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (12, 4);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (12, 7);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (12, 19);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (12, 20);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (12, 30);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (13, 3);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (13, 4);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (13, 7);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (13, 19);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (13, 20);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (14, 1);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (14, 3);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (14, 4);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (14, 10);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (14, 14);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (14, 20);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (15, 3);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (15, 4);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (15, 7);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (15, 26);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (15, 30);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (16, 3);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (16, 4);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (16, 7);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (16, 18);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (16, 25);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (16, 26);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (16, 30);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (17, 3);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (17, 4);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (17, 7);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (17, 25);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (17, 26);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (18, 3);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (18, 4);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (18, 7);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (18, 25);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (18, 26);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (19, 3);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (19, 4);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (19, 7);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (19, 18);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (19, 25);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (19, 26);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (20, 3);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (20, 4);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (20, 7);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (20, 25);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (20, 26);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (21, 3);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (21, 4);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (21, 7);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (21, 18);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (21, 25);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (21, 26);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (22, 2);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (22, 3);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (22, 5);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (22, 7);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (22, 9);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (22, 19);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (23, 2);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (23, 3);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (23, 5);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (23, 7);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (23, 9);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (23, 19);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (24, 2);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (24, 3);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (24, 5);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (24, 7);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (24, 9);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (25, 1);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (25, 2);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (25, 3);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (25, 5);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (25, 9);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (25, 10);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (26, 1);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (26, 2);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (26, 3);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (26, 5);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (26, 9);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (26, 10);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (27, 3);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (27, 7);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (27, 21);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (27, 25);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (27, 30);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (28, 1);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (28, 2);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (28, 3);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (28, 14);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (28, 15);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (28, 28);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (28, 30);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (29, 1);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (29, 3);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (29, 14);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (29, 15);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (29, 20);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (29, 28);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (29, 30);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (30, 1);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (30, 3);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (30, 12);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (30, 14);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (30, 15);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (30, 28);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (30, 30);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (31, 1);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (31, 3);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (31, 4);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (31, 14);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (31, 15);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (31, 20);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (31, 30);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (32, 1);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (32, 2);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (32, 5);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (32, 10);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (32, 11);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (32, 18);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (33, 1);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (33, 2);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (33, 5);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (33, 9);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (33, 11);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (33, 18);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (34, 1);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (34, 2);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (34, 5);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (34, 9);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (34, 18);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (35, 1);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (35, 2);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (35, 10);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (35, 13);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (35, 18);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (35, 20);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (36, 1);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (36, 2);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (36, 5);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (36, 10);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (36, 13);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (36, 18);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (37, 3);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (37, 4);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (37, 7);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (37, 20);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (37, 25);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (37, 30);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (38, 3);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (38, 4);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (38, 5);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (38, 18);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (38, 25);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (38, 26);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (39, 3);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (39, 4);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (39, 5);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (39, 25);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (39, 26);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (39, 30);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (40, 3);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (40, 4);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (40, 5);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (40, 18);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (40, 25);
INSERT INTO puesto_cualidad (puesto_id, cualidad_id) VALUES (40, 26);




INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (1, 3, 5);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (1, 4, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (1, 13, 5);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (1, 14, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (1, 15, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (1, 34, 5);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (1, 35, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (1, 55, 3);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (1, 56, 3);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (2, 1, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (2, 2, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (2, 7, 3);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (2, 8, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (2, 18, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (2, 20, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (2, 26, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (2, 27, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (2, 34, 5);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (3, 3, 5);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (3, 1, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (3, 13, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (3, 20, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (3, 8, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (3, 26, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (3, 34, 5);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (3, 39, 3);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (4, 1, 5);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (4, 2, 5);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (4, 8, 5);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (4, 18, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (4, 19, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (4, 34, 5);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (4, 66, 3);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (5, 11, 5);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (5, 12, 5);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (5, 13, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (5, 34, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (5, 39, 3);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (6, 5, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (6, 6, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (6, 24, 5);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (6, 25, 5);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (6, 57, 3);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (6, 34, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (7, 60, 5);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (7, 61, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (7, 63, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (7, 64, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (7, 65, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (7, 76, 3);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (8, 32, 5);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (8, 33, 5);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (8, 38, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (8, 34, 5);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (8, 42, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (8, 43, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (8, 39, 3);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (9, 18, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (9, 19, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (9, 39, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (9, 40, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (9, 41, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (9, 33, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (9, 32, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (10, 39, 5);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (10, 40, 5);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (10, 41, 5);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (10, 33, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (10, 32, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (10, 42, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (11, 44, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (11, 46, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (11, 49, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (11, 60, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (11, 61, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (12, 45, 5);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (12, 47, 5);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (12, 48, 5);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (12, 49, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (12, 44, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (13, 45, 5);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (13, 47, 5);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (13, 46, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (13, 48, 5);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (13, 60, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (14, 44, 3);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (14, 49, 3);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (14, 71, 3);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (14, 72, 3);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (15, 1, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (15, 8, 5);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (15, 50, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (15, 51, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (15, 52, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (15, 53, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (16, 1, 5);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (16, 9, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (16, 22, 5);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (16, 23, 5);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (16, 54, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (16, 53, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (17, 1, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (17, 8, 5);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (17, 26, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (17, 27, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (17, 54, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (17, 33, 3);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (18, 1, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (18, 54, 5);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (18, 29, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (18, 30, 3);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (18, 33, 3);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (19, 1, 5);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (19, 22, 5);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (19, 23, 5);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (19, 54, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (20, 1, 5);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (20, 22, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (20, 23, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (20, 53, 3);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (21, 1, 5);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (21, 22, 5);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (21, 23, 5);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (21, 9, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (21, 54, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (22, 62, 5);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (22, 60, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (22, 61, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (22, 77, 3);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (23, 62, 5);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (23, 60, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (23, 61, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (23, 77, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (24, 62, 5);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (24, 49, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (24, 60, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (24, 77, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (25, 60, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (25, 61, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (25, 65, 3);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (25, 78, 3);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (25, 79, 3);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (26, 60, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (26, 61, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (26, 65, 3);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (26, 78, 3);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (27, 61, 3);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (27, 65, 3);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (27, 66, 3);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (27, 68, 3);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (28, 66, 5);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (28, 67, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (28, 68, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (28, 70, 3);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (29, 71, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (29, 72, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (29, 39, 3);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (29, 40, 3);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (30, 1, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (30, 39, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (30, 40, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (30, 66, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (31, 71, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (31, 72, 3);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (31, 39, 3);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (31, 40, 3);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (32, 55, 5);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (32, 56, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (32, 57, 3);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (32, 59, 3);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (33, 55, 5);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (33, 56, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (33, 58, 3);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (33, 59, 3);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (34, 57, 5);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (34, 58, 5);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (34, 59, 3);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (35, 1, 3);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (35, 2, 3);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (35, 66, 3);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (35, 67, 3);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (36, 60, 3);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (36, 61, 3);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (36, 56, 3);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (36, 55, 3);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (37, 1, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (37, 2, 3);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (37, 39, 3);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (38, 1, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (38, 6, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (38, 75, 5);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (38, 74, 3);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (39, 1, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (39, 73, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (39, 74, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (39, 60, 3);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (40, 1, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (40, 78, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (40, 79, 4);
INSERT INTO puesto_conocimiento (puesto_id, conocimiento_id, nivel) VALUES (40, 32, 3);




INSERT INTO puesto_itinerario (puesto_id, itinerario_id) VALUES (1, 1);
INSERT INTO puesto_itinerario (puesto_id, itinerario_id) VALUES (2, 2);
INSERT INTO puesto_itinerario (puesto_id, itinerario_id) VALUES (3, 3);
INSERT INTO puesto_itinerario (puesto_id, itinerario_id) VALUES (4, 4);
INSERT INTO puesto_itinerario (puesto_id, itinerario_id) VALUES (5, 5);
INSERT INTO puesto_itinerario (puesto_id, itinerario_id) VALUES (6, 6);
INSERT INTO puesto_itinerario (puesto_id, itinerario_id) VALUES (7, 7);
INSERT INTO puesto_itinerario (puesto_id, itinerario_id) VALUES (8, 8);
INSERT INTO puesto_itinerario (puesto_id, itinerario_id) VALUES (9, 9);
INSERT INTO puesto_itinerario (puesto_id, itinerario_id) VALUES (10, 10);
INSERT INTO puesto_itinerario (puesto_id, itinerario_id) VALUES (11, 11);
INSERT INTO puesto_itinerario (puesto_id, itinerario_id) VALUES (12, 12);
INSERT INTO puesto_itinerario (puesto_id, itinerario_id) VALUES (13, 13);
INSERT INTO puesto_itinerario (puesto_id, itinerario_id) VALUES (14, 14);
INSERT INTO puesto_itinerario (puesto_id, itinerario_id) VALUES (15, 15);
INSERT INTO puesto_itinerario (puesto_id, itinerario_id) VALUES (16, 16);
INSERT INTO puesto_itinerario (puesto_id, itinerario_id) VALUES (17, 17);
INSERT INTO puesto_itinerario (puesto_id, itinerario_id) VALUES (18, 18);
INSERT INTO puesto_itinerario (puesto_id, itinerario_id) VALUES (19, 19);
INSERT INTO puesto_itinerario (puesto_id, itinerario_id) VALUES (20, 20);
INSERT INTO puesto_itinerario (puesto_id, itinerario_id) VALUES (21, 21);
INSERT INTO puesto_itinerario (puesto_id, itinerario_id) VALUES (22, 22);
INSERT INTO puesto_itinerario (puesto_id, itinerario_id) VALUES (23, 23);
INSERT INTO puesto_itinerario (puesto_id, itinerario_id) VALUES (24, 24);
INSERT INTO puesto_itinerario (puesto_id, itinerario_id) VALUES (25, 25);
INSERT INTO puesto_itinerario (puesto_id, itinerario_id) VALUES (26, 26);
INSERT INTO puesto_itinerario (puesto_id, itinerario_id) VALUES (27, 27);
INSERT INTO puesto_itinerario (puesto_id, itinerario_id) VALUES (28, 28);
INSERT INTO puesto_itinerario (puesto_id, itinerario_id) VALUES (29, 29);
INSERT INTO puesto_itinerario (puesto_id, itinerario_id) VALUES (30, 30);
INSERT INTO puesto_itinerario (puesto_id, itinerario_id) VALUES (31, 31);
INSERT INTO puesto_itinerario (puesto_id, itinerario_id) VALUES (32, 32);
INSERT INTO puesto_itinerario (puesto_id, itinerario_id) VALUES (33, 33);
INSERT INTO puesto_itinerario (puesto_id, itinerario_id) VALUES (34, 34);
INSERT INTO puesto_itinerario (puesto_id, itinerario_id) VALUES (35, 35);
INSERT INTO puesto_itinerario (puesto_id, itinerario_id) VALUES (36, 36);
INSERT INTO puesto_itinerario (puesto_id, itinerario_id) VALUES (37, 37);
INSERT INTO puesto_itinerario (puesto_id, itinerario_id) VALUES (38, 38);
INSERT INTO puesto_itinerario (puesto_id, itinerario_id) VALUES (39, 39);
INSERT INTO puesto_itinerario (puesto_id, itinerario_id) VALUES (40, 40);



    INSERT INTO itinerario_conocimiento (id, itinerario_id, conocimiento_id, nivel) VALUES (1, 1, 3, 5);
INSERT INTO itinerario_conocimiento (id, itinerario_id, conocimiento_id, nivel) VALUES (2, 1, 4, 4);
INSERT INTO itinerario_conocimiento (id, itinerario_id, conocimiento_id, nivel) VALUES (3, 1, 13, 5);
INSERT INTO itinerario_conocimiento (id, itinerario_id, conocimiento_id, nivel) VALUES (4, 1, 14, 4);
INSERT INTO itinerario_conocimiento (id, itinerario_id, conocimiento_id, nivel) VALUES (5, 1, 15, 4);
INSERT INTO itinerario_conocimiento (id, itinerario_id, conocimiento_id, nivel) VALUES (6, 1, 34, 5);
INSERT INTO itinerario_conocimiento (id, itinerario_id, conocimiento_id, nivel) VALUES (7, 1, 35, 4);
INSERT INTO itinerario_conocimiento (id, itinerario_id, conocimiento_id, nivel) VALUES (8, 1, 55, 3);
INSERT INTO itinerario_conocimiento (id, itinerario_id, conocimiento_id, nivel) VALUES (9, 1, 56, 3);



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