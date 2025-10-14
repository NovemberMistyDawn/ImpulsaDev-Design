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
      <div class="main-content">
        <div class="card-grid">
          <div class="card">
            <h1>${data.conocimiento_nombre}</h1>
            <p>${data.conocimiento_descripcion || "Sin descripción disponible."}</p>
          </div>

          <div class="card">
            <h2>Puestos relacionados</h2>
            <ul>
           ${(data.puestos || []).map(
  p => `<li><a class="btn" href="/detalle-puesto?id=${encodeURIComponent(p.id)}">${p.nombre} →</a></li>`
).join("")}
            </ul>
          </div>

          <div class="card">
            <h2>Itinerarios relacionados</h2>
            <ul>
             ${(data.itinerarios || []).map(
  it => `<li><a class="btn" href="/detalle-itinerario?nombre=${encodeURIComponent(it.nombre)}">${it.nombre} →</a></li>`
).join("")}
            </ul>
          </div>
        </div>

        <div style="margin-top: 1.5rem;">
          <a class="btn" href="/">← Volver al buscador</a>
        </div>
      </div>
    `;
  } catch (error) {
    container.textContent = "Error cargando la información del conocimiento.";
    console.error(error);
  }
}

window.addEventListener("DOMContentLoaded", cargarDetalleConocimiento);