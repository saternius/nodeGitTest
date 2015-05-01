// Compatibility shim
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

//used for creating a peer id
var peerId = "";
var peer; 
var myStream;
var socket = io.connect();

//setup the timer
var myTimer = new Timer({
  tick    : 1,
  ontick  : function(sec) {
    $("#timeLeft").text(sec)
  },
  onstart : function() { 
    console.log('timer started') 
  },
  onstop  : function() { 
    console.log('timer stop') 
  },
  onpause : function() { 
    console.log('timer set on pause') 
  },
  onend   : function() { 
    console.log('timer ended normally') 
  }
});

//set the peer id
if($('#isDebatorOne').val() == "first" ){

  peerId = $("#debateID").text()+"debatorOne";
  connectToServer();
  setupMyStream();
  socket.emit('debator ready', {"debator":"first", "id":$("#debateID").text()});

} else if ($('#isDebatorOne').val() == "second") {

  peerId = $("#debateID").text()+"debatorTwo";
  setupMyStream();
  connectToServer();
  socket.emit('debator ready', {"debator":"second", "id":$("#debateID").text()});

}else {
  console.log($("#debateID").text());
  socket.emit('viewing debate', {"id":$("#debateID").text()});
}

socket.on('set viewer', function(msg){
  if($('#isDebatorOne').val() == "viewer" && peerId == "" && msg["id"] == parseInt($("#debateID").text())){
    console.log("val= viewer: " + msg["viewerID"])
    console.log(msg["viewerID"])
    peerId = msg["viewerID"];
    connectToServer();
    socket.emit("ready", {"viewerID":msg["viewerID"], "id":msg["id"]});
  }
});

socket.on('call viewer', function(msg){
  if(msg["id"] !== parseInt($("#debateID").text())){
    return;
  }

  console.log("call viewer");
  if($('#isDebatorOne').val() == "first" && msg["debateState"]%2 == 0){
    console.log(msg["viewerID"])
    peer.call(msg["viewerID"], myStream);
  } else if($('#isDebatorOne').val() == "second"){
    console.log(msg["viewerID"])
    peer.call(msg["viewerID"], myStream);
  }
});

socket.on('set sender', function(msg){
  console.log('switching sender');
  //set the timer
  myTimer.stop();
  myTimer.start(msg["speakingTime"]/1000);

  if($('#isDebatorOne').val() == msg["debator"] && msg["id"] == parseInt($("#debateID").text())){
    var myPeers = msg["viewers"];
    for(var i = 0; i<myPeers.length; i++){
      peer.call(myPeers[i], myStream);
    }
    if(msg["debator"] == "second"){
      peer.call($("#debateID").text()+'debatorOne', myStream)

      $('#my-video').prop('muted', true);
      $('#my-video').prop('src', URL.createObjectURL(myStream));
    } else {
      peer.call($("#debateID").text()+'debatorTwo', myStream)
      $('#my-video').prop('muted', true);
      $('#my-video').prop('src', URL.createObjectURL(myStream));
    }
  }
})

socket.on('debate over', function(msg){
  if(msg["id"] == parseInt($("#debateID").text())){
    myStream = "";
    $("#timeLeft").text("debate over");
    myTimer.stop();
    $('#my-video').prop('src', "");
  }
})

function endTurnEarly(){
  socket.emit("end early", {"secret":parseInt($('#secret').val()), "id":parseInt($("#debateID").text())})
}

function setupMyStream(){
  navigator.getUserMedia({video: true, audio: true}, function(Stream) {
    myStream = Stream;
  }, function(err) {
  });
}

function connectToServer(){
  peer = new Peer(peerId, {key: 'lwjd5qra8257b9'});

  //connect to the server
  peer.on('open', function(id) {
    console.log('My peer ID is: ' + id);
  });

  peer.on('call', function(call) {
    call.answer(); // Answer the call with an A/V stream.
    call.on('stream', function(remoteStream) {
      console.log("call answered");
      $('#my-video').prop('muted', false);
      $('#my-video').prop('src', URL.createObjectURL(remoteStream));
      window.localStream = remoteStream;
    });
  }, function(err) {
    console.log('Failed to get local stream' ,err);
  });
}
