var app = angular.module('app', ['ngRoute', 'MainController', 'LoginController', 'HttpService', 'spotify','vs-repeat']);

app.config(function($httpProvider,$provide) {

    $httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.withCredentials = true;
    delete $httpProvider.defaults.headers.common["X-Requested-With"];




    $provide.factory('myHttpInterceptor', function($q,$location) {
        var networkPromise = null;

        return {
            'request': function(config) {
                return config;
            },
            'responseError': function(response) {
                if (response.status === 401) {
                    console.log(response, "401 villa")
                    $location.path("/login");
                }

                if (response.status === 0) {
                    console.log("serverR")

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