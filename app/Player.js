function Player(sid, pid, xPos, yPos, Type){
	//Public variables 
	this.sid;   // Socket id. Used to uniquely identify players via 
                // the socket they are connected from
    this.pid;   // Player id. In this case, 1 or 2 or 3 or 4
    this.Shape;// player's object shape
    this.Type;  
    
    this.lastUpdated; // timestamp of last player update

    //constructor
    this.sid = sid;
    this.pid = pid;
    this.Shape = new Shape(xPos,yPos,Type);
    this.lastUpdated = new Date().getTime();
    this.Type = Type;

    this.getAbility = function() {
      switch(Type) {
    case "circle":
        return "movefaster";
        break;
    case "triangle":
        return "shotfaster";
        break;
    case "square":
    	return "morehitpoint"
    	break;
    default:
        return "not support type";
	}
  }
  
  this.getShape = function() { return Shape; }
}

// For node.js require
global.Player = Player;

// vim:ts=4:sw=4:expandtab
