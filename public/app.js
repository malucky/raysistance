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
    this.set('isLeader', false);
  },

  vote: function(){
    //prompt for approve or deny
  }
});

var Players = Backbone.Collection.extend({
  model: Player,

  initialize: function(){
    this.on('destroy', function() {
    });
  },

  makePlayer: function(socketId, playerName, isMe){
    var player = this.add({
      socketId: socketId,
      playerName: playerName, 
      isMe: isMe
    });
    if (isMe) {
      window.raysistanceApp.set('me', player);
    }
  }
});




// /****************** views ************************/


var PlayerView = Backbone.View.extend({
  className: 'span3 offset2 playerView',

  events: {
    'click': 'selected'
  },

  template: _.template( $('#playerTemplate').html() ),

  render: function(){
    this.$el.html( this.template(this.model.toJSON()) );
    return this;
  },

  initialize: function() {
    this.listenTo(this.model, 'destroy', this.remove);
    this.listenTo(this.model, 'change : isLeader', this.modelChanged);
    this.listenTo(this.model, 'teamMemberAdded', this.teamMemberAdded);
    this.listenTo(this.model, 'teamMemberRemoved', this.teamMemberRemoved);
// this.listenTo(this.model, 'change : identity', this.showIdentity);
    // this.listenTo(this.model, 'change : selected', this.toggleSelected);
  },

  modelChanged: function() {
  },

  selected: function() {
    var that = this;
    if (window.raysistanceApp.get('isLeader')) {
      window.socket.emit('select', {
        socketId: that.model.get('socketId')
      });
    }
  },

  teamMemberAdded: function() {
    this.$el.addClass('teamMember');
  },

  teamMemberRemoved: function() {
    this.$el.removeClass('teamMember');
  }

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
    var view = new PlayerView( {model: player} );
    this.$el.append(view.render().el);
  }
});


var AppView = Backbone.View.extend({
  el: $('body'),

  events: {
    // 'click #chooseTeamButton': "chooseTeam"
    'click .approveButton': 'approveTeam',
    'click .disapproveButton': 'disapproveTeam'
  },

  initialize: function(){
    this.$el.find('#chooseTeamButton').on('click', function() {
      window.socket.emit('submitTeam', {});
    });
    var that = this;
    this.playersView = new PlayersView( {collection: this.model.get('players')} );
    window.socket.on('socketId', function(data){
      that.model.set('socketId', data.socketId);
      that.model.get('me').set('socketId', data.socketId);
    });
    window.socket.on('newPlayerJoined', function(data) {
      that.model.get('players').makePlayer(data.socketId, data.playerName, false);
    });
    window.socket.on('identity', function(data) {
      that.model.set('identity', data.identity);
      that.displayIdentity();
    });
    window.socket.on('leader', function(data) {
      that.model.set('isLeader', true);
      that.model.get('me').set('isLeader', true); //the player model (not app)
      $('#chooseTeamButton').removeAttr('disabled');
    });
    window.socket.on('nominateMember', function(data) {
      var models = that.model.get('players').models;
      for (var i = 0; i < models.length; i++) {
        if (models[i].get('socketId') === data.socketId) {
          models[i].trigger('teamMemberAdded');
          break;
        }
      }
    });
    window.socket.on('removeMember', function(data) {
      var models = that.model.get('players').models;
      for (var i = 0; i < models.length; i++) {
        if (models[i].get('socketId') === data.socketId) {
          models[i].trigger('teamMemberRemoved');
          break;
        }
      }
    });
    window.socket.on('invalidTeam', function(data){
      alert(data.message);
    });
    window.socket.on('voteOnTeam', function(){
      if (that.model.get('isLeader')) {
        $('#chooseTeamButton').attr('disabled', 'disabled');
      }
      $('#voteModal').modal();
    });
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
      that.model.get('players').makePlayer(that.model.get('socketId'), that.model.get('playerName'), true );
    });
    $('#nameModal').modal();
  },

  displayIdentity: function() {
    if ( this.model.get('identity') === 'resistance') {//resistance
      $('#resistanceModal').modal();
    } else {
      $('#spyModal').modal();
    }
  },

  approveTeam: function() {
    console.log('approved team');
    window.socket.emit('approve', {});
  },

  disapproveTeam: function() {
    console.log('disapproved team');
    window.socket.emit('disapprove', {});
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
