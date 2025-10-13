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
    // ✅ usar ruta relativa (funciona en Railway y en local)
    const res = await fetch(`/api/puesto/${encodeURIComponent(puestoId)}`);
    if (!res.ok) {
      container.textContent = "No se encontró el puesto solicitado.";
      return;
    }

    const data = await res.json();

    // ✅ Depuración
    console.log("🟢 Detalle del puesto recibido:", data);

    // Pintamos el puesto
    container.innerHTML = `
      <h1>${data.nombre || data.puesto_nombre || "Puesto sin nombre"}</h1>
      <p>${data.descripcion || data.puesto_descripcion || "Sin descripción disponible."}</p>

      <div class="card-grid">
        <div class="card">
          <h2>Soft Skills</h2>
          <ul id="softskills-list">
            ${(data.cualidades || [])
              .map(skill => `
                <li>
                  <button class="skill-toggle" data-skill="${skill.trim()}">
                    ${skill.trim()} ▼
                  </button>
                  <div class="skill-desc"></div>
                </li>
              `)
              .join("")}
          </ul>
        </div>

        <div class="card">
          <h2>Conocimientos</h2>
          <ul>
            ${(data.conocimientos || [])
              .map(item => `
                <li>
                  <a href="/detalle-conocimiento.html?nombre=${encodeURIComponent(item.trim())}">
                    ${item.trim()} →
                  </a>
                </li>
              `)
              .join("")}
          </ul>
        </div>

        <div class="card">
          <h2>Itinerarios Funcionales</h2>
          <ul>
            ${(data.itinerarios || [])
              .map(it => `
                <li>
                  <a href="/detalle-itinerario.html?nombre=${encodeURIComponent(it.trim())}">
                    ${it.trim()} →
                  </a>
                </li>
              `)
              .join("")}
          </ul>
        </div>
      </div>

      <a href="/">← Volver al buscador</a>
    `;

    // Añadir interactividad a los botones de Soft Skills
    const buttons = container.querySelectorAll(".skill-toggle");
    buttons.forEach(btn => {
      btn.addEventListener("click", async () => {
        const skillName = btn.dataset.skill;
        const descDiv = btn.nextElementSibling;

        if (!descDiv) return;

        // Si ya está desplegado, colapsamos
        if (descDiv.classList.contains("active")) {
          descDiv.classList.remove("active");
          descDiv.innerHTML = "";
          btn.innerHTML = `${skillName} ▼`;
          return;
        }

        // 🔹 Llamar al backend para obtener la descripción
        try {
          const res = await fetch(`/api/cualidad/${encodeURIComponent(skillName || "")}`);
          if (!res.ok) throw new Error("No se encontró la descripción");

          const data = await res.json();

          descDiv.innerHTML = `<p>${data.cualidad_descripcion || "Sin descripción disponible."}</p>`;
          descDiv.classList.add("active");
          btn.innerHTML = `${skillName} ▲`;
        } catch (err) {
          console.error("Error al cargar descripción de skill:", err);
          descDiv.innerHTML = `<p style="color:red;">Error cargando la descripción.</p>`;
        }
      });
    });

  } catch (error) {
    console.error("Error cargando el detalle del puesto:", error);
    container.textContent = "Error cargando la información del puesto.";
  }
}

window.addEventListener("DOMContentLoaded", cargarDetallePuesto);
