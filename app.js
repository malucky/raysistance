/* Backbone models, views, and collections */

var App = Backbone.Firebase.Model.extend({
  firebase: new Firebase("https://dazzling-fire-9595.firebaseio.com/raysistance/logic"),

  currRound: 0,

  playersCount: 8,

  curPlayer: null,

  initialize: function(){
    $('#nameModal').modal();
  }

});

var AppView = Backbone.View.extend({
});


var Player = Backbone.Firebase.Model.extend({
  leader: false,

  resistance: false,

  initialize: function(){
    console.log('making player');
  }
});

var Players = Backbone.Firebase.Collection.extend({
  model: Player,

  firebase: new Firebase("https://dazzling-fire-9595.firebaseio.com/raysistance/players"),

  defaults: {
    'playerCount': 8
  },

  initialize: function(){
    this.on('add', function(model){
      console.log("model:", model);
    });
    this.makePlayer();
  },

  makePlayer: function(){
    var obj = { name: window.App.userName};
    console.log('obj:', obj);
    this.add(obj);
  }

});

var PlayersView = Backbone.View.extend({

});




var PlayerView = Backbone.View.extend({
});