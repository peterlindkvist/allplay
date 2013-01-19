var players = window.players || {};

players.SpotifyPlayer = function(url,id){
  console.log("SpotifyPlayer ", url);
  var self = this;
  this.callback = new players.PlayerCallback();

  if($.cookie('spotify_channel_id')) {
    this._channel_id = $.cookie('spotify_channel_id')
  }else{
    this._channel_id = (Math.random() + "").substr(2);
    $.cookie('spotify_channel_id', this._channel_id);
    alert("open remote app with\nspotify:app:remote:" + this._channel_id);
  }

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
  this.position / 1000;
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

};

players.SpotifyPlayer._getID = function(url){
  return url.split('/').pop();
}


