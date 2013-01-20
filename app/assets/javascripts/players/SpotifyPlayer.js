var players = window.players || {};

players.SpotifyPlayer = function(url,id){
  console.log("SpotifyPlayer ", url);
  var self = this;
  this.callback = new players.PlayerCallback();

  this._channel_id = players.SpotifyPlayer.getChannel();

  this.url = url;
  this._id = id;

  //if(!players.SpotifyPlayer.pubnub){
    this.pubnub = PUBNUB.init({
      publish_key   : 'demo',
      subscribe_key : 'demo'
    });

    this.pubnub.subscribe({
      channel : "allplay_remote_api_spotify_" + self._channel_id,
      message : function(message){
        self._onCallback(message);
      },
      connect : function(channel) {
        console.log("connect", channel);
        self._send({
          command : "load",
          url : url
        });
      }
    })
   // players.SpotifyPlayer.active = true;
  /*} else {
    this._send({
      command : "load",
      url : url
    });
  } */
};

players.SpotifyPlayer.prototype._onCallback = function(message){
  console.log("callback", message);
  this.duration = message.duration;
  this.position = message.position;
  this.isPlaying = message.playing;
  this._retrivedTime = (new Date()).getTime()
  switch(message.command){
    case "onload" :
      this.callback.onReady();
      break;
    case "onState" :
      if(message.position == 0){
        if(this._firstEnd){
          this.callback.onEnd();
        }else{
          this._firstEnd = true;
        }
      } else {
        if(message.playing){
          this.callback.onPlay();
        } else {
          this.callback.onPause();
        }
      }

      break;
  }
};


players.SpotifyPlayer.prototype.play = function(){
  this._send({
    command : 'play'
  })
};


players.SpotifyPlayer.prototype.pause = function(){
  this._send({
    command : 'pause'
  })
};

players.SpotifyPlayer.prototype.togglePause = function(){
  this.isPlaying
    ? this.pause()
    : this.play();
};


players.SpotifyPlayer.prototype.seek = function(){};

players.SpotifyPlayer.prototype.dispose = function(){
  this.pause();

  this.pubnub.unsubscribe({
    channel : "allplay_remote_api_spotify_" + this._channel_id
  });
};

/**
 * @return integer Duration in seconds
 */
players.SpotifyPlayer.prototype.getDuration = function() {
  return this.duration / 1000;
};

/**
 * @return integer Position in seconds
 */
players.SpotifyPlayer.prototype.getPosition = function() {
  var offset = 0
  if(this.isPlaying){
    offset = (new Date()).getTime() - this._retrivedTime;
  }
  return (this.position + offset) / 1000;
};

players.SpotifyPlayer.prototype._send = function(message){
  console.log("send", this._channel_id, message);
  var self = this;
  this.pubnub.publish({
    channel : "allplay_remote_api_client_" + self._channel_id,
    message : message
  });
}


players.SpotifyPlayer.supportsURL = function(url){
  return url.indexOf("spotify.com") != -1;
};

players.SpotifyPlayer.getMetaData = function(url, callback){
  var id = this._getID(url)
  var full = 'http://ws.spotify.com/lookup/1/.json?uri=spotify:track:' + id;
  $.ajax({
    url : full,
    dataType: "json",
    success: function (data) {
      console.log("data", data);
      var artists = [];
      for(var i = 0; i < data.track.artists.length;i++){
        artists.push(data.track.artists.name);
      }
      var ret = {
        type : 'spotify',
        title: data.track.name,
        author: artists.join(", "),
        duration: data.track.length
      }
      callback.call(null, ret);
    }
  });

};

players.SpotifyPlayer._getID = function(url){
  return url.split('/').pop();
}

players.SpotifyPlayer.getChannel = function(){
  var channel_id
  if($.cookie('spotify_channel_id')) {
    channel_id = $.cookie('spotify_channel_id')
  }else{
    channel_id = (Math.random() + "").substr(2);
    $.cookie('spotify_channel_id', channel_id);
    //document.location.href = "spotify:app:remote:" + this._channel_id;
    //alert("open remote app with\nspotify:app:remote:" + this._channel_id);
  }
  return channel_id
}


