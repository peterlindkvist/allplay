PlayerFactory = function(){};

PlayerFactory.resolve = function(url){
  if (players.YoutubePlayer.supportsURL(url))
    return new players.YoutubePlayer(url);

  if (players.SoundCloudPlayer.supportsURL(url)) {
    console.log("SCPlayer supports URL");
    return new players.SoundCloudPlayer(url);
  }

  if (players.BasicPlayer.supportsURL(url))
    return new players.BasicPlayer(url);

  return new players.IPlayer(url);
}

PlayerFactory.getMetaData = function(url, callback){
  if (players.YoutubePlayer.supportsURL(url))
    return players.YoutubePlayer.getMetaData(url, callback);

  if (players.SoundCloudPlayer.supportsURL(url))
    return players.SoundCloudPlayer.getMetaData(url, callback);

  if (players.BasicPlayer.supportsURL(url))
    return players.BasicPlayer.getMetaData(url, callback);


  return new players.IPlayer.getMetaData(url, callback);
}

