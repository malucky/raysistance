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
  requiredNumOfPlayers: 3,  //for testing ********
  currLeader: null,
  players: [],
  currTeam: {},
  teamMemberCount: 0,
  teamMemberByRound: [3,4,4,5,5],
  round: 0
};


var distributeIdentities = function() {
  var arr = [];
  for (var i = 0; i < game.requiredNumOfPlayers; i++) {
    arr.push(i);
  }
  var shuffled = _.shuffle(arr);
  for (var i = 0; i < game.players.length; i++) {
    if (shuffled.pop() < 4) {
      game.players[i][0].emit('identity', {'identity': 'spy'});
    } else {
      game.players[i][0].emit('identity', {'identity': 'spy'});
    }
  } 
};

var startGame = function() {
  distributeIdentities();
  game.currLeader = 0;
  game.players[game.currLeader][0].emit('leader', {});
};




/* socket events */
io.sockets.on('connection', function (socket) {
  //new player created
  socket.on('newPlayer', function (data) {
    _.each(game.players, function(player) {
      socket.emit('newPlayerJoined', {
        socketId: player[0].id,
        playerName: player[1].playerName
      });
    });
    game.players.push([socket, data]);
    socket.emit('socketId', {socketId: socket.id});
    socket.broadcast.emit('newPlayerJoined', {
        socketId: socket.id,
        playerName: data.playerName
    });
    if (game.players.length === game.requiredNumOfPlayers) {
      startGame();
    }
  });
  socket.on('select', function(data) {
    if (game.currTeam[data.socketId]) {
      delete game.currTeam[data.socketId];
      game.teamMemberCount--;
      io.sockets.emit('removeMember', {
        socketId: data.socketId
      });
    } else {
      game.currTeam[data.socketId] = true;
      game.teamMemberCount++;
      io.sockets.emit('nominateMember', {
        socketId: data.socketId
      });
    }
  });
  socket.on('submitTeam', function() {
    if (game.teamMemberCount === game.teamMemberByRound[game.round]) {
      io.sockets.emit('voteOnTeam', {});
    } else {
      socket.emit('invalidTeam', {'message': "Need to pick " + game.teamMemberByRound[game.round] + " team members!"});
    }
  });
  socket.on('approve', function(){
    console.log(socket.id, ' approved');
  });
  socket.on('disapprove', function(){
    console.log(socket.id, ' disapproved');
  });
});

console.log("Listening on port " + port);

