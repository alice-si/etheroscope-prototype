var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var morgan         = require('morgan');
var passport	     = require('passport');
var cache          = require('mongoose-cache');


var port = process.env.PORT || 8080; // set our port

var Promise = require('bluebird');
Promise.config({
  cancellation: true
});

var isProduction = process.env.NODE_ENV === 'production';
var staticdir = isProduction ? 'dist.prod' : 'dist.dev'; // get static files dir

process.on('uncaughtException', function (err) {
  console.error(err);
  console.log("Node NOT Exiting...");
});

app.use(bodyParser.json()); // parse application/json
// get all data/stuff of the body (POST) parameters
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT

//CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

//log to console
app.use(morgan('dev'));

// routes ==================================================
require('./devServer/routes')(app); // configure our routes


//STATIC FILES

//resources
if (!isProduction) {
  app.use(express.static(__dirname + '/' + staticdir)); // set the static files location /public/img will be /img for users
}
//html5
app.get('/*', function(req, res) {
 res.sendfile(__dirname + '/' + staticdir + '/index.html');
});

// start app ===============================================
  app.listen(port);                                    // startup our app at http://localhost:8080
  console.log('Starting server at: ' + port);          // shoutout to the user

exports = module.exports = app;                        // expose app
