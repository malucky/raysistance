$(function(){
  /*prompt for name*/
  $('#nameModal form').submit(function(e){
    e.preventDefault();
    $('#nameModal').modal('toggle');
    window.App.userName = $('#nameInput').val();
    window.App.players = new Players(window.App.playersCount);
  });

  window.AppView = new AppView({model: new App() });
});