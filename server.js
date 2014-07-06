//
// index.js
//
// @author  thedoritos
// @version 2014.05.23
//

// Score keeper
var scoreKeeper = require("./public/score-keeper.js");

// Socket.io
var express = require("express")
  , app     = express()
  , server  = require("http").createServer(app)
  , io      = require("socket.io").listen(server)
  , port    = Number(process.env.PORT || 5000);

server.listen(port);

app.use(express.static(__dirname + "/public"));

app.get("/", function(req, res) {
  res.sendfile(__dirname + "/public/client.html");
});

app.get("/meter", function(req, res) {
  res.sendfile(__dirname + "/public/meter.html");
});

io.sockets.on("connection", function(socket) {

  socket.on("vote", function(data) {
    scoreKeeper.update(data.name, data.score);
    socket.broadcast.emit("vote", { name:data.name, score:scoreKeeper.score(data.name), total:scoreKeeper.total() });
    console.log("score updated: " + scoreKeeper.total());
  });

  socket.on("disconnect", function() {
    scoreKeeper.unregister(socket.id);
    socket.broadcast.emit("vote", { name:socket.id, score:0, total:scoreKeeper.total() });
    console.log("user disconnected: " + socket.id);
  });

  socket.on("reset", function() {
    scoreKeeper.clear();
    socket.broadcast.emit("reset");
  });

  scoreKeeper.register(socket.id, 0);
  console.log("user connected: " + socket.id);
  socket.emit("hello", { total:scoreKeeper.total() }); 

}); 

