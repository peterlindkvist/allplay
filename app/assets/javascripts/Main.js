Main = function(){
  var self = this;

  $.getJSON('/playlist.json', function(data){
    self.start(data);
  });
};


Main.prototype.start = function(playlist){
  for(var i = 0; i< playlist.songs.length;i++){
    playlist.songs[i].id = i;
  }
  this._playlist = playlist;
  this._index = 0;

  $(".js-list").html(HandlebarsTemplates['list'](playlist));

  this.setupEvents();
  this.loadNext();
};

Main.prototype.setupEvents = function() {
  var self = this;

  $("body")
    .on("click", ".js-play_button", function(e) {
      e.preventDefault();
      self.play();
    })
    .on("click", ".js-pause_button", function(e) {
      e.preventDefault();
      self.pause();
    })
    .on("click", ".js-stop_button", function(e) {
      e.preventDefault();
      self.stop();
    })
    .on("click", ".js-next_button", function(e) {
      e.preventDefault();
	  $('.js-list-item-'+self._index).removeClass('pausing').removeClass('playing');
      self._index++;
      self.loadNext();
    })
    .on("click", ".js-previous_button", function(e) {
      e.preventDefault();
      self._index--;
      self.loadNext();
    })
    .on("click", ".js-play_item_button", function(e) {
      self._index = $(this).data('id');
      self._index++;
      self.loadNext();
    })
    .on("click", ".js-add-song", function(e) {
      var $input = $('#' + $(this).data('input'));
      var url = $input.val();
      self.addSong($input.val());
    });

  $(document).on("keyup", function(e) {
    if (e.keyCode === 32) {  // space
      e.preventDefault();
      self.togglePause();
    }
  });
};

Main.prototype.loadNext = function() {
  var self = this;

  if (this._index === this._playlist.songs.length)
    this._index = 0;  // reached end, go to beginning
	

  if (this._index < 0) {
    this._index = this._playlist.songs.length - 1;  // attempting to play song before first one, move to last one
    console.log("move to last - index: ", this._index);
  }

  if(this._currentPlayer){
    this._currentPlayer.dispose();
  }

  var url = this._playlist.songs[this._index].url;
  this._currentPlayer = PlayerFactory.resolve(url, this._index);
  
  this._currentPlayer.callback.onReady = function(id){
    self.play();
	$('.js-list-item-'+self._index).addClass('playing').removeClass('pausing');
  };

  this._currentPlayer.callback.onPlay = function(id) {
  $('.js-list-item-'+self._index).addClass('playing').removeClass('pausing');
    // set UI state
  };

  this._currentPlayer.callback.onPause = function(id) {

    // set UI state
    $('.js-list-item-'+self._index).addClass('pausing').removeClass('playing');
  };

  this._currentPlayer.callback.onEnd = function(id) {
    console.log("onEnd");
    $('.js-list-item-'+self._index).removeClass('pausing').removeClass('playing');
    self._index ++;
    self.loadNext();
  };
};

Main.prototype.play = function(){
  var self = this;

  if (!this._currentPlayer) return;
  if ("play" in this._currentPlayer) this._currentPlayer.play();

  if (this._setPositionInterval) {
    clearInterval(this._setPositionInterval);
    this._setPositionInterval = null;
  }
  this._setPositionInterval = setInterval(function() {
    self.setCurrentPosition();
  }, 500);
};

Main.prototype.pause = function() {
  if (!this._currentPlayer) return;
  if (this._setPositionInterval) {
    clearInterval(this._setPositionInterval);
    this._setPositionInterval = null;
  }
  if ("pause" in this._currentPlayer) this._currentPlayer.pause();
};

Main.prototype.togglePause = function() {
  if (!this._currentPlayer) return;
  if (this._setPositionInterval) {
    clearInterval(this._setPositionInterval);
    this._setPositionInterval = null;
  }
  if ("togglePause" in this._currentPlayer) this._currentPlayer.togglePause();
};

Main.prototype.stop = function() {
  if (!this._currentPlayer) return;
  if ("stop" in this._currentPlayer) this._currentPlayer.stop();
};

Main.prototype.addSong = function(url){
  console.log("ADD song not implemented", url);
};

Main.prototype.setCurrentPosition = function() {
  var position = this._currentPlayer.getPosition();
  console.log("setCurrentPosition: ", position);
};
