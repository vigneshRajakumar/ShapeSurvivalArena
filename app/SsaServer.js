/*
 *SsaServer.js
 *Basic server code based of the PongServer.js example
 *
 *Usage:
 *	node SsaServer.js 
 */

"use strict";

var LIB_PATH = "./";
require(LIB_PATH + "Ssa.js");

function SsaServer() {
	var port; 	
	var sockets;
	var players;

	this.start = function() {
		try {
			var express = require("express");
			var http = require("http");

			//start httpServer
			var app = express();
			var httpServer = http.createServer(app);
			httpServer.listen(Ssa.PORT, '0.0.0.0');
			app.use(express.static(__dirname));
		} catch (e) {
			console.log("Cannot listen to " + port);
        console.log("Error: " + e);
		}
	}
}

//starting server
var gameServer = new SsaServer();
gameServer.start();