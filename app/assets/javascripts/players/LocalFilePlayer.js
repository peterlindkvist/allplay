window.players = window.players || {};

players.LocalFilePlayer = function LocalFilePlayer(url,id){
	var self=this;
	this._id = id;
	this.callback = new players.PlayerCallback();
	//on the api playback event call this.callback.onEnd() ...
	
	this._sound = new buzz.sound(url);	
	
	this._sound.bind('canplay', function() { 
		self.callback.onReady();
	}, false);
	
	this._sound.bind('ended', function() { 
		self.callback.onEnd(self._id);
	}, false);

	this._sound.bind('play', function() { 
		self.callback.onPlay(self._id);
	}, false);

	this._sound.bind('pause', function() { 
		self.callback.onPause(self._id);
	}, false);

	this._sound.bind('onerror', function(){
		self.callback.onError(self._id);
	},false);
	
	this._sound.src=url;
	
};

players.LocalFilePlayer.supportsUrl = function(url){
	return /^(file|\/).*\.(wav|mp3|ogg|mp4)/.test(url);
}

players.LocalFilePlayer.getMetaData = function(url,callback){
	// Check for the various File API support.
	if (window.File && window.FileReader && window.FileList && window.Blob) {
      console.log("FILE LOADED", url);
     var file = new File(url); 
     var reader = new FileReader();
	  reader.onload = function(e) {
	    console.log("ON LOAD", url);
        var dv = new jDataView(this.result);
   	    // "TAG" starts at byte -128 from EOF.
        // See http://en.wikipedia.org/wiki/ID3
		if (dv.getString(3, dv.byteLength - 128) == 'TAG') {
		  console.log(dv.getString());
		  /*var trackData = {
			title : dv.getString(30, dv.tell());
		  var artist = dv.getString(30, dv.tell());
		  var album = dv.getString(30, dv.tell());
		  var year = dv.getString(4, dv.tell());*/
		} else {
		  console.log("// no ID3v1 data found.")
		  return;
		}
	  }
	  reader.onerror = function(e){console.log(e)}
      console.log(reader);
	  
	  reader.readAsArrayBuffer(file);
	
	} else {
	  alert('The File APIs are not fully supported in this browser.');
	}
	
/*	sound.bind('canplay', function(url) { 
		var trackData = {
	      title: "No title",
		  duration:sound.getDuration(),
		  type: "html5Audio",
	      author: "Missing data"
	    };
		if (/.*\.(wav|mp3|ogg|mp4)/.test(url)){
		  var reader = new FileReader();
		  reader.onload = function(e) {
            var dv = new jDataView(this.result);
       	    // "TAG" starts at byte -128 from EOF.
			    // See http://en.wikipedia.org/wiki/ID3
			if (dv.getString(3, dv.byteLength - 128) == 'TAG') {
			  var title = dv.getString(30, dv.tell());
			  var artist = dv.getString(30, dv.tell());
			  var album = dv.getString(30, dv.tell());
			  var year = dv.getString(4, dv.tell());
			} else {
			      // no ID3v1 data found.
			}
		  };

		  reader.readAsArrayBuffer(url);
		  $.extend(trackData, {
		  });
		  callback(trackData);
		}else {
		  $.extend(trackData, {});
		    callback(trackData);
		 }
	}, false);*/
}


players.LocalFilePlayer.prototype.play = function(){
	this._sound.play();
};

players.LocalFilePlayer.prototype.pause = function(){
	this._sound.pause();
};

players.LocalFilePlayer.prototype.seek = function(){
};

players.LocalFilePlayer.prototype.dispose = function(){
	this._sound.pause();
	this._sound = null;
};

/**
 * @return integer Duration in seconds
 */
players.LocalFilePlayer.prototype.getDuration = function() {
	return this._sound.getDuration();
};

/**
 * @return integer Position in seconds
*/ 
players.LocalFilePlayer.prototype.getPosition = function() {
  return this._sound.getTime();
};
