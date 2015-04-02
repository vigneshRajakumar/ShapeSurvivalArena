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
require(LIB_PATH + "Shape.js");
require(LIB_PATH + "Player.js");


function SsaServer() {
	var port;
	var sockets;
	var players;
	var gameInterval;
	var count;
	var nextPID;
	var p1,p2,p3,p4;
	var Y_POSITION_1 = 100;
	var Y_POSITION_2 = 400;
	var X_POSITION_1 = 100;
	var X_POSITION_2 = 600;


	var broadcast = function(msg) {
		var id;
		for (id in sockets) {
			sockets[id].write(JSON.stringify(msg));
		}
	}

	var unicast = function(sock, msg) {
		sock.write(JSON.stringify(msg));
	}

	var reset = function(msg) {

		if (gameInterval !== undefined) {
			clearInterval(gameInterval);
			gameInterval = undefined;
		}
		//TODO
	}

	var newPlayer = function(conn, shape) {
		count++;

		unicast(conn, {
			type: "message",
			content: "You are Player " + nextPID
		})

		var xPos,yPos;

		switch(nextPID) {
			case 1:
				xPos = X_POSITION_1;
				yPos = Y_POSITION_1;
				break;
			case 2:
				xPos = X_POSITION_2;
				yPos = Y_POSITION_1;
				break;
			case 3:
				xPos = X_POSITION_1;
				yPos = Y_POSITION_2;
				break;
			case 4:
				xPos = X_POSITION_2;
				yPos = Y_POSITION_2;
				break;
			default:
				xPos = X_POSITION_1;
				yPos = Y_POSITION_1;
		}

		players[conn.id] = new Player(conn.id, nextPID, xPos, yPos, shape);
		sockets[nextPID] = conn;

		//mark players
		switch(nextPID) {
			case 1:
				p1 = players[conn.id];
				break;
			case 2:
				p2 = players[conn.id];
				break;
			case 3:
				p3 = players[conn.id];
				break;
			case 4:
				p4 = players[conn.id];
				break;
			default:
				break;
		}

		nextPID++;
		if(nextPID>4) {
			nextPID=1;
		}
	}

	var gameLoop = function() {

		console.log("Playing....!");

	}

	var startGame = function() {
		if (gameInterval !== undefined) {
			// There is already a timer running so the game has 
			// already started.
			console.log("Already playing!");

		} else if (Object.keys(players).length < 4) {
			// We need two players to play.
			console.log("Not enough players!");
			//broadcast({type:"message", content:"Not enough player"});

		} else {

			gameInterval = setInterval(function() {
				gameLoop();
			}, 1000);
		}



	}

	var multicastUpdatePlayers  = function() {
		var id;
		var sockid;
		for(sockid in sockets) {
			for(id in players) {
				if(players[id].sid!=sockid) {
					unicast(sockets[sockid],{
						id:id,
						type:"addPlayer", 
						shape:players[id].Shape.type, 
						xPos:players[id].Shape.x, 
						yPos:players[id].Shape.y
					});
				}
			}
		}
	}

	this.start = function() {
		try {
			var express = require("express");
			var http = require("http");
			var sockjs = require("sockjs");
			var sock = sockjs.createServer();

			//init
			count = 0;
			nextPID = 1;

			gameInterval = undefined;
			players = new Object();
			sockets = new Object();

			sock.on("connection", function(conn) {
				console.log("connected");
				broadcast({
					type: "message",
					content: "There is now " + count + " players"
				});
				
				conn.on("close", function() {

					reset();

					count--;

					if(players[conn.id] != undefined) nextPID = players[conn.id].pid;

					if (players[conn.id] === p1) p1 = undefined;
					if (players[conn.id] === p2) p2 = undefined;
					if (players[conn.id] === p3) p3 = undefined;
					if (players[conn.id] === p4) p4 = undefined;

					delete players[conn.id];

					broadcast({
						type: "message",
						content: " There is now " + count + " players"
					});
					broadcast({
						type: "removePlayer",
						id: conn.id
					})
				});

				conn.on("data", function(data) {
					var message = JSON.parse(data);
					var p = players[conn.id];

					switch (message.type) {
						case "start":
							startGame();
							break;
						case "newPlayer":
							if (count == 4) {
								// Send back message that game is full
								unicast(conn, {
									type: "message",
									content: "The game is full.  Come back later"
								});
								// TODO: force a disconnect
							} else {
								newPlayer(conn, message.shape);
								console.log(players[conn.id]);
								unicast(conn, {
									type: "you",
									shape:message.shape, 
									xPos:players[conn.id].Shape.x, 
									yPos:players[conn.id].Shape.y,
									id:conn.id
								});
								multicastUpdatePlayers();
							}
							break;
						default:
							console.log("Unhandled message type:" + message.type)
					}
				})
			});

			//start httpServer
			var app = express();
			var httpServer = http.createServer(app);
			sock.installHandlers(httpServer, {
				prefix: '/ssa'
			});
			httpServer.listen(Ssa.PORT, '0.0.0.0');
			app.use(express.static(__dirname));
			console.log("Server running on http://0.0.0.0:" + Ssa.PORT + "\n")
			console.log("Visit http://0.0.0.0:" + Ssa.PORT + "/Ssa.html in your " +
				"browser to start the game")
		} catch (e) {
			console.log("Cannot listen to " + port);
			console.log("Error: " + e);
		}
	}
}

//starting server
var gameServer = new SsaServer();
gameServer.start();