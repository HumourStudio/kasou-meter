//
// @author  thedoritos
// @version 2014.05.23
//

var scores = {};

exports.register = function(name, score) {
  if (scores[name] != undefined) return;
  scores[name] = score;
  console.log(score[name]);
}

exports.unregister = function(name) {
  if (scores[name] == undefined) return;
  delete scores[name];
}

exports.score = function(name) {
  return (scores[name]) ? scores[name] : 0;
}

exports.total = function() {
  var total = 0;
  for (var key in scores) {
    total += scores[key];
  }
  return total;
}

exports.update = function(name, score) {
  if (scores[name] == undefined) return;
  scores[name] = score;
  console.log(score[name]);
}

exports.clear = function() {
  for (var key in scores) {
    scores[key] = 0;
  }
}

