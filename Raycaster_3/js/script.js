//MAIN FILE FROM WHICH ALL OTHERS ARE CALLED
//	<line x1="50" y1="50" x2="200" y2="200" stroke="blue" stroke-width="4" />
//all globals here
const myCanvas = /** @type {HTMLCanvasElement} */ (document.getElementById("content"));
const ctx = /** @type {CanvasRenderingContext2D} */ (myCanvas.getContext("2d"));
let mapData = {wallData:undefined,entityData:undefined,playerData:undefined}
mapData.wallData = [{x1:50,y1:50,x2:200,y2:200,material:"blue"},{x1:0,y1:0,x2:50,y2:50,material:"red"}]
//end of globals
myCanvas.height = 600;
myCanvas.width = 1200;


function addWall(){}

