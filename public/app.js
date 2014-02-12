/* Backbone models, views, and collections */
//local storage

/************* models and collections ***************/

var App = Backbone.Model.extend({
  defaults: function() {
    return {
      playerName: "anonymous"
    }
  },

  initialize: function() {
    this.set('isLeader', false);
    this.set('playerName', '??');
    this.set('players', new Players());
    var that = this; 
  }


  //   this.startGame();

  //   this.teamMembers = [];

  //   this.voting = false;

  //   this.on('change : gameStart', this.startNewGame);
  // },

  // startGame: function() {
  //   var that = this;
  //   $('#startButton').click(function(e) {
  //     e.preventDefault();
  //     if (that.players.length === that.reqNumOfPlayers) {
  //       that.set( {'gameStart': true} );

  //     } else if (that.players.length < that.reqNumOfPlayers) {
  //       alert("waiting for more players");
  //     } else {
  //       alert("too many players!");
  //     }
  //   });
  // }
});

var Player = Backbone.Model.extend({

  initialize: function(){
    this.set('leader', false);
  },

  vote: function(){
    //prompt for approve or deny
  }
});

var Players = Backbone.Collection.extend({
  model: Player,

  initialize: function(){
    this.on('destroy', function() {
      console.log('listened to destroy in collection');
    });
  },

  makePlayer: function(playerName, isMe){
    this.add( {playerName: playerName, isMe: isMe} );
  }
});




// /****************** views ************************/


var PlayerView = Backbone.View.extend({
  className: 'span3 offset2 playerView',

  events: {
    // 'click': 'selected'
  },

  template: _.template( $('#playerTemplate').html() ),

  render: function(){
    this.$el.html( this.template(this.model.toJSON()) );
    return this;
  },

  initialize: function() {
    this.listenTo(this.model, 'destroy', this.remove);
    this.listenTo(this.model, 'change', this.modelChanged);
// this.listenTo(this.model, 'change : identity', this.showIdentity);
    // this.listenTo(this.model, 'change : selected', this.toggleSelected);
  }

  // modelChanged: function() {
  //   console.log("model changed");
  // }

  // showIdentity: function() {
  //   if ( window.playerName === this.model.get('name') ) { //if you are this player
  //     if ( this.model.get('identity') === 'resistance') {//resistance
  //       $('#resistanceModal').modal();
  //     } else {
  //       $('#spyModal').modal();
  //     }
  //   }
  // },

  // selected: function() {
  //   if (me.currLeader) {
  //     var index = me.team.indexOf(this.model);
  //     if (index === -1) {
  //       this.model.set('selected', 'true');
  //       me.team.push(this.model);
  //     } else {
  //       me.team.splice(index, 1);
  //     }
  //   }
  // },

  // toggleSelected: function() {
  //   if (this.model.selected === true) {
  //     this.$el.css({'border': "1px dotted red"});
  //   } else {
  //     this.$el.css({'border': "none"});
  //   }
  // }
});


var PlayersView = Backbone.View.extend({
  el: $('#playersView'),

  initialize: function(){
    this.listenTo(this.collection, 'add', this.addOne);
  },

  addOne: function(player) {
    console.log('adding one');
    var view = new PlayerView( {model: player} );
    this.$el.append(view.render().el);
  }
});


var AppView = Backbone.View.extend({
  el: $('body'),

  events: {
    // 'click #chooseTeamButton': "chooseTeam"
  },

  initialize: function(){
    var that = this;
    this.playersView = new PlayersView( {collection: this.model.get('players')} );
    window.socket.on('socketId', function(data){
      that.model.set('socketId', data.socketId);
    });
    window.socket.on('newPlayerJoined', function(data) {
      that.model.get('players').makePlayer(data.playerName, false);
    });
    // this.listenToOnce(this.model, 'change : gamestart', this.distributeIdentities);
    // this.listenTo(this.model, 'change : voting', this.promptVote);
    this.promptPlayerName();
  },

  promptPlayerName: function() {
    var that = this;
    $('#nameForm').submit(function(e){
      e.preventDefault();
      $('#nameModal').modal('toggle');
      that.model.set('playerName', $('#nameInput').val());
      window.socket.emit('newPlayer', {
        playerName: that.model.get('playerName')
      });
      that.model.get('players').makePlayer( that.model.get('playerName'), true );
    });
    $('#nameModal').modal();
  }


  // chooseTeam: function(e) {
  //   e.preventDefault();
  //   if (me.team.length !== 3) {
  //     alert('you need to choose 3 members for this mission');
  //     return;
  //   } else {
  //     this.model.set({
  //       'voting': true,
  //       'teamMembers': me.team
  //     });
  //     $('#chooseTeamButton').attr('disabled', 'disabled');
  //   }
  // },

  // promptVote: function() {
  //   $('approveButton').click(function(e){
  //     e.preventDefault();
  //   });
  //   $('disapproveButton').click(function(e){
  //     e.preventDefault();
  //     this.model.set('disapproveVotes', this.model.get('disapproveVotes').push(window.playerName));
  //   });
  //   $('#votingModal').modal();
  // },

  // distributeIdentities: function() {
  //   console.log('in AppView distributing identities');

  //   //run game logic only on the leader to avoid conflict
  //   if ( window.playerName === this.model.players.models[0].get('name') ) {
  //     alert('you are the leader!!');
  //     me.currLeader = true;
  //     $('#chooseTeamButton').removeAttr('disabled');
  //     var shuffled = _.shuffle([1,2,3,4,5,6,7,8]);
  //     for (var i = 0; i < this.model.players.length; i++) {
  //       var identity = shuffled.pop();
  //       if (identity < 4) {
  //         this.model.players.models[i].set({identity: 'spy'});
  //       } else {
  //         this.model.players.models[i].set({identity: 'resistance'});
  //       }
  //     }
  //     this.model.set({'round': 1});
  //   }
  // }


});
