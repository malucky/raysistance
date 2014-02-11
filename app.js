/* Backbone models, views, and collections */

var App = Backbone.Model.extend({
  firebase: new Firebase("https://dazzling-fire-9595.firebaseio.com/raysistance/logic"),

  currRound: 0,

  playersCount: 8,

  curPlayer: null,

  initialize: function(){
  }

});

var AppView = Backbone.View.extend({
  initialize: function(){
    this.playersView = new PlayersView();
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

  defaults: {
    'playerCount': 8
  },

  initialize: function(){
    this.on('add', function(player){
      window.vent.trigger('newPlayer', player);
    });
    this.makePlayer();
  },

  makePlayer: function(){
    var obj = { name: window.raysistanceApp.get('userName')};
    this.add(obj);
  }

});

var PlayersView = Backbone.View.extend({
  el: $('#playersView'),

  events: {

  },

  initialize: function(){
    window.vent.on('newPlayer', this.addOne);
  },

  render: function() {
    // for (var i = 0; i < window.raysistanceApp.playersCount; i++) {
    // }
  },

  addOne: function() {
    console.log('adding one');
    // var view = new TodoView({model: todo});
    // this.$("#todo-list").append(view.render().el);
  }

  // addAll: function() {
  //   this.$("#todo-list").html("");
  //   Todos.each(this.addOne, this);
  // }
});

// var AppView = Backbone.View.extend({

//     events: {
//       "keypress #new-todo":  "createOnEnter",
//       "click #clear-completed": "clearCompleted",
//       "click #toggle-all": "toggleAllComplete"
//     },

//     initialize: function() {
//       this.input = this.$("#new-todo");
//       this.allCheckbox = this.$("#toggle-all")[0];

//       this.listenTo(Todos, 'add', this.addOne);
//       this.listenTo(Todos, 'reset', this.addAll)
//       this.listenTo(Todos, 'all', this.render);

//       this.footer = this.$('footer');
//       this.main = $('#main');
//     },

    // render: function() {
    //   var done = Todos.done().length;
    //   var remaining = Todos.remaining().length;

    //   if (Todos.length) {
    //     this.main.show();
    //     this.footer.show();
    //     this.footer.html(this.statsTemplate({done: done, remaining: remaining}));
    //   } else {
    //     this.main.hide();
    //     this.footer.hide();
    //   }

    //   this.allCheckbox.checked = !remaining;
    // },

    // addOne: function(todo) {
    //   var view = new TodoView({model: todo});
    //   this.$("#todo-list").append(view.render().el);
    // },

    // addAll: function() {
    //   this.$("#todo-list").html("");
    //   Todos.each(this.addOne, this);
    // },


var PlayerView = Backbone.View.extend({
});