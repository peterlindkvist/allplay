PlayerFactory = function(){};

PlayerFactory.resolve = function(url, id){
	console.log("resoovce", id)
	if(players.YoutubePlayer.isSupported(url)){
		return new players.YoutubePlayer(url, id);
	} else if (players.BasicPlayer.isSupported(url)){
		return new players.BasicPlayer(url, id);
	}
	return new players.IPlayer(url, id);
}




