var express = require("express");
var app = express();
var port = 3700;
var _ = require('underscore');
 
app.set('views', __dirname + '/tpl');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);
app.use(express.bodyParser())
app.use(express.logger('dev'))
app.use(express.static(__dirname + '/public'));

app.get("/", function(req, res){
  res.render("index");
});

var io = require('socket.io').listen(app.listen(port));

/* game logistics */
var game = {
  requiredNumOfPlayers: 8, 
  currLeader: null,
  players: [],
  currTeam: [],
  round: 0
};





/* socket events */
io.sockets.on('connection', function (socket) {
  //new player created
  socket.on('newPlayer', function (data) {
    _.each(game.players, function(player) {
      socket.emit('newPlayerJoined', player);
    });
    game.players.push(data);
    socket.broadcast.emit('newPlayerJoined', data);
    console.log(game.players);
  });



  socket.emit('message', { message: 'welcome to the chat' });
  socket.on('send', function (data) {
    io.sockets.emit('message', data);
    socket.broadcast.emit('message', {message: 'hello there'});
  });
  socket.on('appEvent', function(data) {
    io.sockets.emit('returnMessage', {'message': 'Hi from the server'});
    console.log(data);
  });
});

console.log("Listening on port " + port);

