PlayerFactory = function(){};

PlayerFactory.resolve = function(url){
  if (players.YoutubePlayer.supportsURL(url))
    return new players.YoutubePlayer(url);

  if (players.SoundCloudPlayer.supportsURL(url)) {
    return new players.SoundCloudPlayer(url);
  }

  if (players.RdioPlayer.supportsURL(url))
    return new players.RdioPlayer(url);

  if (players.SpotifyPlayer.supportsURL(url)) {
    return new players.SpotifyPlayer(url);
  }

  if (players.BasicPlayer.supportsURL(url))
    return new players.BasicPlayer(url);

  return new players.IPlayer(url);
};

PlayerFactory.getMetaData = function(url, callback){
  if (players.YoutubePlayer.supportsURL(url))
    return players.YoutubePlayer.getMetaData(url, callback);

  if (players.SoundCloudPlayer.supportsURL(url))
    return players.SoundCloudPlayer.getMetaData(url, callback);

  if (players.RdioPlayer.supportsURL(url))
    return players.RdioPlayer.getMetaData(url, callback);

  if (players.SpotifyPlayer.supportsURL(url))
    return players.SpotifyPlayer.getMetaData(url, callback);

  if (players.BasicPlayer.supportsURL(url))
    return players.BasicPlayer.getMetaData(url, callback);

  return new players.IPlayer.getMetaData(url, callback);
};

