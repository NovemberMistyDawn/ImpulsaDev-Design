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

    // Agrupamos conocimientos por nivel
    const conocimientosPorNivel = {};
    (data.conocimientos || []).forEach(c => {
      const nivel = c.nivel ?? 0;
      if (!conocimientosPorNivel[nivel]) conocimientosPorNivel[nivel] = [];
      conocimientosPorNivel[nivel].push(c);
    });

    container.innerHTML = `
      <a href="/">← Volver al buscador</a>

      <div class="page-header">
        <div class="page-header-text">
          <h1>${data.nombre}</h1>
          <p>${data.descripcion || "Sin descripción disponible."}</p>
        </div>
        <div class="page-header-image">
          <img src="/img/itinerario_ilustration-01-01.png" alt="${data.nombre}">
        </div>
      </div>

      <div class="two-column-layout">
        <!-- Columna izquierda: Conocimientos -->
        <div class="column-left">
          <section class="section-block">
            <h2><img src="/img/conocimientos.png" alt=""> Conocimientos</h2>
            <p class="section-subtitle">Pulsa en un nivel de conocimiento a continuación para ver más detalle.</p>
            
            <div class="levels-schema-wrapper">
              <div class="levels-schema">
  <div class="vertical-line"></div>
  
  ${Object.keys(conocimientosPorNivel)
    .map(n => parseInt(n))
    .sort((a, b) => a - b)
    .map(nivel => {
      const conocimientos = conocimientosPorNivel[nivel] || [];
      const mitad = Math.ceil(conocimientos.length / 2);
      const izquierda = conocimientos.slice(0, mitad);
      const derecha = conocimientos.slice(mitad);

      return `
        <div class="level-row" data-nivel="${nivel}">
          <div class="knowledge-branches knowledge-left">
            ${izquierda.map(c => `
              <div class="knowledge-item">
                <a href="/detalle-conocimiento.html?nombre=${encodeURIComponent(c.nombre)}" class="knowledge-btn">
                  <span class="icon-tech">🔧</span>
                  ${c.nombre}
                  <span class="arrow">→</span>
                </a>
              </div>
            `).join('')}
          </div>

          <button class="level-circle" data-nivel="${nivel}">
            ${nivel}
          </button>

          <div class="knowledge-branches knowledge-right">
            ${derecha.map(c => `
              <div class="knowledge-item">
                <a href="/detalle-conocimiento.html?nombre=${encodeURIComponent(c.nombre)}" class="knowledge-btn">
                  <span class="icon-tech">🔧</span>
                  ${c.nombre}
                  <span class="arrow">→</span>
                </a>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }).join('')}
</div>
            </div>
          </section>
        </div>

        <!-- Columna derecha: Puestos -->
        <div class="column-right">
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

    // Inicializar interactividad
    initLevelsInteraction();

  } catch (error) {
    container.textContent = 'Error cargando la información del itinerario.';
    console.error(error);
  }
}

function initLevelsInteraction() {
  const circles = document.querySelectorAll('.level-circle');
  const rows = document.querySelectorAll('.level-row');
  let selectedLevel = 1;

  function activateLevel(nivel) {
    selectedLevel = nivel;
    
    circles.forEach(circle => {
      const circleNivel = parseInt(circle.dataset.nivel);
      if (circleNivel === nivel) {
        circle.classList.add('active');
      } else {
        circle.classList.remove('active');
      }
    });
    
    rows.forEach(row => {
      const rowNivel = parseInt(row.dataset.nivel);
      const branches = row.querySelectorAll('.knowledge-branches');
      
      if (rowNivel === nivel) {
        branches.forEach(branch => {
          branch.classList.add('active');
        });
      } else {
        branches.forEach(branch => {
          branch.classList.remove('active');
        });
      }
    });
  }

  circles.forEach(circle => {
    circle.addEventListener('click', () => {
      const nivel = parseInt(circle.dataset.nivel);
      activateLevel(nivel);
    });
  });

  activateLevel(selectedLevel);
}

document.addEventListener('DOMContentLoaded', cargarDetalleItinerario);