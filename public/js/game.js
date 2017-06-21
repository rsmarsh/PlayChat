//handles clientside game interaction
var chatList = document.getElementById('chatList');
var activeUsers = document.getElementById('activeUserCount');


function prepareHandlers() {
	var textInput = document.getElementById('input-box');
	textInput.addEventListener("keypress", function(e) {
		//if the enter key was pressed
		if (e.keyCode == 13){
			sendMessage();
		}

	});

	var usernameInput = document.getElementById('username-box');
	usernameInput.addEventListener("keypress", function(e) {
		
		//if the enter key was pressed
		if (e.keyCode == 13){
			changeUsername();
		}

	});

};

function updateTotalUserCount(newCount) {
	activeUsers.innerHTML = newCount;
};



function sendMessage() {
	

	var textInput = document.getElementById('input-box');
	var message = textInput.value;


	if (textInput.value !== ""){
		//clear the text box
		textInput.value = "";
		sendMessageToServer(message);
	}
	
};

function changeUsername() {
	var newUsername = document.getElementById('username-box');
	if (newUsername.value !== "") {
		sendUsernameToServer(newUsername.value);
		newUsername.value = "";

	}
};

//new message from server
function newMessageFromServer(message, usernameFrom) {

	var newMessage = document.createElement("li");
	newMessage.classList.add("chatMessage");

	var messageContent = usernameFrom += ': ' + message;
	
	var textInsert = document.createTextNode(messageContent);

	//add it to the new li element
	newMessage.appendChild(textInsert);
		
	//add it to the chat
	chatList.appendChild(newMessage);

	chatList.scrollTop = chatList.scrollHeight;
};