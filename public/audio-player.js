//
// @author  thedoritos
// @version 2014.07.01
//

var context = null;

var beepBuffers = {};
var successMusicBuffer = null;

var musicBufferSource = null;

var init = function(err) {
    try {
        context = context ? context : new webkitAudioContext();

        loadBuffer('./sounds/beep_des_' + 0 + '.mp3', function(buff) { beepBuffers[0] = buff }, err);
        loadBuffer('./sounds/beep_des_' + 1 + '.mp3', function(buff) { beepBuffers[1] = buff }, err);
        loadBuffer('./sounds/beep_des_' + 2 + '.mp3', function(buff) { beepBuffers[2] = buff }, err);
        loadBuffer('./sounds/beep_des_' + 3 + '.mp3', function(buff) { beepBuffers[3] = buff }, err);
        loadBuffer('./sounds/beep_des_' + 4 + '.mp3', function(buff) { beepBuffers[4] = buff }, err);

        $.getJSON('./conf.json', function(data) {
          loadBuffer(data['music'], function(buff) { successMusicBuffer = buff; } , err);
        })
        .fail(function() {
          alert("Failed to load sound configuration.");
        });

    }
    catch(e) {
        err('Web Audio API is not supported in this browser');
    }
};

var loadBuffer = function(url, buffer, err) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

    request.onload = function() {
        context.decodeAudioData(request.response, buffer, err);
    }
    request.send();
};

var playBuffer = function(buffer, pitch, isMusic) {
    if (!context) {
        console.log('Webkit audio context is not ready.');
        return;
    }
    if (!buffer) {
        console.log('Buffer is not ready.');
        return;
    }

    var source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    source.playbackRate.value = pitch;
    source.noteOn(0);

    if (isMusic) {
        musicBufferSource = source;
    }
};

var playSuccess = function() {
    stopAll();
    playBuffer(successMusicBuffer, 1, true);
};

var playMeter = function(score) {
    // playback rates for chromatic scale
    var SCALE = [
        1.0  /  1.0,
        16.0 / 15.0,
        9.0  /  8.0,
        6.0  /  5.0,
        5.0  /  4.0,
        4.0  /  3.0,
        45.0 / 32.0,
        3.0  /  2.0,
        8.0  /  5.0,
        5.0  /  3.0,
        9.0  /  5.0,
        15.0 /  8.0
    ];

    // kasou meter's pitches for each scores
    var SCORE_PITCHES = [
        1,  // D
        3,  // E
        5,  // F#
        6,  // G
        8,  // A
        10, // B
        14, // Eb
        17, // F#
        20, // A
        23, // C
        27, // E
        29, // F#
        32, // A
        36, // C#
        39, // E
        41, // F#
        44, // A
        47, // C
        50, // Eb
        53, // F#
    ];

    if (score <= 0 || score > SCORE_PITCHES.length) {
        console.log('Score (=' + score + ') is out of range [1,' + SCORE_PITCHES.length + '].');
        return;
    }

    var pitch  = SCORE_PITCHES[score - 1];
    var octove = Math.floor(pitch / SCALE.length);

    if (!beepBuffers[octove]) {
        console.log('Octove (=' + octove + ') is not supported.');
        return;
    }

    playBuffer(beepBuffers[octove], SCALE[pitch % SCALE.length]);
};

var stopAll = function() {
    if (musicBufferSource) {
        musicBufferSource.noteOff(0);
        musicBufferSource = null;
    }
};
