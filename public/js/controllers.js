var lastBusTanControllers = angular.module('lastBusTanControllers', []);

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
            //$scope.nbArrets = _.size(_.countBy(data, function(data) { return data.libelle; }));
            $scope.arrets = data;
            $scope.loading = false;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    // when we click on a "arret", display data about it
    $scope.showArret = function(arret) {
        $scope.loading = true;
        $scope.currentArret = arret.libelle;
        $http.get('/api/arret/' + arret.codeLieu)
            .success(function(data) {
                $scope.arretData = data;
                $scope.pageHeader = 'Arrêt ' + arret.libelle
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
