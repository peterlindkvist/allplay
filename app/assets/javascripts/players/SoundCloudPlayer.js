var players = window.players || {};

players.SoundCloudPlayer = function(url) {
  this.callback = new players.PlayerCallback();
  //on the api playback event call this.callback.onEnd() ...

  this._soundObj = {
    uri: url,
    track: null,
    loadedSound: null
  };

  var self = this;
  this.setupSDK(function() {
    self.prepareForPlayback(function() {
      self.onReady();
    });
  });
};

players.SoundCloudPlayer.prototype.setupSDK = function(callback) {
  console.log("SCPlayer - setupSDK");
  var self = this;

  if (document.querySelector("[src='"+Settings.soundcloud.sdk_uri+"']")) {
    console.info("SoundCloud SDK already initialized");
    this.onSDKLoad(callback);
    return;
  }

  var sdkEl = document.createElement("script");
  sdkEl.src = Settings.soundcloud.sdk_uri;
  document.body.appendChild(sdkEl);
  sdkEl.addEventListener("load", function() {
    self.onSDKLoad(callback);
  });
  sdkEl.addEventListener("error", players.SoundCloudPlayer.onSDKLoadError);
};

players.SoundCloudPlayer.prototype.onSDKLoad = function(callback) {
  console.log("SCPlayer - onSDKLoad");

  SC.initialize({ client_id: Settings.soundcloud.client_id });

  if (callback) callback();
};

players.SoundCloudPlayer.prototype.onSDKLoadError = function() {
  console.log("SCPlayer - onSDKLoadError: ", arguments);
};

players.SoundCloudPlayer.prototype.prepareForPlayback = function(callback) {
  console.log("SCPlayer - prepareForPlayback");
  var self = this;

  if (!this._soundObj.track) {
    SC.get("/resolve", { url: this._soundObj.uri }, function(track) {
      console.log("SCPlayer - resolved track data: ", track);
      self._soundObj.track = track;
      self.prepareForPlayback(callback);
    });
    return false;
  }

  if (!this._soundObj.loadedSound) {
    SC.stream("/tracks/"+this._soundObj.track.id, function(loadedSound) {
      console.log("SCPlayer - loaded sound data: ", loadedSound);
      self._soundObj.loadedSound = loadedSound;
      window.loadedSound = loadedSound;
      self.prepareForPlayback(callback);
    });
    return false;
  }

  if (callback) callback();
  return true;
};

players.SoundCloudPlayer.prototype.play = function() {
  console.log("SCPlayer play");

  if (this._soundObj.loadedSound.playState === 1 && !this._soundObj.loadedSound.paused) return;  // don't play more than one sound at a time
  this._soundObj.loadedSound.play();

  if (this.callback.onPlay) this.callback.onPlay();
};

players.SoundCloudPlayer.prototype.pause = function() {
  console.log("SCPlayer pause");

  if (this._soundObj.loadedSound.paused) return;
  this._soundObj.loadedSound.pause();

  if (this.callback.onPause) this.callback.onPause();
};

players.SoundCloudPlayer.prototype.togglePause = function() {
  //console.log("SCPlayer pause");

  if (this._soundObj.loadedSound.paused) {
    this.play();
    return;
  }

  this.pause();
};

players.SoundCloudPlayer.prototype.stop = function() {
  console.log("SCPlayer stop");

  if (this._soundObj.loadedSound.playState === 0) return;
  this._soundObj.loadedSound.stop();
};

players.SoundCloudPlayer.prototype.seek = function(pos) {
  console.log("SCPlayer seek", pos);

  if (!this._soundObj.loadedSound) return;
  this._soundObj.loadedSound.setPosition(pos);
};

players.SoundCloudPlayer.prototype.dispose = function() {
  console.log("SCPlayer dispose");
  this.stop();
  this._soundObj = null;
};

players.SoundCloudPlayer.prototype.onReady = function() {
  if (this.callback.onReady) this.callback.onReady(this);
};

players.SoundCloudPlayer.prototype.getDuration = function() {
  if (!this._soundObj.loadedSound) return 0;

  if (this._soundObj.loadedSound.loaded)
    return this._soundObj.loadedSound.duration;
  return this._soundObj.loadedSound.durationEstimate;
};

players.SoundCloudPlayer.prototype.getPosition = function() {
  if (!this._soundObj.position) return 0;
  return this._soundObj.loadedSound.position;
};

/**
 * Statics
 */
players.SoundCloudPlayer.supportsURL = function(url) {
  return url.indexOf("soundcloud.com") > -1;
};
