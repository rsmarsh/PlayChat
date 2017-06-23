var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var utils = require('./utils');




var usernameList = {};
var totalUsers = 0;
var currentActiveUsers = 0;

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');

});

app.use(express.static('public'));


// app.listen(3000, function() {
// 	console.log("app online, port 3000");
// });

var port = process.env.PORT || 8080;
server.listen(port, function() {
	console.log("app online, port "+port);
});


io.on('connection', function (socket) {

	totalUsers+=1;
	currentActiveUsers+=1;
	console.log("new connection");
	socket.username = 'guest'+totalUsers;
	
	var userCountUpdate = {
		currentActiveUsers: currentActiveUsers,
		totalUsers: totalUsers
	};
	
	io.emit('totalUsersUpdate', userCountUpdate);

	socket.on('disconnect', function () {
		console.log("client disconnected");
		currentActiveUsers-=1;
		io.emit('totalUsersUpdate', currentActiveUsers);
	})
	
	socket.on('editUsername', function (newUsername) {

		usernameList[this.id] = newUsername;
		this.username = newUsername;

	});

	//registration attempt made
	socket.on('registration', function(newUser) {
		//new user registration attempt, check first if the username is already taken
		dbComms.registration(newUser);
	});

	//log in attempt made
	socket.on('login', function(logIn) {

	});




	//text message from clients
	socket.on('chatMessage', function (message) {
		
		io.emit('newMessage', message, this.username);

	});

});

