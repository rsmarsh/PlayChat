//handles clientside comms between client and server
var socket = io();

function sendMessageToServer(message) {
	socket.emit('chatMessage', message);
};

function sendUsernameToServer(username) {
	socket.emit('editUsername', username);
};

//split into an object
socket.on('newMessage', function(message, usernameFrom) {
	newMessageFromServer(message, usernameFrom);
});

socket.on('totalUsersUpdate', function(userCount) {
	updateTotalUserCount(userCount);
});

