var Utils = window.utils || {};

Handlebars.registerHelper("formatTime", function(time) {
  return Utils.formatTime(time)
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
