/*
 *SsaClient.js
 *Basic client code based of the PongClient.js example
 *
 *Usage:
 *	Include in HTML body onload to run on a web page.
 *    <body onload="loadScript('', 'SsaClient.js')">
 */

"use strict";

function SsaClient() {
	var socket;
	var playArena;

	var showMessage = function(location, msg) {
		document.getElementById(location).innerHTML = msg; 
	}

    var appendMessage = function(location, msg) {
        var prev_msgs = document.getElementById(location).innerHTML;
        document.getElementById(location).innerHTML = "[" + new Date().toString() + "] " + msg + "<br />" + prev_msgs;
    }

    var sendToServer = function (msg) {
        var date = new Date();
        var currentTime = date.getTime();
        msg["timestamp"] = currentTime;
        socket.send(JSON.stringify(msg));
    }    

    var initNetwork = function () {
    	try {
    		socket = new SockJS("http://" + Ssa.SERVER_NAME + ":" + Ssa.PORT + "/ssa");
    		socket.onmessage = function (e) {
    			var message = JSON.parse(e.data);
    			switch(message.type) {
    				case "message":
    					appendMessage("serverMsg", message.content);
    					break;
					default:
						appendMessage("servermsg", "unhandled message type" +message.type);
    			}
    		}
    	} catch (e) {
    		console.log("Failed to connect to " + "http://" + Ssa.SERVER_NAME + ":" + Ssa.PORT );
    	}
    }

	var initGUI = function() {

		while(document.readyState != "complete") {console.log("lodaing...");};

		playArena = document.getElementById("playArena");
		playArena.height = Ssa.HEIGHT;
		playArena.width = Ssa.WIDTH;
	}

	this.start = function() {
		initNetwork();
		initGUI();
	}
}

//start client
var gameClient = new SsaClient();
setTimeout(function() {gameClient.start();}, 500);