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

  const sidebar = document.getElementById('sidebar');
  const menuBtn = document.getElementById('menuBtn');
  const drawer = document.getElementById('drawer');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');
  const drawerList = document.getElementById('drawerList');

  const searchInput = document.getElementById('searchInput');
  const clearSearch = document.getElementById('clearSearch');
  const locateBtn = document.getElementById('locateBtn');

  let myPos = null;
  let markers = [];
  let markersById = new Map();

  function openDrawer() {
    sidebar.classList.add('drawer-open');
    drawer.setAttribute('aria-hidden', 'false');
  }

  function closeDrawer() {
    sidebar.classList.remove('drawer-open');
    drawer.setAttribute('aria-hidden', 'true');
  }

  function toggleDrawer() {
    if (sidebar.classList.contains('drawer-open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  }

  function haversineKm(a, b) {
    const R = 6371;
    const toRad = (x) => (x * Math.PI) / 180;
    const dLat = toRad(b.lat - a.lat);
    const dLng = toRad(b.lng - a.lng);
    const s1 = Math.sin(dLat / 2);
    const s2 = Math.sin(dLng / 2);
    const q = s1 * s1 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * s2 * s2;
    return 2 * R * Math.asin(Math.sqrt(q));
  }

  function setCard(f) {
    cardTitle.textContent = f.name || '';

    const img = f.image_url || '';
    cardImg.src = img;
    cardImg.alt = f.name || '';

    let sub = '';
    if (myPos) {
      const km = haversineKm(myPos, { lat: Number(f.lat), lng: Number(f.lng) });
      sub = `A ${km.toFixed(1)} kilómetros de ti`;
    } else {
      sub = (f.address ? f.address : '');
    }
    cardSub.textContent = sub;

    cardOpen.textContent = Number(f.is_open) === 1 ? 'Abierto' : 'Cerrado';
    card.classList.remove('hidden');
  }

  function hideCard() {
    card.classList.add('hidden');
  }

  function clearMarkers() {
    for (const m of markers) {
      map.removeLayer(m.marker);
    }
    markers = [];
    markersById = new Map();
  }

  function setDrawerList(list) {
    drawerList.innerHTML = '';

    for (const f of list) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'drawer-item';

      const img = document.createElement('img');
      img.className = 'drawer-item-img';
      img.alt = '';
      img.src = f.image_url || '';

      const meta = document.createElement('div');
      const title = document.createElement('div');
      title.className = 'drawer-item-title';
      title.textContent = f.name || '';

      const sub = document.createElement('div');
      sub.className = 'drawer-item-sub';
      sub.textContent = (f.address ? f.address : '');

      meta.appendChild(title);
      meta.appendChild(sub);

      btn.appendChild(img);
      btn.appendChild(meta);

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const marker = markersById.get(String(f.id));
        if (marker) {
          map.setView(marker.getLatLng(), Math.max(map.getZoom(), 15), { animate: true });
        }
        setCard(f);
        closeDrawer();
      });

      drawerList.appendChild(btn);
    }
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

    const q = (searchInput.value || '').trim().toLowerCase();
    const filtered = q
      ? list.filter((f) => String(f.name || '').toLowerCase().includes(q))
      : list;

    for (const f of filtered) {
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

    if (filtered.length > 0) {
      const bounds = L.latLngBounds(filtered.map((f) => [Number(f.lat), Number(f.lng)]));
      map.fitBounds(bounds.pad(0.2));
    }
  }

  async function load() {
    const url = (window.FF_BASE_URL || '') + '/api/furanchos';
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if (!res.ok) {
      return;
    }

    const data = await res.json();
    if (!Array.isArray(data)) {
      return;
    }

    window.__furanchos = data;
    setDrawerList(data);
    render(data);
  }

  function locate() {
    if (!navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        myPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        map.setView([myPos.lat, myPos.lng], 15);
        if (Array.isArray(window.__furanchos)) {
          render(window.__furanchos);
        }
      },
      () => {},
      { enableHighAccuracy: true, timeout: 7000 }
    );
  }

  map.on('click', () => {
    hideCard();
    closeDrawer();
  });

  L.DomEvent.disableClickPropagation(card);
  L.DomEvent.disableScrollPropagation(card);
  L.DomEvent.disableClickPropagation(drawer);
  L.DomEvent.disableScrollPropagation(drawer);

  menuBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleDrawer();
  });

  closeDrawerBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeDrawer();
  });

  searchInput.addEventListener('input', () => {
    if (Array.isArray(window.__furanchos)) {
      render(window.__furanchos);
    }
  });

  clearSearch.addEventListener('click', () => {
    searchInput.value = '';
    if (Array.isArray(window.__furanchos)) {
      render(window.__furanchos);
    }
    searchInput.focus();
  });

  locateBtn.addEventListener('click', locate);

  load();
})();
