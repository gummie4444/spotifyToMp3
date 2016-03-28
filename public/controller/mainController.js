angular.module('MainController',[])

.controller('MainCtr', function($scope,Spotify,httpService,$location,$timeout) {



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
	  		console.log(data,"dataFrom SPotify");
	   		httpService.downloadSongs(data.items).then(function(result){

	   			var file = new Blob([result.data], {type: "application/octet-stream"});
	            saveAs(file,name+".zip");
	            item.loading = false;
	            return;
	   		}).catch(function(error){
	   			console.log("downloadSong error")

	   			item.loading = false;
			  	item.error = true;

			  	$timeout(function(){
			  		item.error = false;
			  		item.loading = false;
			  	},5000);
			});

		  }).catch(function(){
		  	item.loading = false;

		  	item.error = true;

		  	$timeout(function(){
			  		item.error = false;
			  	},5000);
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