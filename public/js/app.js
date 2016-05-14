var app = angular.module('lastBusTan', ['ngRoute', 'lastBusTanControllers']);

// application configuration
app.config(['$routeProvider', function ($routeProvider) {
  /**
   * $routeProvider
   */
  $routeProvider
  .when('/', {
    templateUrl: 'views/arrets.html',
    controller: 'ArretsCtrl'
  })
  .when('/arrets', {
    templateUrl: 'views/arrets.html',
    controller: 'ArretsCtrl'
  })
  .when('/lignes', {
    templateUrl: 'views/lignes.html',
    controller: 'LignesCtrl'
  })
  .otherwise({
    redirectTo: '/'
  });

}]);