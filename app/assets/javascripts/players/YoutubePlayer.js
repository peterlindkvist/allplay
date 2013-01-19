var players = window.players || {};

players.YoutubePlayer = function(url){
	this.callback = new players.PlayerCallback();
	console.log("youtube", url)
	//on the api playback event call this.callback.onEnd() ...
	/*
	var params = { allowScriptAccess: "always" };
	var atts = { id: "yt-player" };
	//http://www.youtube.com/watch?v=m3KdpzL3Hkk
	var video_id = url.split('v=').shift();
	var full_url = "http://www.youtube.com/v/" + video_id+ "?enablejsapi=1&playerapiid=ytplayer&version=3";
	console.log("full_url", full_url);
	swfobject.embedSWF(full_url, "js-player", "100", "80", "8", null, null, params, atts);*/
}

players.YoutubePlayer.prototype.play = function(){};

players.YoutubePlayer.prototype.pause = function(){};

players.YoutubePlayer.prototype.seek = function(){};

players.YoutubePlayer.prototype.dispose = function(){};

players.YoutubePlayer.isSupported = function(url){
	return url.indexOf("www.youtube.com") != -1;
};




