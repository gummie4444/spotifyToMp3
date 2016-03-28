angular.module('HttpService',[])

.factory('httpService', function($http) {

   return {
        login: function() {
             //return the promise directly.
             return $http.get('/loginToSpotify')     
        },

        downloadSongs:function(tracks){


          return $http({
                  method: 'POST',
                  url: 'downloadSongs',
                  data: tracks,
                  headers: {
                      'Content-Type': 'arraybuffer'
                  }})
        }

      };
    })