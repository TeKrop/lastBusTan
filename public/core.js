function MainController($scope, $http) {
    //$scope.formData = {};
    $scope.loading = true;

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

    $scope.showArret = function(id) {
        $scope.loading = true;
        $http.get('/api/arret/' + id)
            .success(function(data) {
                $scope.arretData = data;
                $scope.loading = false;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

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
angular.module('lastBusTan', []).controller('MainController', MainController);