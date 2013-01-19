var players = window.players || {};

players.IPlayer = function(){
	this.callback = new players.PlayerCallback();
	//on the api playback event call this.callback.onEnd() ...
};

players.IPlayer.prototype.play = function(){
	console.log("IPLAYER play")
};

players.IPlayer.prototype.pause = function(){
	console.log("IPLAYER pause")
};

players.IPlayer.prototype.seek = function(pos){
	console.log("IPLAYER seek", pos)
};

players.IPlayer.prototype.dispose = function(){
	console.log("IPLAYER dispose")
};

/**
 * @return integer Duration in seconds
 */
players.IPlayer.prototype.getDuration = function() {
  return 0;
};

/**
 * @return integer Position in seconds
 */
players.IPlayer.prototype.getPosition = function() {
  return 0;
};

players.IPlayer.supportsURL = function(url){
	return false;
};

