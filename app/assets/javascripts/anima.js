// todo : http://webaudiodemos.appspot.com/input/index.html

var Anima = Anima || {};
Anima.date_cache = new Date();

window.onload = function() {
  navigator.webkitGetUserMedia({audio: true}, function(localMediaStream) {
    Anima.enable_real_audio(new window.webkitAudioContext(), localMediaStream);
  });

  new Processing(document.getElementsByTagName('canvas')[0], function(p) {
    p.size(window.innerWidth, window.innerHeight);
    Anima.processing = p;
    Anima.enable_fake_audio();
  });

  (function daytimeRepeater() {
    Anima.update_background();
    setTimeout(daytimeRepeater, 1000);
  })();
};
