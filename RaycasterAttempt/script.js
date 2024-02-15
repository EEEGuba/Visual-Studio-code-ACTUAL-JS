//settings

const fov = 30
const fps = 40
const renderaccuracy = 50 //ammount of blocks per frame
const turnsensitivity = 6 //degrees turning on click of a or d
const steplength = 1 //how far you go after w or s
const renderdistance = 200 //impacts how far away a wall has to be to not appear, much longer distances might slow down the game


//end of settings

const myCanvas = document.getElementById("content");
myCanvas.height = 500;
myCanvas.width = 1200;
const myMap = document.getElementById("map");
myMap.height = 500;
myMap.width = 500;
const ctm = myMap.getContext("2d");
const ctx = myCanvas.getContext("2d");
const mapData = []
document.addEventListener("keydown", (event) => {
    keySwitchboard(event);
});

function keySwitchboard(event) {
    console.log(event.key)
    switch (event.key) {
        case "w":

            break;

        case "a":

            break;
        case "s":

            break;
        case "d":

            break;
        default:
            break;
    }
}
function drawMap() {
    console.log(mapData)
    ctm.clearRect(0, 0, myMap.height, myMap.width)
    for (let i = 0; i <= (mapData.length)-1; i++) {
        console.log(mapData[0].length)
        for (let j = 0; j <= (mapData[i].length)-1; j++) {
            const element = mapData[i][j];
            drawSquare(element.x, element.y, element.material, 1, ctm)
        };
    }
}
function returnVectorDisplacementByAngle() {

}
function drawSquare(x, y, color, size, canvas) {
    canvas.fillStyle = color
    canvas.fillRect(x, y, size, size)
}
function returnLineFromVector(x0, y0, x1, y1, material) {
    function MapPixel(x, y, cycleNumber, mat) {
        this.x = x
        this.y = y
        this.cycleNumber = cycleNumber
        this.material = mat
    }
    let dx = Math.abs(x1 - x0)
    let dy = Math.abs(y1 - y0)
    let sx = (x0 < x1) ? 1 : -1
    let sy = (y0 < y1) ? 1 : -1
    let dir = dx - dy
    let data = []
    cycleNumber = 1
    while (true) {
        cycleNumber++
        data.push(new MapPixel(x0, y0, cycleNumber, material))
        if (x0 === x1 && y0 === y1) { break }
        let a = 2 * dir
        if (a > -dy) {
            dir -= dy
            x0 += sx
        }
        if (a < dx) {
            dir += dx
            y0 += sy
        }
    }
    return (data)
}

function makeLine(startX,startY,endX,endY,material) {
    const drawData = returnLineFromVector(startX, startY, endX, endY,material)
    mapData.push(drawData)
    for (let i = 0; i < drawData.length; i++) {
        drawSquare(drawData[i].x, drawData[i].y, material, 1, ctm);

    }
}
makeLine(400,400,100,100,"blue")
makeLine(100,100,400,100,"red")
makeLine(400,100,400,400,"green")

/*const cuboid1 = new Cuboid([0,0,0],2,2,2)
objectList.push(cuboid1)
function Cuboid(originPoint, sizex, sizey, sizez) {
    this.originPoint = originPoint;
    this.sizex = sizex
    this.sizey = sizey
    this.sizez= sizez
  }*/

function toRadians(angle) {
    return angle * (Math.PI / 180);
}