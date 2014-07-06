//
// meter.js
//
// @author  thedoritos
// @version 2014.05.24
//

// Conf
var conf = null;

var getConf = function(callback) {
  if (conf) {
    callback(conf);
  }
  $.getJSON('./conf.json', callback)
  .fail(function(){
    alert('Failed to load app configuration.');
  });
};

// Init window
window.onload = function() {
  getConf(function(conf) {
    // Add meter boxes
    for (var i = 0; i < conf.score.perfect; i++) {

      var meterScore = i + 1;
      var meterStyle = "";

      if (meterScore >= conf.score.great) {
        meterStyle = "high-score";
      } else if (meterScore >= conf.score.good) {
        meterStyle = "mid-score";
      } else {
        meterStyle = "low-score";
      }

      $("#meter").prepend(
        '<div class="meter-box">' + 
          '<div class="meter-box-fill ' + meterStyle + ' off-score">' + meterScore + '</div>' +
        '</div>'
      );
    }
  });
}

// Socket.io
var socket = io.connect(window.location.hostname);

socket.on("hello", function(data) {
  setScore(data.total);
  getLgtm();

  // audio-player.js
  init(function(errorMessage) {
    window.alert("Error:\n" + errorMessage);
  });
});

socket.on("vote", function(data) {
  setScore(data.total);
});

var reset = function() {
  socket.emit("reset");
  setScore(0);
  getLgtm();
}

var greatResultImageUrl = "http://i.imgur.com/TPEcIHt.gif";
var goodResultImageUrl = "";

var getLgtm = function() {
  getConf(function(conf) {
    getGoogleImages(conf['image-terms'], function(imageUrl) {
      greatResultImageUrl = imageUrl;
    });
  });
}

var getGoogleImages = function(keywords, success) {
  var url     = "http://ajax.googleapis.com/ajax/services/search/images?";
  var version = "v=1.0";
  var start   = "start=" + Math.floor(Math.random() * 20);
  var query   = "q="     + keywords.join("+");

  $.ajax({
    url: url + version + "&" + start + "&" + query,
    dataType: 'jsonp',
    type: 'GET',
    success: function(res) {
      var results = res.responseData.results;
      var index   = Math.floor(Math.random() * results.length);
      var imageUrl = res.responseData.results[index].unescapedUrl;
      success(imageUrl);
    }
  });
}

var lastScore = -1;

var setScore = function(score) {
  getConf(function(conf) {
    if (score < 0 || score > conf.score.perfect) {
      console.log("score(" + score + ") is out of range([0," + conf.score.perfect + "])");
      return;
    }
    if (score == lastScore) {
      console.log("score(" + score + ") and the last score(" + lastScore + ") is the same");
      return;
    }

    var numBoxes = $(".meter-box").length;
    $(".meter-box-fill").removeClass("off-score");
    $(".meter-box-fill:lt(" + (numBoxes - score) + ")").addClass("off-score");

    if (score >= conf.score.great) {
      if (!(lastScore >= conf.score.great)) {
        showResult(greatResultImageUrl);
        showMessage("LGTM", "Looks Good To Me");
        playSuccess();
      }
    } else {
      hideResult();
      hideMessage();
      stopAll(); // audio
    }

    if (score > 0) {
      playMeter(score);
    }
    lastScore = score;
  });
}

var showResult = function(imageUrl) {
  $("#result-image").attr("src", imageUrl);
  $("#result-image").show();
}

var hideResult = function() {
  $("#result-image").hide();
}

var showMessage = function(title, subtitle) {
  $(".title").html(title);
  $(".subtitle").html(subtitle);
  $(".center-pop").show();
}

var hideMessage = function() {
  $(".center-pop").hide();
}

