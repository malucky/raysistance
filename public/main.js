$(function(){
  window.vent = _.extend({}, Backbone.Events);
  window.raysistanceApp = new App();
  window.raysistanceAppView = new AppView({model: window.raysistanceApp });
});