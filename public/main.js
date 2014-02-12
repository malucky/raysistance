$(function(){
  window.vent = _.extend({}, Backbone.Events);
  window.socket = io.connect('http://localhost:3700');
  window.raysistanceApp = new App();
  window.raysistanceAppView = new AppView({model: window.raysistanceApp });
});