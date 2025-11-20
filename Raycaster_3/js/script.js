//MAIN FILE FROM WHICH ALL OTHERS ARE CALLED
//	<line x1="50" y1="50" x2="200" y2="200" stroke="blue" stroke-width="4" />

//settings

let fov = 60; //make it even, not odd
let fps = 40;
let renderAccuracy = 300; //ammount of blocks per frame
let turnSensitivity = 3; //degrees turning on click of a or d
let stepLength = 1; //how far you go every frame
let renderDistance = 250; //impacts how far away a wall has to be to not appear, much longer distances might slow down the game
let gameSpeed = 1000;//lower the number to make it faster 1000 is default
let sprintRate = 10;// sprint is this number * regular speed
let speedDampening = 0.1; //how fast you slow down, 0 makes you go on ice, 1 is instant
let maxSpeed = 5;
let recoilSeverity = 1;
let bounceDampening = 0.9; //0 no bounce, 1 same speed
let gametickPause = false;
let noclip = false;
//end of settings
//all globals here
let isShiftPressed = false;
let currentFrame = 1;
const myCanvas = /** @type {HTMLCanvasElement} */ (document.getElementById("content"));
const ctx = /** @type {CanvasRenderingContext2D} */ (myCanvas.getContext("2d"));
const myFloorCanvas = /** @type {HTMLCanvasElement} */ (document.getElementById("floorceilingcanvas"));
const ctf = /** @type {CanvasRenderingContext2D} */ (myFloorCanvas.getContext("2d"));
let mapData = { 
    wallData: [{ x1: 50, y1: 50, x2: 200, y2: 200, material: "blue" }, { x1: 0, y1: 0, x2: 50, y2: 50, material: "red" },{ x1: 0, y1: 0, x2: 200, y2: 200, material: "green" }],
    entityData: undefined, 
    playerData: { location: { x: 500, y: 500 }, velocity: { magnitude: 0, azimuth: 0 }, azimuth: 90/*degrees not radians*/ } 
}

const testTexture1 = new Image();
testTexture1.src = "assets/bukit2.png";
const missingTexture = new Image();
missingTexture.src = "assets/missing_textures.png";
//end of globals

let gameScreenSize = { height: 600, width: 1200 }
myCanvas.height = gameScreenSize.height;
myCanvas.width = gameScreenSize.width;
myFloorCanvas.height = gameScreenSize.height
myFloorCanvas.width = gameScreenSize.width

function addWall() { }
mainUpdateClock()
function mainUpdateClock() {
    //   if(animcount<500){testAnim()}
    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height)
    ctx.fillStyle = "red"
    moveMaker();
    playerMovementExecuter();
    ctx.fillRect(1+mapData.playerData.location.x, 1+mapData.playerData.location.y, 2, 2)
    ctx.fillStyle = "green"
    const prediction = addtwo2DVectors(calculateVectorDisplacement(mapData.playerData.azimuth,10), mapData.playerData.location)
    ctx.fillRect(1+prediction.x, 1+prediction.y, 2, 2)
    //console.log(mapData.playerData.location.x,mapData.playerData.location.y,mapData.playerData.velocity.magnitude,mapData.playerData.velocity.azimuth,mapData.playerData.azimuth)
    //drawWalls();
    //drawOrCheckFloors();
    if (!gametickPause) {
        currentFrame++;
    }
    setTimeout(mainUpdateClock, gameSpeed / fps);
}
