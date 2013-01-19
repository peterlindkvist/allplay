PlayerFactory = function(){};

PlayerFactory.resolve = function(url){
	if(players.YoutubePlayer.isSupported(url)){
		return new players.YoutubePlayer(url);
	}
	return new players.IPlayer(url);
}




