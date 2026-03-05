<!doctype html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>FuranchoFinder</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="">
    <link rel="stylesheet" href="<?= base_url('assets/css/app.css?v=4') ?>">
</head>
<body>
    <div class="app">
        <aside class="sidebar" id="sidebar">
            <div class="sidebar-top">
                <button class="icon-btn" id="menuBtn" type="button">☰</button>
            </div>

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

                <div class="topbar-actions">
                    <div class="user-chip"><?= esc((string) session()->get('user_email')) ?></div>
                    <a class="link-btn" href="<?= base_url('logout') ?>">Salir</a>
                </div>
            </header>

            <section class="map-wrap">
                <div id="map"></div>

                <div id="furanchoCard" class="furancho-card hidden">
                    <img id="cardImg" class="furancho-card-img" alt="">
                    <div class="furancho-card-body">
                        <div class="furancho-card-head">
                            <div id="cardTitle" class="furancho-card-title"></div>
                        </div>
                        <div id="cardSub" class="furancho-card-sub"></div>
                        <div id="cardOpen" class="furancho-card-open"></div>
                    </div>
                </div>
            </section>
        </main>
    </div>

    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
    <script src="<?= base_url('assets/js/map.js?v=4') ?>"></script>
</body>
</html>
