//sits clientside between the DOM and the server and handles communication
var socket = io();
var fileUploader = new SocketIOFileClient(socket);

function sendMessageToServer(message) {
	socket.emit('chatMessage', message);
};

function sendUsernameToServer(username) {
	socket.emit('editUsername', username);
};

//split into an object
socket.on('newMessage', function(message, usernameFrom, avatar) {
	newMessageFromServer(message, usernameFrom, avatar);
});

socket.on('totalUsersUpdate', function(userCount) {
	updateTotalUserCount(userCount);
});

socket.on('userDisconnected', function(username) {
	removeUserFromHistory(username);
})

socket.on('userHistory', function(usernameList) {
	updateUserHistory(usernameList);
});

socket.on('usernameToDisplay', function(usernameToDisplay) {
	changeDisplayedUsername(usernameToDisplay);
});

socket.on('newAvatarUploaded', function(newAvatar) {
	updateAvatar(newAvatar);
});

socket.on('userError', function(errorMsg) {
	alert(errorMsg);
});

fileUploader.on('ready', function() {
		// console.log('SocketIOFile ready to go!');
});

fileUploader.on('start', function(fileInfo) {
	console.log('Start uploading', fileInfo);
});

fileUploader.on('stream', function(fileInfo) {
	console.log('Streaming... sent ' + fileInfo.sent + ' bytes.');
});

fileUploader.on('complete', function(fileInfo) {
	console.log('Upload Complete', fileInfo);
	closeAvatarUploadMenu();
});

fileUploader.on('error', function(err) {
	console.log('Error!', err);
});

fileUploader.on('abort', function(fileInfo) {
	console.log('Aborted: ', fileInfo);
});

