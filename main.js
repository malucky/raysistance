$(function(){
  window.App = {};

  /*prompt for name*/
  $('form').submit(function(e){
    e.preventDefault();
    $('#myModal').modal('toggle');
    window.userName = $('#nameInput').val();
  });
  $('#myModal').modal();
  
  // window.App.name = prompt("what's your name??");
});