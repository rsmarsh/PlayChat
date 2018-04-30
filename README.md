Work-in-progress project of a chat room, which allows users to launch and invite others to browser-based games.  
This is a single page application running on a NodeJS Express server, using web sockets for all communication between users.  

See a live demo [here]: http://chatterplay.herokuapp.com, hosted on Heroku (app may take a moment to boot)

Current features include:  
* Profile creation
* Avatar uploads
* Modification of usernames on the fly
* Online members list
* Live text chat room
 

## Operation
First run an 'npm install' to create the node_modules folder locally with all required dependencies. 
Then run the server using 'node app.js', then connect to the given IP via different clients on the local network to see a demonstration.  
Games are not currently included with this repo, however they can be placed within the public/apps/ directory, and the index page of that folder will be launched within an iFrame.  
Avatar uploads will be stored in both the public/users/temp-uploads during upload, and then moved to public/users/avatars when the upload is complete.  


## Technology Stack

The application runs with assistance from the following technologies:   
  * NodeJS  
  * Express  
  * Socket.io   
  * MySQL  
  * HTML/JavaScript/CSS  

# Credit

Created by Richard Marshall  
Contact: Richard@live.cl