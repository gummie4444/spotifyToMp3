angular.module('MainController',[])

.controller('MainCtr', function($scope,Spotify,httpService) {



Spotify.getCurrentUser().then(function(data){
	$scope.user = data;



	Spotify.getUserPlaylists(data.id).then(function(data2){
	    $scope.playlists = data2.items;
	    console.log("playlist",data2)


	});

	$scope.downloadPlaylist= function(id){
		console.log("downloadPlaylis")

		Spotify
		  .getPlaylistTracks($scope.user.id, id)
		  .then(function (data) {
		  		console.log(data);
		   		httpService.downloadSongs(data.items);

		  });

	}


});

	

});