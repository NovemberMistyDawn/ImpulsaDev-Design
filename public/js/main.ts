
async function cargarPuestos() {
  const res = await fetch('http://localhost:3000/api/puestos');
  const puestos = await res.json();

  const container = document.getElementById('jobs-container');
  if (!container) return;

  container.innerHTML = '';
// @ts-ignore
puestos.forEach(({ id, nombre, descripcion }) => {
    const card = document.createElement('div');
    card.className = 'job-card';
    card.innerHTML = `
      <h2>${nombre}</h2>
      <p>${descripcion}</p>
      <a href="/detalle-puesto?id=${encodeURIComponent(id)}" class="btn">Más info</a>
    `;
    container.appendChild(card);
  });
}

cargarPuestos();