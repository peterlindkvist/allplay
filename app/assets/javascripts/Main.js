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
      self.loadNext();
    })
  .on("click", ".js-play_item_button", function(e) {
    self._index = $(this).data('id');
    self.loadNext();
  }).on("click", ".js-add-song", function(e) {
    var $input = $('#' + $(this).data('input'));
    var url = $input.val();
    self.addSong($input.val());
  });
};

Main.prototype.loadNext = function() {
  var self = this;

  if(this._currentPlayer){
    this._currentPlayer.dispose();
  }

  var url = this._playlist.songs[this._index].url;
  console.log("init", this._index);
  this._currentPlayer = PlayerFactory.resolve(url, this._index);
  this._currentPlayer.callback.onReady = function(id){
    self.play();
  };

  this._currentPlayer.callback.onPlay = function(id) {
    console.log("onPlay - args: ", arguments);
  $('.js-list-item-'+id).addClass('playing').removeClass('pausing');
    // set UI state
  };

  this._currentPlayer.callback.onPause = function(id) {
    console.log("onPause - args: ", arguments);
	$('.js-list-item-'+id).addClass('pausing').removeClass('playing');
    // set UI state
  };

  this._currentPlayer.callback.onEnd = function(id) {
    console.log("onEnd");
    self._index ++;
    self.loadNext();
    $('.js-list-item-'+id).removeClass('pausing').removeClass('playing');
    // set UI state
  };
};

Main.prototype.play = function(){
  if (!this._currentPlayer) return;
  if ("play" in this._currentPlayer) this._currentPlayer.play();
};

Main.prototype.pause = function() {
  if (!this._currentPlayer) return;
	if ("pause" in this._currentPlayer) this._currentPlayer.pause();
};

Main.prototype.stop = function() {
  if (!this._currentPlayer) return;
  if ("stop" in this._currentPlayer) this._currentPlayer.stop();
};

Main.prototype.addSong = function(url){
  console.log("ADD song not implemented", url)
};
