/* Backbone models, views, and collections */

var me = {
  currLeader: false,
  team: []
};
/************* models and collections ***************/

var App = Backbone.Firebase.Model.extend({

  firebase: new Firebase("https://dazzling-fire-9595.firebaseio.com/raysistance/logic"),

  reqNumOfPlayers: 8,

  initialize: function(){

    this.currLeader = 0;

    this.players = new Players();

    this.promptPlayerName();    //prompts for player name

    this.startGame();

    this.teamMembers = [];

    this.on('change : gameStart', this.startNewGame);
  },

  promptPlayerName: function() {
    var that = this;
    $('#nameForm').submit(function(e){
      e.preventDefault();
      $('#nameModal').modal('toggle');
      window.playerName = $('#nameInput').val();

      that.players.makePlayer( window.playerName );
    });

    $('#nameModal').modal();
  },

  startGame: function() {
    var that = this;
    $('#startButton').click(function(e) {
      e.preventDefault();
      if (that.players.length === that.reqNumOfPlayers) {
        that.set( {'gameStart': true} );

      } else if (that.players.length < that.reqNumOfPlayers) {
        alert("waiting for more players");
      } else {
        alert("too many players!");
      }
    });
  }
});

var Player = Backbone.Model.extend({

  initialize: function(){
    this.leader = false;
  },

  vote: function(){
    //prompt for approve or deny
  }
});

var Players = Backbone.Firebase.Collection.extend({

  model: Player,

  firebase: new Firebase("https://dazzling-fire-9595.firebaseio.com/raysistance/players"),

  initialize: function(){
    this.on('destroy', function() {
      console.log('listened to destroy in collection');
    });
  },

  makePlayer: function(playerName){
    this.add( {name: playerName} );
  }
});




/****************** views ************************/

var AppView = Backbone.View.extend({
  el: $('body'),

  events: {
    'click #chooseTeamButton': "chooseTeam"
  },

  initialize: function(){
    this.playersView = new PlayersView( {collection: this.model.players} );

    this.listenToOnce(this.model, 'change : gamestart', this.distributeIdentities);
  },

  chooseTeam: function(e) {
    e.preventDefault();
    console.log('enable team choose');
    $('#chooseTeamButton').attr('disabled', 'disabled');
  },

  distributeIdentities: function() {
    console.log('in AppView distributing identities');

    //run game logic only on the leader to avoid conflict
    if ( window.playerName === this.model.players.models[0].get('name') ) {
      alert('you are the leader!!');
      me.currLeader = true;
      $('#chooseTeamButton').removeAttr('disabled');
      var shuffled = _.shuffle([1,2,3,4,5,6,7,8]);
      for (var i = 0; i < this.model.players.length; i++) {
        var identity = shuffled.pop();
        if (identity < 4) {
          this.model.players.models[i].set({identity: 'spy'});
        } else {
          this.model.players.models[i].set({identity: 'resistance'});
        }
      }
      this.model.set({'round': 1});
    }
  }


});


var PlayersView = Backbone.View.extend({

  el: $('#playersView'),

  initialize: function(){
    // _.bindAll(this, 'addOne');
    // window.vent.on('newModelAdded', this.addOne);
    this.listenTo(this.collection, 'add', this.addOne);
  },

  addOne: function(player) {
    var view = new PlayerView( {model: player} );
    this.$el.append(view.render().el);
  }

});


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
    this.listenTo(this.model, 'change', this.modelChanged);
    this.listenTo(this.model, 'change : identity', this.showIdentity);
  },

  modelChanged: function() {
    console.log("model changed");
  },

  showIdentity: function() {
    if ( window.playerName === this.model.get('name') ) { //if you are this player
      if ( this.model.get('identity') === 'resistance') {//resistance
        $('#resistanceModal').modal();
      } else {
        $('#spyModal').modal();
      }
    }
  },

  selected: function() {
    if (me.currLeader) {
      var index = me.team.indexOf(this.model);
      if (index === -1) {
        me.team.push(this.model);
        this.$el.css({'border': "1px dotted red"});
      } else {
        me.team.splice(index, 1);
        this.$el.css({'border': "none"});
      }
    }
  }

});



