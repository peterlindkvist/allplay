PlayerFactory = function(){

	//on the api playback event call this.callback.onEnd() ...
};


PlayerFactory.resolve = function(url){
	console.log("resolve", url)

	if(players.YoutubePlayer.isSupported(url)){
		return new players.YoutubePlayer(url);
	}
	return new players.IPlayer(url);
}




