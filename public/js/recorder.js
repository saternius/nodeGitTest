// Compatibility shim
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

var peerId = ""
if($('#isDebatorOne').val() == "true"){
  peerId = "debatorOne";
  console.log("debatorOne");
} else {
  peerId = "debatorTwo";
  console.log($('#isDebatorOne').val());
}

var peer = new Peer(peerId, {key: 'lwjd5qra8257b9'});

peer.on('open', function(id) {
  console.log('My peer ID is: ' + id);
});

navigator.getUserMedia({audio: true, video: true}, function(stream){
        
}, function(res){});


if($('#isDebatorOne').val() == "false"){

  navigator.getUserMedia({video: true, audio: true}, function(stream) {
    var call = peer.call('debatorOne', stream);
    console.log("called");
  }, function(err) {
    console.log('Failed to get local stream' ,err);
  });
} else {
  peer.on('call', function(call) {
    navigator.getUserMedia({video: true, audio: true}, function(stream) {
    call.answer(); // Answer the call with an A/V stream.
    call.on('stream', function(remoteStream) {
      console.log("call answered");
      $('#my-video').prop('src', URL.createObjectURL(remoteStream));
        window.localStream = remoteStream;
    });
  }, function(err) {
    console.log('Failed to get local stream' ,err);
  });
  });
}
