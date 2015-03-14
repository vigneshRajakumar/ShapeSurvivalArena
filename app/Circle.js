
function PlayerCircle(){

//Private Variables
	var life = 100;
	var speed = 30;
	var hitpower = 30;

//Public Variables


	
	this.x = 0;
	this.y = 0;
	this.vx = 0;
	this.vy = 0;


//Public Functions
this.identify = function()
{
	return 'Circle';
}

this.isAlive = function(){

	return (life>0);
}

this.isBeingHit = function(hitter)
{
	Hitter = hitter.identify();
	HitPower =
	switch(Hitter)
	{
		case 'circle':
		hitpower = 20;
		break;

		case 'triangle':
		hitpower = 40;
		break;

		case 'square':
		hitpower = 30;
		break;

	}

	reduceLife(hitPower);

}

this.updateVelocity = function(vyNew,vxNew)
{
that.vy = vyNew;
that.vx = vxNew;

}

this.updatePositon = function(yNew,xNew)
{
that.y = yNew;
that.x = xNew;

}
//Private Functions

var reduceLife = function(hitpower)
{
	life-= hitpower;
}
	
var vanish = function()
{
	;
}

}