
"use strict"

function Bullet(B) {
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

  this.LPF = function(myShape,delay,locallag)
  {
    var euclidean_distance = Math.sqrt(Math.pow((myShape.x - this.x),2) + Math.pow((myShape.y- this.y),2));
    var normal_time = euclidean_distance/Math.sqrt(Math.pow(this.vx,2) + Math.pow(this.vy,2));
    var LPF_time = normal_time  - 2*delay + locallag;
    this.vy = this.vy*(normal_time/LPF_time);
    this.vx = this.vx*(normal_time/LPF_time);

  }


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
    context.arc(that.x, that.y, Ssa.BULLET_RADIUS, 0, Math.PI * 2, true);
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