<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');

$routes->get('/map', 'Map::index');

$routes->group('api', static function ($routes) {
    $routes->get('furanchos', 'Api\\Furanchos::index');
});
