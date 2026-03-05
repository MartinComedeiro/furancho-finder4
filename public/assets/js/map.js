(function () {
  // ------------------------------------------------------------
  // 1) Inicialización del mapa (Leaflet)
  // ------------------------------------------------------------
  const map = L.map('map', { zoomControl: false });
  L.control.zoom({ position: 'bottomright' }).addTo(map);

  // Capa base de tiles (OpenStreetMap). Leaflet dibuja el mapa a partir de esto.
  const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap',
  });
  tiles.addTo(map);

  // Zoom por defecto (si no hay datos aún). Se ajustará luego con fitBounds.
  const defaultCenter = [42.240599, -8.720727];
  map.setView(defaultCenter, 14);

  // ------------------------------------------------------------
  // 2) Referencias al DOM
  // ------------------------------------------------------------
  // El HTML está en app/Views/map.php. Aquí solo capturamos los nodos para actualizarlos.
  const card = document.getElementById('furanchoCard');
  const cardImg = document.getElementById('cardImg');
  const cardTitle = document.getElementById('cardTitle');
  const cardSub = document.getElementById('cardSub');
  const cardOpen = document.getElementById('cardOpen');

  // ------------------------------------------------------------
  // 3) Estado en memoria (markers y elemento seleccionado)
  // ------------------------------------------------------------
  // Guardamos referencias para poder limpiar/re-renderizar markers.
  let markers = [];
  // Mapa id->marker por si se necesita localizar un marker por id rápidamente.
  let markersById = new Map();
  // Furancho actualmente mostrado en el sidecard.
  let currentFurancho = null;

  // ------------------------------------------------------------
  // 4) Helper de llamadas a API
  // ------------------------------------------------------------
  // En este proyecto el backend expone JSON en /api/*.
  async function apiFetch(path) {
    return fetch(path, {
      headers: {
        'Accept': 'application/json',
      },
    });
  }

  // ------------------------------------------------------------
  // 5) Sidecard: mostrar/ocultar detalle
  // ------------------------------------------------------------
  // Rellena la tarjeta con datos del furancho y la hace visible.
  function setCard(f) {
    currentFurancho = f;
    cardTitle.textContent = f.name || '';

    const img = f.image_url || '';
    cardImg.src = img;
    cardImg.alt = f.name || '';

    cardSub.textContent = (f.address ? f.address : '');

    cardOpen.textContent = Number(f.is_open) === 1 ? 'Abierto' : 'Cerrado';
    card.classList.remove('hidden');
  }

  // Oculta la tarjeta y resetea la selección.
  function hideCard() {
    currentFurancho = null;
    card.classList.add('hidden');
  }

  // ------------------------------------------------------------
  // 6) Limpieza de markers
  // ------------------------------------------------------------
  // Leaflet mantiene layers en el mapa. Para re-renderizar correctamente,
  // eliminamos los markers anteriores.
  function clearMarkers() {
    for (const m of markers) {
      map.removeLayer(m.marker);
    }
    markers = [];
    markersById = new Map();
  }

  // ------------------------------------------------------------
  // 7) Iconos de marker (verde/rojo)
  // ------------------------------------------------------------
  // Diferenciamos visualmente si el furancho está abierto/cerrado.
  function markerIcon(color) {
    const url = color === 'green'
      ? 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png'
      : 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png';

    const shadow = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

    return new L.Icon({
      iconUrl: url,
      shadowUrl: shadow,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
  }

  // ------------------------------------------------------------
  // 8) Render principal: markers + encuadre
  // ------------------------------------------------------------
  // Recibe la lista completa de furanchos y pinta markers.
  function render(list) {
    clearMarkers();
    hideCard();

    for (const f of list) {
      const lat = Number(f.lat);
      const lng = Number(f.lng);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
        continue;
      }

      const icon = Number(f.is_open) === 1 ? markerIcon('green') : markerIcon('red');
      const marker = L.marker([lat, lng], { icon }).addTo(map);

      // Al hacer click en el marker, mostramos el detalle.
      // Además prevenimos propagación para evitar que el click "caiga" en el mapa
      // y ejecute otros handlers.
      marker.on('click', (ev) => {
        if (ev && ev.originalEvent) {
          ev.originalEvent.preventDefault();
          ev.originalEvent.stopPropagation();
        }
        setCard(f);
      });

      markers.push({ f, marker });
      markersById.set(String(f.id), marker);
    }

    // Si tenemos elementos, encuadramos el mapa para que entren todos.
    if (list.length > 0) {
      const bounds = L.latLngBounds(list.map((f) => [Number(f.lat), Number(f.lng)]));
      map.fitBounds(bounds.pad(0.2));
    }
  }

  // ------------------------------------------------------------
  // 9) Carga de datos inicial
  // ------------------------------------------------------------
  // Pide la lista de furanchos al backend y dispara el render.
  async function load() {
    const res = await apiFetch('/api/furanchos');
    if (!res.ok) {
      return;
    }

    const data = await res.json();
    if (!Array.isArray(data)) {
      return;
    }

    // Guardamos una copia por conveniencia/debug. Es la "fuente" de verdad en el cliente.
    window.__furanchos = data;
    render(data);
  }

  // ------------------------------------------------------------
  // 10) Interacción con el mapa
  // ------------------------------------------------------------
  // Click en el mapa (zona vacía): oculta la tarjeta.
  map.on('click', () => {
    hideCard();
  });

  // Evita que el scroll/click dentro de la tarjeta afecte al mapa (zoom/drag involuntarios).
  L.DomEvent.disableClickPropagation(card);
  L.DomEvent.disableScrollPropagation(card);

  // Punto de arranque.
  load();
})();
