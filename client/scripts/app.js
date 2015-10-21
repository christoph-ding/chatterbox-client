// YOUR CODE HERE:


var app = {};


$( document ).ready(function() {

  app.server = 'https://api.parse.com/1/classes/chatterbox';

  app.init = function(){
  }

  app.currentRoom = false;
  app.currentFriend = false;

  $('#send').on('click', function() {
    app.handleSubmit();
  });

  $('#refresh').on('click', function() {
      app.fetch();
  });

 $('#addRoom').on('click', function(){
  app.addRoom($('#newRoomName').val());
 });


$('#roomSelect').change(function(){
   
   if( $('#roomSelect option:selected').text() === " All Rooms ") {
    app.currentRoom = false;
   } else {
   app.currentRoom = $('#roomSelect option:selected').text();
   }
   $('#chats').empty();
   app.fetch();
});

$('#friendSelect').change(function(){
   
   if( $('#friendSelect option:selected').text() === " Everyone ") {
    app.currentFriend = false;
   } else {
   app.currentFriend = $('#friendSelect option:selected').text();
   }
   $('#chats').empty();
   app.fetch();
});


  app.friendlist = {};

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
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    contentType: 'application/json',
    success: function (data) {
      var rooms = {};
      var results = data.results
      for (var i=0; i< results.length; i++) {
        var currentMessage = app.convertForSafety(results[i]["text"]);
        var currentUser = app.convertForSafety(results[i]["username"]);
        var messageRoom = app.convertForSafety(results[i]["roomname"]);

        if (app.currentFriend === false) {
          if (app.currentRoom === false) {
            app.addMessage(results[i]);   
            if (! (messageRoom in rooms) ) {
              rooms[messageRoom] = true;
            }   
         } else {
            if (messageRoom === app.currentRoom) {
              app.addMessage(results[i]);             
            }         
          }          
        } else {
            if (currentUser === app.currentFriend) {
               if (app.currentRoom === false) {
                 app.addMessage(results[i]);   
                 if (! (messageRoom in rooms) ) {
                   rooms[messageRoom] = true;
                 }   
              } else {
                 if (messageRoom === app.currentRoom) {
                   app.addMessage(results[i]);             
                 }         
               }
            }
        }
      }

      for(var room in rooms){
          app.addRoom(room);
      }

      console.log(data);
      console.log('chatterbox: Message fetched');
    }
  ,
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to fetch message');
    },
  });
  }

  app.addMessage = function(message){
    // $("<div></div>").append("<h4>"+ app.convertForSafety(message.username) +"</h4>")
    // .append("<p>"+ app.convertForSafety(message.roomname) +"</p>")
    // .append('<p>' + app.convertForSafety(message.text) + '</p>')
    $("<div> <span> <button class='username'>" + app.convertForSafety(message.username) + "</button>:" + app.convertForSafety(message.text) + "</span></div>")
    .prependTo('#chats');

   $('.username').on('click', function() {
      app.addFriend($(this).text());
   })

    // $('.username').click(function(){
    //   app.addFriend();
    // });
  }

  app.clearMessages = function() {
    $('#chats').children().remove();
  };

  app.addRoom = function(roomName) {
    $('#roomSelect').append("<option>" + roomName + "</option>");
  };

  app.addFriend = function(friend){
    if (!(friend in app.friendlist)) {
      app.friendlist[friend] = true
      $('#friendSelect').append("<option>" + friend + "</option>");
    }
  };


  app.handleSubmit = function(){
    var newMessage = {};
    newMessage.username = window.location.search.slice(window.location.search.indexOf('=') + 1);
    newMessage.text = $('#newMessage').val();
    if (app.currentRoom === false) {
      newMessage.roomname = "";
    } else {
      newMessage.roomname = app.currentRoom;
    }
    $('#newMessage').val("");
    app.send(newMessage);
  };


  app.convertForSafety = function(messageText){
    return _.escape(messageText);
  }
});