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
    const res = await fetch(`/api/puesto/${encodeURIComponent(puestoId)}`);
    if (!res.ok) {
      container.textContent = "No se encontró el puesto solicitado.";
      return;
    }

    const data = await res.json();
    console.log("🟢 Detalle del puesto recibido:", data);

    container.innerHTML = `
     <a href="/">← Volver al buscador</a>

     <div class="page-header">
      <div class="page-header-text">
        <h1>${data.nombre || data.puesto_nombre || "Puesto sin nombre"}</h1>
        <p>${data.descripcion || data.puesto_descripcion || "Sin descripción disponible."}</p>
      </div>
      <div class="page-header-image">
        <img src="/img/Puestos_ilustration-01.png" alt="Desarrollador web">
      </div>
    </div>

    <div class="sections-container">
      <!-- 🧭 Itinerarios -->
      <section class="section-block">
        <h2><img src="icons/itinerarios.svg" alt=""> Itinerarios</h2>
        <div class="cards-row">
          ${(data.itinerarios || [])
            .map(it => `
              <div class="info-card">
                <h3>${it.nombre || it.trim()}</h3>
                <p>${it.descripcion || "Sin descripción disponible."}</p>
                <a href="/detalle-itinerario.html?nombre=${encodeURIComponent(it.nombre || it.trim())}" class="btn-primary">
                  Info →
                </a>
              </div>
            `)
            .join("")}
        </div>
      </section>

      <!-- 💬 Soft Skills -->
      <section class="section-block">
        <h2><img src="icons/softskills.svg" alt=""> Soft Skills</h2>
        <ul class="interactive-list">
          ${(data.cualidades || [])
            .map(skill => `
              <li>
                <button class="toggle-btn" data-skill="${skill.trim()}">
                  ${skill.trim()} ▼
                </button>
                <div class="toggle-content"></div>
              </li>
            `)
            .join("")}
        </ul>
      </section>

      <!-- 📘 Conocimientos -->
      <section class="section-block">
        <h2><img src="icons/conocimientos.svg" alt=""> Conocimientos</h2>
        <ul class="link-list">
          ${(data.conocimientos || [])
            .map(item => `
              <li>
                <a href="/detalle-conocimiento.html?nombre=${encodeURIComponent(item.trim())}">
                  ${item.trim()}
                </a>
              </li>
            `)
            .join("")}
        </ul>
      </section>
    </div>
    `;

    // Añadir interactividad a los botones de Soft Skills
    const buttons = container.querySelectorAll(".toggle-btn");
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

        // Llamar al backend para obtener la descripción
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
