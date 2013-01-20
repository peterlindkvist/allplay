var Utils = window.utils || {};

Handlebars.registerHelper("formatTime", function(time) {
  return Utils.formatTime(time)
});

Handlebars.registerHelper("artwork", function(url) {
  return url ? url : 'http://aura-healingbyphone.com/index_files/Audio%20File%20Icon.gif'
});


Utils.formatTime = function(time) {
  var
    minutes = Math.floor(time / 60),
    seconds = Math.round(time % 60);

  return Utils.zeroPad(minutes) + ":" + Utils.zeroPad(seconds);
};

Utils.zeroPad = function(number) {
  number = Number(number);
  if (number < 10) return "0"+number;
  return String(number);
};

Utils.isMobile = function() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
};
