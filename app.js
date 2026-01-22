// URL del JSON remoto (lo actualizás en GitHub y la APK lo toma al vuelo)
const STREAMS_URL = "https://raw.githubusercontent.com/SalvaFriu9/smttv/main/streams.json";

// Guardamos la instancia del player
let player = null;

// Esperamos a que Cordova esté listo
document.addEventListener("deviceready", () => {
    console.log("Cordova listo 😎");

    iniciarPlayer();
    cargarStreams();
});

// Inicializa Video.js
function iniciarPlayer() {
    player = videojs('player', {
        autoplay: true,
        controls: true,
        preload: 'auto',
        liveui: true
    });

    console.log("Video.js listo bro 🥀");
}

// Cargar lista de streams desde servidor
async function cargarStreams() {
    try {
        console.log("Cargando streams...");

        const response = await fetch(STREAMS_URL, { cache: "no-store" });
        if (!response.ok) throw new Error("No se pudo obtener streams.json");

        const data = await response.json();
        generarTarjetas(data);

    } catch (err) {
        console.error("Error cargando streams:", err);
    }
}

// Genera las tarjetas dinámicas de canales
function generarTarjetas(streams) {
    const contenedor = document.getElementById("canalesContainer");
    if (!contenedor) return console.warn("No existe contenedor #canalesContainer");

    contenedor.innerHTML = ""; // limpia por si actualiza

    Object.keys(streams).forEach(nombre => {
        const url = streams[nombre];

        const div = document.createElement("div");
        div.className = "match-card";
        div.onclick = () => setStream(url);

        div.innerHTML = `
            <div class="name">${nombre}</div>
            <div class="details">En vivo</div>
        `;

        contenedor.appendChild(div);
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
