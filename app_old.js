/* Backbone models, views, and collections */

var App = Backbone.Model.extend({
  firebase: new Firebase("https://dazzling-fire-9595.firebaseio.com/raysistance/logic"),

  currRound: 0,

  curPlayer: null,

  initialize: function(){
    this.players = new Players({playersCount: 8});
  }
});

var AppView = Backbone.View.extend({
  initialize: function(){
    this.playersView = new PlayersView({collection: this.model.players});
  }
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

  initialize: function(params){
    // this.on('add', function(player){
    window.vent.listenTo(this, 'add', function(player){
      debugger;
      window.vent.trigger('newPlayer', player);
    });

    // });
    //this.playersCount = params.playersCount;

    this.makePlayer();
  },

  makePlayer: function(){
    if (this.length >= this.playersCount) {
      alert('Sorry, out of spots');
    } else {
      this.add( {name: $('#nameInput').val()} );
    }
  }
});

var PlayersView = Backbone.View.extend({
  el: $('#playersView'),

  events: {

  },

  initialize: function(){
    _.bindAll(this, 'addOne');
    window.vent.on('newPlayer', this.addOne);
  },

  render: function() {
  },

  addOne: function(player) {
    var view = new PlayerView({model: player});
    this.$el.append(view.render().el);
    if (this.collection.length === this.collection.playersCount) {
      //can start game
      //to avoid overlapping logic, the client player that is the leader will be running the logic
      if ($('#nameInput').val() === player.get('name')) {
        console.log("I'm the leader!");
      }
    }
  }
});


var PlayerView = Backbone.View.extend({
  className: 'span3 offset2',

  template: _.template($('#playerTemplate').html()),

  render: function(){
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  }
});



