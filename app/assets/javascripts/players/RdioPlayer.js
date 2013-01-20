var players = window.players || {};

/**
 * @param boolean autoInitialize Defaults to true
 */
players.RdioPlayer = function(url, autoInitialize) {
  if (autoInitialize === undefined) autoInitialize = true;

  this.callback = new players.PlayerCallback();
  //on the api playback event call this.callback.onEnd() ...

  this._soundObj = {
    uri: url,
    trackData: null
  };

  var self = this;
  if (autoInitialize) {
    this.setupSDK(function() {
      R.ready(function() {
        self.resolve(function() {
          self.onReady();
        });
      });
    });
  }
};

players.RdioPlayer.prototype.setupSDK = function(callback) {
  //console.log("RPlayer - setupSDK");
  var self = this;

  var SDKURI = Settings.rdio.api_uri + Settings.rdio.client_id;

  if (document.querySelector("[src='"+SDKURI+"']") && "R" in window) {
    //console.info("Rdio SDK already initialized");
    this.onSDKLoad(callback);
    return;
  }

  var sdkEl = document.createElement("script");
  sdkEl.src = SDKURI;
  document.body.appendChild(sdkEl);
  sdkEl.addEventListener("load", function() {
    self.onSDKLoad(callback);
  });
  sdkEl.addEventListener("error", players.RdioPlayer.onSDKLoadError);
};

players.RdioPlayer.prototype.onSDKLoad = function(callback) {
  //console.log("RPlayer - onSDKLoad");

  if (callback) callback();
};

players.RdioPlayer.prototype.onSDKLoadError = function() {
  //console.log("RPlayer - onSDKLoadError: ", arguments);
};

players.RdioPlayer.prototype.resolve = function(callback) {
  if (!("R" in window)) return;

  var self = this;
  R.request({
    method: "getObjectFromUrl",
    content: { url: this._soundObj.uri },
    success: function(response) {
      var trackData = response.result;
      //console.log("RPlayer - resolved track data: ", trackData);

      self._soundObj.trackData = trackData;
      callback(trackData);
    },
    error: function(response) {
      //console.log("RPlayer - error: ", response);
    }
  });
};

players.RdioPlayer.prototype.play = function() {
  //console.log("RPlayer play");

  if (!("R" in window)) return;

  if (!this._playbackIsInitialized) {
    this._playbackIsInitialized = true;
    R.player.play({ source: this._soundObj.trackData });
  } else {
    R.player.play();
  }

  if (this.callback.onPlay) this.callback.onPlay();
};

players.RdioPlayer.prototype.pause = function() {
  //console.log("RPlayer pause");

  if (!("R" in window)) return;

  R.player.pause();

  if (this.callback.onPause) this.callback.onPause();
};

players.RdioPlayer.prototype.togglePause = function() {
  //console.log("RPlayer pause");

  if (!("R" in window)) return;

  if (R.player.playState() === R.player.PLAYSTATE_PLAYING) {
    R.player.pause();
    if (this.callback.onPause) this.callback.onPause();
    return;
  }

  this.play();
};

players.RdioPlayer.prototype.stop = function() {
  //console.log("RPlayer stop");

  if (!("R" in window)) return;

  R.player.pause();

  if (this.callback.onStop) this.callback.onStop();
};

/**
 * @param integer pos Position in seconds
 */
players.RdioPlayer.prototype.seek = function(pos) {
  //console.log("RPlayer seek", pos);

  if (!this._soundObj.loadedSound) return;
  this._soundObj.loadedSound.setPosition(pos * 1000);
};

players.RdioPlayer.prototype.dispose = function() {
  //console.log("RPlayer dispose");
  this.stop();
  this._soundObj = null;
};

players.RdioPlayer.prototype.onReady = function() {
  if (this.callback.onReady) this.callback.onReady(this);
};

players.RdioPlayer.prototype.onEnd = function() {
  if (this.callback.onEnd) this.callback.onEnd();
};

/**
 * @return integer Duration in seconds
 */
players.RdioPlayer.prototype.getDuration = function() {
  var duration = 0;
  if (!this._soundObj.trackData) return duration;

  duration = this._soundObj.trackData.duration;

  return duration;// / 1000;
};

/**
 * @return integer Position in seconds
 */
players.RdioPlayer.prototype.getPosition = function() {
  var position = 0;
  if (!("R" in window) || !this._playbackIsInitialized) return position;

  position = R.player.position();
  return position;// / 1000;
};

/**
 * Statics
 */
players.RdioPlayer.supportsURL = function(url) {
  return url.indexOf("rdio.com") > -1 || url.indexOf("rd.io/") > -1;
};
players.RdioPlayer.getMetaData = function(url, callback) {
  var p = new players.RdioPlayer(url, false);
  p.setupSDK(function() {
    R.ready(function() {
      p.resolve(function(trackData) {
        $.extend(trackData, {
          type: "rdio",
          author: trackData.artist,
          title: trackData.name,
          img: trackData.icon
        });
        callback(trackData);
      });
    });
  });
};

