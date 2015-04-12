function Player(sid, pid, xPos, yPos, Type){
	//Public variables 
	this.sid;   // Socket id. Used to uniquely identify players via 
                // the socket they are connected from
    this.pid;   // Player id. In this case, 1 or 2 or 3 or 4
    this.Shape;// player's object shape
    this.Type;  
    this.delay; // player's delay 
    
    this.lastUpdated; // timestamp of last player update

    //constructor
    this.sid = sid;
    this.pid = pid;
    this.Shape = new Shape(xPos,yPos,Type);
    this.lastUpdated = new Date().getTime();
    this.Type = Type;
  
    this.getShape = function() { return Shape; }
    
    
    /*
     * priviledge method: getDelay
     *
     * Return the current delay associated with this player.
     * The delay has a random 20% fluctuation.
     */
    this.getDelay = function() {
        var errorPercentage = 20;
        var to = this.delay + errorPercentage*this.delay/100;
        var from = this.delay - errorPercentage*this.delay/100;
        if (this.delay != 0) {
            return Math.floor(Math.random() * (to - from + 1) + from);
        } else {
            return 0;
        }
    }
}

// For node.js require
global.Player = Player;

// vim:ts=4:sw=4:expandtab
