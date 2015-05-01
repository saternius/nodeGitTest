// Load required packages
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');
var mainController = require('./controllers/main');
var debTController = require('./controllers/debateTime');


var request = require('request');
var async = require('async');
var parseString = require('xml2js').parseString;
var fs = require('fs');

// Create our Express application
var app = express();

var http = require('http');


var server = http.createServer(app).listen(8000, function(){
  console.log('Express server listening on port ' + 8000);
});

var io = require('socket.io').listen(server);

io.on('connection', function(socket){

  socket.on('viewing debate', function(msg){
  	var debates = mainController.getCurrentDebates();
  	console.log("viewing: " +msg["id"]);
  	for(var i = 0; i<debates.length; i++){
  		if(debates[i]["id"] === parseInt(msg["id"])){
  			debates[i]["viewerINC"]++;
  			debates[i]["viewers"].push(msg["id"] + "viewer"+ (debates[i]["viewerINC"]-1));
  			io.emit('set viewer', {"viewerID": (msg["id"] + "viewer"+ (debates[i]["viewerINC"]-1)), "id":parseInt(msg["id"])});
  			console.log(debates[i]["viewerINC"])
  			return;
  		}
  	}
  });

  socket.on('debator ready', function(msg) {
    var debates = mainController.getDebates();
    var id = parseInt(msg["id"])
    console.log(debates);
    var debate = "not found";
    for(var i = 0; i<debates.length; i++){
      console.log(debates[i]["id"]);
      if(debates[i]["id"] === id){
        console.log("found correctly");
        debates[i]["readyDebators"].push(msg['debator']);
        debate = debates[i]
        break;
      }
    }

    if(debate == "not found"){
      debates = mainController.getCurrentDebates();
      for(var i = 0; i<debates.length; i++){
        if(debates[i]["id"] === id){
          console.log("found correctly");
          debates[i]["readyDebators"].push(msg['debator']);
          debate = debates[i]
          // var time = debTController.getNextDelayTime(debate);
          // io.emit("set sender", {"id":id, "debator":"first", "viewers":debate["viewers"], "speakingTime":time})
          // debate["myTimeout"] = setTimeout(startSwitching, time, socket, id);
          startSwitching(socket, id);
          break;
        }
      }
    } 


  })

socket.on('ready', function(msg){
  debates = mainController.getCurrentDebates();
  for(var i = 0; i<debates.length; i++){
    if(debates[i]["id"] == msg["id"]){
      io.emit('call viewer', {"viewerID": msg["viewerID"], "id":msg["id"], "debateState":debates[i]["debateState"]});
    }
  }
});

socket.on('end early', function(msg){
  debates = mainController.getCurrentDebates();
  for(var i = 0; i<debates.length; i++){
    if(debates[i]["id"] === msg["id"]){
      if(debates[i]["debateState"]%2 == 0 && msg["secret"] == debates[i]["key1"]){
        clearTimeout(debates[i]["myTimeout"]);
        debates[i]["myTimeout"] = startSwitching(socket, msg["id"]);
        return;
      }else if(debates[i]["debateState"]%2 == 1 && msg["secret"] == debates[i]["key2"]){
        clearTimeout(debates[i]["myTimeout"]);
        debates[i]["myTimeout"] = startSwitching(socket, msg["id"]);
        return;
      } 
    }
  }
  console.log("wrong presser or key, could not end early");

});
});

function startSwitching(socket, id){
	var viewers = [];
	var curDevs = mainController.getCurrentDebates();
	for(var i = 0; i<curDevs.length; i++){
		if(curDevs[i].id === id){
			viewers = curDevs[i]["viewers"];
		}
	}
	if(debate["debateState"]%2 == 0){
    var nextTime = debTController.getNextDelayTime(debate)
    if(nextTime != -1){
      io.emit('set sender', {'debator':'first', "viewers":viewers, "id":id, "speakingTime":nextTime});
      debate["myTimeout"] = setTimeout(startSwitching, nextTime, socket, id);
      debate["debateState"]++;
    }else{
      io.emit("debate over", {"id":id})
    }
  } else {
    var nextTime = debTController.getNextDelayTime(debate)
    if(nextTime != -1){
      io.emit('set sender', {'debator':'second', "viewers":viewers, "id":id, "speakingTime":nextTime});
      debate["myTimeout"] = setTimeout(startSwitching, nextTime, socket, id);
      debate["debateState"]++;
    }else{
      io.emit("debate over", {"id":id})
    }
  }
}


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

router.route('/viewDebate/:id')
.get(mainController.viewDebate);

router.route('/debateScreen/:id/:key')
.get(mainController.getDebateScreen);

router.route('/joinDebate/:id')
.post(mainController.joinDebate);




// Register all our routes with /api
app.use('/', router);
var port = process.env.PORT || 3000;
// Start the server
app.listen(port);