PlayerFactory = function(){};

PlayerFactory.resolve = function(url){
  if (players.YoutubePlayer.supportsURL(url)){
    return new players.YoutubePlayer(url);
  }

  if (players.SoundCloudPlayer.supportsURL(url)) {
    return new players.SoundCloudPlayer(url);
  }

  if (players.RdioPlayer.supportsURL(url)) {
    return new players.RdioPlayer(url);
  }

  //have to be before Buzz
  if (players.LocalFilePlayer.supportsUrl(url)){
   console.log('LocalFileLoader'); 
    return new players.LocalFilePlayer(url);
  }

  if (players.Buzz.supportsURL(url)){
   console.log('Buzz'); 
   return new players.Buzz(url);
  }

  if (players.SpotifyPlayer.supportsURL(url)) {
    return new players.SpotifyPlayer(url);
  }

  if (players.BasicPlayer.supportsURL(url)){
    return new players.BasicPlayer(url);
  }

  return null;
  //return new players.IPlayer(url);
};

PlayerFactory.getMetaData = function(url, callback){
  if (players.YoutubePlayer.supportsURL(url))
    return players.YoutubePlayer.getMetaData(url, callback);

  if (players.SoundCloudPlayer.supportsURL(url))
    return players.SoundCloudPlayer.getMetaData(url, callback);

  if (players.RdioPlayer.supportsURL(url))
    return players.RdioPlayer.getMetaData(url, callback);

  if (players.LocalFilePlayer.supportsUrl(url))
    return players.LocalFilePlayer.getMetaData(url, callback);

  if (players.Buzz.supportsURL(url))
    return players.Buzz.getMetaData(url, callback);

  if (players.SpotifyPlayer.supportsURL(url))
    return players.SpotifyPlayer.getMetaData(url, callback);


  throw new Error('NO PLAYER FOUND');	
  return new players.IPlayer.getMetaData(url, callback);
};

