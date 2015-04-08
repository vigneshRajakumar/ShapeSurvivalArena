var Ssa = {
	HEIGHT : 500, 				//height of the play area
	WIDTH : 800, 				//width of the play area
	PORT : 5000, 				//server port
	FRAME_RATE : 25,			//game frame rate
	SERVER_NAME : "localhost",	//server name for testing

	BG_COLOR : "#000000",//"#525252",

	UI_HEIGHT : 100,
	UI_Y_OFFSET : 5,
	UI_X_OFFSET : 10,
	UI_HEALTH_BOX1_WIDTH : 20,
	UI_HEALTH_BOX2_WIDTH : 23,
	UI_HEALTH_BOX2_THICKNESS : 3,
	UI_HEALTH_BOX2_COLOR : "#383838",
	UI_PLAYER_FONT : "small-caps bold 24px Arial",
	UI_SCORE_FONT : "small-caps bold 18px Arial",
	UI_SCORE_COLOR : "#ffffff",
	UI_TEXT1_SIZE : 24,
	UI_TEXT2_SIZE : 18,
	UI_LINESPACING : 2,

	UI_BG_COLOR : "#525252",

	Y_POSITION_1 : 100,
	Y_POSITION_2 : 400,
	X_POSITION_1 : 100,
	X_POSITION_2 : 700,
	
	P1_COLOR : "#ff0000",
	P2_COLOR : "#0000ff",
	P3_COLOR : "#00ff00",
	P4_COLOR : "#ff00ff",
	P0_COLOR : "#ffffff", // Undefined player

	// Shape Constants
	MOVESPEED : 0.1, //In pixels
  
  	CIRCLE_HP : 5,
  	CIRCLE_VMULTIPLIER : 1.3,
  	CIRCLE_STRENGTH : 1,
  	CIRCLE_RADIUS : 5,
  
  	SQUARE_HP : 3,
  	SQUARE_VMULTIPLIER : 1.6,
  	SQUARE_STRENGTH : 1,
  	SQUARE_LENGTH : 10,
  
  	TRIANGLE_HP : 3,
  	TRIANGLE_VMULTIPLIER : 1.3,
  	TRIANGLE_STRENGTH : 2,
  	TRIANGLE_HEIGHT : 10,
  	TRIANGLE_LENGTH : 10
}

global.Ssa = Ssa;