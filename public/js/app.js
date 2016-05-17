var app = angular.module('lastBusTan', ['ngRoute', 'infinite-scroll', 'lastBusTanControllers']);

// application configuration
app.config(['$routeProvider', function ($routeProvider) {
    /**
    * $routeProvider
    */
    $routeProvider
    .when('/', {
        templateUrl: 'views/arrets.html',
        controller: 'ArretsProchesCtrl'
    })
    .when('/lignes', {
        templateUrl: 'views/lignes.html',
        controller: 'LignesCtrl'
    })
    .when('/arrets', {
        templateUrl: 'views/arrets.html',
        controller: 'ArretsCtrl'
    })
    .otherwise({
        redirectTo: '/'
    });

}]);

// config for infinite scroll
angular.module('infinite-scroll').value('THROTTLE_MILLISECONDS', 250)