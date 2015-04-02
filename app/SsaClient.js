/*
 *SsaClient.js
 *Basic client code based of the PongClient.js example
 *
 *Usage:
 *  Include in HTML body onload to run on a web page.
 *    <body onload="loadScript('', 'SsaClient.js')">
 */

"use strict";

function SsaClient() {
  var socket;
  var playArea;

  var myShape;
  var oppShape = new Object();

  var upPressed = false;
  var downPressed = false;
  var leftPressed = false;
  var rightPressed = false;
  
  var playerBullets;

  var showMessage = function(location, msg) {
    document.getElementById(location).innerHTML = msg;
  }

  var appendMessage = function(location, msg) {
    var prev_msgs = document.getElementById(location).innerHTML;
    document.getElementById(location).innerHTML = "[" + new Date().toString() + "] " + msg + "<br />" + prev_msgs;
  }

  var sendToServer = function(msg) {
    var date = new Date();
    var currentTime = date.getTime();
    msg["timestamp"] = currentTime;
    socket.send(JSON.stringify(msg));
  }

  var initNetwork = function() {
    try {
      socket = new SockJS("http://" + Ssa.SERVER_NAME + ":" + Ssa.PORT + "/ssa");
      socket.onmessage = function(e) {
        var message = JSON.parse(e.data);
        switch (message.type) {
          case "message":
            appendMessage("serverMsg", message.content);
            break;
          case "you":
            myShape = new Shape(message.xPos, message.yPos, message.shape);
            oppShape = [];
            break;
          case "addPlayer":
            oppShape[message.id] = new Shape(message.xPos, message.yPos, message.shape);
            break;
          default:
            appendMessage("servermsg", "unhandled message type" + message.type);
        }
      }
    } catch (e) {
      console.log("Failed to connect to " + "http://" + Ssa.SERVER_NAME + ":" + Ssa.PORT);
    }
  }

  var initGUI = function() {

    while (document.readyState != "complete") {
      console.log("lodaing...");
    };

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
    document.addEventListener("keyup", function(e) {
      onKeyRelease(e);
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

    switch (e.keyCode) {
      case 87:
      case 38:
        { // Up
          if(upPressed == false) {
            //Set vY to a positive value
            console.log("Up");
            //myShape.updateVelY(ShapeConstants.MOVESPEED);
            myShape.move('U');

            console.log("VX = " + myShape.vx + ", VY = " + myShape.vy);
            // Send event to server
            //sendToServer({type:"move", delay:delay});
            upPressed = true;
          }
          break;
        }
      case 83:
      case 40:
        { // Down
          if(downPressed == false) {
            //Set vY to a negative value
            console.log("Down");
            //myShape.updateVelY(ShapeConstants.MOVESPEED*-1);
            myShape.move('D');

            console.log("VX = " + myShape.vx + ", VY = " + myShape.vy);
            // Send event to server
            //sendToServer({type:"move", delay:delay});
            downPressed = false;
          }
          break;
        }
      case 65:
      case 37:
        { // Left
          if(leftPressed == false) {
            //Set vX to a negative value cause left is -ve
            console.log("Left");
            //myShape.updateVelX(ShapeConstants.MOVESPEED*-1);
            myShape.move('L');

            console.log("VX = " + myShape.vx + ", VY = " + myShape.vy);
            // Send event to server
            //sendToServer({type:"move", delay:delay});
            leftPressed = true;
          }
          break;
        }
      case 68:
      case 39:
        { // Right
          if(rightPressed == false) {
            //Set vX to a positive value cause left is +ve
            console.log("Right");
            //myShape.updateVelX(ShapeConstants.MOVESPEED);
            myShape.move('R');

            console.log("VX = " + myShape.vx + ", VY = " + myShape.vy);
            // Send event to server
            //sendToServer({type:"move", delay:delay});
            rightPressed = true;
          }
          break;
        }
    }
  }
  
  var onKeyRelease = function(e) {
    /* Keycodes:
    38: up arrow      87: W
    40: down arrow    83: S
    37: left arrow    65: A
    39: right arrow   68: D
    */

    switch (e.keyCode) {
      case 87:
      case 38:
        { // Stop moving up
          //myShape.updateVelY(ShapeConstants.MOVESPEED);
          myShape.move('D');
          // Send event to server
          //sendToServer({type:"move", delay:delay});
          upPressed = false;
          break;
        }
      case 83:
      case 40:
        { // Stop moving down
          //myShape.updateVelY(ShapeConstants.MOVESPEED*-1);
          myShape.move('U');
          // Send event to server
          //sendToServer({type:"move", delay:delay});
          downPressed = false;
          break;
        }
      case 65:
      case 37:
        { // Stop moving left
          //myShape.updateVelX(ShapeConstants.MOVESPEED*-1);
          myShape.move('R');
          // Send event to server
          //sendToServer({type:"move", delay:delay});
          leftPressed = false;
          break;
        }
      case 68:
      case 39:
        { // Stop moving right
          //Set vX to a positive value cause left is +ve
          //myShape.updateVelX(ShapeConstants.MOVESPEED);
          myShape.move('L');
          // Send event to server
          //sendToServer({type:"move", delay:delay});
          rightPressed = false;
          break;
        }
    }
  }

  var gameLoop = function() {
  //Need to check when bullets exit bounds of the map and delete them
  //Both on client and server side for better memory management
  
    myShape.updatePos();
    playerBullets = myShape.getBulletList();
    console.log(oppShape);
    for (var i = 0; i < oppShape.length; i++) {
      oppShape[i].updatePos();
      manageCollisions(playerBullets, oppShape[i]);
    }
    render();
  }



  var manageCollisions = function(playerBullets, shape) {

    var effectiveHeight = 0;
    var effectiveWidth = 0;

    if (shape.type == "circle") {
      effectiveHeight = ShapeConstants.CIRCLE_RADIUS;
      effectiveWidth = ShapeConstants.CIRCLE_RADIUS;

    } else if (shape.type == "square") {

      effectiveHeight = ShapeConstants.SQUARE_LENGTH;
      effectiveWidth = ShapeConstants.SQUARE_LENGTH;
    } else {

      effectiveHeight = ShapeConstants.TRIANGLE_HEIGHT;
      effectiveWidth = ShapeConstants.TRIANGLE_LENGTH;
    }

    // Recangular Collison Detection Algorithm
    playerBullets.forEach(function(bullet) {
      if (bullet.isActive()) {
        var xref = bullet.getX();
        var yref = bullet.getY();
        var BULLET_RADIUS = 0.5

        if (xref.x < shape.x + effectiveWidth &&
          xref.x + bullet.BULLET_RADIUS > shape.x &&
          xref.y < shape.y + effectiveHeight &&
          xref.y + xref.height > shape.y) {

          bullet.kill();
          shape.isHit(myShape);
        }
      }
    });
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
      for(var i=0; i<oppShape.length; i++) {
        renderShape(oppShape[i], "#ff00ff", context); //Color decided by serve
      }

      playerBullets.forEach(function(bullet) {
        if (bullet.isActive()) {
          bullet.update();
          bullet.draw(context);
        }
      })
      var id;
      for (id in oppShape) {
        renderShape(oppShape[id], "#00ff00", context);
      }
      //Draw myself later so I'll be on top
      renderShape(myShape, "#ff0000", context); //Color decided by server
    }
    //Bullet Management and Rendering

  //Expects a shape object and a string
  var renderShape = function(shape, colorCode, context) {
    context.fillStyle = colorCode;

    if (shape.type == "circle") {
      //Circle center should be in corner of bottom-right quadrant
      var circleCenterX = shape.x + ShapeConstants.CIRCLE_RADIUS;
      var circleCenterY = shape.y - ShapeConstants.CIRCLE_RADIUS;

      context.beginPath();
      context.arc(circleCenterX, circleCenterY, ShapeConstants.CIRCLE_RADIUS, 0, Math.PI * 2, true);
      context.closePath();
      context.fill();
    } else if (shape.type == "square") {
      //Starting from top left-hand corner      
      context.fillRect(shape.x, shape.y,
        ShapeConstants.SQUARE_LENGTH, ShapeConstants.SQUARE_LENGTH);
    } else if (shape.type == "triangle") {
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
      context.lineTo(triangleStartX + ShapeConstants.TRIANGLE_LENGTH / 2,
        triangleStartY + ShapeConstants.TRIANGLE_HEIGHT);
      context.lineTo(triangleStartX + ShapeConstants.TRIANGLE_LENGTH, triangleStartY);
      context.fill();
    } else { //Just use circle for now
      //Circle center should be in corner of bottom-right quadrant
      var circleCenterX = shape.x + ShapeConstants.CIRCLE_RADIUS;
      var circleCenterY = shape.y - ShapeConstants.CIRCLE_RADIUS;

      context.beginPath();
      context.arc(circleCenterX, circleCenterY, ShapeConstants.CIRCLE_RADIUS, 0, Math.PI * 2, true);
      context.closePath();
      context.fill();
    }
  }

  this.start = function() {
    initNetwork();
    initGUI();
    setTimeout(function() {
      sendToServer({type:'newPlayer', shape:"square"});
    }, 100);
    setInterval(function() {
      gameLoop();
    }, 1000 / Ssa.FRAME_RATE);
  }
}

//start client
var gameClient = new SsaClient();
setTimeout(function() {
  gameClient.start();
}, 500);