var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res, next) {
	res.sendFile(__dirname + '/public/index.html');
});

var balls = {};

server.listen(3000, function(){
	console.log('listening on *:3000');
});

io.on('connection', function(client) {
	console.log('client connected');
	balls[client.id] = {x:30, y:30};
	
	io.emit('allBalls', balls);
	console.log(balls);
	
	//if any client moves, store their new x,y and notify all clients
	client.on('moved',function(pos){
		balls[client.id] = {x: pos.x, y: pos.y};
		
		io.emit('ballUpdate', client.id, balls[client.id]);
	});
	
	
	
	//if any client disconnects remove them and notify all clients
	client.on('disconnect', function(){
		delete balls[client.id];
		io.emit('allBalls', balls);
	});
	
	
	
});
