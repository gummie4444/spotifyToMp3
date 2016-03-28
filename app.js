
var express = require('express'); // Express web server framework
var morgan = require('morgan');
var logger = morgan('combined');
var compress = require('compression');


var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

app.use(compress());  

app.use(express.static(__dirname + '/public'));     // set the static files location /public/img will be /img for users
app.use(logger);                                    // log every request to the console
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());                         // pull information from html in POST
app.use(cookieParser());

  // Add headers
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8888');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});
 
// routes ======================================================================
require('./server/routes.js')(app);

console.log('Listening on 8888');
app.listen(8888);
