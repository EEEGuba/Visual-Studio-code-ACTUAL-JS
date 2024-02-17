//settings

const fov = 30
const fps = 40
const renderaccuracy = 50 //ammount of blocks per frame
const turnsensitivity = 6 //degrees turning on click of a or d
const steplength = 3 //how far you go after w or s
const renderdistance = 200 //impacts how far away a wall has to be to not appear, much longer distances might slow down the game


//end of settings

let playerpos = { x: 250, y: 240, rotation: 90 }

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
            console.log(playerpos)
            const a = calculateVectorDisplacement(angleCorrector(playerpos.rotation), steplength)
            playerpos.x += a.x
            playerpos.y += a.y
            drawPlayerOnMap()
            testDraw()
            break;

        case "a":

            break;
        case "s":

            break;
        case "d":

            break;
        case "j":
            playerpos.rotation -= turnsensitivity
            playerpos.rotation = angleCorrector(playerpos.rotation)
            break;
        case "l":
            playerpos.rotation += turnsensitivity
            playerpos.rotation = angleCorrector(playerpos.rotation)
            break;
        default:
            break;
    }
    function angleCorrector(angle) {
        if (angle > 359) { return (angle - 360) }
        else if (angle < 0) { return (angle + 359) }
        return (angle)
    }

}
function testDraw() {
    ctx.clearRect(0, 0, myCanvas.height, myCanvas.width)
    const rayResult = rayCastingReturnWall(playerpos, playerpos.rotation, renderdistance)
    if (rayResult == undefined) { return }
    console.log("it went through")
    ctx.fillStyle = rayResult.material
    const wallProportions = Math.round(myCanvas.height / rayResult.length)
    ctx.fillRect(myCanvas.width / 2 - 5, myCanvas.height - wallProportions, 10, wallProportions)
}
function drawPlayerOnMap() {
    drawSquare(playerpos.x, playerpos.y, "magenta", 2, ctm)
}
function drawMap() {
    console.log(mapData)
    ctm.clearRect(0, 0, myMap.height, myMap.width)
    for (let i = 0; i <= (mapData.length) - 1; i++) {
        for (let j = 0; j <= (mapData[i].length) - 1; j++) {
            const element = mapData[i][j];
            drawSquare(element.x, element.y, element.material, 1, ctm)
        };
    }
    drawPlayerOnMap()
}
function rayCastingReturnWall(startingPoint, angle, length) {
    for (let k = 0; k < length; k++) {
        const vectorDisplacement = calculateVectorDisplacement(angle, 1)
        const currentPoint = { x: Math.floor(startingPoint.x + vectorDisplacement.x), y: Math.floor(startingPoint.y + vectorDisplacement.y) }
        for (let i = 0; i <= (mapData.length) - 1; i++) {
            for (let j = 0; j <= (mapData[i].length) - 1; j++) {
                const element = mapData[i][j];
                if (j == 100) { console.log(element.x, currentPoint.x, element.y, currentPoint.y) }
                if (element.x == currentPoint.x && element.y == currentPoint.y) {
                    return { x: element.x, y: element.y, cycleNumber: element.cycleNumber, material: element.material, rayLength: k }
                }
            }

        }
    }
    return undefined
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

function makeLine(startX, startY, endX, endY, material) {
    const drawData = returnLineFromVector(startX, startY, endX, endY, material)
    mapData.push(drawData)
    for (let i = 0; i < drawData.length; i++) {
        drawSquare(drawData[i].x, drawData[i].y, material, 1, ctm);

    }
}
makeLine(400, 400, 100, 100, "blue")
makeLine(100, 100, 400, 100, "red")
makeLine(400, 100, 400, 400, "green")

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
function calculateVectorDisplacement(angle, magnitude) {
    return { x: -magnitude * Math.cos(toRadians(angle)), y: -magnitude * Math.sin(toRadians(angle)) }
}