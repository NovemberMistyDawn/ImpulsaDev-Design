async function cargarPuestos() {
  try {
    const res = await fetch("https://impulsadev-design-production.up.railway.app/api/puestos");
    const puestos = await res.json();

    const container = document.getElementById("jobs-container");
    if (!container) return;

    container.innerHTML = "";

    puestos.forEach(({ id, nombre, descripcion }) => {
      const card = document.createElement("div");
      card.className = "job-card";
      card.innerHTML = `
        <h2>${nombre}</h2>
        <p>${descripcion}</p>
        <a href="/detalle-puesto?id=${encodeURIComponent(id)}" class="btn">Más info</a>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    console.error("Error cargando puestos:", err);
    const container = document.getElementById("jobs-container");
    if (container) container.innerHTML = "<p>Error al cargar los puestos.</p>";
  }
}

cargarPuestos();