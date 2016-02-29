var app = angular.module('app', ['ngRoute', 'MainController', 'LoginController', 'HttpService', 'spotify']);

app.config(function($httpProvider,$provide) {

    $httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.withCredentials = true;
    delete $httpProvider.defaults.headers.common["X-Requested-With"];
    $httpProvider.defaults.headers.common["Accept"] = "application/json";
    $httpProvider.defaults.headers.common["Content-Type"] = "application/json";



    $provide.factory('myHttpInterceptor', function($q) {
        var networkPromise = null;

        return {
            'request': function(config) {

                return config;
            },
            'responseError': function(response) {
                if (response.status === 401) {
                    console.log(response, "401 villa")
                }

                if (response.status === 0) {


                }

                return $q.reject(response);
            }
        };
    });

    $httpProvider.interceptors.push('myHttpInterceptor');

});


app.config(function(SpotifyProvider) {
    SpotifyProvider.setClientId('2db32e7a77be4146a16aca3ecc3e02e4');
    SpotifyProvider.setRedirectUri('http://localhost:8888/callback.html');
    SpotifyProvider.setScope('user-read-private playlist-read-private');
    // If you already have an auth token
    console.log(localStorage["spotify-token"], "token")
    if (localStorage["spotify-token"])
        SpotifyProvider.setAuthToken(localStorage["spotify-token"]);


});

//routing
app.config(['$locationProvider', '$routeProvider',
    function($location, $routeProvider) {


        $routeProvider.
        when('/login', {
            templateUrl: 'html/login.html',
            controller: 'LoginCtr'
        }).
        when('/main', {
            templateUrl: 'html/main.html',
            controller: 'MainCtr'
        }).
        otherwise({
            redirectTo: '/main'
        });
    }
]);