var app = require('express')();
var http = require('http').Server(app);
//initialize a new instance of socket.io by passing the http (the HTTP server) object
var io = require('socket.io')(http);

//serve the static html page
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var connectedUsers = {};
var clientIdsCurrent;

//open a connection to sockets
io.on('connection', function(socket){

  // client.broadcast.emit('connected', name + " has connected");
  socket.on('join', function(name) {
    //save the new users name in the hash with the user value
    io.clients(function(error, clients){
      if (error) {
        console.log('error getting connected users');
      }
      var oldUsers = Object.keys(connectedUsers);
      //look through the clients and see which one not in the old users and add this and the name to connected users
      for (var i = 0; i < clients.length; i++) {
        if (oldUsers.indexOf(clients[i]) === -1) {//if the index is not in clients
          connectedUsers[clients[i]] = name;
        }
      }
    });
    socket.broadcast.emit('newUserJoin', name + " has connected");
   });

  //emit the message sent to the other users
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    socket.broadcast.emit('chat message', msg); //broadcast to all but who wrote it
  });

  //other user typing emit event
  socket.on('typingMessage', function (name) {
    socket.broadcast.emit('typingMessage', name + ' is currently typing.....');
  });

  //emit that the user has stopped typing
  socket.on('notTyping', function () {
    socket.broadcast.emit('notTyping');
  });

  socket.on('usersOnlineCheck', function (name) {
    // var sessionID;
    var toSendToClient = [];

    //take the name and find the id
    for (var key in connectedUsers) {
      if (connectedUsers[key] !== name) {
        // sessionID = key;
        toSendToClient.push(connectedUsers[key]);
      }
    }
    // io.clients[sessionID].send(connectedUsers);
    socket.emit('userOnline', toSendToClient);

  });

  socket.on('disconnect', function () {

    io.clients(function(error, clients){
      if (error) {
        console.log('error getting connected users');
      }
      var oldClients = Object.keys(connectedUsers);
      for (var i = 0; i < oldClients.length; i++) {
        if (clients.indexOf(oldClients[i]) === -1) {//if the index is not in clients
          delete connectedUsers[oldClients[i]];
        }
      }

    });


  });

});

http.listen(8080, function(){
  console.log('listening on port 8080');
});