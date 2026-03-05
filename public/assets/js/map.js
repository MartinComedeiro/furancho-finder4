(function () {
  const map = L.map('map', { zoomControl: false });
  L.control.zoom({ position: 'bottomright' }).addTo(map);

  const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap',
  });
  tiles.addTo(map);

  const defaultCenter = [42.240599, -8.720727];
  map.setView(defaultCenter, 14);

  const card = document.getElementById('furanchoCard');
  const cardImg = document.getElementById('cardImg');
  const cardTitle = document.getElementById('cardTitle');
  const cardSub = document.getElementById('cardSub');
  const cardOpen = document.getElementById('cardOpen');

  let markers = [];
  let markersById = new Map();
  let currentFurancho = null;

  async function apiFetch(path) {
    return fetch(path, {
      headers: {
        'Accept': 'application/json',
      },
    });
  }

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

  function hideCard() {
    currentFurancho = null;
    card.classList.add('hidden');
  }

  function clearMarkers() {
    for (const m of markers) {
      map.removeLayer(m.marker);
    }
    markers = [];
    markersById = new Map();
  }

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

    if (list.length > 0) {
      const bounds = L.latLngBounds(list.map((f) => [Number(f.lat), Number(f.lng)]));
      map.fitBounds(bounds.pad(0.2));
    }
  }

  async function load() {
    const res = await apiFetch('/api/furanchos');
    if (!res.ok) {
      return;
    }

    const data = await res.json();
    if (!Array.isArray(data)) {
      return;
    }

    window.__furanchos = data;
    render(data);
  }

  map.on('click', () => {
    hideCard();
  });

  L.DomEvent.disableClickPropagation(card);
  L.DomEvent.disableScrollPropagation(card);

  load();
})();
