window.players = window.players || {};


players.BasicPlayer = function(url,id){
	var self=this;
	this._id = id;
	this.callback = new players.PlayerCallback();
	//on the api playback event call this.callback.onEnd() ...
	
	this._sound = new Audio();	
	
	this._sound.addEventListener('canplaythrough', function() { 
		self.callback.onReady();
	}, false);
	
	this._sound.addEventListener('ended', function() { 
		self.callback.onEnd(self._id);
	}, false);

	this._sound.addEventListener('play', function() {
    self._isPlaying = true;
		self.callback.onPlay(self._id);
	}, false);

	this._sound.addEventListener('pause', function() {
    self._isPlaying = false;
		self.callback.onPause(self._id);
	}, false);

	this._sound.onerror = function(){
		self.callback.onError(self._id);
	}
	
	this._sound.src=url;
	
};

players.BasicPlayer.supportsURL = function(url){
	return /.*\.(wav)/.test(url);
}

players.BasicPlayer.prototype.play = function(){
	this._sound.play();
};

players.BasicPlayer.prototype.pause = function(){
	this._sound.pause();
};

players.BasicPlayer.prototype.togglePause = function(){
  this._isPlaying
    ? this.pause()
    : this.play();
};


players.BasicPlayer.prototype.seek = function(){
};

players.BasicPlayer.prototype.getDuration = function() {
  return this._sound.duration;
};

/**
 * @return integer Position in seconds
 */
players.BasicPlayer.prototype.getPosition = function() {
  return this._sound.currentTime;
};


players.BasicPlayer.prototype.dispose = function(){
	this._sound.pause();
	this._sound = null;
};

