"use strict";

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var SocketIOFile = require('socket.io-file');

//local libs
//var databaseComms = require('./private/dbComms');
var utils = require('./private/utils');
var socketIOAuth = require('./private/socketio-auth');




var usernameList = {};
var publicUserList = [];
var totalUsers = 0;
var currentActiveUsers = 0;

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');

});

// app.post('/image-upload', upload.single('formImage'), function(req, res) {
// 	console.log("received image upload");
// 	fs.readFile(req.file.path, function(err, data){ 
// 		console.log("reading file");
// 		var randomFileName = "avatar-" + Date.now().toString(); 
// 		var imagePath = __dirname + '/public/users/avatars/'+randomFileName+'.png';
// 		fs.writeFile(imagePath, data, function(err) {
// 			res.end('upload successful');
// 			console.log("writefile completed, callback event now?");
// 		});

// 	});
// })

app.use(express.static('public'));


// app.listen(3000, function() {
// 	console.log("app online, port 3000");
// });

var port = process.env.PORT || 8080;
server.listen(port, function() {
	console.log("app online, port "+port);
});


io.on('connection', function (socket) {

	var uploader = new SocketIOFile(socket,  {
		uploadDir: 'public/users/avatars',
		accepts: ['image/png', 'image/jpeg'],
		maxFileSize: 5000000,
		chunkSize: 10240,
		transmissionDelay: 0,
		overwrite: false
	});

	uploader.on('start', (fileInfo) => {
		console.log('Start uploading');
		console.log(fileInfo);
	});
	uploader.on('stream', (fileInfo) => {
		console.log(`${fileInfo.wrote} / ${fileInfo.size} byte(s)`);
	});
	uploader.on('complete', (fileInfo) => {
		console.log('Upload Complete.');
		console.log(fileInfo);
		socket.avatar = fileInfo.name;
		socket.emit('newAvatarUploaded',socket.avatar);
	});
	uploader.on('error', (err) => {
		console.log('Error!', err);
	});
	uploader.on('abort', (fileInfo) => {
		console.log('Aborted: ', fileInfo);
	});



	
	// console.log(socket.handshake.headers.cookie);
	totalUsers+=1;
	currentActiveUsers+=1;
	console.log("new connection");
	socket.username = 'guest'+totalUsers;
	usernameList[socket.id] = socket.username;
	publicUserList.push(socket.username);




	if (typeof socket.avatar === 'undefined') {
		socket.avatar = "default.png";
	}

	var userCountUpdate = {
		currentActiveUsers: currentActiveUsers,
		totalUsers: totalUsers
	};

	//send the username only to the newly connected user
	socket.emit('usernameToDisplay', socket.username);

	//inform all users of a new connection
	io.emit('totalUsersUpdate', userCountUpdate);

	//update the user history list to allowe population of the web list
	io.emit('userHistory', publicUserList);

	socket.on('disconnect', function () {
		console.log(socket.username+" disconnected");
		publicUserList.splice(publicUserList.indexOf(socket.username), 1);
		currentActiveUsers-=1;
		io.emit('totalUsersUpdate', currentActiveUsers);
		io.emit('userHistory', publicUserList);
	});
	
	socket.on('editUsername', function (newUsername) {

		usernameList[socket.id] = newUsername;
		publicUserList[publicUserList.indexOf(socket.username)] = newUsername;
		socket.username = newUsername;

		socket.emit('usernameToDisplay', socket.username);
		io.emit('userHistory', publicUserList);

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
		
		io.emit('newMessage', message, this.username, this.avatar);

	});

});

