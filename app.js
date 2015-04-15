// Load required packages
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');
var mainController = require('./controllers/main');

var http = require('http');
var request = require('request');
var async = require('async');
var parseString = require('xml2js').parseString;
var fs = require('fs');
var holla = require('holla'); //holla


// Create our Express application
var app = express();

var server = require('http').createServer(app).listen(5000); //holla
var rtc = holla.createServer(server); //holla


app.set("view engine", "ejs");

// Use the body-parser package in our application
app.use(bodyParser.urlencoded({
  extended: true
}));
// Add headers
app.use(function (req, res, next) {
  //console.log("here");
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Authorization");
    next();
  });

// Create our Express router
var router = express.Router();

app.use(express.static(__dirname + "/public"));
console.log(__dirname + "/public")

 router.route('/')
 .get(mainController.getMain);

 router.route('/create')
 .get(mainController.getCreate)
 .post(mainController.createDebate);

 router.route('/join')
 .get(mainController.getJoin);

 router.route('/view')
 .get(mainController.getView);

 router.route('/debateScreen/:id/:key1')
 .get(mainController.getDebateScreen);

 router.route('/joinDebate/:id')
 .get(mainController.joinDebate);


// Register all our routes with /api
app.use('/', router);
var port = process.env.PORT || 8080;
// Start the server
app.listen(port);