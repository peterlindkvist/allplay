PlayerFactory = function(){};

PlayerFactory.resolve = function(url){
	if(players.YoutubePlayer.isSupported(url)){
		return new players.YoutubePlayer(url);
	} else if (players.BasicPlayer.isSupported(url)){
		return new players.BasicPlayer(url);
	}
	return new players.IPlayer(url);
}




