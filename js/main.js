require.config({
    baseUrl: "js",
    paths: {
        'angular': 'angular-1.2.22/angular.min',
        'angular-route': 'angular-1.2.22/angular-route.min',
        'angularAMD': 'angularAMD.min',
        'angular-dragdrop': 'angular-dragdrop.min',
        'googleMaps': '//rawgit.com/allenhwkim/angularjs-google-maps/master/build/scripts/ng-map.min',
        'GridController': 'controllers/grid'
    },
    shim: {
        'angularAMD': ['angular'],
        'angular-route': ['angular'],
        'angular-dragdrop': ['angular'],
        'googleMaps' : ['angular']
    },
    deps: ['app']
});