<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');

$routes->get('/map', 'Map::index');

$routes->get('/login', 'Auth::loginForm');
$routes->post('/auth/login', 'Auth::login');
$routes->get('/logout', 'Auth::logout');

$routes->group('api', static function ($routes) {
    $routes->get('furanchos', 'Api\\Furanchos::index');

    $routes->get('me', 'Api\\Me::index');
});
