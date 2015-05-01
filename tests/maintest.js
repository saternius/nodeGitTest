//test file

var assert = require("assert")
var mainController = require('../controllers/main');
var timeController = require('../controllers/debateTime');
var request = require('dupertest');

describe("adding debate route should work", function(){
	it("should add to looking debates", function(done){
		var mr = request(mainController.createDebate)
		.body({type: "123", political: "none", seriousness:1, private:"not", topic:"some topic", debator1:"me"})
		.extendRes({
			JSON: function(ob){
				this.send({});
			},
          // very mocked out - we know it will only be used in the context of req.get('host')
          redirect: function(ob) {
          	this.send({});
          }
      })
		.end(function(response) {
			assert(mainController.getDebates().length == 1);
			done();
		});
	});

	it("should be visible in debates", function(done){
		var mr = request(mainController.joinDebate)
		.params({id:0})
		.extendRes({
			JSON: function(ob){
				this.send({});
			},
          // very mocked out - we know it will only be used in the context of req.get('host')
          redirect: function(ob) {
          	this.send({});
          },
          render: function(ob) {
          	this.send({});
          },
          send: function(ob) {
          	this.send({});
          }
      })
		.end(function(response) {
			// console.log(mainController.getDebates().length);
			assert(mainController.getDebates().length == 1);
			done();
		});
	});
})

describe("the time functionality should work correctly", function(){
	it("should work correctly for a parliamentary debate", function(done){
		var debate = {"type":"Parlimentary", "debateState":0}

		assert(timeController.getNextDelayTime(debate) == (1000)*60*5)
		done();
	})
})

