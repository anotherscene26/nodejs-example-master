#!/bin/env node
//  OpenShift sample Node application
var http = require('http');
var fs = require('fs');
//Get the environment variables we need.
var ipaddr  = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port    = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var httpServer = http.createServer(function(request, response) {
	
    fs.readFile( __dirname +'/app.html', "utf8", function(error, content) {
    	
        response.writeHeader(200, {"Content-Type": "text/html"});
        response.end(content);
    });
    
     
 
}).listen(port,ipaddr);

var io = require('socket.io').listen(httpServer);


io.sockets.on('connection', function (socket, pseudo) {
    // Dès qu'on nous donne un pseudo, on le stocke en variable de session et on informe les autres personnes
    socket.on('nouveau_client', function(pseudo) {
        socket.set('pseudo', pseudo);
        socket.broadcast.emit('nouveau_client', pseudo);
    });

    // Dès qu'on reçoit un message, on récupère le pseudo de son auteur et on le transmet aux autres personnes
    socket.on('message', function (message) {
        socket.get('pseudo', function (error, pseudo) {
            socket.broadcast.emit('message', {pseudo: pseudo, message: message});
        });
    }); 
});
