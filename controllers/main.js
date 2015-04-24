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
		if(lookingDebates[i].id == req.params.id && req.params.key == lookingDebates[i].key1){
			debate = lookingDebates[i];
			res.render("debateScreen", {"debate":debate, "debator":"first"});
			return;
		}
		if(lookingDebates[i].id == req.params.id && req.params.key == lookingDebates[i].key2){
			debate = lookingDebates[i];
			res.render("debateScreen", {"debate":debate, "debator":"second"});
			currentDebates.push(lookingDebates[i]);
			lookingDebates.splice(i,1);
			return;
		}
	}
	for(var i = 0; i<currentDebates.length; i++){
		if(currentDebates[i].id == req.params.id && req.params.key == currentDebates[i].key1){
			debate = currentDebates[i];
			res.render("debateScreen", {"debate":debate, "debator":"first"});
			return;
		}
		if(currentDebates[i].id == req.params.id && req.params.key == currentDebates[i].key2){
			debate = currentDebates[i];
			res.render("debateScreen", {"debate":debate, "debator":"second"});
			return;
		}
	}
	// res.render("index");
}

exports.getView = function(req, res){
	res.render("view", {"currentDebates": currentDebates});
}

exports.viewDebate = function(req, res){
	for(var i = 0; i<currentDebates.length; i++){
		if(currentDebates[i] != null && currentDebates[i].id == req.params.id){
			res.render("debateScreen", {"debate":currentDebates[i], "debator":"viewer"});
		}
	}
}

exports.joinDebate = function(req, res){
	var debate = {};
	for(var i = 0; i<lookingDebates.length; i++){
		if(lookingDebates[i] != null && lookingDebates[i].id == req.params.id){
			debate = lookingDebates[i];
			debate['key2'] = Math.floor(100000*Math.random());
			res.send({"key": debate['key2']})
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
		"id":currentId,
		"viewerINC":0,
		"viewers": []
	}
	console.log("created debate");
	console.log(debate);

	currentId++;
	lookingDebates.push(debate);

	res.send({"id":currentId-1, "key":key1});
}


exports.getDebates = function(){
	return lookingDebates;
}

exports.getCurrentDebates = function(){
	return currentDebates;
}
