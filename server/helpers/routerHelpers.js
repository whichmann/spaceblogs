function isActiveRoute(route, currentRoute) {
    return currentRoute && route === currentRoute;
}

module.exports = { isActiveRoute }