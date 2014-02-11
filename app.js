/* Backbone models, views, and collections */

/************* models and collections ***************/

var App = Backbone.Model.extend({

  firebase: new Firebase("https://dazzling-fire-9595.firebaseio.com/raysistance/logic"),

  initialize: function(){

    this.players = new Players();

    this.promptPlayerName();    //prompts for player name
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
    // window.vent.listenTo(this, 'add', function(player) {
    console.log('a player added to players');
      // window.vent.trigger('newModelAdded', player);
    // });
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
  }

});



