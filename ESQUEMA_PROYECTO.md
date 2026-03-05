# Esquema detallado del proyecto FuranchoFinder

## Raíz (`/`)

- **`docker-compose.yml`**
  - **Contenido**: Orquesta 3 servicios (app, db, phpmyadmin).
  - **Finalidad**: Definir contenedores, puertos (8080, 8081, 3307), variables de entorno para la base de datos y volúmenes.
  - **Uso**: `docker-compose up -d` para levantar todo el stack.

- **`docker/`**
  - **`app/Dockerfile`**
    - **Contenido**: Imagen Docker para PHP 8.2 + Apache.
    - **Finalidad**: Instalar extensiones PHP (intl, mysqli, pdo_mysql), activar rewrite de Apache y copiar vhost/entrypoint.
  - **`app/entrypoint.sh`**
    - **Contenido**: Script de arranque del contenedor.
    - **Finalidad**: Esperar a que la BD esté disponible, ejecutar migraciones y seeders, y lanzar Apache.
  - **`app/vhost.conf`**
    - **Contenido**: Configuración de Apache para servir `public/` como raíz y permitir `.htaccess`.

- **`app/` (código PHP con CodeIgniter 4)**
  - **`Config/`**
    - **`Database.php`**: Lee configuración de BD desde variables de entorno (sin `.env`).
    - **`Routes.php`**: Define rutas web (`/login`, `/map`, `/logout`) y API (`/api/furanchos`, `/api/me`).
    - **`Security.php`**: Configuración de CSRF (cookie) y seguridad.
    - **`App.php`**: Configuración de la app (baseURL, `indexPage` eliminado para URLs limpias).
    - **`Filters.php`**: Filtros globales (CSRF desactivado actualmente).
  - **`Controllers/`**
    - **`BaseController.php`**: Clase base para controladores (helper URL activado).
    - **`Home.php`**: Redirige `/` → `/map`.
    - **`Auth.php`**: Login (`/login`, `POST /auth/login`), logout (`/logout`). Usa `UserModel`, `password_verify`, sesión.
    - **`Map.php`**: Renderiza mapa (`/map`) solo si hay sesión activa.
    - **`Api/`**
      - **`Furanchos.php`**: Endpoint `GET /api/furanchos` → devuelve JSON con todos los furanchos (`FuranchoModel`).
      - **`Me.php`**: Endpoint `GET /api/me` → JSON con sesión del usuario logueado.
      - **`Favorites.php`**: CRUD de favoritos (ya sin uso, sin rutas activas).
  - **`Models/`**
      - **`UserModel.php`**: Acceso a tabla `users` (email, password_hash).
      - **`FuranchoModel.php`**: Acceso a tabla `furanchos` (campos de furancho).
      - **`FavoriteModel.php`**: Modelo para tabla `favorites` (user_id, furancho_id).
  - **`Database/`**
    - **`Migrations/`**
      - **`CreateUsers.php`**: Crea tabla `users` (id, email, password_hash, timestamps).
      - **`CreateFuranchos.php`**: Crea tabla `furanchos` (id, name, description, address, lat, lng, image_url, is_open, timestamps).
      - **`CreateFavorites.php`**: Migra tabla `favorites` (neutralizada, no crea ni borra).
    - **`Seeds/`**
      - **`DatabaseSeeder.php`**: Llama a `UsersSeeder` y `FuranchosSeeder`.
      - **`UsersSeeder.php`**: Inserta usuario admin (`admin@furanchofinder.local` / `admin123`) si no existe.
      - **`FuranchosSeeder.php`**: Inserta 3 furanchos de ejemplo si la tabla está vacía.
  - **`Views/`**
    - **`login.php`**: Formulario de login (email/password), muestra errores de sesión, usa `app.css?v=2`.
    - **`map.php`**: Layout principal (sidebar, drawer, topbar, mapa, tarjeta de furancho). Carga Leaflet, `app.css?v=4` y `map.js?v=4`.
    - **`errors/`**: Vistas de errores de CodeIgniter (HTML).

- **`public/` (servido por Apache)**
  - **`index.php`**: Bootstrap de CodeIgniter para web (versión mínima PHP, paths, arranque).
  - **`.htaccess`**: Reglas de rewrite para URLs limpias, redirecciones, seguridad y cabecera `Authorization`.
  - **`robots.txt`**: Vacío (permite todo a los crawlers).
  - **`index.html`**: Página 403 genérica para evitar listado de directorios.
  - **`favicon.ico`**: Icono del sitio.
  - **`assets/`**
    - **`css/app.css`**: Estilos del layout (sidebar, topbar, mapa, tarjeta, auth, responsive).
    - **`js/map.js`**: Lógica Leaflet, drawer, búsqueda, renderizado de markers, llamada a APIs (`/api/furanchos`, `/api/me`).

- **`tests/` (PHPUnit)**
  - **`README.md`**: Guía para ejecutar tests con PHPUnit y configurar BD de tests.
  - **`phpunit.xml.dist`**: Configuración de PHPUnit (bootstrap, cobertura, suites, excludes).
  - **`_support/`**
    - **`Database/`**: Migración y seeder de ejemplo para tests.
    - **`Models/`**: Modelo de ejemplo (`ExampleModel`).
    - **`Libraries/`**: Librería de ejemplo (`ConfigReader`).
  - **`unit/`**
    - **`HealthTest.php`**: Tests básicos de constantes y configuración.
  - **`database/`**
    - **`ExampleDatabaseTest.php`**: Test de BD con `DatabaseTestTrait`, seed `ExampleSeeder`.
  - **`session/`**
    - **`ExampleSessionTest.php`**: Test simple de sesión (`session()->set/get`).

