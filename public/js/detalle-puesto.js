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
     <a href="/">← Volver al buscador</a>

     <div class="detalle-header">
      <div class="detalle-texto">
      <h1>${data.nombre || data.puesto_nombre || "Puesto sin nombre"}</h1>
      <p>${data.descripcion || data.puesto_descripcion || "Sin descripción disponible."}</p>
 </div>
      <div class="detalle-imagen">
      <img src="/img/Puestos_ilustration-01.png" alt="Desarrollador web">
    </div>
    </div>



    <div class="detalle-secciones">
  <!-- 🧭 Itinerarios -->
  <section class="bloque itinerarios">
    <h2><img src="icons/itinerarios.svg" alt=""> Itinerarios</h2>
    <div class="itinerarios-grid">
      ${(data.itinerarios || [])
        .map(it => `
          <div class="itinerario-card">
            <h3>${it.nombre || it.trim()}</h3>
            <p>${it.descripcion || "Sin descripción disponible."}</p>
            <a href="/detalle-itinerario.html?nombre=${encodeURIComponent(it.nombre || it.trim())}" class="btn-info">
              Info →
            </a>
          </div>
        `)
        .join("")}
    </div>
  </section>

  <!-- 💬 Soft Skills -->
  <section class="bloque softskills">
    <h2><img src="icons/softskills.svg" alt=""> Soft Skills</h2>
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
  </section>

  <!-- 📘 Conocimientos -->
  <section class="bloque conocimientos">
    <h2><img src="icons/conocimientos.svg" alt=""> Conocimientos</h2>
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
  </section>
</div>
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
