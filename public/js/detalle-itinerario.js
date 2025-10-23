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
    const res = await fetch(`/api/itinerario/${encodeURIComponent(nombre)}`);
    if (!res.ok) {
      container.textContent = 'No se encontró el itinerario solicitado.';
      return;
    }

    const data = await res.json();

    // Generamos los niveles
    const niveles = {
      0: 'Junior',
      1: 'Mid',
      2: 'Senior'
    };

    // Agrupamos conocimientos por nivel
    const conocimientosPorNivel = {};
    (data.conocimientos || []).forEach(c => {
      const nivel = c.nivel ?? 0;
      if (!conocimientosPorNivel[nivel]) conocimientosPorNivel[nivel] = [];
      conocimientosPorNivel[nivel].push(c);
    });

    container.innerHTML = `
      <div class="card-grid">

        <!-- Card principal -->
        <div class="card">
          <h1>${data.nombre}</h1>
          <p>${data.descripcion || "Sin descripción disponible."}</p>
        </div>

        <!-- Esquema vertical de niveles -->
        <div class="card">
          <h2>Progresión de conocimientos</h2>
          <div class="levels-schema">
            ${[2,1,0].map(nivel => `
              <div class="level-circle" data-level="${niveles[nivel].toLowerCase()}">
                <strong>${niveles[nivel]}</strong>
                <ul>
                  ${(conocimientosPorNivel[nivel] || [])
                    .map(c => `<li><a href="/detalle-conocimiento?nombre=${encodeURIComponent(c.nombre)}">${c.nombre}</a></li>`)
                    .join('')}
                </ul>
              </div>
              ${nivel > 0 ? `<div class="connection-line"></div>` : ''}
            `).join('')}
          </div>
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