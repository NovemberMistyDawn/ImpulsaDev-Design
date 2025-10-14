async function cargarDetalleItinerario() {
  const params = new URLSearchParams(window.location.search);
  const nombre = params.get('nombre');
  const container = document.getElementById('detalle-container');
  if (!container) return;

  if (!nombre) {
    container.textContent = 'No se proporcionó ningún nombre de itinerario.';
    return;
  }

  try {
    const res = await  fetch(`/api/itinerario/${encodeURIComponent(nombre)}`);
    if (!res.ok) {
      container.textContent = 'No se encontró el itinerario solicitado.';
      return;
    }
    const data = await res.json();

    container.innerHTML = `
      <div class="card-grid">

    <!-- Card principal -->
    <div class="card">
      <h1>${data.nombre}</h1>
<p>${data.descripcion || "Sin descripción disponible."}</p>
    </div>

    <!-- Card de conocimientos -->
    <div class="card">
  <h2>Conocimientos relacionados</h2>
  <ul>
    ${(data.conocimientos || []).map(
      c => `<li><a class="btn" href="/detalle-conocimiento?nombre=${encodeURIComponent(c)}">${c} →</a></li>`
    ).join('')}
  </ul>
</div>

    <!-- Card de puestos -->
   <div class="card">
  <h2>Puestos relacionados</h2>
  <ul>
   ${(data.puestos || []).map(
  p => `<li><a class="btn" href="/detalle-puesto?id=${encodeURIComponent(p.id)}">${p.nombre} →</a></li>`
).join('')}
  </ul>
</div>
  </div>

  <!-- Botón volver -->
  <div style="margin-top: 1.5rem;">
    <a class="btn" href="/">← Volver al buscador</a>
  </div>
    `;
  } catch (error) {
    container.textContent = 'Error cargando la información del itinerario.';
    console.error(error);
  }
}

window.addEventListener('DOMContentLoaded', cargarDetalleItinerario);