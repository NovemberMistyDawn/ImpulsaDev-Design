async function cargarDetallePuesto() {
  const container = document.getElementById("detalle-container");
  const params = new URLSearchParams(window.location.search);
  const puestoId = params.get("id");

  if (!container) return;

  if (!puestoId) {
    container.textContent = "No se proporcionó ningún ID de puesto.";
    return;
  }

  try {
    const res = await fetch(`http://localhost:3000/api/puesto/${encodeURIComponent(puestoId)}`);
    if (!res.ok) {
      container.textContent = "No se encontró el puesto solicitado.";
      return;
    }

    const data = await res.json();

    // Pintamos el puesto
    container.innerHTML = `
      <h1>${data.puesto_nombre}</h1>
      <p>${data.puesto_descripcion}</p>

      <div class="card-grid">
        <div class="card">
          <h2>Soft Skills</h2>
          <ul id="softskills-list">
            ${data.cualidades.map(skill => `
              <li>
                <button class="skill-toggle" data-skill="${skill.trim()}">
                  ${skill.trim()} ▼
                </button>
                <div class="skill-desc"></div>
              </li>
            `).join("")}
          </ul>
        </div>

        <div class="card">
          <h2>Conocimientos</h2>
         <ul>
        ${data.conocimientos.map(item => `
          <li><a href="/detalle-conocimiento?nombre=${encodeURIComponent(item.trim())}">
            ${item.trim()} →
          </a></li>`).join('')}
      </ul>
        </div>

        <div class="card">
          <h2>Itinerarios Funcionales</h2>
          <ul>
        ${data.itinerarios.map(it => `
          <li><a href="/detalle-itinerario?nombre=${encodeURIComponent(it.trim())}">
            ${it.trim()} →
          </a></li>`).join('')}
      </ul>
        </div>
      </div>

      <a href="/">← Volver al buscador</a>
    `;

    // Añadir interactividad a los botones de Soft Skills
    const buttons = container.querySelectorAll<HTMLButtonElement>(".skill-toggle");
    buttons.forEach(btn => {
      btn.addEventListener("click", async () => {
        const skillName = btn.dataset.skill;
        const descDiv = btn.nextElementSibling as HTMLElement;

        // Si ya está desplegado, colapsamos
        if (descDiv.classList.contains("active")) {
          descDiv.classList.remove("active");
          descDiv.innerHTML = "";
          btn.innerHTML = `${skillName} ▼`;
          return;
        }

        // 🔹 Llamar al backend para obtener la descripción
        try {
          const res = await fetch(`http://localhost:3000/api/cualidad/${encodeURIComponent(skillName || "")}`);
          if (!res.ok) throw new Error("No se encontró la descripción");

          const data = await res.json();

          descDiv.innerHTML = `<p>${data.cualidad_descripcion || "Sin descripción disponible."}</p>`;
          descDiv.classList.add("active");
          btn.innerHTML = `${skillName} ▲`;

        } catch (err) {
          descDiv.innerHTML = `<p style="color:red;">Error cargando la descripción.</p>`;
        }
      });
    });

  } catch (error) {
    container.textContent = "Error cargando la información del puesto.";
    console.error(error);
  }
}

window.addEventListener("DOMContentLoaded", cargarDetallePuesto);