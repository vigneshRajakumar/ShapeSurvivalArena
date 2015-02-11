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


	var initGUI() {

		playArena = document.getElementById("playArena");
		playArena.height = Ssa.HEIGHT;
		playArena.width = Ssa.WIDTH;
	}

	this.start = function() {
		initGUI();
	}
}

//start client
var gameClient = new SsaClient();
setTimeout(funtion() {gameClient.start();}, 500);