window.players = window.players || {};

players.BasicPlayer = function(url){
	var self=this;
	
	this.callback = new players.PlayerCallback();
	//on the api playback event call this.callback.onEnd() ...
	
	this._sound = new Audio();	
	
	this._sound.addEventListener('canplaythrough', function() { 
		self.callback.onReady();
	}, false);
	
	this._sound.addEventListener('ended', function() { 
		self.callback.onEnd();
	}, false);

	this._sound.onerror = function(){
		self.callback.onError();
	}
	
	
	this._sound.src=url;
	
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

