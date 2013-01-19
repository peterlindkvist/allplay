window.players = players || {};

players.BasicPlayer = function(url){
	this.callback = new players.PlayerCallback();
	//on the api playback event call this.callback.onEnd() ...
	this._sound = new Audio();
	this._sound.src=url;
	this._sound.onload = function(){
		this.callback.onReady();
	}
	this._sound.onerror = function(){
		this.callback.onError();
	}
};

players.BasicPlayer.prototype.play = function(){
	this._sound.play();
};

players.BasicPlayer.prototype.pause = function(){
	this._sound.pause();
};

players.BasicPlayer.prototype.seek = function(){

};

players.BasicPlayer.prototype.dispose = function(){
};

