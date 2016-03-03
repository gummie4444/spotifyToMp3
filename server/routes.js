

module.exports = function(app){

var request = require('request'); // "Request" library
var querystring = require('querystring');
var youtubedl = require('youtube-dl');
var fs = require('fs');
var YouTube = require('youtube-node');
var mkdirp = require('mkdirp');

var youTube = new YouTube();

//TODO get a real api key
youTube.setKey('AIzaSyB1OOSpTREs85WUMvIgJvLTZKye4BVsoFU');

//AIzaSyB1OOSpTREs85WUMvIgJvLTZKye4BVsoFU Tst
//AIzaSyAvGUm0KhLmVxDYhoYShrr9l2a0TSRNdb0 Gummi

  var searchSong = function(song){
    youTube.search(song, 2, function(error, result) {
      if (error) {
        console.log(error);
      }
      else {
        //check if it's a playlist
        //TODO HANDLE IF PLAYLIST BETTER
        if(result.items[0] && result.items[0].id && result.items[0].id.videoId){
          console.log(result.items[0].id);
          downloadSong('http://www.youtube.com/watch?v='+result.items[0].id.videoId,song);
        }

      };
    })
  }

  var downloadSong = function(youtubeLink,songName){
      var video = youtubedl(youtubeLink,
          // Optional arguments passed to youtube-dl.
             // Optional arguments passed to youtube-dl.
             //TODO CONVERT THIS BETTER
             ['--format=171'],

             //AUDIO formats-
             /*
              format 249 : opus/webem
              format 250: opus/webm
              format 140: vorbis/webm 
                format 251: mp4a 
              format: 278  webm             */            

                     
              // Additional options can be given for calling `child_process.execFile()`.

          // Additional options can be given for calling `child_process.execFile()`.
          { cwd: __dirname });


        // Will be called when the download starts.
              video.on('info', function(info) {
          console.log('Download started');
          console.log('filename: ' + info._filename);
          console.log('size: ' + info.size);
        });




        console.log("songName",songName)
        video.pipe(fs.createWriteStream(__dirname+'/songs/'+songName.replace(/\s+/g, '')+'.webm'));

        video.on('end', function() {
          console.log('finished downloading!');
        });

            };

  app.post('/downloadSongs',function(req,res){

    var tracks = req.body;

    var songs = [];

    for(var i = 0; i <= tracks.length-1;i++){

        //TODO
        //1. Get all the artist names
        //2. ??
        songs.push(tracks[i].track.artists[0].name + " " + tracks[i].track.name);

    }

    var youtubeLinks = []

    //TODO:make this async and return a minifyed version of the songs
    //todo Create a directory first and on the callback start doing this



    mkdirp(__dirname+'/songs', function(err) { 
        console.log("directory Done",songs);
      for(var k = 0; k < songs.length;k++){
        console.log("k",k)
        searchSong(songs[k]);

      }
    // path was created unless there was error

    });

    res.json({a:"test"});
  });
}