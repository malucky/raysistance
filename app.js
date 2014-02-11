/* Backbone models, views, and collections */

/************* models and collections ***************/

var App = Backbone.Firebase.Model.extend({

  firebase: new Firebase("https://dazzling-fire-9595.firebaseio.com/raysistance/logic"),

  reqNumOfPlayers: 8, 

  initialize: function(){

    this.players = new Players();

    // this.gameStart = false;

    this.promptPlayerName();    //prompts for player name

    this.startGame();

    this.on('change', this.startNewGame);
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
        // $('#startModal').modal();
        // //run game logic only on the leader to avoid conflict
        // if (window.playerName === that.players.models[0].get('name')) {
        //   alert('your are the leader!!');
        //   that.distributeIdentities();
        // }
        that.set( {'gameStart': true} );
      } else if (that.players.length < that.reqNumOfPlayers) {
        alert("waiting for more players");
      } else {
        alert("too many players!");
      }
    });
  },

  startNewGame: function() {
      console.log('new game starting');
  },

  distributeIdentities: function() {
    var shuffled = _.shuffle([1,2,3,4,5,6,7,8]);
    for (var i = 0; i < this.players.length; i++) {
      var identity = shuffled.pop();
      if (identity < 4) {
        this.players.models[i].set({identity: 'spy'});
      } else {
        this.players.models[i].set({identity: 'resistance'});
      }
    }
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

  initialize: function(){

    this.playersView = new PlayersView( {collection: this.model.players} );
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

    // if (this.collection.length === this.collection.playersCount) {
    //   //can start game
    //   //to avoid overlapping logic, the client player that is the leader will be running the logic
    //   if ($('#nameInput').val() === player.get('name')) {
    //     console.log("I'm the leader!");
    //   }
    // }
  }

});


var PlayerView = Backbone.View.extend({

  className: 'span3 offset2',

  template: _.template( $('#playerTemplate').html() ),

  render: function(){
    this.$el.html( this.template(this.model.toJSON()) );
    return this;
  },

  initialize: function() {
    this.listenTo(this.model, 'destroy', this.remove);
  }

});



