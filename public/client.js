//
// client.js
//
// @author  thedoritos
// @version 2014.05.24
//

// Socket.io
var socket = io.connect(window.location.hostname);
var clientId = null;

socket.on("connect", function() {
  clientId = socket.socket.transport.sessid;
  vote(getName(), getScore());
});

socket.on("vote", function(data) {
  
});

socket.on("reset", function() {
  setScore(0);
});

// client actions
var vote = function(name, score) {
  socket.emit("vote", { name:getName(), score:getScore() });
}

// client view helpers
var getInputs = function() {
  return document.getElementsByName("light");
}

var getScore = function() {
  var inputs = getInputs();
  var score  = 0;
  for (var i = 0; i < inputs.length; i++) {
    score += (inputs[i].checked) ? 1 : 0;
  }
  return score;
}

var setScore = function(score) {
  var inputs = getInputs();
  for (var i = 0; i < inputs.length; i++) {
    inputs[i].checked = i < score;
  }
}

var getName = function() {
  return clientId;
}

