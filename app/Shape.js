function Shape(xPos,yPos,t) {
  //Shape properties for everyone
  var that = this;
  
  //Init values
  this.pid = 0; // Player id. In this case, 1 or 2 or 3 or 4
  this.serverId; // ID used to identify with server.
  this.shapeColor = "#ff0000"; // Color to identify the shape. Default is red
  this.init = false;

  this.score = 0;

  this.x = parseInt(xPos);
  this.y = parseInt(yPos);
  this.vx = 0;
  this.vy = 0;
  this.direction = 'U';
  this.type = t.toLowerCase();
  this.width;
  this.height;
  this.lastUpdate = new Date().getTime();

  //Bullet list
  var bulletList = [];
  
  //This instance's Shape properties
  this.vMultiplier; //Floating point >1 and <2
  this.strength;
  this.hitPoints;

  this.initShape = function() {
    if(that.init==true) return 1;

    if(that.type=="circle") {
      that.hitPoints = Ssa.CIRCLE_HP;
      that.vMultiplier = Ssa.CIRCLE_VMULTIPLIER;
      that.strength = Ssa.CIRCLE_STRENGTH;
      that.width = 2*Ssa.CIRCLE_RADIUS;
      that.height = 2*Ssa.CIRCLE_RADIUS;
    } else if(that.type=="square") {
      that.hitPoints = Ssa.SQUARE_HP;
      that.vMultiplier = Ssa.SQUARE_VMULTIPLIER;
      that.strength = Ssa.SQUARE_STRENGTH;
      that.width = Ssa.SQUARE_LENGTH;
      that.height = Ssa.SQUARE_LENGTH;
    } else if(that.type=="triangle") {
      that.hitPoints = Ssa.TRIANGLE_HP;
      that.vMultiplier = Ssa.TRIANGLE_VMULTIPLIER;
      that.strength = Ssa.TRIANGLE_STRENGTH;
      that.width = Ssa.TRIANGLE_LENGTH;
      that.height = Ssa.TRIANGLE_HEIGHT;
    }

    that.updateColor();
    this.maxHitPoints = this.hitPoints;

    that.init = true;
  }

  this.updateColor = function() {
    if(that.pid==1) {
      that.shapeColor = Ssa.P1_COLOR;
    } else if(that.pid==2) {
      that.shapeColor = Ssa.P2_COLOR;
    } else if(that.pid==3) {
      that.shapeColor = Ssa.P3_COLOR;
    } else if(that.pid==4) {
      that.shapeColor = Ssa.P4_COLOR;
    } else {
      that.shapeColor = Ssa.P0_COLOR;
    }
  }
  
  this.isAlive = function() { return that.hitPoints>0; }
  
  //Expects a Shape object
  this.isHit = function(s) {
    // If this shape is already dead, no further hits will deduct health
    // Report as NOT a kill shot
    if(!(that.isAlive())) return false;

    if(s=="circle") {
      that.hitPoints -= Ssa.CIRCLE_STRENGTH;
    } else if(s=="square") {
      that.hitPoints -= Ssa.SQUARE_STRENGTH;
    } else if(s=="triangle") {
      that.hitPoints -= Ssa.TRIANGLE_STRENGTH;
    } else {
      that.hitPoints -= Ssa.CIRCLE_STRENGTH;
    }

    // If this hit kills this shape, reset its health
    if(!(that.isAlive())) {
      that.shapeColor = Ssa.INVUL_COLOR;
      // Create another thread that resets the health of the shape after 3s
      setTimeout(that.resetHealth, 3000);

      return true;
    } else {
      // Just report it as not a kill shot
      return false;
    }
  }

  this.resetHealth = function() {
    if(that.type=="circle") {
      that.hitPoints = Ssa.CIRCLE_HP;
    } else if(that.type=="square") {
      that.hitPoints = Ssa.SQUARE_HP;
    } else if(that.type=="triangle") {
      that.hitPoints = Ssa.TRIANGLE_HP;
    }

    that.updateColor();
  }
  
  this.forceUpdatePos = function(xNew, yNew) {
    that.x = xNew;
    that.y = yNew;
  }
  
  this.updatePos = function() {
    var now = new Date().getTime();
    var tempX = that.x + that.vx * (now-that.lastUpdate) * that.vMultiplier;
    var tempY = that.y - that.vy * (now-that.lastUpdate) * that.vMultiplier;
    
    if(tempX>0 && tempX<(Ssa.WIDTH-Ssa.SQUARE_LENGTH)) {
      that.x = tempX;
    }
    if(tempY>0 && tempY<(Ssa.HEIGHT-Ssa.SQUARE_LENGTH)) {
      that.y = tempY;
    }
    
    that.lastUpdate = now;
  }
  
  this.updateVelX = function(xNew) { that.vx = xNew; }
  this.updateVelY = function(yNew) { that.vy = yNew; }

  this.plusScore = function() { that.score++; }
  this.setScore = function(newScore) { that.score = newScore; }

  this.getBulletList = function(){
    return bulletList;
  }

  this.deleteInactiveBullets = function()
  {
    for(i = 0; i < bulletList.length; i++)
    {
      if(bulletList[i]&&!bulletList[i].isActive()){
        delete bulletList[i];
      }

    }


  }

  this.addBullet = function(bullet)
  {

    bulletList.push(bullet);
  }

  this.shoot = function(){    
    var now = new Date().getTime();
    //Start positon of bullet

    var bulletX = that.x + that.width/2;
    var bulletY = that.y + that.height/2;

    //Bullet speed is 2 times speed of player
    var bulletVX = Ssa.BULLET_SPEED_MUL*that.vx;
    var bulletVY = Ssa.BULLET_SPEED_MUL*that.vy;

    if(bulletVX==0 && bulletVY==0) {
       // If bullet will end up stationary, sample last known direction and fire that way
      if(that.direction=='U') { // Up
        bulletVX = 0;
        bulletVY = Ssa.BULLET_SPEED_MUL*Ssa.MOVESPEED;
      } else if(that.direction=='D') { // Down
        bulletVX = 0;
        bulletVY = Ssa.BULLET_SPEED_MUL*Ssa.MOVESPEED*-1;
      } else if(that.direction=='L') { // Left
        bulletVX = Ssa.BULLET_SPEED_MUL*Ssa.MOVESPEED*-1;
        bulletVY = 0;
      } else { // Right
        bulletVX = Ssa.BULLET_SPEED_MUL*Ssa.MOVESPEED;
        bulletVY = 0;
      }
    }

    bullet = new Bullet(new Bullet({
      shooter: that.pid,
      x: bulletX,
      y: bulletY,
      vx: bulletVX,
      vy: bulletVY
    }));

    bulletList.push(bullet);

    return bullet;
  }
  
  this.move = function(direction) {
    if(direction=='U') {
      that.vy += Ssa.MOVESPEED;
      that.direction = 'U';
    } else if(direction=='D') {
      that.vy -= Ssa.MOVESPEED;
      that.direction = 'D';
    } else if(direction=='L') {
      that.vx -= Ssa.MOVESPEED;
      that.direction = 'L';
    } else if(direction=='R') {
      that.vx += Ssa.MOVESPEED;
      that.direction = 'R';
    } else {
      //Do nothing
    }
    
    if(that.vx>Ssa.MOVESPEED) that.vx = Ssa.MOVESPEED;
    else if(that.vx<Ssa.MOVESPEED*-1) that.vx = Ssa.MOVESPEED*-1;
    
    if(that.vy>Ssa.MOVESPEED) that.vy = Ssa.MOVESPEED;
    else if(that.vy<Ssa.MOVESPEED*-1) that.vy = Ssa.MOVESPEED*-1;
  }

  this.stop = function(direction) {
    if(direction=='U' || direction=='D') {
      that.vy = 0;
    } else if(direction=='L' || direction=='R') {
      that.vx = 0;  
    }
  }
}

global.Shape = Shape;