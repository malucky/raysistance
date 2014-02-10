/* Backbone models, views, and collections */

var App = Backbone.Model.extend({
  
});

var AppView = Backbone.View.extend({
  
});



var Players = Backbone.Firebase.Collection.extend({
  model: Player,

  firebase: new Firebase("https://dazzling-fire-9595.firebaseio.com/raysistance/players")

});

var PlayersView = Backbone.View.extend({

});



var Player = Backbone.Model.extend({
  
});

var PlayerView = Backbone.View.extend({
  
});


window.AppView = new AppView({model: new App() });