- **`writable/`**
  - **`cache/`, `logs/`, `session/`, `uploads/`, `debugbar/`**: Carpetas temporales de CodeIgniter (con `index.html` para evitar listado).

- **`vendor/`**
  - Dependencias de Composer (CodeIgniter 4, PHPUnit, Faker).

- **`spark`**
  - CLI de CodeIgniter para comandos (`migrate`, `db:seed`, etc).

- **`.gitignore`**
  - Ignora `vendor/`, `env`, `writable/*`, `phpunit`, `IDEs`, etc.

## Flujo de ejecución

1. **Docker levanta** `app` (PHP/Apache), `db` (MariaDB) y `phpmyadmin`.
2. **`entrypoint.sh`** espera a la BD, ejecuta migraciones y seeders.
3. **Apache sirve** `public/index.php` → bootstrap CodeIgniter.
4. **`Routes.php`** enruta peticiones a controladores.
5. **`Auth.php`** gestiona login/logout con sesión.
6. **`Map.php`** requiere sesión y renderiza `map.php`.
7. **Frontend (`map.js`)** llama a `/api/furanchos` y pinta mapa con Leaflet.

## Ciclo de llamadas (request → backend → frontend → API → BD)

### 1) Navegador → servidor web

1. El usuario navega a **`GET /map`**.
2. Apache recibe la petición y, por reglas de rewrite, la manda a:
   - **`public/index.php`** (front controller).
3. `public/index.php` arranca CodeIgniter (boot) y delega en el router.

### 2) Router → Controller (backend)

1. **`app/Config/Routes.php`** resuelve la ruta:
   - `GET /map` → **`App\Controllers\Map::index()`**
2. **`Map::index()`**:
   - Comprueba sesión `session()->has('user_id')`.
   - Si no hay sesión → `redirect()->to('/login')`.
   - Si hay sesión → `return view('map')`.
3. CodeIgniter renderiza la vista:
   - **`app/Views/map.php`** (HTML del layout + includes de CSS/JS).

### 3) Vista → carga de assets (frontend)

1. El navegador descarga:
   - `public/assets/css/app.css`
   - `public/assets/js/map.js`
   - Leaflet CSS/JS desde CDN.
2. Cuando se ejecuta **`map.js`**:
   - Inicializa Leaflet: `L.map(...)`, `L.tileLayer(...).addTo(map)`.
   - Define helpers internos (p.ej. `apiFetch()`, `render()`, etc.).
   - Llama a `load()`.

### 4) Frontend → API (backend)

1. `load()` hace `fetch('/api/furanchos')`.
2. El router resuelve:
   - `GET /api/furanchos` → **`App\Controllers\Api\Furanchos::index()`**
3. **`Furanchos::index()`**:
   - Instancia el modelo: `new FuranchoModel()`.
   - Consulta BD con: `findAll()`.
   - Devuelve JSON: `return $this->respond($furanchos)`.

### 5) Modelo → Base de datos

1. **`App\Models\FuranchoModel`** usa el driver configurado en:
   - **`app/Config/Database.php`** (en tu caso via variables de entorno desde `docker-compose.yml`).
2. `findAll()` genera la query (Query Builder) contra la tabla:
   - `furanchos`

### 6) Respuesta API → render en el mapa

1. `map.js` recibe el JSON (array) y lo guarda en `window.__furanchos`.
2. Llama a `render(data)`.
3. `render()`:
   - Limpia markers anteriores.
   - Recorre la lista y crea markers Leaflet `L.marker([lat, lng], { icon })`.
   - Ajusta el viewport con `map.fitBounds(...)`.

### 7) Ciclo de login (cuando no hay sesión)

1. Usuario intenta `GET /map` sin sesión → `Map::index()` redirige a **`GET /login`**.
2. `GET /login` → `Auth::loginForm()` → `view('login')`.
3. El formulario hace `POST /auth/login` → `Auth::login()`:
   - Lee `email/password`.
   - Busca usuario con `UserModel->where('email', $email)->first()`.
   - Verifica con `password_verify()`.
   - Si OK: guarda `user_id` y `user_email` en sesión y redirige a `/map`.

## Seguridad

- **Contraseñas**: `password_hash()` (bcrypt) + `password_verify()`.
- **Sesión**: manejada por CodeIgniter; regenerada en login.
- **CSRF**: configurado en modo cookie, pero filtro global desactivado.
- **XSS**: escapado en vistas con `esc()`. Frontend usa `textContent`.
- **Inyección SQL**: mitigada por Query Builder/Modelos CI4.

## Notas

- No se usa `.env`; la configuración de BD viene de variables de entorno de `docker-compose.yml`.
- Los assets tienen cache-busting (`?v=4`) para forzar recarga en desarrollo.
- `public/index.html` evita listado de directorios (403).
- Los seeders son idempotentes: no insertan duplicados si ya existen datos.
