var request = require('request');
var async = require('async');
var parseString = require('xml2js').parseString;

//In the future this may be stored in a database, but will be stored like this for now
var currentId = 0;
var lookingDebates = [];
var currentDebates = [];

exports.getMain = function(req, res){
	res.render("index");
}

exports.getJoin = function(req, res){
	res.render("join", {"lookingDebates":lookingDebates});
}

exports.getCreate = function(req, res){
	res.render("create");
}

exports.getDebateScreen = function(req, res){
	for(var i = 0; i<lookingDebates.length; i++){
		if(lookingDebates[i].id == req.params.id && req.params.key1 == lookingDebates[i].key1){
			debate = lookingDebates[i];
			res.render("debateScreen", {"debate":debate, "debator1":"true"});
		}
	}
	// res.render("index");
}

exports.getView = function(req, res){
	res.render("view");
}

exports.joinDebate = function(req, res){
	var debate = {};
	for(var i = 0; i<lookingDebates.length; i++){
		if(lookingDebates[i].id == req.params.id){
			debate = lookingDebates[i];
			res.render("debateScreen", {"debate":debate, "debator1":"false"});
		}
	}
	// res.render("join", {"lookingDebates":lookingDebates});
}

exports.createDebate = function(req, res){

	var key1 = Math.floor(100000*Math.random())

	var debate = {
		"type":req.body.type,
		"political":req.body.political,
		"seriousness":req.body.seriousness,
		"private":req.body.private,
		"topic":req.body.topic,
		"debator1":req.body.debator1,
		"key1":key1,
		"id":currentId
	}
	console.log("created debate");
	console.log(debate);

	currentId++;
	lookingDebates.push(debate);

	res.send({"id":currentId-1, "key1":key1});
}

