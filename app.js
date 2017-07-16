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
// var publicUserList = [];
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
		usernameList[socket.id].avatar = fileInfo.name;
		socket.emit('newAvatarUploaded',socket.avatar);
		io.emit('userHistory', generatePublicUserList());
	});
	uploader.on('error', (err) => {
		console.log('Error!', err);
		socket.emit('userError', 'Sorry, avatar upload failed, please check that it meets the requirements');
	});
	uploader.on('abort', (fileInfo) => {
		console.log('Aborted: ', fileInfo);
	});
	
	// console.log(socket.handshake.headers.cookie);
	totalUsers+=1;
	currentActiveUsers+=1;
	console.log("new connection");
	socket.username = 'guest'+totalUsers

	if (typeof socket.avatar === 'undefined') {
		socket.avatar = "default.png";
	}

	usernameList[socket.id] = {
		username: socket.username,
		online: true,
		lastOnline: new Date().toGMTString(),
		avatar: socket.avatar

	};
	//publicUserList.push(socket.username);



	

	//send the username only to the newly connected user
	socket.emit('usernameToDisplay', socket.username);

	//inform all users of a new connection
	io.emit('totalUsersUpdate', {
		currentActiveUsers: currentActiveUsers,
		totalUsers: totalUsers
	});

	//update the user history list to allow population of the web list
	io.emit('userHistory', generatePublicUserList());

	socket.on('disconnect', function () {
		console.log(socket.username+" disconnected");
		usernameList[socket.id].online = false,
		usernameList[socket.id].lastOnline = new Date().toGMTString(),
		currentActiveUsers-=1;
		io.emit('userHistory', generatePublicUserList());
		
		io.emit('totalUsersUpdate', {
			currentActiveUsers: currentActiveUsers,
			totalUsers: totalUsers
		});
	});
	
	socket.on('editUsername', function (newUsername) {

		if (usernameIsUnique(newUsername)) {

			usernameList[socket.id].username = newUsername;
			//publicUserList[publicUserList.indexOf(socket.username)] = newUsername;
			socket.username = newUsername;

			socket.emit('usernameToDisplay', socket.username);
			io.emit('userHistory', generatePublicUserList());

		} else {
			socket.emit('userError', 'Sorry, \''+newUsername+'\' has already been taken.');
		}

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

var usernameIsUnique = function(username) {
	//iterate over the username list object, see if the new username matches anyone elses
	for (var user in usernameList) {
		if (usernameList[user].username === username) {
			return false;
		}
	}

	return true;

};



var generatePublicUserList = function() {
	//populate array with user objects, to not reveal the socket id to all users
	var publicUserList = [];

	for (var user in usernameList) {
		publicUserList.push({
			username: usernameList[user].username,
			online: usernameList[user].online,
			lastOnline: usernameList[user].lastOnline,
			avatar: usernameList[user].avatar
		});

	}
	return publicUserList;
};

