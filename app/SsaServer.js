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
require(LIB_PATH + "Bullet.js");


function SsaServer() {
	var port;
	var sockets;
	var players;
	var gameInterval;
	var count;
	var nextPID;
	var p1,p2,p3,p4;
	var globalBullets = [];

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

	var getSizeOf = function(array) {
		var size = 0;
		var i;

		for(i in array) {
			size++;
		}

		return size;

		//return Object.keys(array).length;
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
			xPos = Ssa.X_POSITION_1;
			yPos = Ssa.Y_POSITION_1;
			break;
		case 2:
			xPos = Ssa.X_POSITION_2;
			yPos = Ssa.Y_POSITION_1;
			break;
		case 3:
			xPos = Ssa.X_POSITION_1;
			yPos = Ssa.Y_POSITION_2;
			break;
		case 4:
			xPos = Ssa.X_POSITION_2;
			yPos = Ssa.Y_POSITION_2;
			break;
		default:
			xPos = Ssa.X_POSITION_1;
			yPos = Ssa.Y_POSITION_1;
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

	var manageCollisions = function(player) {
		var shape = player.Shape;
	
	    var effectiveHeight = 0;
    	var effectiveWidth = 0;
    	//console.log("Checking hits...!");

	    if (shape.type == "circle") {
	    	effectiveHeight = Ssa.CIRCLE_RADIUS*2;
	    	effectiveWidth = Ssa.CIRCLE_RADIUS*2;
    	} else if (shape.type == "square") {
		    effectiveHeight = Ssa.SQUARE_LENGTH*2;
		    effectiveWidth = Ssa.SQUARE_LENGTH*2;
	    } else {
		    effectiveHeight = Ssa.TRIANGLE_HEIGHT*2;
		    effectiveWidth = Ssa.TRIANGLE_LENGTH*2;
	    }

	    globalBullets.forEach(function(bullet) {
    		if (bullet.isActive()) {
        		if(bullet.shooter!= player.pid){
			        if (((bullet.x < shape.x + effectiveWidth)&&(bullet.x > shape.x - effectiveWidth))
			        	&&((bullet.y < shape.y + effectiveHeight )&&(bullet.y > shape.y - effectiveHeight)))
			           {
				        bullet.kill();
				        //console.log("Sending Hit Msg!");

          				//Determine which Shape's bullet it is
					    var hitFromShapeLocal = "Circle";
					    var n;
					    for (n in players){
					      	if(players[n].pid == bullet.shooter){
          						hitFromShapeLocal = players[n].Shape.type;
          					}
          				}

      					var hitmsg = {
							hitFrom: bullet.shooter,
							hitTo: player.pid,
							hitFromShape: hitFromShapeLocal,
							type:"Hit"
						};
						multicastUpdatePlayers("Hit", hitmsg);
        			}
				}
			}
    	});
    		// Recangular Collison Detection Algorithm
    }

	var bulletGarbageCollect = function(){
  		var i;
    	
    	for(i = 0; i < globalBullets.length; i++) {
      		if(globalBullets[i]&&!globalBullets[i].isActive()){
        		delete globalBullets[i];
			}

    }
  
  }

var renderBullets = function() {
    globalBullets.forEach(function(bullet) {
      if (bullet.isActive()) {
        bullet.update();
      }
    })

}

	var gameLoop = function() {
		// Server-side simulation
		var i;

		bulletGarbageCollect();
		renderBullets();
    	for (i in players) {

	    	players[i].Shape.updatePos();
	    	manageCollisions(players[i]);
	    	
    	}

		
	}

	var startGame = function() {
		gameInterval = setInterval(function() {
			gameLoop();
		}, 1000);

		if (gameInterval !== undefined) {
			// There is already a timer running so the game has 
			// already started.
			console.log("Already playing!");

		} else if (Object.keys(players).length < 4) {
			// We need two players to play.
			console.log("Not enough players!");
			//broadcast({type:"message", content:"Not enough player"});
		} else {
			/*gameInterval = setInterval(function() {
				gameLoop();
			}, 1000);*/
		}
	}

	var multicastUpdatePlayers  = function(msgType, msgOptions) {
		var id;
		var sockid;
		if (msgType == "newPlayer") {
			var i;
			var socketsSize = getSizeOf(sockets);

			//Update existing players of this new player
			//For all players other than the last guy that joined
			for(i=1; i<=(socketsSize-1); i++) {
				unicast(sockets[i], generateMsg("addPlayer", msgOptions));
			}

			for(id in players) { //For all players
				//Tell new player of status of all other players
				if(players[id].sid!=i) {
					unicast(sockets[i], generateMsg("addPlayer", {id:id, pid:players[id].pid}));
				}
			}
		} else if (msgType == "updateVel") {
			for(sockid in sockets) { //For all connections
				//Update the velocity of a specific player
				unicast(sockets[sockid], generateMsg(msgType, msgOptions));
			}
		}
		else if (msgType == "Shoot"){
			for(sockid in sockets) { //For all connections
				//Update the velocity of a specific player
				unicast(sockets[sockid], generateMsg(msgType, msgOptions));
			}
		}
		else if (msgType == "Hit"){
			for(sockid in sockets) { //For all connections
				//Update the velocity of a specific player
				unicast(sockets[sockid], generateMsg(msgType, msgOptions));
			}
	}
}
	var generateMsg = function(msgType, msgOptions) {
		var msg;

		if(msgType == "addPlayer") {
			msg = {
					id:msgOptions.id,
					type:"addPlayer",
					shape:players[msgOptions.id].Shape.type, 
					xPos:players[msgOptions.id].Shape.x, 
					yPos:players[msgOptions.id].Shape.y,
					pid:msgOptions.pid
			};
		} else if(msgType == "updateVel") {
			msg = {
					id:msgOptions.id,
					type:"updateVel",
					xPos:players[msgOptions.id].Shape.x,
					yPos:players[msgOptions.id].Shape.y,
					xVel:msgOptions.xVel,
					yVel:msgOptions.yVel
			};
		}else if(msgType == "Shoot") {
			msg = msgOptions;
		}
		else if( msgType == "Hit")
		{
			msg = msgOptions;
		}

		return msg;
	}

	this.start = function() {
		try {
			var express = require("express");
			var http = require("http");
			var sockjs = require("sockjs");
			var bodyParser = require("body-parser");
			var ejs = require('ejs');
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
						if(count > 4) {
							return;
						} else if (count == 4) {
							// Send back message that game is full
							unicast(conn, {
								type: "message",
								content: "The game is full.  Come back later"
							});
							// TODO: force a disconnect
						} else {
							//New player joins
							//Give him the status of all players
							//Update server copy of state
							//Update everyone else of this person joining
							var currPID = nextPID;
							newPlayer(conn, message.shape);
							console.log(players[conn.id]);
							unicast(conn, {
								type: "you",
								shape:message.shape, 
								xPos:players[conn.id].Shape.x, 
								yPos:players[conn.id].Shape.y,
								id:conn.id,
								pid:currPID
							});
							multicastUpdatePlayers("newPlayer", {id:conn.id, pid:currPID});
						}
						break;
					case "updateVel":
						//Update server copy of state
						players[message.id].Shape.updateVelX(message.xVel);
						players[message.id].Shape.updateVelY(message.yVel);
						players[message.id].Shape.forceUpdatePos(message.xPos, message.yPos);
						//Update all players of this change
						multicastUpdatePlayers("updateVel", message);
						break;
					case "Shoot":
						//Update server copy of state
						//player[message.id].Shape.updateVelX(message.xVel);
						//player[message.id].Shape.updateVelY(message.yVel);
						//Update all players of this change

						//Account for client delay
						var dlay = 0;
						if(players[conn.id].delay){
							dlay = players[conn.id].delay;
						}

						//RollBack by client Delay

						var normalisedX = message.x - dlay*message.vx;
						var normalisedY = message.y - dlay*message.vy;

						globalBullets.push(new Bullet({
                		shooter: message.shooter,
                		x: normalisedX,
                		y: normalisedY,
                		vx: message.vx,
                		vy: message.vy
              			}))

						multicastUpdatePlayers("Shoot", message);
						break;
					case "delay":
						players[conn.id].delay = message.delay;
						console.log("delay = ", message.delay);
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
			app.set('views', __dirname);
			app.use(bodyParser.json());
			app.use(bodyParser.urlencoded({
				extended:true
			}));
			app.engine('html', ejs.renderFile);
			//handler
			var shape;
			app.post('/user', function(sReq, sRes) {
				shape = sReq.body.shape;
				console.log(shape);
				sRes.redirect('/play');
			});
			app.get('/play', function(req, res) {
				console.log(shape);
			    res.render('ssa.html', {
			        shape: shape
		    	});
			});
			console.log("Server running on http://0.0.0.0:" + Ssa.PORT + "\n")
			console.log("Visit http://0.0.0.0:" + Ssa.PORT + "/Ssa.html in your " +
			"browser to start the game")
		} catch (e) {
			console.log("Cannot listen to " + port);
			console.log("Error: " + e);
		}

		setInterval(function() {
	      gameLoop();
	    }, 1000 / Ssa.FRAME_RATE);
	}
}

//starting server
var gameServer = new SsaServer();
gameServer.start();