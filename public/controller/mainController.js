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

	$scope.downloadPlaylist= function(id,name){
		console.log("downloadPlaylis")
		var item = search(id,$scope.playlists);
		item.loading = true;
		Spotify
		  .getPlaylistTracks($scope.user.id, id)
		  .then(function (data) {
		  		console.log(data);
		   		httpService.downloadSongs(data.items).success(function(result){

		   			var file = new Blob([result], {type: "application/octet-stream"});
		            saveAs(file,name+".zip");
		            item.loading = false;
		            return;
		   		});

		  });
	}
	$scope.logout= function(){
		localStorage.clear();
		$location.path('/login');

	}

	function search(idKey, myArray){
    	for (var i=0; i < myArray.length; i++) {
		        if (myArray[i].id === idKey) {
		            return myArray[i];
		        }
		    }
	}



});

	

});