// todo : http://webaudiodemos.appspot.com/input/index.html

var microphone, sampler;
var context = new window.webkitAudioContext();
var processing;

window.onload = function() {
  var repeater, id;

  navigator.webkitGetUserMedia({audio: true}, function(localMediaStream) {
    microphone = context.createMediaStreamSource(localMediaStream);
    sampler = context.createAnalyser();
    sampler.fftSize = 1024;
    microphone.connect(sampler);

    window.clearTimeout(id);
    repeater = function () { sampleAudio(); id = setTimeout(repeater, 15); };
    repeater();
  });

  var canvas = document.getElementsByTagName('canvas')[0];
  new Processing(canvas, function(p) {
    processing = p;
    processing.size(window.innerWidth, window.innerHeight);
  });

  repeater = function() { sampleAudio(); id = setTimeout(repeater, 100); };
  repeater();

  (function daytimeRepeater() { updateBackground(); setTimeout(daytimeRepeater, 1000); })();
};

function updateBackground() {
  var date = new Date();

  $('#topGradientTransition,#bottomGradient').removeClass();
  var current_hour = date.getHours();
  var next_hour = (current_hour + 1) % 24;

  var percentage = (date.getMinutes() * 60 + date.getSeconds()) / 3600;
  $('#topGradientTransition').addClass('hour-' + current_hour);
  $('#topGradient').css('opacity', 1 - percentage);
  $('#bottomGradient').addClass('hour-' + next_hour);
}

function sampleAudio() {
  processing.background(0, 0, 0, 0);
  processing.stroke(230, 230, 230);

  if (!sampler) {
    return sampleFakeAudio();
  }

  var buffer = new Uint8Array(512);
  sampler.smoothingTimeConstant = 0.75;
  sampler.getByteFrequencyData(buffer);

  var waves_frame_origin = window.innerHeight / 2 + 100;

  for(var line_count = 0; line_count < 5; ++line_count) {
    var previous_x = 0;
    var previous_y = 0 - 50 * line_count;

    for(var i = 0; i < buffer.length; ++i) {
      var x = window.innerWidth * 1.0 / buffer.length * i;
      var y = buffer[i];
      processing.line(previous_x, waves_frame_origin - previous_y - 50 * line_count, x, waves_frame_origin - y - 50 * line_count);

      previous_x = x;
      previous_y = y;
    }
  }
}

var theta = 0;
var float_values = new Uint8Array(window.innerWidth);
function sampleFakeAudio() {
  theta += 0.2;

  var waves_frame_origin = window.innerHeight / 2 + 100;

  var x = theta;
  for (var i = 0; i < float_values.length; ++i) {
    float_values[i] = 100 + Math.sin(x + i * 0.1) * 100;
  }

  for(var line_count = 0; line_count < 5; ++line_count) {
    var previous_x = 0;
    var previous_y = float_values[0] - 50 * line_count;

    for(var j = 0; j < float_values.length; ++j) {
      processing.line(previous_x, waves_frame_origin + previous_y - 50 * line_count, previous_x + j, waves_frame_origin + float_values[j] - 50 * line_count);

      previous_x = previous_x + j;
      previous_y
 = float_values[j];
    }
  }
}
