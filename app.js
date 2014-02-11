/* Backbone models, views, and collections */

var App = Backbone.Model.extend({
  firebase: new Firebase("https://dazzling-fire-9595.firebaseio.com/raysistance/logic"),

  currRound: 0,

  playersCount: 8,

  curPlayer: null,

  initialize: function(){
    this.vent = _.extend({}, Backbone.Events);
    $('#nameModal').modal();
  }

});

var AppView = Backbone.View.extend({
});


var Player = Backbone.Model.extend({

  leader: false,

  resistance: false,

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

  defaults: {
    'playerCount': 8
  },

  initialize: function(){
    this.makePlayer();
    console.log('made player');
  },

  makePlayer: function(){
    var obj = { name: window.raysistanceApp.get('userName')};
    this.add(obj);
  }

});

var PlayersView = Backbone.View.extend({

});


var PlayerView = Backbone.View.extend({
});