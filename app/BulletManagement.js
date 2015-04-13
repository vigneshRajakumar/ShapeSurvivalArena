var manageCollisions = function(playerID, shape) {

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
    playerBullets.forEach(function(bullet) {
      if (bullet.isActive()) {
        var xref = bullet.getX();
        var yref = bullet.getY();
        var BULLET_RADIUS = 0.5;

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