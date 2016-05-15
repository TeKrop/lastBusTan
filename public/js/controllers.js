var lastBusTanControllers = angular.module('lastBusTanControllers', []);

lastBusTanControllers.controller('ArretsProchesCtrl', function($scope, $http) {
    // global variables
    $scope.loading = true;
    $scope.currentArret = false;
    $scope.pageHeader = 'Arrêts proches';
    $scope.errorDisplay = false;
    $scope.arretData = [];

    // we get the latitude and longitude of the user and then get the list
    navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        };

        // get the arrets with api
        $http.get('/api/arrets/' + pos.latitude + '/' + pos.longitude)
            .success(function(data) {
                $scope.arrets = data;
                $scope.loading = false;
                if (data.length === 0) {
                    $scope.errorMessage = 'Aucun arrêt à moins de 500m de votre position.';
                }
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    },
    function (error) {
        if (error.code == error.PERMISSION_DENIED) {
            console.log("permission denied");
            $scope.arrets = [];
            $scope.loading = false;
            $scope.errorMessage = 'Impossible de charger les arrêts à proximité : vous devez autoriser votre navigateur à utiliser votre géolocalisation.';
        }
    });

    // when we click on a "arret", display data about it
    $scope.showArret =  function(arret) {
        $scope.loading = true;
        $scope.currentArret = arret.libelle;
        $scope.pageHeader = 'Arrêt ' + arret.libelle;
        $http.get('/api/arret/' + arret.codeLieu)
            .success(function(data) {
                $scope.arretData = data;
                $scope.loading = false;
                if (data.length === 0) {
                    $scope.errorMessage = 'Erreur : aucune donnée pour cet arrêt';
                }
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // when we click on the back button, return on the list
    $scope.backToArrets = function() {
        $scope.currentArret = false;
        $scope.errorMessage = false;
        $scope.arretData = [];
        $scope.pageHeader = 'Arrêts proches';
    };

    // order by for arret list of hours
    $scope.hourIncreasing = function(arret) {
        var arretArray = arret.heure.split('h');

        var hours = parseInt(arretArray[0]);
        var minutes = arretArray[1];
        // if the last char is not a number (it can happen sometimes), we substract it
        if (isNaN(parseInt(minutes[minutes.length-1]))) {
            minutes = minutes.substr(0, minutes.length-1);
        }

        // we only have hours between 6am and 2am, so we use it
        if (hours < 4) { hours += 24; }

        // we return the total minutes for comparison
        return hours*60 + minutes;
    };
});

lastBusTanControllers.controller('LignesCtrl', function($scope, $http) {
    // global variables
    $scope.loading = true;
    $scope.currentArret = '';
    $scope.pageHeader = 'Liste des lignes';

    // when landing on the page, get all todos and show them
    $http.get('/api/arrets')
        .success(function(data) {
            //$scope.nbArrets = _.size(_.countBy(data, function(data) { return data.libelle; }));
            $scope.arrets = data;
            $scope.loading = false;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    //
    /*$http.get('/api/lignes')
        .success(function(data) {
            console.log(data);
            $scope.nbLignes = data.length;
            $scope.lignes = data;
            $scope.loading = false;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });*/
});

lastBusTanControllers.controller('ArretsCtrl', function($scope, $http) {
    // global variables
    $scope.loading = true;
    $scope.currentArret = false;
    $scope.pageHeader = 'Liste des arrêts';
    $scope.errorDisplay = false;
    $scope.arretData = [];

    // get the arrets with api
    $http.get('/api/arrets')
        .success(function(data) {
            $scope.arrets = data;
            $scope.loading = false;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    // when we click on a "arret", display data about it
    $scope.showArret =  function(arret) {
        $scope.loading = true;
        $scope.currentArret = arret.libelle;
        $scope.pageHeader = 'Arrêt ' + arret.libelle;
        $http.get('/api/arret/' + arret.codeLieu)
            .success(function(data) {
                $scope.arretData = data;
                $scope.loading = false;
                if (data.length === 0) {
                    $scope.errorMessage = 'Erreur : aucune donnée pour cet arrêt';
                }
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // when we click on the back button, return on the list
    $scope.backToArrets = function() {
        $scope.currentArret = false;
        $scope.errorMessage = false;
        $scope.arretData = [];
        $scope.pageHeader = 'Liste des arrêts';
    };

    // order by for arret list of hours
    $scope.hourIncreasing = function(arret) {
        var arretArray = arret.heure.split('h');

        var hours = parseInt(arretArray[0]);
        var minutes = arretArray[1];
        // if the last char is not a number (it can happen sometimes), we substract it
        if (isNaN(parseInt(minutes[minutes.length-1]))) {
            minutes = minutes.substr(0, minutes.length-1);
        }

        // we only have hours between 6am and 2am, so we use it
        if (hours < 4) { hours += 24; }

        // we return the total minutes for comparison
        return hours*60 + minutes;
    };
});
