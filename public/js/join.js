function joinDebateByID(id){
	$.post( "/joinDebate/" + id, {}, function(data){
			console.log(data);
			window.location.href = "/debateScreen/" + id + "/"+data.key;
	});
}