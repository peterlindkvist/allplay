PlayerFactory = function(){};

PlayerFactory.resolve = function(url){
	if (players.YoutubePlayer.isSupported(url))
		return new players.YoutubePlayer(url);

  if (players.SoundCloudPlayer.supportsURL(url)) {
    console.log("SCPlayer supports URL");
    return new players.SoundCloudPlayer(url);
  }

  if (players.BasicPlayer.isSupported(url))
		return new players.BasicPlayer(url);

	return new players.IPlayer(url);
}

