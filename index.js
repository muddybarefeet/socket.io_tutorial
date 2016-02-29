var app = require('express')();
var http = require('http').Server(app);
//initialize a new instance of socket.io by passing the http (the HTTP server) object
var io = require('socket.io')(http);

//serve the static html page
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var clients = [];

//open a connection to sockets
io.on('connection', function(socket){

  // client.broadcast.emit('connected', name + " has connected");
  socket.on('join', function(name) {
    clients.push(name);//add the users name to the array of names
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

  socket.on('usersOnlineCheck', function () {
    console.log('button clicked to see other users online', io.sockets.clients());
  });

  socket.on('disconnect', function () {
    console.log('user disconnected');
    // clients.splice(clients.indexOf(name), 1); //remove the username to show that the user is not here anymore
  });

});

http.listen(8080, function(){
  console.log('listening on port 8080');
});