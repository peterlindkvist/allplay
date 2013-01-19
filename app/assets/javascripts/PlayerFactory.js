PlayerFactory = function(){

	//on the api playback event call this.callback.onEnd() ...
};


PlayerFactory.resolve = function(url){
	return new IPlayer(url);
}




