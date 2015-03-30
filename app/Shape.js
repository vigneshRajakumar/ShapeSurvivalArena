var ShapeConstants = {
  MOVESPEED : 0.1, //In pixels
  
  CIRCLE_HP : 100,
  CIRCLE_VMULTIPLIER : 1.3,
  CIRCLE_STRENGTH : 30,
  CIRCLE_RADIUS : 5,
  
  SQUARE_HP : 80,
  SQUARE_VMULTIPLIER : 1.5,
  SQUARE_STRENGTH : 30,
  SQUARE_LENGTH : 10,
  
  TRIANGLE_HP : 80,
  TRIANGLE_VMULTIPLIER : 1.3,
  TRIANGLE_STRENGTH : 40,
  TRIANGLE_HEIGHT : 10,
  TRIANGLE_LENGTH : 10
}


global.ShapeConstants = ShapeConstants;

function Shape(xPos,yPos,t) {
  //Shape properties for everyone
  var that = this;
  
  //Init values
  this.sid; // Socket id. Used to uniquely identify players via the socket they are connected from
  this.pid; // Player id. In this case, 1 or 2 or 3 or 4
  
  this.x = xPos;
  this.y = yPos;
  this.vx = 0;
  this.vy = 0;
  this.type = t;
  this.width;
  this.height;
  this.lastUpdate = new Date().getTime();

  //Bullet list
  var bulletList = [];
  
  //This instance's Shape properties
  this.life;
  this.vMultiplier; //Floating point >1 and <2
  this.strength;
  
  if(that.type=="circle") {
    that.life = ShapeConstants.CIRCLE_HP;
    that.vMultiplier = ShapeConstants.CIRCLE_VMULTIPLIER;
    that.strength = ShapeConstants.CIRCLE_STRENGTH;
    that.width = 2*ShapeConstants.CIRCLE_RADIUS;
    that.height = 2*ShapeConstants.CIRCLE_RADIUS;
  } else if(that.type=="square") {
    that.life = ShapeConstants.SQUARE_HP;
    that.vMultiplier = ShapeConstants.SQUARE_VMULTIPLIER;
    that.strength = ShapeConstants.SQUARE_STRENGTH;
    that.width = ShapeConstants.SQUARE_LENGTH;
    that.height = ShapeConstants.SQUARE_LENGTH;
  } else if(that.type=="triangle") {
    that.life = ShapeConstants.TRIANGLE_HP;
    that.vMultiplier = ShapeConstants.TRIANGLE_VMULTIPLIER;
    that.strength = ShapeConstants.TRIANGLE_STRENGTH;
    that.width = ShapeConstants.TRIANGLE_LENGTH;
    that.height = ShapeConstants.TRIANGLE_HEIGHT;
  } else { //Use circle for now
    that.life = ShapeConstants.CIRCLE_HP;
    that.vMultiplier = ShapeConstants.CIRCLE_VMULTIPLIER;
    that.strength = ShapeConstants.CIRCLE_STRENGTH;
  }
  
  this.isAlive = function() { return that.life>0; }
  
  //Expects a Shape object
  this.isHit = function(s) {
    if(s.type=="circle") {
      that.life -= ShapeConstants.CIRCLE_STRENGTH;
    } else if(s.type=="square") {
      that.life -= ShapeConstants.SQUARE_STRENGTH;
    } else if(s.type=="triangle") {
      that.life -= ShapeConstants.TRIANGLE_STRENGTH;
    } else {
      that.life -= ShapeConstants.CIRCLE_STRENGTH;
    }
  }
  
  this.forceUpdatePos = function(xNew, yNew) {
    that.x = xNew;
    that.y = yNew;
  }
  
  this.updatePos = function() {
    var now = new Date().getTime();
    var tempX = that.x + that.vx * (now-that.lastUpdate) * that.vMultiplier;
    var tempY = that.y - that.vy * (now-that.lastUpdate) * that.vMultiplier;
    
    if(tempX>0 && tempX<(Ssa.WIDTH-ShapeConstants.SQUARE_LENGTH)) {
      that.x = tempX;
    }
    if(tempY>0 && tempY<(Ssa.HEIGHT-ShapeConstants.SQUARE_LENGTH)) {
      that.y = tempY;
    }
    
    that.lastUpdate = now;
  }
  
  this.updateVelX = function(xNew) { that.vx = xNew; }
  this.updateVelY = function(yNew) { that.vy = yNew; }

  this.getBulletList = function(){
    return bulletList;
  }

  this.shoot = function(){
    
    var now = new Date().getTime();
    //Start positon of bullet

    var bulletX = that.x + that.width/2;
    var bulletY = that.y + that.height/2;

    //Bullet speed is 2 times speed of player
    var bulletVX = 2*that.vx;
    var bulletVY = 2*that.vy;

    bulletList.push(new Bullet({
      x: bulletX,
      y: bulletY,
      vx: bulletVX,
      vy: bulletVY
    }));


  }
  
  this.move = function(direction) {    
    if(direction=='U') {
      that.vy += ShapeConstants.MOVESPEED;
    } else if(direction=='D') {
      that.vy -= ShapeConstants.MOVESPEED;
    } else if(direction=='L') {
      that.vx -= ShapeConstants.MOVESPEED;
    } else if(direction=='R') {
      that.vx += ShapeConstants.MOVESPEED;
    } else {
      //Do nothing
    }
    
    if(that.vx>ShapeConstants.MOVESPEED) that.vx = ShapeConstants.MOVESPEED;
    else if(that.vx<ShapeConstants.MOVESPEED*-1) that.vx = ShapeConstants.MOVESPEED*-1;
    
    if(that.vy>ShapeConstants.MOVESPEED) that.vy = ShapeConstants.MOVESPEED;
    else if(that.vy<ShapeConstants.MOVESPEED*-1) that.vy = ShapeConstants.MOVESPEED*-1;
  }
}