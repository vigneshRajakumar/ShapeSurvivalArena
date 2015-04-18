# shape-survival-arena
SSA is a multiplayer arena survival viewed from the top-down perspective. Players control basic geometry and attempt to score killing blows against other players for score.

## Things you need to run this
- A copy of the source
- NodeJs
- SockJs
- express
- HTML5 Compatible browser

## Getting it to run
Download the archive and unzip it to a desired destination. Fire up a terminal and navigate to the _app_ subdirectory and launch the hosting webserver using _node SsaServer.js_ and connect to _<IP_ADDRESS>:5000/index.html_.

To allow other people to connect to the game, modify the _SERVER_NAME_ variable inside _Ssa.js_ to your own IP. Change the port number too (the default is 5000), if you so desire.