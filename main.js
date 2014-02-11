$(function(){
  /*prompt for name*/
  window.vent = _.extend({}, Backbone.Events);
  $('#nameModal form').submit(function(e){
    e.preventDefault();
    $('#nameModal').modal('toggle');
    window.raysistanceApp.set({userName: $('#nameInput').val()});
    window.raysistanceApp.players = new Players();
  });

  window.raysistanceApp = new App();
  window.raysistanceAppView = new AppView({model: window.raysistanceApp });
  $('#nameModal').modal();
});