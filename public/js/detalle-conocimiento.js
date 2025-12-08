async function cargarDetalleConocimiento() {
  const params = new URLSearchParams(window.location.search);
  const nombre = params.get("nombre");
  const container = document.getElementById("detalle-container");
  if (!container) return;

  if (!nombre) {
    container.textContent = "No se proporcionó ningún nombre de conocimiento.";
    return;
  }

  try {
    const res = await fetch(`/api/conocimiento/${encodeURIComponent(nombre)}`);
    if (!res.ok) {
      container.textContent = "No se encontró el conocimiento solicitado.";
      return;
    }

    const data = await res.json();

    container.innerHTML = `
      <a href="/">← Volver al buscador</a>

      <div class="page-header">
        <div class="page-header-text">
          <h1>${data.conocimiento_nombre}</h1>
          <p>${data.conocimiento_descripcion || "Sin descripción disponible."}</p>
        </div>
        <div class="page-header-image">
          <img src="/img/Puestos_ilustration-01.png" alt="${data.conocimiento_nombre}">
        </div>
      </div>

      <div class="sections-container">
        <!-- Itinerarios - Ancho completo arriba -->
        <section class="section-block section-full-width">
          <h2><img src="/img/itinerarios.png" alt=""> Itinerarios</h2>
          <div class="cards-horizontal">
            ${(data.itinerarios || []).map(it => `
              <div class="info-card">
                <h3>${it.nombre}</h3>
                <p>${it.descripcion || "Sin descripción disponible."}</p>
                <a href="/detalle-itinerario.html?nombre=${encodeURIComponent(it.nombre)}" class="btn-primary">
                  Info →
                </a>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- Dos columnas abajo -->
        <div class="two-columns-bottom">
          <!-- Conocimientos relacionados (izquierda) -->
          <section class="section-block">
            <h2><img src="/img/conocimientos.png" alt=""> Conocimientos relacionados</h2>
            <ul class="link-list">
              ${(data.conocimientos_relacionados || []).map(c => `
                <li>
                  <a href="/detalle-conocimiento.html?nombre=${encodeURIComponent(c.nombre)}">
                    ${c.nombre}
                  </a>
                </li>
              `).join('')}
            </ul>
          </section>

          <!-- Puestos de trabajo (derecha) -->
          <section class="section-block">
            <h2><img src="/img/puestos.png" alt=""> Puestos de trabajo</h2>
            <div class="cards-row cards-two-columns">
              ${(data.puestos || []).map(p => `
                <div class="info-card">
                  <h3>${p.nombre}</h3>
                  <p>${p.descripcion || "Sin descripción disponible."}</p>
                  <a href="/detalle-puesto.html?id=${encodeURIComponent(p.id)}" class="btn-primary">
                    Info →
                  </a>
                </div>
              `).join('')}
            </div>
          </section>
        </div>
      </div>
    `;
  } catch (error) {
    container.textContent = "Error cargando la información del conocimiento.";
    console.error(error);
  }
}

window.addEventListener("DOMContentLoaded", cargarDetalleConocimiento);