var players = window.players || {};

players.YoutubePlayer = function(url, id){
  //console.log("YoutubePlayer: ", id);
  this._id = id;
  var self = this;
  var _domid = "js-player-inner";
  $('#js-player').html('<div id="' + _domid + '"></div>');
  this.callback = new players.PlayerCallback();
  //on the api playback event call this.callback.onEnd() ...

  window.onYouTubePlayerReady = function(playerId) {
    //console.log("pl", playerId, _domid);
    var player = document.getElementById(_domid);
    window.player = player;
    self._onReady(player);
  };

  window.onYouTubePlayerStateCallback = function(state){
    self._onStateCallback(state);
  };

  var params = { allowScriptAccess: "always" };
  var atts = { id: _domid };
  //http://www.youtube.com/watch?v=m3KdpzL3Hkk
  var video_id = players.YoutubePlayer._getVideoID(url);
  var full_url = "http://www.youtube.com/v/" + video_id+ "?enablejsapi=1&playerapiid=ytplayer&version=3";
  swfobject.embedSWF(full_url, _domid, "200", "200", "8", null, null, params, atts);
};

players.YoutubePlayer.prototype._onReady = function(player){
  this._player = player;
  this._player.addEventListener("onStateChange", "onYouTubePlayerStateCallback");
  this.callback.onReady();
};

players.YoutubePlayer.prototype._onStateCallback = function(state){
  switch(state){
    case 0:
      this._isPlaying = false;
      this.callback.onEnd(this._id);
      break;
    case 1:
      this._isPlaying = true;
      this.callback.onPlay(this._id);
      break;
    case 2:
      this._isPlaying = false;
      this.callback.onPause(this._id);
      break;
  }
};

players.YoutubePlayer.prototype.play = function(){
  this._player.playVideo();
};

players.YoutubePlayer.prototype.pause = function(){
  this._player.pauseVideo();
};

players.YoutubePlayer.prototype.togglePause = function(){
  this._isPlaying
    ? this.pause()
    : this.play();
};

players.YoutubePlayer.prototype.seek = function() {};

players.YoutubePlayer.prototype.dispose = function(){
  this._player.clearVideo();
  window.onYouTubePlayerReady = null;
  window.onYouTubePlayerStateCallback = null;
  $('#js-player').empty();
};

/**
 * @return integer Duration in seconds
 */
players.YoutubePlayer.prototype.getDuration = function() {
  if (!("_player" in this)) return 0;
  return this._player.getDuration();
};

/**
 * @return integer Position in seconds
 */
players.YoutubePlayer.prototype.getPosition = function() {
  if (!("_player" in this)) return 0;
  return this._player.getCurrentTime();
};

players.YoutubePlayer.supportsURL = function(url){
  return url.indexOf("www.youtube.com") != -1 && !Utils.isMobile();
};

players.YoutubePlayer.getMetaData = function(url, callback){
  var id = players.YoutubePlayer._getVideoID(url);

  $.ajax({
    url: "http://gdata.youtube.com/feeds/api/videos/" + id + "?v=2&alt=json",
    dataType: "jsonp",
    success: function (data) {
      console.log("youtube resp", data);
      var ret = {
        type : 'youtube',
        title: data.entry.title.$t,
        author: data.entry.author[0].name.$t,
        duration: data.entry.media$group.yt$duration.seconds,
        img: data.entry.media$group.media$thumbnail[0].url
      }
      callback.call(null, ret);
    }
  });

};

players.YoutubePlayer._getVideoID = function(url){
  return url.split('v=')[1];
}

