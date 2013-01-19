Main = function(){
	var self = this;
	$.get('playlist.json', function(){
		self.start();
	})
};


Main.prototype.start = function(playlist){
	this._playlist = playlist;
	this._index = 0;

	this.loadnext();
};

Main.prototype.loadnext = function() {
	var self = this;
	var url = this._playlist[this._index];
	this._currentPlayer = PlayerFactory.resolve(url);

	this._currentPlayer.callback.onReady = function(){
		self.startPlaying();
	}
}

Main.prototype.startPlaying = function(){
	this._currentPlayer.play();
}



