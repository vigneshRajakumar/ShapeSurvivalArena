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

  var delay;          // delay simulated on current client 
  var locallag = 0;
  
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
    //console.log("Triggering a "+msg.type+" update...\n");
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
            myShape.serverId = message.id;
            myShape.pid = message.pid;
            myShape.initShape();
            break;
          case "addPlayer":
            if(message.id!=/*myId*/myShape.serverId) {
              if(oppShape[message.id] === undefined) {
                oppShape[message.id] = new Shape(message.xPos, message.yPos, message.shape);
                oppShape[message.id].pid = message.pid;
                oppShape[message.id].initShape();
              }
            } 
            break;
          case "removePlayer":
            if(oppShape[message.id]!=undefined) delete oppShape[message.id];
            break;
          case "updateVel": //Update a specific player's velocity
            if(message.id!=myShape.serverId) {
              oppShape[message.id].updateVelX(message.xVel);
              oppShape[message.id].updateVelY(message.yVel);
              oppShape[message.id].forceUpdatePos(message.xPos, message.yPos);
            }
            break;
          case "Shoot":
          { //Update a specific player's velocity
            if(message.shooter!=myShape.pid) {

              var new_bullet = new Bullet({
                shooter: message.shooter,
                x: message.x,
                y: message.y,
                vx: message.vx,
                vy: message.vy
              })

              //if Shooter is not MyShape, we assume bullet is moving towards us and apply LPF

              new_bullet.LPF(myShape,delay,locallag);
              myShape.addBullet(new_bullet);
            }
            break;}
          case "Hit":{ //Update a specific player's velocity
            /*console.log("MyShape PID!");
            console.log(myShape.pid);
            console.log("Message HIT FROM");
            console.log(message.hitFrom);
            console.log("Message Hit To");
            console.log(message.hitTo);*/
            
            var kill = false;

            // Set who got hit
            if(message.hitTo == myShape.pid){
              kill = myShape.isHit(message.hitFromShape);
            } else {
              var j;
              for (j in oppShape) {
                if(oppShape[j].pid == message.hitTo) kill = oppShape[j].isHit(message.hitFromShape);
              }
            }

            // Check if the hit is a kill
            if(kill==true) {
              // Credit the score
              if(message.hitFrom == myShape.pid){
                myShape.plusScore();
              } else {
              var k;
              for(k in oppShape) {
                if(oppShape[k].pid == message.hitFrom) oppShape[k].plusScore();}
              }
            }

            break;}
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
      console.log("loading...");
    };

    playArea = document.getElementById("playArena");
    playArea.height = Ssa.HEIGHT + Ssa.UI_HEIGHT;
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
    playArea.addEventListener("touchmove", function(e) {
      onTouchMove(e);
    }, false); //For player shooting
    playArea.addEventListener("touchend", function(e) {
      onTouchEnd(e);
    }, false); //For playing shooting
    window.addEventListener("devicemotion", function(e) {
      onDeviceMotion(e);
    }, false);
    window.ondevicemotion = function(e) {
      onDeviceMotion(e);
    }
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
    pewPew();
  }

  var onKeyPress = function(e) {
    /* Keycodes:
    38: up arrow      87: W
    40: down arrow    83: S
    37: left arrow    65: A
    39: right arrow   68: D
    */

    switch (e.keyCode) {
      case 87: { // Up/W
        if(upPressed == false) {
          //Set vY to a positive value
        	setTimeout(myShape.move('U'),locallag);

          //console.log("VX = " + myShape.vx + ", VY = " + myShape.vy);
          // Send event to server
          sendToServer({type:"updateVel", id:myShape.serverId, xVel:myShape.vx, yVel:myShape.vy, xPos:myShape.x, yPos:myShape.y});
          upPressed = true;
        }
        break;
      }
      case 83: { // Down/S
        if(downPressed == false) {
          //Set vY to a negative value
          setTimeout(myShape.move('D'),locallag);

          //console.log("VX = " + myShape.vx + ", VY = " + myShape.vy);
          // Send event to server
          sendToServer({type:"updateVel", id:myShape.serverId, xVel:myShape.vx, yVel:myShape.vy, xPos:myShape.x, yPos:myShape.y});
          downPressed = true;
        }
        break;
      }
      case 65: { // Left/A
        if(leftPressed == false) {
          //Set vX to a negative value cause left is -ve
          setTimeout(myShape.move('L'),locallag);

          //console.log("VX = " + myShape.vx + ", VY = " + myShape.vy);
          // Send event to server
          sendToServer({type:"updateVel", id:myShape.serverId, xVel:myShape.vx, yVel:myShape.vy, xPos:myShape.x, yPos:myShape.y});
          leftPressed = true;
        }
        break;
      }
      case 68: { // Right/D
        if(rightPressed == false) {
          //Set vX to a positive value cause left is +ve
          setTimeout(myShape.move('R'),locallag);

          //console.log("VX = " + myShape.vx + ", VY = " + myShape.vy);
          // Send event to server
          sendToServer({type:"updateVel", id:myShape.serverId, xVel:myShape.vx, yVel:myShape.vy, xPos:myShape.x, yPos:myShape.y});
          rightPressed = true;
        }
        break;
      }
      case 38: { // Up
        delay += 50;
        // Send event to server
        sendToServer({type:"delay", delay:delay});
        showMessage("delay", "Delay to Server: " + delay + " ms");
        break;
      }
      case 40: { // Down
        if (delay >= 50) {
            delay -= 50;
            // Send event to server
            sendToServer({type:"delay", delay:delay});
            showMessage("delay", "Delay to Server: " + delay + " ms");
        }
        break;
      }
      case 32: { // Space bar
        pewPew();
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
      case 87: { // Stop moving up
        //myShape.updateVelY(Ssa.MOVESPEED);
    	  setTimeout(myShape.stop('U'),locallag);
        // Send event to server
        sendToServer({type:"updateVel", id:myShape.serverId, xVel:myShape.vx, yVel:myShape.vy, xPos:myShape.x, yPos:myShape.y});
        upPressed = false;
        break;
      }
      case 83: { // Stop moving down
        //myShape.updateVelY(Ssa.MOVESPEED*-1);
    	  setTimeout(myShape.stop('D'),locallag);
        // Send event to server
        sendToServer({type:"updateVel", id:myShape.serverId, xVel:myShape.vx, yVel:myShape.vy, xPos:myShape.x, yPos:myShape.y});
        downPressed = false;
        break;
      }
      case 65: { // Stop moving left
        //myShape.updateVelX(Ssa.MOVESPEED*-1);
        setTimeout(myShape.stop('R'),locallag);
        // Send event to server
        sendToServer({type:"updateVel", id:myShape.serverId, xVel:myShape.vx, yVel:myShape.vy, xPos:myShape.x, yPos:myShape.y});
        leftPressed = false;
        break;
      }
      case 68: { // Stop moving right
        //Set vX to a positive value cause left is +ve
        //myShape.updateVelX(Ssa.MOVESPEED);
    	  setTimeout(myShape.stop('L'),locallag);
        // Send event to server
        sendToServer({type:"updateVel", id:myShape.serverId, xVel:myShape.vx, yVel:myShape.vy, xPos:myShape.x, yPos:myShape.y});
        rightPressed = false;
        break;
      }
    }
  }

  // Touch version of "mouse click" callback above.
  var onTouchEnd = function(e) {
    pewPew();
  }

  var pewPew = function() {
    bullet = myShape.shoot();

    //Send event to server
    sendToServer({type:"Shoot",
      shooter: bullet.shooter,
      x: bullet.x,
      y: bullet.y,
      vx: bullet.vx,
      vy: bullet.vy});
  }

  var gameLoop = function() {
	  
	  if(delay <= 100 ){
		  locallag = delay;
	  }else{
		  locallag = 100;
	  }
	  
	  
    if(myShape!=undefined) {
      myShape.updatePos();
      myShape.deleteInactiveBullets();
      playerBullets = myShape.getBulletList();

      var i;
      for (i in oppShape) {
        oppShape[i].updatePos();
        managedCollisions(playerBullets, oppShape[i]);
      }

      render();
    }
  }


  var managedCollisions = function(playerBullets, shape) {
    var effectiveHeight = 0;
    var effectiveWidth = 0;

    if (shape.type == "circle") {
      effectiveHeight = Ssa.CIRCLE_RADIUS;
      effectiveWidth = Ssa.CIRCLE_RADIUS;
    } else if (shape.type == "square") {
      effectiveHeight = Ssa.SQUARE_LENGTH;
      effectiveWidth = Ssa.SQUARE_LENGTH;
    } else {
      effectiveHeight = Ssa.TRIANGLE_HEIGHT;
      effectiveWidth = Ssa.TRIANGLE_LENGTH;
    }

    // Recangular Collison Detection Algorithm
    playerBullets.forEach(function(bullet){ 
      if (bullet.isActive()) {
        if (((bullet.x < shape.x + effectiveWidth)&&(bullet.x > shape.x - effectiveWidth))
          &&((bullet.y < shape.y + effectiveHeight )&&(bullet.y > shape.y - effectiveHeight))) {
          bullet.kill();
          //console.log("Killing Bullet");
        } 
      }
    });
  }




  var render = function() {
    var context = playArea.getContext("2d");
    // Reset playArea border
    context.clearRect(0, 0, playArea.width, playArea.height);

    // Render the play area
    renderBG(context);

    // Render all the bullets
    renderBullets(context);

    // Render the enemy shapes first
    var id;
    for (id in oppShape) {
      renderShape(oppShape[id], context);
    }

    //Draw myself later so I'll be on top
    renderShape(myShape, context); //Color decided by player

    // Render the UI
    renderUI(context);
  }
  
  var renderBG = function(context) {
    context.fillStyle = Ssa.BG_COLOR;
    context.fillRect(0, 0, playArea.width, playArea.height);
  }

  //Expects a shape object and a string
  var renderShape = function(shape, context) {
    context.fillStyle = shape.shapeColor;

    if (shape.type == "circle") {
      //Circle center should be in corner of bottom-right quadrant
      var circleCenterX = shape.x + Ssa.CIRCLE_RADIUS;
      var circleCenterY = shape.y - Ssa.CIRCLE_RADIUS;

      context.beginPath();
      context.arc(circleCenterX, circleCenterY, Ssa.CIRCLE_RADIUS, 0, Math.PI * 2, true);
      context.closePath();
      context.fill();
    } else if (shape.type == "square") {
      //Starting from top left-hand corner      
      //context.fillRect(shape.x, shape.y, Ssa.SQUARE_LENGTH, Ssa.SQUARE_LENGTH);

      context.beginPath();
      context.moveTo(shape.x, shape.y);
      context.lineTo(shape.x + Ssa.SQUARE_LENGTH, shape.y);
      context.lineTo(shape.x + Ssa.SQUARE_LENGTH, shape.y - Ssa.SQUARE_LENGTH);
      context.lineTo(shape.x, shape.y - Ssa.SQUARE_LENGTH);
      context.lineTo(shape.x, shape.y);
      context.fill();
    } else if (shape.type == "triangle") {
      //Imagine an upright triangle in a square with the base
      //of the triangle as the bottom edge of the square

      //We start from the top left-hand corner and move down to
      //the bottom left-hand corner to begin drawing.
      //Then we draw a line to the top of the triangle
      //Then we draw a line back down to the bottom of the triangle
      var triangleStartX = shape.x;
      var triangleStartY = shape.y - Ssa.TRIANGLE_HEIGHT;

      context.beginPath();
      context.moveTo(triangleStartX, triangleStartY);
      context.lineTo(triangleStartX + Ssa.TRIANGLE_LENGTH / 2,
        triangleStartY + Ssa.TRIANGLE_HEIGHT);
      context.lineTo(triangleStartX + Ssa.TRIANGLE_LENGTH, triangleStartY);
      context.fill();
    } else { //Just use circle for now
      //Circle center should be in corner of bottom-right quadrant
      var circleCenterX = shape.x + Ssa.CIRCLE_RADIUS;
      var circleCenterY = shape.y - Ssa.CIRCLE_RADIUS;

      context.beginPath();
      context.arc(circleCenterX, circleCenterY, Ssa.CIRCLE_RADIUS, 0, Math.PI * 2, true);
      context.closePath();
      context.fill();
    }
  }

  var renderUI = function(context) {
    //Render UI BG
    renderUiBg(context);

    //Render my own panel first, regardless of player #
    renderUiPanel(context, 0, myShape);

    // Render everyone else
    var i;
    var j = 1;
    for(i in oppShape) {
      renderUiPanel(context, (Ssa.WIDTH/4*j), oppShape[i]);
      j++;
    }
  }

  var renderUiBg = function(context) {
    context.fillStyle = Ssa.UI_BG_COLOR;
    context.fillRect(0, Ssa.HEIGHT, Ssa.WIDTH, Ssa.UI_HEIGHT);
  }

  var renderUiPanel = function(context, xOffset, shape) {
    // Show details of player
    var playerName = "PLAYER " + shape.pid;
    var score = shape.score + " LAST HITS";
    var topLeftStartingPosition;

    // Draw "PLAYER X"
    // Note that fillText draws text "bottom right->up", and now "top left->down"
    context.font = Ssa.UI_PLAYER_FONT;
    context.fillStyle = shape.shapeColor;
    topLeftStartingPosition = Ssa.HEIGHT + Ssa.UI_Y_OFFSET + Ssa.UI_TEXT1_SIZE;
    context.fillText(playerName, xOffset+Ssa.UI_X_OFFSET, topLeftStartingPosition);

    // Draw "SCORE Y"
    context.font = Ssa.UI_SCORE_FONT;
    context.fillStyle = Ssa.UI_SCORE_COLOR;
    topLeftStartingPosition = Ssa.HEIGHT + Ssa.UI_Y_OFFSET + Ssa.UI_TEXT1_SIZE + Ssa.UI_LINESPACING + Ssa.UI_TEXT2_SIZE;
    context.fillText(score, xOffset+Ssa.UI_X_OFFSET, topLeftStartingPosition);

    // Draw health boxes
    topLeftStartingPosition = Ssa.HEIGHT + Ssa.UI_Y_OFFSET*2 + Ssa.UI_TEXT1_SIZE + Ssa.UI_LINESPACING*2 + Ssa.UI_TEXT2_SIZE;
    renderHealthBoxes(context, xOffset+Ssa.UI_X_OFFSET, topLeftStartingPosition, shape);
  }

  var renderHealthBoxes = function(context, xOffset, yOffset, shape) {
    // Draw outlines
    var i, boxXStart, boxYStart;
    context.lineWidth = Ssa.UI_HEALTH_BOX2_THICKNESS;
    context.strokeStyle = Ssa.UI_HEALTH_BOX2_COLOR;

    for(i=0; i<shape.maxHitPoints; i++) {
      // For the max health of the shape
      boxXStart = xOffset + i*(Ssa.UI_LINESPACING*4+Ssa.UI_HEALTH_BOX2_WIDTH);
      boxYStart = yOffset;
      context.beginPath();
      context.rect(boxXStart, boxYStart, Ssa.UI_HEALTH_BOX2_WIDTH, Ssa.UI_HEALTH_BOX2_WIDTH);
      context.stroke();
    }
    
    // Draw filled boxes
    context.fillStyle = shape.shapeColor;

    for(i=0; i<shape.hitPoints; i++) {
      // For the current health of the shape
      boxXStart = xOffset + Ssa.UI_HEALTH_BOX2_THICKNESS*0.5 + i*(Ssa.UI_LINESPACING*4+Ssa.UI_HEALTH_BOX1_WIDTH+Ssa.UI_HEALTH_BOX2_THICKNESS);
      boxYStart = yOffset + Ssa.UI_HEALTH_BOX2_THICKNESS*0.5 ;
      context.fillRect(boxXStart, boxYStart, Ssa.UI_HEALTH_BOX1_WIDTH, Ssa.UI_HEALTH_BOX1_WIDTH);
    }
  }

  var renderBullets = function(context) {
    playerBullets.forEach(function(bullet) {
      if (bullet.isActive()) {
        bullet.update();
        bullet.draw(context);
      }
    })
  }

  
  this.start = function() {  
	// Start off with no delay to the server
    delay = 0;
      
    initNetwork();
    initGUI();

    setTimeout(function() {
      sendToServer({type:'newPlayer', shape:shape});
    }, 1000);
    
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