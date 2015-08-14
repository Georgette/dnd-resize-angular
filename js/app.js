define(['angularAMD', 'angular-route', 'angular-dragdrop', 'googleMaps'], function (angularAMD) {
    var app = angular.module("app", ['ngRoute', 'ngDragDrop', 'ngMap']);
    app.config(function ($routeProvider) {
        $routeProvider
            .when('/grid', angularAMD.route({
                templateUrl: 'views/grid.html', controller: 'GridController'
            }))
            .otherwise({
                redirectTo: '/grid'
            });
    });
    return angularAMD.bootstrap(app);
});