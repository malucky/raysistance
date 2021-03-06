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
  clients: {},
  requiredNumOfPlayers: 3,  //for testing ********
  currLeader: null,
  players: [],
  currTeam: {},
  teamMemberCount: 0,
  teamMemberByRound: [3,4,4,5,5],
  numVotesToLose: [1,1,1,2,1],
  round: 0, 
  votes: [], 
  score: [],
  missionVote: [[],[],[],[],[]]
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

var tallyVotes = function() {
  var thisEvent = 'rejected';
  var voteResult = _.reduce(_.pluck(game.votes, 'vote'), function(memo, num){ return memo + num; }, 0);
  if (voteResult > (game.requiredNumOfPlayers / 2)) {
    thisEvent = 'approved';
    //TODO
      //set timeout for 10 seconds
      //send mission modal to the teamates
    setTimeout(function() {
      _.each(game.currTeam, function(isOnTeam, socketId) {
        game.clients[socketId].emit('mission');
      });
    }, 1000);
  } else { //failed
    //TODO clear team members
    //set leader to next person
    //clear current leader
  }
  io.sockets.emit(thisEvent, { 
    votes: game.votes

  });
};



/* socket events */
io.sockets.on('connection', function (socket) {
  //new player created
  game.clients[socket.id] = socket;
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
    game.votes.push({socketId: socket.id, vote: 1});
    if (game.votes.length === game.requiredNumOfPlayers) {
      tallyVotes();
    }
  });
  socket.on('disapprove', function(){
    game.votes.push({socketId: socket.id, vote: 0});
    if (game.votes.length === game.requiredNumOfPlayers) {
      tallyVotes();
    }
  });
  socket.on('missionCompleted', function(data) {
    if (game.currTeam[socket.id]) { //if this is a team member
      if (data.result === 'success') {
        game.missionVote[game.round].push(0);
        console.log('success');
      } else {
        game.missionVote[game.round].push(1);
        console.log('fail');
      }
      if (game.missionVote[game.round].length === game.teamMemberByRound[game.round]) {
        var score = _.reduce(game.missionVote[game.round], function(memo, num){ return memo + num; }, 0);
        console.log(score);
        if (score >= game.numVotesToLose[game.round]) {
          game.score.push('fail');
        } else {
          game.score.push('success');
        }
        io.sockets.emit('missionResult', {
          result: score,
          numVotesToLose: game.numVotesToLose[game.round]
        });
      }
    }
  });
});

console.log("Listening on port " + port);

