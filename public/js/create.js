function setDebateType(type){
	$('#Mode').html(type);
}

function setPrivacy(type){
	$('#Privacy').html(type);
}

function setIsPolitical(type){
	$('#Political').html(type);
} 

function createDebate(){
	$.post( "/create", { "type": $('#Mode').html(), "private": $('#Privacy').html(), 
		"political":$('#Political').html(), "seriousness":$("#points").val(), "topic":$("#comment").val(), 
		"debator1":$("#Name").val()}, function(data){
			console.log(data);
			window.location.href = "/debateScreen/" + data.id + "/"+data.key;
		});
}