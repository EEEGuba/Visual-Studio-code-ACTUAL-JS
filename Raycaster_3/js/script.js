//MAIN FILE FROM WHICH ALL OTHERS ARE CALLED
//	<line x1="50" y1="50" x2="200" y2="200" stroke="blue" stroke-width="4" />
//all globals here
const myCanvas = /** @type {HTMLCanvasElement} */ (document.getElementById("content"));
const ctx = /** @type {CanvasRenderingContext2D} */ (myCanvas.getContext("2d"));
const myFloorCanvas= /** @type {HTMLCanvasElement} */ (document.getElementById("floorceilingcanvas"));
const ctf = /** @type {CanvasRenderingContext2D} */ (myFloorCanvas.getContext("2d"));
let mapData = {wallData:undefined,entityData:undefined,playerData:undefined}

mapData.wallData = [{x1:50,y1:50,x2:200,y2:200,material:"blue"},{x1:0,y1:0,x2:50,y2:50,material:"red"}]
const testTexture1 = new Image();
testTexture1.src = "assets/bukit2.png";
//end of globals
let gameScreenSize = {height:600,width:1200}
myCanvas.height = gameScreenSize.height;
myCanvas.width = gameScreenSize.width;
myFloorCanvas.height = gameScreenSize.height
myFloorCanvas.width = gameScreenSize.width

function addWall(){}

