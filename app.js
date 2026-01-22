// URL del JSON remoto (lo actualizás en tu servidor sin tocar la APK)
const STREAMS_URL = "https://raw.githubusercontent.com/SalvaFriu9/smttv/main/streams.json";

// Guardamos la instancia del player
let player = null;

// Inicializamos Video.js cuando esté el DOM
document.addEventListener("DOMContentLoaded", () => {
  iniciarPlayer();
  cargarStreams();
});

function iniciarPlayer() {
  player = videojs('player', {
    autoplay: true,
    controls: true,
    preload: 'auto'
  });

  console.log("Video.js listo bro");
}

// Cargar lista de streams desde servidor
async function cargarStreams() {
  try {
    console.log("Cargando streams...");

    const response = await fetch(STREAMS_URL, {
      cache: "no-store" // evita cache y siempre trae actualizado
    });

    if (!response.ok) {
      throw new Error("No se pudo obtener streams.json");
    }

    const data = await response.json();
    generarBotones(data);

  } catch (err) {
    console.error("Error cargando streams:", err);
  }
}

// Genera los botones dinámicos
function generarBotones(streams) {
  const contenedor = document.getElementById("canales");
  
  if (!contenedor) {
    console.warn("No existe contenedor #canales en el HTML");
    return;
  }

  contenedor.innerHTML = ""; // limpia por si actualiza

  Object.keys(streams).forEach(nombre => {
    const url = streams[nombre];

    let btn = document.createElement("button");
    btn.textContent = nombre;
    btn.style.margin = "5px";
    btn.onclick = () => setStream(url);

    contenedor.appendChild(btn);
  });

  console.log("Streams cargados correctamente");
}

// Cambia el stream del player
function setStream(url) {
  if (!player) return;

  console.log("Cambiando a:", url);

  player.src({
    src: url,
    type: "application/x-mpegURL"
  });

  player.play();
}
