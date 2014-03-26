
//Variables openshift
var ipaddr  = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port    = process.env.OPENSHIFT_NODEJS_PORT || 8080 ;

//Cr�ation du serveur http
var http = require('http');
var httpServ = http.createServer().listen(port, ipaddr);

// Cr�ation de la socket
var io = require('socket.io').listen(httpServ);

// Cr�ation des variables n�cessaires:

var channels = new Array();// Liste des canaux
var i=0;
var timeout;
var tm;
var clients;


// Cr�ation des fonctions n�cessaires:
/** Fonction contains* */
// Besoin de v�rifier si le canal existe ou pas ?
Array.prototype.contains = function(obj) {
	var i = this.length;
	while (i--) {
		if (this[i] === obj) {
			return true;
		}
	}
	return false;
};

// Listeners du serveur
io.sockets.on('connection', function(socket) {
	
	console.log(socket.transport);

	
	socket.on('createChannel', function(channel) {
	
		// TODO : r�cup�rer l'id de la personne qui a cr�� le canal
	// var idUser=socket.id;
		
		if (channels.contains(channel)){
		console.log("Warning : channel already exists " + channel);	
		socket.emit("channelcreated", channel);
		console.log ("Successful creation of " + channel);
		}
		
		else{channels.push(channel);
		socket.emit("channelcreated", channel);
		console.log ("Successful creation of " + channel);
			}

	
		
	});

	// TODO
	socket.on('createNewChannel', function() {
		// var idUser=socket.id;
		// TODO : r�cup�rer l'id de la personne qui a cr�� le canal
	
		var newChannel = ("channel " + i);
		i++;
		channels.push(newChannel);
		console.log(channels);
		socket.emit("newChannel", newChannel);
		console.log("New channel created " + newChannel);
	});

	socket.on('subscribe', function(channel) {
		
		if (channels.contains(channel)){socket.join(channel);
		console.log ("Subscribe successful to " + channel);}
		
		else {console.log("Subscription : channel doesn't exist " + channel);}

	});

	socket.on('publish', function(channel, data) {
		if (channels.contains(channel)){io.sockets.in(channel).emit('published', data);}
		else {console.log("Publication : channel doesn't exist " + channel);}
		
		// todo : remplacer les console.log en gestionnaires d'erreur
	
		
	});

	socket.on('unsubscribe', function(channel) {
	
		if (channels.contains(channel))
		
		{socket.leave(channel);
		console.log ("Unsubscribe successful from " + channel);
		clients = io.sockets.clients(channel).length;
		console.log(clients);
		setTimeout(function(){
		if (clients==0){
	
		channels.pop(channel);
		console.log("Channel destroyed ! ");
			
		}
		}, tm);
		
		}
		else {console.log("Unsubscribe : channel doesn't  exist " + channel);}
	});
	
	
	socket.on('timeout set', function(timeout){
 
		tm=timeout;
		timeout=true;
	
		});
		

	// TODO : LATER
	socket.on('subsists', function(subsisted, channel){
		// IDUSER?
		if (idUser==socket.id){
				
				
			}
		
		
	});
	
	// TODO
	socket.on('getchannelinfo', function(channel){
		
		// Quelles infos renvoyer ?
		
		
		
	});

});

console.log('Server running at http://localhost:1337/');
