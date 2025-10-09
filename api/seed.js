const db = require('./database');

db.prepare("INSERT INTO puesto (nombre, descripcion) VALUES (?, ?)").run('Desarrollador Web', 'Crea y mantiene sitios web');
db.prepare("INSERT INTO conocimiento (nombre, descripcion) VALUES (?, ?)").run('JavaScript', 'Lenguaje de programación frontend');
db.prepare("INSERT INTO cualidad (nombre, descripcion) VALUES (?, ?)").run('Trabajo en equipo', 'Capacidad para colaborar con otros');
db.prepare("INSERT INTO itinerario_formativo (nombre, descripcion) VALUES (?, ?)").run('Itinerario Frontend', 'Formación en tecnologías web');
db.prepare("INSERT INTO puesto_conocimiento (id_puesto, id_conocimiento) VALUES (?, ?)").run(1, 1);
db.prepare("INSERT INTO puesto_cualidad (id_puesto, id_cualidad) VALUES (?, ?)").run(1, 1);
db.prepare("INSERT INTO puesto_itinerario (id_puesto, id_itinerario) VALUES (?, ?)").run(1, 1);

console.log("Datos de prueba insertados ✅");