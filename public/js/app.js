var app = angular.module('lastBusTan', ['ngRoute', 'lastBusTanControllers']);

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

// directive for class active on navbar links
angular.module('lastBusTan').directive('bsActiveLink', ['$location', function ($location) {
    return {
        restrict: 'A', //use as attribute
        replace: false,
        link: function (scope, elem) {
            //after the route has changed
            scope.$on("$routeChangeSuccess", function () {
                var hrefs = ['/#' + $location.path(),
                             '#' + $location.path(), //html5: false
                             $location.path()]; //html5: true
                angular.forEach(elem.find('a'), function (a) {
                    a = angular.element(a);
                    if (-1 !== hrefs.indexOf(a.attr('href'))) {
                        a.parent().addClass('active');
                    } else {
                        a.parent().removeClass('active');
                    };
                });
            });
        }
    }
}]);