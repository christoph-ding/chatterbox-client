// YOUR CODE HERE:


var app = {};

$( document ).ready(function() {

  app.server = 'https://api.parse.com/1/classes/chatterbox';
  app.init = function(){
    $('#send .submit').on('submit', function() {
        app.handleSubmit();
    });
  }

  $('#refresh').on('click', function() {
      app.fetch();
  })

  app.send = function(message){
    $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
  }

  app.fetch = function(){
    $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: app.server,
    type: 'GET',
    contentType: 'application/json',
    success: function (data) {
      for (var i=0; i<data.results.length; i++) {
        app.addMessage(app.convertForSafety(data.results[i]["text"]));
      }
      console.log(data);
      console.log('chatterbox: Message fetched');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to fetch message');
    },
  });
  }

  app.addMessage = function(message){
    // $('#chats').after($("<li>" + message +"</li>")).addClass('username');
    $("<li>" + message +"</li>").prependTo('#chats').addClass('username');

    $('.username').click(function(){
      app.addFriend();
    });

  }

  app.clearMessages = function() {
    $('#chats').children().remove();
  };

  app.addRoom = function(roomName) {
    $('#roomSelect').append("<li>" + roomName + "</li>");
  };

  app.addFriend = function(){
  };


  app.handleSubmit = function(){

    console.log('hi');
  };


  app.convertForSafety = function(messageText){
    return _.escape(messageText);
  }
});







