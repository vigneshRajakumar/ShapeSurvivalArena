function Bullet(B) {

  var BULLET_RADIUS = 0.5 //Circle Radius divided by scale 10
  B.active = true;

B.isActive = function(){

  return B.active;
};
 

  B.withinCanvas = function() {
    return B.x >= 0 && B.x <= CANVAS_WIDTH &&
      B.y >= 0 && B.y <= CANVAS_HEIGHT;
  };

  B.draw = function() {
    context.beginPath();
    context.arc(B.x, B.y, BULLET_RADIUS, 0, Math.PI*2, true);
    context.closePath();
    context.fill();
  };

  B.update = function() {
    B.x += B.vx
    B.y += B.vy;

    B.active = B.active && B.withinCanvas();
  };

  return B;
}