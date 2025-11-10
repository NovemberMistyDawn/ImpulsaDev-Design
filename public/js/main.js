async function cargarPuestos() {
  try {
    const res = await fetch("https://impulsadev-design.onrender.com/api/puestos");
    const puestos = await res.json();

    const container = document.getElementById("jobs-container");
    if (!container) return;

    container.innerHTML = "";

    puestos.forEach(({ id, nombre, descripcion }) => {
      const card = document.createElement("div");
      card.className = "job-card";
      card.innerHTML = `
        <h2>${nombre}</h2>
        <p>${descripcion}</p>
        <a href="/detalle-puesto.html?id=${encodeURIComponent(id)}" class="btn">Más info</a>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    console.error("Error cargando puestos:", err);
    const container = document.getElementById("jobs-container");
    if (container) container.innerHTML = "<p>Error al cargar los puestos.</p>";
  }
}

cargarPuestos();


document.addEventListener("DOMContentLoaded", () => {

  // Chat functionality
  const chatBox = document.getElementById('chatBox');
  const closeChatBtn = document.getElementById('closeChatBtn');

  if (closeChatBtn) {
    closeChatBtn.addEventListener('click', () => {
      chatBox.classList.add('hidden');
    });
  }

const levelCircles = document.querySelectorAll('.level-circle');
  const connectionLines = document.querySelectorAll('.connection-line');

  if (!levelCircles.length) return; // seguridad: no ejecutar si no existen

  let currentLevel = 0;
  let autoPlayInterval;
  let isManualMode = false;

  function activateLevel(index) {
    // Resetear todos
    levelCircles.forEach(circle => circle.classList.remove('active'));
    connectionLines.forEach(line => line.classList.remove('animate'));

    // Activar nivel actual
    if (levelCircles[index]) {
      levelCircles[index].classList.add('active');
    }

    // Animar líneas hasta el nivel actual
    for (let i = 0; i < index; i++) {
      if (connectionLines[i]) {
        connectionLines[i].classList.add('animate');
      }
    }
  }

  function nextLevel() {
    currentLevel = (currentLevel + 1) % levelCircles.length;
    activateLevel(currentLevel);
  }

  function startAutoPlay() {
    clearInterval(autoPlayInterval);
    autoPlayInterval = setInterval(() => {
      if (!isManualMode) nextLevel();
    }, 4000);
  }

  // Click manual
  levelCircles.forEach((circle, index) => {
    circle.addEventListener('click', () => {
      isManualMode = true;
      currentLevel = index;
      activateLevel(currentLevel);

      clearInterval(autoPlayInterval);
      setTimeout(() => {
        isManualMode = false;
        startAutoPlay();
      }, 8000);
    });
  });

  // 🔹 Iniciar animación automáticamente
  activateLevel(0);
  startAutoPlay();

});