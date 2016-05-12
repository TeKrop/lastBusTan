function MainController($scope, $http) {
    // global variables
    $scope.loading = true;
    $scope.currentArret = '';
    $scope.pageHeader = 'Liste des arrêts';

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

    $scope.showArret = function(arret) {
        $scope.loading = true;
        $scope.currentArret = arret.libelle;
        $location.path('/arret/' + arret.codeLieu);
        $http.get('/api/arret/' + arret.codeLieu)
            .success(function(data) {
                $scope.arretData = data;
                $scope.pageHeader = 'Arrêt ' + arret.libelle
                $scope.loading = false;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    $scope.previous

    // when submitting the add form, send the text to the node API
    /*$scope.createTodo = function() {
        $http.get('/api/lignes/' + $scope.formData)
            .success(function(data) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.todos = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // delete a todo after checking it
    $scope.deleteTodo = function(id) {
        $http.delete('/api/todos/' + id)
            .success(function(data) {
                $scope.todos = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };*/
}

MainController.$inject = ['$scope', '$http'];
angular.module('lastBusTan', [])
    .controller('MainController', MainController);