window.players = players || {};

players.IPlayer = function(){
	this.callback = new players.PlayerCallback();
	//on the api playback event call this.callback.onEnd() ...
};


players.IPlayer.prototype.play = function(){};

players.IPlayer.prototype.pause = function(){};

players.IPlayer.prototype.seek = function(){};

players.IPlayer.prototype.dispose = function(){};



