var app = require('express')();
var http = require('http').Server(app);
//initialize a new instance of socket.io by passing the http (the HTTP server) object
var io = require('socket.io')(http);

//serve the static html page
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

//open a connection to sockets
io.on('connection', function(socket){

  // client.broadcast.emit('connected', name + " has connected");
  socket.on('join', function(name) {
    console.log('joined called', name);
     // socket.set('name', name);
     console.log(name + " has connected!");

     socket.broadcast.emit('kkk', name + " has connected");
   });

  // socket.broadcast.emit('hi');//will send the message to all the other clients except the newly created connection

  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    io.emit('chat message', msg);//will send to all the clients
  });

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

});

http.listen(8080, function(){
  console.log('listening on port 8080');
});