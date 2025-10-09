async function cargarDetalleCualidad() {
  // 1. Leer el parámetro "nombre" de la URL
  const params = new URLSearchParams(window.location.search);
  const nombreCualidad = params.get('nombre');
  const container = document.getElementById('detalle-container');
  if (!container) return;

  // 2. Si no hay nombre en la URL, mostramos error
  if (!nombreCualidad) {
    container.textContent = 'No se proporcionó ninguna soft skill.';
    return;
  }

  try {
    // 3. Llamar al backend para pedir los datos de la cualidad
    const res = await fetch(`http://localhost:3000/api/cualidad/${encodeURIComponent(nombreCualidad)}`);
    if (!res.ok) {
      container.textContent = 'No se encontró la soft skill solicitada.';
      return;
    }

    // 4. Parsear la respuesta
    const data = await res.json();

    // 5. Pintar en pantalla
    container.innerHTML = `
      <h1>${data.cualidad_nombre}</h1>
      <p>${data.cualidad_descripcion || 'Sin descripción disponible.'}</p>

      <section>
        <h2>Puestos relacionados</h2>
        <ul>
          ${data.puestos.map(
            puesto => `<li><a href="/detalle-puesto?id=${encodeURIComponent(puesto.trim())}">${puesto.trim()} →</a></li>`
          ).join('')}
        </ul>
      </section>

      <section>
        <h2>Itinerarios relacionados</h2>
        <ul>
          ${data.itinerarios.map(
            it => `<li><a href="/detalle-itinerario?nombre=${encodeURIComponent(it.trim())}">${it.trim()} →</a></li>`
          ).join('')}
        </ul>
      </section>

      <a href="/">← Volver al buscador</a>
    `;
  } catch (error) {
    container.textContent = 'Error cargando la información de la soft skill.';
    console.error(error);
  }
}

// 6. Ejecutar al cargar la página
window.addEventListener('DOMContentLoaded', cargarDetalleCualidad);
