"use strict";

var Remote = function(){
  var self = this;
  this.sp = getSpotifyApi();
  this.models = this.sp.require('$api/models');
  window.view = this.views = this.sp.require('$api/models');
  window.player = this._player = this.models.player;
  this._channel_id = this.models.application.arguments[0];

  this._player.observe(this.models.EVENT.CHANGE, function(event) {
    self._onStateCallback(event);
  });

  document.getElementById('js-channel').innerText = this._channel_id;

  this.pubnub = PUBNUB.init({
    publish_key   : 'demo',
    subscribe_key : 'demo'
  });

  this.pubnub.subscribe({
    channel : "allplay_remote_api_client_" + self._channel_id,
    message : function(message){
      self._onCallback(message);
    },
    connect : function(channel) {
      console.log("connect", channel);
    },
    presence : function(data){
      console.log("presense", data)
      if(data.action == 'leave'){
        //self._player.playing = false;
      }
    }
  })
}

Remote.prototype._onStateCallback = function(state){
  //console.log("state", state, this._player.position, this._player.track.duration);

  this._send({
    command:'onState',
    data : state.data,
    playing : this._player.playing,
    position : this._player.position,
    duration : this._player.track.duration
  });
}

Remote.prototype._send = function(message){
  console.log("send", this._channel_id, message);
  var self = this;
  this.pubnub.publish({
    channel : "allplay_remote_api_spotify_" + self._channel_id,
    message : message
  });
}

Remote.prototype._onCallback = function(message){
  console.log("message", message);
  switch(message.command){
    case "load":
      this._player.play(message.url);
      this._player.playing = false;
      this._send({command : 'onload'});
      break;
    case "play":
      this._player.playing = true;
      break;
    case "pause":
      this._player.playing = false;
      break;
  }
}

window.onload = function() {
  var app = new Remote();
}
