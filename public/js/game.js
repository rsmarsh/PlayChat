//handles clientside game interaction
var chatList = document.getElementById('chatList');
var activeUsers = document.getElementById('activeUserCount');
var totalUsers = document.getElementById('totalUserCount');
var avatarUploadMenu = document.getElementById('uploadPopUp');
var gameArea = document.getElementById('gameArea');

var userInfo = {
	username: '',
	avatar: 'default.png'
};

function prepareHandlers() {
	var textInput = document.getElementById('chat-input-box');
	textInput.addEventListener("keypress", function(e) {
		//if the enter key was pressed
		if (e.keyCode == 13){
			sendMessage();
		}

	});

	var usernameInput = document.getElementById('username-input-box');
	usernameInput.addEventListener("keypress", function(e) {
		
		//if the enter key was pressed
		if (e.keyCode == 13){
			changeUsername();
		}

	});

	var openAvatarMenu = document.getElementById("openAvatarUploadMenu");
	var closeButton = document.getElementsByClassName("close")[0];
	var avatar = document.getElementById("mainProfileAvatar");
	var avatarUploadForm = document.getElementById('imageUploadForm');
	var userHistoryList = document.getElementById('userHistoryList');

	avatarUploadForm.onsubmit = function(e) {
		e.preventDefault();
		uploadNewAvatar();
	};

	//update all of the avatars on the page to be the user's avatar
	updateAvatar(userInfo.avatar);


	//When the user clicks on the button, open the avatar upload modal menu 
	openAvatarMenu.onclick = function() {
    	avatarUploadMenu.style.display = "block";
	}

	
	closeButton.onclick = function() {
		closeAvatarUploadMenu();
	}

	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) {
	    if (event.target == avatarUploadMenu) {
	    	closeAvatarUploadMenu();
	    }
	}



};

function updateTotalUserCount(newCount) {
	activeUsers.innerHTML = newCount.currentActiveUsers;
	totalUsers.innerHTML = newCount.totalUsers;
};

function updateUserHistory(userList) {
	var userListHTML = '';
	var onlineUsers = '';
	var offlineUsers = '';


	var userListHTML = '<h2>Users in the chat:</h2>';
	userListHTML += '<ul>';
	for (var user in userList) {

		var newLine = '<li class=\'usersListOnline'+userList[user].online+' tooltip\'>';

		newLine += '<img class="userlistImg" src="users/avatars/'+userList[user].avatar+'">';
		newLine += userList[user].username; 
		newLine += ' <span class="tooltiptext">Last seen online: '+userList[user].lastOnline+'</span>';

		newLine += '</li>';

		if (userList[user].online) {
			onlineUsers += newLine;
		} else {
			offlineUsers += newLine;
		}
	}
	userListHTML += onlineUsers;
	userListHTML += offlineUsers;
	userListHTML += '</ul>';
		
	userHistoryList.innerHTML = userListHTML;

};

function removeUserFromHistory(username) {
	var onlineUsersArr = document.getElementsByClassName('usersListOnline');
	for (var i = 0; i < onlineUsersArr.length; i++) {
		if (onlineUsersArr[i].innerHTML === username) {
			onlineUsersArr[i].classList.add('usersListOffline');
			onlineUsersArr[i].classList.remove('usersListOnline');
		}
	}
}



function sendMessage() {
	

	var textInput = document.getElementById('chat-input-box');
	var message = textInput.value;


	if (textInput.value !== ""){
		//clear the text box
		textInput.value = "";
		sendMessageToServer(message);
	}
	
};

function changeUsername() {
	var newUsername = document.getElementById('username-input-box');
	if (newUsername.value !== "") {
		sendUsernameToServer(newUsername.value);
		newUsername.value = "";

	}
};

function changeDisplayedUsername(newUsername) {
	userInfo.username = newUsername;
	var usernameDisplayed = document.getElementsByClassName('usernameDisplay');
	for (var i = 0; i < usernameDisplayed.length; i++) {
		usernameDisplayed[i].innerHTML = userInfo.username;
	}
};

//new message from server
function newMessageFromServer(message, usernameFrom, avatar) {

	//generate new chat element and add it to the chatbox
	var newChatMessage = createChatMessage(message, usernameFrom, avatar);
	chatList.appendChild(newChatMessage);

	//scroll down the chat to the new message
	chatList.scrollTop = chatList.scrollHeight;
};

function createChatMessage(message, usernameFrom, avatar) {

	var userAvatar = document.createElement("img");
	userAvatar.classList.add('messageImg');
	userAvatar.src = 'users/avatars/' + avatar;

	var newMessage = document.createElement("li");
	newMessage.classList.add("chatMessage");

	var messageContent = usernameFrom += ': ' + message;
	
	var textInsert = document.createElement("p");
	textInsert.classList.add("chatMessageSpan"); 
	textInsert.innerHTML = messageContent;


	newMessage.appendChild(userAvatar);
	newMessage.appendChild(textInsert);
	
	//add it to the chat
	return newMessage;
	

};

function closeAvatarUploadMenu() {
	avatarUploadMenu.style.display = "none";

	//reset the upload form and remove the selected file from the form
	document.getElementById('avatarFile').value = "";
};

function updateAvatar(newImage) {
	userInfo.avatar = newImage;
	var avatarImages = document.getElementsByClassName("profileImage");
	//loop over all nodes with the profileImage classname
	for (var i = 0; i < avatarImages.length; i++) {
		avatarImages[i].src= 'users/avatars/'+userInfo.avatar;

	}
};

function uploadNewAvatar() {

		var imageToUpload = document.getElementById('avatarFile');

		if (imageToUpload.files.length === 0) {
			alert("You must first select an image to be your new avatar.");
			return;
		}
		var imageFile = imageToUpload.files[0];

		var fileExtension = imageFile.name.split('.');
		fileExtension = fileExtension[fileExtension.length-1];

		var fileSize = imageFile.size;

		//check filesize is less than 5MB
		if ( (fileExtension === "png" || fileExtension === "jpg") && fileSize < 5000000){
			var uploadIds = fileUploader.upload(imageToUpload);
		} else {
			imageToUpload.value = "";
			alert("Invalid file selected. Avatars must be either .png or .jpg and less than 5MB.");
			return;
		}

		// if (imageToUpload is not null && imageFiletype === "png") {

		// } else if (imageUpload is null) {
		// 	alert("Select an image to upload");
		// 	//clear image selection;
		// } else if (imageType is ! png) {
		// 	alert("Avatar must be a png file");
		// }
};

function prepareGame(gameName) {
	initiateGameOnServer(gameName);
};

function launchGame(gameName) {
	console.log("launching "+gameName);
	gameArea.innerHTML = '<iframe id="gameiFrame" src="/apps/'+gameName+'/index.html">';

};