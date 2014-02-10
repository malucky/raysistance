
//copied with minor changes from firebase example
$(function(){

  var chatFB = new Firebase('https://dazzling-fire-9595.firebaseio.com/raysistance/chat');

  $('#messageInput').keypress(function (e) {
    if (e.keyCode == 13) {
      var text = $('#messageInput').val();
      chatFB.push({name: window.App.name, text: text});
      $('#messageInput').val('');
    }
  });
  chatFB.on('child_added', function(snapshot) {
    var message = snapshot.val();
    displayChatMessage(message.name, message.text);
  });
  var displayChatMessage = function(name, text) {
    var div = $('<div/>');
    div.append(($('<div/>').text(text).prepend($('<em/>').text(name+': '))).prepend($('<i class="icon-user">')));
    div.appendTo($('#messagesDiv'));
    $('#messagesDiv')[0].scrollTop = $('#messagesDiv')[0].scrollHeight;
  };

});