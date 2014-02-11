$(function(){
  /*prompt for name*/
  window.vent = _.extend({}, Backbone.Events);

  //initiate app after info entered
  $('#nameForm').submit(function(e){
    e.preventDefault();
    window.raysistanceApp = new App();
    window.raysistanceAppView = new AppView({model: window.raysistanceApp });
    $('#nameModal').modal('toggle');
    // window.raysistanceApp.set({userName: $('#nameInput').val()});
  });

  $('#nameModal').modal();
});