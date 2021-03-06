var app = angular.module('lastBusTan', ['ngRoute', 'infinite-scroll', 'lastBusTanControllers']);
var lastBusTanControllers = angular.module('lastBusTanControllers', []);

// application configuration
app.config(['$routeProvider', function ($routeProvider) {
    /**
    * $routeProvider
    */
    $routeProvider
    .when('/', {
        templateUrl: 'views/arrets.html',
        controller: 'ArretsProchesController'
    })
    .when('/lignes', {
        templateUrl: 'views/lignes.html',
        controller: 'LignesController'
    })
    .when('/arrets', {
        templateUrl: 'views/arrets.html',
        controller: 'ArretsController'
    })
    .otherwise({
        redirectTo: '/'
    });

}]);

// config for infinite scroll
angular.module('infinite-scroll').value('THROTTLE_MILLISECONDS', 250)