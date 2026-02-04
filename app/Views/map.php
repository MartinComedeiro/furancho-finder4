<!doctype html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>FuranchoFinder</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="">
    <link rel="stylesheet" href="<?= base_url('assets/css/app.css?v=1') ?>">
</head>
<body>
    <div class="app">
        <aside class="sidebar" id="sidebar">
            <div class="sidebar-top">
                <button class="icon-btn" id="menuBtn" type="button">☰</button>
            </div>
            <nav class="sidebar-nav">
                <button class="nav-item active" type="button" title="Mapa">🗺</button>
                <button class="nav-item" type="button" title="Furanchos">📍</button>
                <button class="nav-item" type="button" title="Sesión">👤</button>
            </nav>

            <div id="drawer" class="drawer" aria-hidden="true">
                <div class="drawer-header">
                    <div class="drawer-title">Furanchos</div>
                    <button class="icon-btn" id="closeDrawerBtn" type="button">✕</button>
                </div>
                <div id="drawerList" class="drawer-list"></div>
            </div>
        </aside>

        <main class="content">
            <header class="topbar">
                <div class="brand">
                    <div class="brand-mark">✻</div>
                    <div class="brand-name">FuranchoFinder</div>
                </div>

                <div class="search">
                    <span class="search-icon">🔎</span>
                    <input id="searchInput" class="search-input" type="search" placeholder="Búsqueda..." autocomplete="off">
                    <button id="clearSearch" class="icon-btn" type="button">✕</button>
                </div>

                <div class="topbar-actions">
                    <button class="icon-btn" id="locateBtn" type="button" title="Mi ubicación">◎</button>
                </div>
            </header>

            <section class="map-wrap">
                <div id="map"></div>

                <div id="furanchoCard" class="furancho-card hidden">
                    <img id="cardImg" class="furancho-card-img" alt="">
                    <div class="furancho-card-body">
                        <div id="cardTitle" class="furancho-card-title"></div>
                        <div id="cardSub" class="furancho-card-sub"></div>
                        <div id="cardOpen" class="furancho-card-open"></div>
                    </div>
                </div>
            </section>
        </main>
    </div>

    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
    <script>
        window.FF_BASE_URL = "<?= rtrim(base_url('/'), '/') ?>";
    </script>
    <script src="<?= base_url('assets/js/map.js?v=1') ?>"></script>
</body>
</html>
