angular.module('MainController',[])

.controller('MainCtr', function($scope,Spotify,httpService,$location) {



Spotify.getCurrentUser().then(function(data){
	$scope.user = data;



	Spotify.getUserPlaylists(data.id).then(function(data2){

	    $scope.playlists = data2.items;
	    console.log("playlist",data2)

	});

	$scope.doThis = function(){
		console.log("doingThis")
	}

	$scope.downloadPlaylist= function(id){
		console.log("downloadPlaylis")

		Spotify
		  .getPlaylistTracks($scope.user.id, id)
		  .then(function (data) {
		  		console.log(data);
		   		httpService.downloadSongs(data.items).then(function(result){

		   			console.log(result.data,"result");
		   			var file = new Blob([result], {type: 'application/zip'});
		            console.log(file);
		            var fileURL = URL.createObjectURL(file);

            		var a = document.createElement("a");
	            	document.body.appendChild(a);
	            	a.style = "display: none";
	                a.href = fileURL;
	                a.download = "myfile.zip";
	                a.click();
		   		});

		  });
	}

	$scope.logout= function(){

		localStorage.clear();
		$location.path('/login');

	}


});

	

});