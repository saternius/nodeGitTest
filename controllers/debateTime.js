

//returns -1 if the debate is over
exports.getNextDelayTime = function(debate){
	if(debate["type"] == "Parlimentary"){
		return getNextParlTime(debate);
	} else if(debate["type"] == "Ethical Delemma"){
		return getNextEthicalTime(debate);
	}else{
		return 100000;
	}
}

function getNextParlTime(debate){
	if(debate["debateState"] == 0){
		return (1000)*60*5;
	} else if(debate["debateState"] == 1){
		return (1000)*60*8;
	} else if(debate["debateState"] == 2){
		return (1000)*60*8;
	} else if(debate["debateState"] == 3){
		return (1000)*60*8;
	} else if(debate["debateState"] == 4){
		return (1000)*60*3;
	} else {
		return -1;
	}
}

function getNextEthicalTime(debate){
	if(debate["debateState"] == 0){
		return (1000)*60*10;
	} else if(debate["debateState"] == 1){
		return (1000)*60*10;
	} else if(debate["debateState"] == 2){
		return (1000)*60*2;
	} else if(debate["debateState"] == 3){
		return (1000)*60*2;
	} else {
		return -1;
	}
}