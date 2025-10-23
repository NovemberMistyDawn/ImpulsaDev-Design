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
      0: 'Sin orden',
      1: 'Orden 1',
      2: 'Orden 2'
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

      

 <!-- Esquema de conocimientos -->
        <div class="card card-conocimientos">
          <div class="card-header">
            <span class="icon">📚</span>
            <h2>Conocimientos</h2>
          </div>
          <p class="card-subtitle">Pulsa en un nivel de conocimiento a continuación para ver más detalle.</p>
          
          <div class="levels-schema-wrapper">
            <div class="levels-schema">
              <!-- Línea vertical central -->
              <div class="vertical-line"></div>
              
              ${[0, 1, 2].map(nivel => {
                const conocimientos = conocimientosPorNivel[nivel] || [];
                const mitad = Math.ceil(conocimientos.length / 2);
                const izquierda = conocimientos.slice(0, mitad);
                const derecha = conocimientos.slice(mitad);
                
                return `
                  <div class="level-row" data-nivel="${nivel}">
                    <!-- Conocimientos izquierda -->
                    <div class="knowledge-branches knowledge-left">
                      ${izquierda.map(c => `
                        <div class="knowledge-item">
                          <a href="/detalle-conocimiento?nombre=${encodeURIComponent(c.nombre)}" class="knowledge-btn">
                            <span class="icon-tech">🔧</span>
                            ${c.nombre}
                            <span class="arrow">→</span>
                          </a>
                        </div>
                      `).join('')}
                    </div>
                    
                    <!-- Círculo central -->
                    <button class="level-circle" data-nivel="${nivel}">
                      ${nivel}
                    </button>
                    
                    <!-- Conocimientos derecha -->
                    <div class="knowledge-branches knowledge-right">
                      ${derecha.map(c => `
                        <div class="knowledge-item">
                          <a href="/detalle-conocimiento?nombre=${encodeURIComponent(c.nombre)}" class="knowledge-btn">
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
  let selectedLevel = 1; // Mid por defecto

  function activateLevel(nivel) {
    selectedLevel = nivel;
    
    // Actualizar círculos
    circles.forEach(circle => {
      const circleNivel = parseInt(circle.dataset.nivel);
      if (circleNivel === nivel) {
        circle.classList.add('active');
      } else {
        circle.classList.remove('active');
      }
    });
    
    // Mostrar/ocultar ramas
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

  // Event listeners
  circles.forEach(circle => {
    circle.addEventListener('click', () => {
      const nivel = parseInt(circle.dataset.nivel);
      activateLevel(nivel);
    });
  });

  // Activar nivel inicial
  activateLevel(selectedLevel);
}

// Iniciar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', cargarDetalleItinerario);