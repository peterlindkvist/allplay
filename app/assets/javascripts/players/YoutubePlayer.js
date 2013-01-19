var players = window.players || {};

players.YoutubePlayer = function(url){
	var self = this;
	var _domid = "js-player";
	this.callback = new players.PlayerCallback();
	//on the api playback event call this.callback.onEnd() ...

	window.onYouTubePlayerReady = function(playerId) {
		var player = document.getElementById(_domid);
		self._onReady(player);
	};

	var params = { allowScriptAccess: "always" };
	var atts = { id: _domid };
	//http://www.youtube.com/watch?v=m3KdpzL3Hkk
	var video_id = url.split('v=')[1];
	var full_url = "http://www.youtube.com/v/" + video_id+ "?enablejsapi=1&playerapiid=player&version=3";
	swfobject.embedSWF(full_url, _domid, "100", "80", "8", null, null, params, atts);
}

players.YoutubePlayer.prototype._onReady = function(player){
	this._player = player;
	//player.addEventListener("onStateChange", "youtube_callback");
	this.callback.onReady();
};

players.YoutubePlayer.prototype.play = function(){
	console.log("youtubeplay");
	this._player.play();
};


players.YoutubePlayer.prototype.pause = function(){};

players.YoutubePlayer.prototype.seek = function(){};

players.YoutubePlayer.prototype.dispose = function(){};

players.YoutubePlayer.isSupported = function(url){
	return url.indexOf("www.youtube.com") != -1;
};




