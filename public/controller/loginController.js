angular.module('LoginController', [])

.controller('LoginCtr', function($scope, httpService, Spotify, $location) {

    $scope.goToLogin = function() {
        console.log("login");

        Spotify.login().then(function(data) {
            console.log(data);
            $location.path("#/main")

        }, function() {
            console.log('didn\'t log in');


        })

    }


});