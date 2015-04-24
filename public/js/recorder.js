// Compatibility shim
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

//used for creating a peer id
var peerId = "";
var peer; 
var myStream;
var socket = io.connect('http://davidsilin.me:8000');

//set the peer id
if($('#isDebatorOne').val() == "first"){

  peerId = "debatorOne";
  connectToServer();
  socket.emit('debator ready', {"debator":"first", "id":$("#debateID").text()});

} else if ($('#isDebatorOne').val() == "second") {

  peerId = "debatorTwo";
  connectToServer();
  socket.emit('debator ready', {"debator":"second", "id":$("#debateID").text()});

}else {
  console.log($("#debateID").text());
  socket.emit('viewing debate', {"id":$("#debateID").text()});
}

socket.on('set viewer', function(msg){
  if($('#isDebatorOne').val() == "viewer" && peerId == ""){
    console.log("val= viewer: " + msg["viewerID"])
    console.log(msg["viewerID"])
    peerId = msg["viewerID"];
    connectToServer();
    socket.emit("ready", {"viewerID":msg["viewerID"]});
  }
});

socket.on('call viewer', function(msg){
  console.log("call viewer");
  if($('#isDebatorOne').val() == "second"){
    console.log(msg["viewerID"])
    peer.call(msg["viewerID"], myStream);
  }
});

socket.on('set sender', function(msg){
  console.log('switching sender');
  if($('#isDebatorOne').val() == msg["debator"]){
    var myPeers = msg["viewers"];
    if(typeof myStream === 'undefined'){
      navigator.getUserMedia({video: true, audio: true}, function(Stream) {
        myStream = Stream;
        for(var i = 0; i<myPeers.length; i++){
          console.log(myPeers[i]);
          peer.call(myPeers[i], myStream);
        }
        if(msg["debator"] == "second"){
          peer.call('debatorOne', myStream)
          $('#my-video').prop('src', '');
        } else {
          peer.call('debatorTwo', myStream)
          $('#my-video').prop('src', '');
        }
      }, function(err) {});
    } else {
      for(var i = 0; i<myPeers.length; i++){
        peer.call(myPeers[i], myStream);
      }
      if(msg["debator"] == "second"){
        peer.call('debatorOne', myStream)
        $('#my-video').prop('src', '');
      } else {
        peer.call('debatorTwo', myStream)
        $('#my-video').prop('src', '');
      }
    }
  }
})

//broadcast
if($('#isDebatorOne').val() == "second"){
  navigator.getUserMedia({video: true, audio: true}, function(Stream) {
    var call = peer.call('debatorOne', Stream);
    myStream = Stream;
    console.log("called");
  }, function(err) {
    console.log('Failed to get local stream' ,err);
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
      $('#my-video').prop('src', URL.createObjectURL(remoteStream));
      window.localStream = remoteStream;
    });
  }, function(err) {
    console.log('Failed to get local stream' ,err);
  });
}
