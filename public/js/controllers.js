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
                    $scope.errorMessage = 'Erreur : aucune donnée pour l\'arrêt ' + arret.libelle;
                }
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // when we click on the back button, return on the list
    $scope.backToArrets = function() {
        $scope.currentArret = false;
        $scope.loading = false;
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
    // global internal variables
    var lignesLoaded = null;
    var lastLigne = null;
    var loadingStep = 10;

    // global variables
    $scope.loading = true;
    $scope.currentArret = false;
    $scope.pageHeader = 'Liste des lignes';
    $scope.errorDisplay = false;
    $scope.arretData = [];
    $scope.lignes = [];

    // when landing on the page, get all todos and show them
    $http.get('/api/lignes')
        .success(function(data) {
            lignesLoaded = data;
            for (var i=0; i < loadingStep; i++) {
                $scope.lignes.push(lignesLoaded[i]);
            }
            lastLigne = loadingStep;
            $scope.loading = false;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    $scope.toggleArrets = function(ligne) {
        ligne.showArrets = !ligne.showArrets;
    };

    // when we click on a "arret", display data about it (with specific line)
    $scope.showArret =  function(ligne, arret) {
        $scope.loading = true;
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
            });
    };

    // use for lazy loading : we load lignes step by step (loadingStep)
    $scope.showMoreLignes = function() {
        // if we loaded the data
        if (lastLigne !== null) {
            // we show 10 more lignes (or less if we are at the end)
            for (var i = lastLigne; i < lastLigne + loadingStep && i < lignesLoaded.length; i++) {
                $scope.lignes.push(lignesLoaded[i]);
            }
            lastLigne += loadingStep;
        }
    };

    // when we click on the back button, return on the list
    $scope.backToLignes = function() {
        $scope.currentArret = false;
        $scope.loading = false;
        $scope.errorMessage = false;
        $scope.arretData = [];
        $scope.pageHeader = 'Liste des lignes';
    };

    // order by for lignes
    $scope.ligneOrder = function(ligne) {
        if (ligne !== undefined) {
            return isNaN(parseInt(ligne.numLigne)) ? ligne.numLigne : parseInt(ligne.numLigne);
        }
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

lastBusTanControllers.controller('ArretsCtrl', function($scope, $http) {
    // global internal variables
    var arretsLoaded = null;
    var lastArret = null;
    var loadingStep = 10;

    // global scope variables
    $scope.loading = true;
    $scope.currentArret = false;
    $scope.pageHeader = 'Liste des arrêts';
    $scope.errorDisplay = false;
    $scope.arretData = [];
    $scope.arrets = [];

    // get the arrets with api
    $http.get('/api/arrets')
        .success(function(data) {
            arretsLoaded = data;
            for (var i=0; i < loadingStep; i++) {
                $scope.arrets.push(arretsLoaded[i]);
            }
            lastArret = loadingStep;
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
                    $scope.errorMessage = 'Erreur : aucune donnée pour l\'arrêt ' + arret.libelle;
                }
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // use for lazy loading : we load arrets step by step (loadingStep)
    $scope.showMoreArrets = function() {
        // if we loaded the data
        if (lastArret !== null) {
            // we show 10 more arrets
            for (var i = lastArret; i < lastArret + loadingStep && i < arretsLoaded.length; i++) {
                $scope.arrets.push(arretsLoaded[i]);
            }
            lastArret += loadingStep;
        }
    };

    // when we click on the back button, return on the list
    $scope.backToArrets = function() {
        $scope.currentArret = false;
        $scope.loading = false;
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
