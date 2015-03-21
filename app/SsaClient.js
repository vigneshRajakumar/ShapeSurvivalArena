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
	var playArea;
  
  var myShape;
  var oppShape;
  
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

		playArea = document.getElementById("playArena");
		playArea.height = Ssa.HEIGHT;
		playArea.width = Ssa.WIDTH;
    
   ////////////////////////////
    //  Init Event handlers  //
    ///////////////////////////
    //PC Controls
    document.addEventListener("keydown", function(e) {
      onKeyPress(e);
    }, false); //For player movement
    playArea.addEventListener("mousemove", function(e) {
      onMouseMove(e);
    }, false); //For player aimming
    playArea.addEventListener("click", function(e) {
      onMouseClick(e);
    }, false); //For player shooting
    //Mobile Controls
    
    /////////////////////////////
    //  End of event handlers  //
    /////////////////////////////    
	}
  
  var onMouseMove = function(e) {
    /*var canvasMinX = playArea.offsetLeft;
    var canvasMaxX = canvasMinX + playArea.width;
    var canvasMinY = playArea.offsetTop;
    var canvasMaxY = canvasMinX + playArea.height;
    var newMouseX = e.pageX - canvasMinX;
    var newMouseY = e.pageY - canvasMinY;*/

    // Set direction of aim or rotation of shape
    
 
    // Send event to server
    //sendToServer({type:"rotate", x: newMouseX});
  }
  
  var onMouseClick = function(e) {
    //Shoot weapon
    
    myShape.shoot();
    //Send event to server
    //sendToServer({type:"shoot"});
  }
  
  var onKeyPress = function(e) {
    /* Keycodes:
    38: up arrow      87: W
    40: down arrow    83: S
    37: left arrow    65: A
    39: right arrow   68: D
    */
    
    switch(e.keyCode) {
      case 87:
      case 38: { // Up
        //Set vY to a positive value
        console.log("Up");
        //myShape.updateVelY(ShapeConstants.MOVESPEED);
        myShape.move('U');
        
        console.log("VX = "+myShape.vx+", VY = "+myShape.vy);
        // Send event to server
        //sendToServer({type:"move", delay:delay});
        break;
      }
      case 83:
      case 40: { // Down
        //Set vY to a negative value
        console.log("Down");
        //myShape.updateVelY(ShapeConstants.MOVESPEED*-1);
        myShape.move('D');
        
        console.log("VX = "+myShape.vx+", VY = "+myShape.vy);
        // Send event to server
        //sendToServer({type:"move", delay:delay});
        break;
      }
      case 65:
      case 37: { // Left
        //Set vX to a negative value cause left is -ve
        console.log("Left");
        //myShape.updateVelX(ShapeConstants.MOVESPEED*-1);
        myShape.move('L');
        
        console.log("VX = "+myShape.vx+", VY = "+myShape.vy);
        // Send event to server
        //sendToServer({type:"move", delay:delay});
        break;
      }
      case 68:
      case 39: { // Right
        //Set vX to a positive value cause left is +ve
        console.log("Right");
        //myShape.updateVelX(ShapeConstants.MOVESPEED);
        myShape.move('R');
        
        console.log("VX = "+myShape.vx+", VY = "+myShape.vy);
        // Send event to server
        //sendToServer({type:"move", delay:delay});
        break;
      }
    }
  }
  
  var gameLoop = function() {
    myShape.updatePos();
    for(var i=0; i<oppShape.length; i++) {
      oppShape[i].updatePos();
    }
    
    render();


  }
  
  var render = function() {
    var context = playArea.getContext("2d");
    
    // Reset playArea border
    context.clearRect(0, 0, playArea.width, playArea.height);
    context.fillStyle = "#000000";
    context.fillRect(0, 0, playArea.width, playArea.height);
    
    var shape = myShape;
    context.fillStyle = "#ff0000";
    
    //Draw other players with a loop
    /*for(var i=0; i<oppShape.length; i++) {
      renderShape(oppShape[i], "#ff00ff"); //Color decided by serve
    }*/
    
    //Draw myself later so I'll be on top
    renderShape(myShape, "#ff0000"); //Color decided by server

//Bullet Management and Rendering
var playerBullets = myShape.getBulletList();

    playerBullets.forEach(function(bullet) {

      if(bullet.isActive())
      {
    bullet.update();
    bullet.draw();

    }
    })
  }


  
  //Expects a shape object and a string
  var renderShape = function(shape, colorCode) {
    var context = playArea.getContext("2d");
    context.fillStyle = colorCode;
    
    if(shape.type=="circle") {
      //Circle center should be in corner of bottom-right quadrant
      var circleCenterX = shape.x + ShapeConstants.CIRCLE_RADIUS;
      var circleCenterY = shape.y - ShapeConstants.CIRCLE_RADIUS;
      
      context.beginPath();
      context.arc(circleCenterX, circleCenterY, ShapeConstants.CIRCLE_RADIUS, 0, Math.PI*2, true);
      context.closePath();
      context.fill();
    } else if(shape.type=="square") {
      //Starting from top left-hand corner      
      context.fillRect(shape.x, shape.y, 
        ShapeConstants.SQUARE_LENGTH, ShapeConstants.SQUARE_LENGTH);
    } else if(shape.type=="triangle") {
      //Imagine an upright triangle in a square with the base
      //of the triangle as the bottom edge of the square
      
      //We start from the top left-hand corner and move down to
      //the bottom left-hand corner to begin drawing.
      //Then we draw a line to the top of the triangle
      //Then we draw a line back down to the bottom of the triangle
      
      var triangleStartX = shape.x;
      var triangleStartY = shape.y - ShapeConstants.TRIANGLE_HEIGHT;
      
      context.beginPath();
      context.moveTo(triangleStartX, triangleStartY);
      context.lineTo(triangleStartX+ShapeConstants.TRIANGLE_LENGTH/2, 
        triangleStartY+ShapeConstants.TRIANGLE_HEIGHT);
      context.lineTo(triangleStartX+ShapeConstants.TRIANGLE_LENGTH, triangleStartY);
      context.fill();      
    } else { //Just use circle for now
      //Circle center should be in corner of bottom-right quadrant
      var circleCenterX = shape.x + ShapeConstants.CIRCLE_RADIUS;
      var circleCenterY = shape.y - ShapeConstants.CIRCLE_RADIUS;
      
      context.beginPath();
      context.arc(circleCenterX, circleCenterY, ShapeConstants.CIRCLE_RADIUS, 0, Math.PI*2, true);
      context.closePath();
      context.fill();
    }
  }

	this.start = function() {
    myShape = new Shape(100,100,"square");
    
    //Change this value according to # of opponents
    //Determined by server
    oppShape = new Array(3); 
    for(var i=0; i<oppShape.length; i++) {
      oppShape[i] = new Shape(100*(i+1), 100*(i+1), "triangle");
    }
    
		//initNetwork();
		initGUI();
    
    setInterval(function() {gameLoop();}, 1000/Ssa.FRAME_RATE);
	}
}

//start client
var gameClient = new SsaClient();
setTimeout(function() {gameClient.start();}, 500);