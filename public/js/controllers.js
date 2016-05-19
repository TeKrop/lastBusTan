lastBusTanControllers.controller('ArretsProchesController', function($scope, $http, Helpers) {
    // global variables
    $scope.loading = true;
    $scope.currentArret = false;
    $scope.pageHeader = 'Liste des arrêts';
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
                $scope.loading = false;
                $scope.errorMessage = 'Erreur pendant le chargement des données';
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
    $scope.showArret = function(arret) {
        var that = $scope;
        $scope.loading = true;
        $scope.errorMessage = false;
        $scope.currentArret = arret.libelle;
        $scope.pageHeader = 'Arrêt ' + arret.libelle;
        $http.get('/api/arret/' + arret.codeLieu)
            .success(function(data) {
                that.arretData = data;
                that.loading = false;
                if (data.length === 0) {
                    that.errorMessage = 'Erreur : aucune donnée pour l\'arrêt ' + arret.libelle;
                }
            })
            .error(function(data) {
                console.log('Error: ' + data);
                that.loading = false;
                that.errorMessage = 'Erreur pendant le chargement des données';
            });
    };

    // when we click on the back button, return on the list
    $scope.backToList = Helpers.backToList;

    // order by for arret list of hours
    $scope.hourIncreasing = Helpers.hourIncreasing;
});

lastBusTanControllers.controller('LignesController', function($scope, $http, Helpers) {

    // global variables
    $scope.loading = true;
    $scope.currentArret = false;
    $scope.pageHeader = 'Liste des lignes';
    $scope.errorDisplay = false;
    $scope.arretData = [];
    $scope.lignes = [];

    // variables for lazy loading
    $scope.dataLoaded = null;
    $scope.lastLigne = null;
    $scope.loadingStep = 10;

    // when landing on the page, get all todos and show them
    $http.get('/api/lignes')
        .success(function(data) {
            // we take the data, and order it here, in order to avoid issues
            // with orderBy + infinite scroll on HTML
            $scope.dataLoaded = data.sort(function(a, b) {
                var aValue = Helpers.getLigneValue(a.numLigne);
                var bValue = Helpers.getLigneValue(b.numLigne);
                return aValue - bValue;
            });
            for (var i=0; i < $scope.loadingStep; i++) {
                $scope.lignes.push($scope.dataLoaded[i]);
            }
            $scope.lastLigne = $scope.loadingStep;
            $scope.loading = false;
        })
        .error(function(data) {
            console.log('Error: ' + data);
            $scope.errorMessage = 'Erreur pendant le chargement des données';
            $scope.loading = false;
        });

    // when we click on panel-heading containing "ligne" number
    $scope.toggleArrets = function(ligne) {
        ligne.showArrets = !ligne.showArrets;
    };

    // when we click on a "arret", display data about it (with specific line)
    $scope.showArret = function(ligne, arret) {
        $scope.loading = true;
        $scope.errorMessage = false;
        ligne.showArrets = false;
        $scope.currentArret = arret.libelle;
        $scope.pageHeader = 'Ligne ' + ligne.numLigne + ' - Arrêt ' + arret.libelle;
        $http.get('/api/arret/' + arret.codeLieu)
            .success(function(data) {
                // we filter the received data, only selecting hours for the selected "ligne"
                data = data.filter(function(d) {
                    return d.ligne === ligne.numLigne;
                });
                $scope.arretData = data;
                $scope.loading = false;
                if (data.length === 0) {
                    $scope.errorMessage = 'Erreur : aucune donnée pour l\'arrêt ' + arret.libelle + ' sur la ligne ' + ligne.numLigne;
                }
            })
            .error(function(data) {
                console.log('Error: ' + data);
                $scope.errorMessage = 'Erreur pendant le chargement des données';
                $scope.loading = false;
            });
    };

    // use for lazy loading : we load lignes step by step (loadingStep)
    $scope.showMoreData = Helpers.showMoreData;

    // when we click on the back button, return on the list
    $scope.backToList = Helpers.backToList;

    // order by for arret list of hours
    $scope.hourIncreasing = Helpers.hourIncreasing;
});

lastBusTanControllers.controller('ArretsController', function($scope, $http, Helpers) {
    // global scope variables
    $scope.loading = true;
    $scope.currentArret = false;
    $scope.pageHeader = 'Liste des arrêts';
    $scope.errorDisplay = false;
    $scope.arretData = [];
    $scope.arrets = [];

    // variables for lazy loading
    $scope.dataLoaded = null;
    $scope.lastArret = null;
    $scope.loadingStep = 10;

    // get the arrets with api
    $http.get('/api/arrets')
        .success(function(data) {
            $scope.dataLoaded = data;
            for (var i=0; i < $scope.loadingStep; i++) {
                $scope.arrets.push($scope.dataLoaded[i]);
            }
            $scope.lastArret = $scope.loadingStep;
            $scope.loading = false;
        })
        .error(function(data) {
            console.log('Error: ' + data);
            $scope.errorMessage = 'Erreur pendant le chargement des données';
            $scope.loading = false;
        });

    // when we click on a "arret", display data about it
    $scope.showArret = function(arret) {
        var that = $scope;
        $scope.loading = true;
        $scope.errorMessage = false;
        $scope.currentArret = arret.libelle;
        $scope.pageHeader = 'Arrêt ' + arret.libelle;
        $http.get('/api/arret/' + arret.codeLieu)
            .success(function(data) {
                that.arretData = data;
                that.loading = false;
                if (data.length === 0) {
                    that.errorMessage = 'Erreur : aucune donnée pour l\'arrêt ' + arret.libelle;
                }
            })
            .error(function(data) {
                console.log('Error: ' + data);
                that.loading = false;
                that.errorMessage = 'Erreur pendant le chargement des données';
            });
    };

    // use for lazy loading : we load arrets step by step (loadingStep)
    $scope.showMoreData = Helpers.showMoreData;

    // when we click on the back button, return on the list
    $scope.backToList = Helpers.backToList;

    // order by for arret list of hours
    $scope.hourIncreasing = Helpers.hourIncreasing;
});