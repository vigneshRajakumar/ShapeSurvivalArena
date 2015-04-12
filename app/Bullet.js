
"use strict"

function Bullet(B) {

  var BULLET_RADIUS = 1 //Circle Radius divided by scale 10
  

  //public variables
  this.x;
  this.y;
  this.active;
  this.vx;
  this.vy;
  this.lastUpdate;
  this.shooter;
  //constructor
  var that = this;
  this.active = true;
  this.x = B.x;
  this.y = B.y;
  this.vx = B.vx;
  this.vy = B.vy;
  this.shooter = B.shooter;
  this.lastUpdate = new Date().getTime();

  //console.log(this.vx);

  this.isActive = function() {
    return that.active;
  };

  this.getX = function() {
    return that.x;
  };

  this.getY = function() {
    return that.y;
  };

  this.kill = function() {
    that.active = false;
  };

  this.withinCanvas = function() {
    return that.x >= 0 && that.x <= Ssa.WIDTH &&
      that.y >= 0 && that.y <= Ssa.HEIGHT;
  };

  this.draw = function(context) {
	context.fillStyle = "#ffff00";
    context.beginPath();
    context.arc(that.x, that.y, BULLET_RADIUS, 0, Math.PI * 2, true);
    context.closePath();
    context.fill();
  };

  this.update = function() {
    var now = new Date().getTime();
    that.x += that.vx*(now-that.lastUpdate);
    that.y -= that.vy*(now-that.lastUpdate);

    that.active = that.active && that.withinCanvas();

    that.lastUpdate = now;
  };
}

//If bullet moves out of game board, need to kill it
//to free up memory
/*this.isOutOfBounds = function() {
    if(that.x > Ssa.WIDTH || that.x < 0 || that.y > Ssa.HEIGHT || that.y < 0) {
    
    } else return false;
}*/

//node.js require
global.Bullet = Bullet;