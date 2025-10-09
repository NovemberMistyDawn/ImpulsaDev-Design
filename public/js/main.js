
async function cargarPuestos() {
  const res = await fetch('/api/puestos');
  const puestos = await res.json();

  const container = document.getElementById('jobs-container');
  if (!container) return;

  container.innerHTML = '';
// @ts-ignore
  puestos.forEach(({ nombre, descripcion }) => {
    //
    const card = document.createElement('div');
    card.className = 'job-card';
    card.innerHTML = `
      <h2>${nombre}</h2>
      <p>${descripcion}</p>
      <a href="/detalle?titulo=${encodeURIComponent(nombre)}&descripcion=${encodeURIComponent(descripcion)}" class="btn">Más info</a>
    `;
    container.appendChild(card);
  });
}

cargarPuestos();