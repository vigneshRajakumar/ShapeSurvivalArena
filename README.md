# ShapeSurvivalArena
SSA is a multiplayer, round-based dual-stick shooter game multiplayer shooter viewed from top-down. Players control a ship that looks like basic geometry (triangles, circles, etc.) and compete with each other to see who survives last.

Before each round, players choose one of X different shapes and each shape has different attributes (e.g. triangles can move faster, circles can shoot further, etc.). Players are then given Y number of lives per round and can shoot each other while avoiding pitfalls and traps randomly placed by the server.

## Things you need to run this
- A copy of the source
- NodeJs
- SockJs
- express
- HTML5 Compatible browser

## Getting it to run
Download the archive and unzip it to a desired destination. Fire up a terminal and navigate to the _app_ subdirectory and launch the hosting webserver using _node SsaServer.js_ and connect to _IP_ADDRESS:5000/index.html_.

To allow other people to connect to the game, modify the _SERVER_NAME_ variable inside _Ssa.js_ to your own IP. Change the port number too (the default is 5000), if you so desire.
