/*

Search and download spotify-playlist from youtube via the youtubeDl plugin

*/
module.exports = function(app){

var youtubedl = require('youtube-dl');
var YouTube = require('youtube-node');
var youTube = new YouTube();

var mkdirp = require('mkdirp');
var fs = require('fs');
var Archiver = require('archiver');
var Promise = require('promise');

//TODO get a real api key
youTube.setKey('AIzaSyB1OOSpTREs85WUMvIgJvLTZKye4BVsoFU');

//AIzaSyB1OOSpTREs85WUMvIgJvLTZKye4BVsoFU Tst
//AIzaSyAvGUm0KhLmVxDYhoYShrr9l2a0TSRNdb0 Gummi

  //Search for the song on youtube
  var searchSong = function(song){
     return new Promise(function(resolve,reject){
        //TODO:smarter way of selecting the right song?
        youTube.search(song, 2, function(error, result) {
          if (error) {
            console.log(error);
            reject(error);
          }
          else {
            //check if it's a playlist
            //TODO HANDLE IF PLAYLIST BETTER
            if(result.items[0] && result.items[0].id && result.items[0].id.videoId){
              console.log(result.items[0].id);
              resolve(downloadSong('http://www.youtube.com/watch?v='+result.items[0].id.videoId,song));
            }
            reject(); //TODO:add some error msg

          }
        });
    });
  };

  var downloadSong = function(youtubeLink,songName){
      return new Promise( function(resolve,reject){
        var video = youtubedl(youtubeLink,
          //Optional arguments passed to youtube-dl.
          //TODO CONVERT THIS BETTER (iff the video does not suport the format what then?)
          ['--format=171'],

           //AUDIO formats to consider-
           /*
            format 249: opus/webem
            format 250: opus/webm
            format 140: vorbis/webm 
            format 251: mp4a 
            format 278: webm 
            */            

                   
          // Additional options can be given for calling `child_process.execFile()`.
          { cwd: __dirname });


          video.on('info', function(info) {
            console.log('Download started');
            console.log('filename: ' + info._filename);
            console.log('size: ' + info.size);
          });

          //TODO: does this work?
          var string = '';
          video.on('data',function(buffer){
            if(buffer){
              string += buffer;
            }
          });

          video.on('end', function() {
            console.log('finished downloading!');
            //TODO:RETURN THE RIGHT RESULT
            resolve("string");
          });

          //TODO: does this work?
          video.on('error',function(error){
            reject(error);
          })
      });


  };

  app.post('/downloadSongs',function(req,res){

    var tracks = req.body;
    var songs = [];

    //Get all the information about the playlist and create a string array with artist name and song name
    for(var i = 0; i <= tracks.length-1;i++){
        //TODO: what todo if there is more then one artist name? 
        songs.push(tracks[i].track.artists[0].name + " " + tracks[i].track.name);
    }
   
    //Async try to get all the songs in the playlist 
    var promiseArray = [];
    for(var k = 0; k < songs.length;k++){
       promiseArray.push(searchSong(songs[k]));
    }

    //When all song promises have been resolved/rejected either send zip r send error msg
    Promise.all(promiseArray).then(function(response){
      console.log("All promises resolved");

      //Tell the response that it's a zip file
      res.writeHead(200, {
          'Content-Type': 'application/zip',
          'Content-disposition': 'attachment; filename=myfile.zip'
      });

      var zip = Archiver('zip');

        zip.on('error', function(err) {
          res.status(500).send({error: err.message});
        });

        //on stream closed we can end the request
        zip.on('end', function() {
          console.log('Archive wrote %d bytes', zip.pointer());
        });

      // Send the file to the page output.
      zip.pipe(res);

      //TODO:Do we need todo something to convert buffer to webm/mp3?
      //TODO:for loop through the song's and append them to the zip

      zip.append('Some text to go in file 1.', { name: '1.txt' });
      //zip.append('Some text to go in file 2. I go in a folder!', { name: 'somefolder/2.txt' });
      zip.finalize();


    }).catch(function(){
      res.json({a:"Villa"});

    });

  });
}