//settings

const fov = 60 //make it even, not odd
const fps = 40
const renderAccuracy = 1200 //ammount of blocks per frame
const turnSensitivity = 3 //degrees turning on click of a or d
const stepLength = 0.2 //how far you go every frame
const renderDistance = 200 //impacts how far away a wall has to be to not appear, much longer distances might slow down the game
const gameSpeed = 1000//lower the number to make it faster 1000 is default
const sprintRate = 10// sprint is this number * regular speed

//end of settings
let frameCount = 0
let playerpos = { x: 250, y: 240, rotation: 90 }
const keyMap = {
    'w': 0,
    'a': 1,
    's': 2,
    'd': 3,
    'j': 4,
    'l': 5,
    ' ': 6
};
const myCanvas = document.getElementById("content");
myCanvas.height = 500;
myCanvas.width = 1200;
const myMap = document.getElementById("map");
myMap.height = 500;
myMap.width = 500;
const ctm = myMap.getContext("2d");
const ctx = myCanvas.getContext("2d");
const mapData = []
const vectorMapData = []
let isShiftPressed = false
const controller = {
    0: { key: "w", pressed: false },
    1: { key: "a", pressed: false },
    2: { key: "s", pressed: false },
    3: { key: "d", pressed: false },
    4: { key: "j", pressed: false },
    5: { key: "l", pressed: false },
    6: { key: " ", pressed: false },
}
document.addEventListener("keydown", (event) => {
    keySwitchboard(event, true, event.shiftKey);
});
document.addEventListener("keyup", (event) => {
    keySwitchboard(event, false, event.shiftKey);
});
function moveMaker() {
    for (let i = 0; i < Object.keys(controller).length; i++) {
        if (controller[i].pressed) { keyInterpreter(controller[i].key) }
    }
}
function keySwitchboard(event, isDown, isShiftDown) {
    const key = event.key.toLowerCase()
    if (key.search(/^[wasd jl]$/g) == 0) {
        const index = keyMap[key];
        controller[index].pressed = isDown;
    }
    if (event.shiftKey || event.key.search(/^[WASD]$/gi == 0)) {
        isShiftPressed = isShiftDown
    }
}

function keyInterpreter(key) {
    switch (key) {

        case "w":
            tempMovement(0)
            break;

        case "a":
            tempMovement(270)
            break;
        case "s":
            tempMovement(180)
            break;
        case "d":
            tempMovement(90)
            break;
        case "j":
            playerpos.rotation -= turnSensitivity
            playerpos.rotation = angleCorrector(playerpos.rotation)
            break;
        case "l":
            playerpos.rotation += turnSensitivity
            playerpos.rotation = angleCorrector(playerpos.rotation)
            break;
        default:
            break;
    }
}
function tempMovement(angle) {
    let stepDistance = stepLength
    if (isShiftPressed) { stepDistance *= sprintRate }
    const a = calculateVectorDisplacement(angleCorrector(playerpos.rotation + angle), stepDistance)
    playerpos.x += a.x
    playerpos.y += a.y
}
function angleCorrector(angle) {
    if (angle > 359) { return (angle - 360) }
    else if (angle < 0) { return (angle + 359) }
    return (angle)
}

function drawFrame() {
    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height)
    const wallProportionsX = Math.ceil(myCanvas.width / renderAccuracy)
    const angleEnd = playerpos.rotation + fov / 2
    const angleDifference = fov / renderAccuracy
    let currentAngle = playerpos.rotation - fov / 2
    let currentLine = renderAccuracy
    while (currentAngle < angleEnd) {


        const rayResult = rayCastingReturnWall(playerpos, currentAngle, renderDistance)
        if (rayResult !== undefined) {
            ctx.fillStyle = rayResult.material
            if (rayResult.material.search(/(material)[- ]?[a-z]{1,20}/gi) == 0) { ctx.fillStyle = materialEncyclopedia(rayResult.material.replace(/(material)[- ]?/gi, ""), returnIntersectionDistanceFromOrigin(rayResult, rayResult.intersection)) }
            const distance = Math.cos(toRadians(playerpos.rotation - currentAngle)) * (rayResult.proximity)
            const wallProportionsY = Math.round(myCanvas.height / distance)
            const currentWallPositionX = (myCanvas.width - currentLine * wallProportionsX) + wallProportionsX / 2

            ctx.fillRect(currentWallPositionX - (wallProportionsX / 2), (myCanvas.height / 2) - wallProportionsY, wallProportionsX + 1, wallProportionsY * 2)
        }
        currentAngle += angleDifference
        currentLine--
    }
    ctx.strokeText(`Frame: ${frameCount}`, 10, 10, 200)
}
function materialEncyclopedia(materialName, wallDistanceFromOrigin) {

    switch (materialName) {
        case "rainbow":
            const r = (Math.sin(wallDistanceFromOrigin)) * 255;
            const g = (Math.sin(wallDistanceFromOrigin + 2)) * 255;
            const b = (Math.sin(wallDistanceFromOrigin + 4)) * 255;
            return (`rgb(${r}, ${g}, ${b})`)
        case "blackwhitestripes":
            if (Math.floor(wallDistanceFromOrigin) % 2 < 1) {
                return "black"
            } else {
                return "white"
            }
        default:
            break;
    }
}
function returnIntersectionDistanceFromOrigin(wallVector, intersectionPoint) {
    return (Math.sqrt((wallVector.start.x - intersectionPoint.x) * (wallVector.start.x - intersectionPoint.x) + (wallVector.start.y - intersectionPoint.y) * (wallVector.start.y - intersectionPoint.y)))
}
function drawPlayerOnMap() {
    drawSquare(playerpos.x, playerpos.y, "magenta", 2, ctm)
}
function drawMap() {

    ctm.clearRect(0, 0, myMap.height, myMap.width)
    for (let i = 0; i <= (mapData.length) - 1; i++) {
        for (let j = 0; j <= (mapData[i].length) - 1; j++) {
            const element = mapData[i][j];
            drawSquare(element.x, element.y, element.material, 1, ctm)
        };
    }
}
function rayCastingReturnWall(startingPoint, angle, length) {
    const relevantVectorMapData = []
    let a = 0
    vectorMapData.forEach(element => {
        const calculatedDisplacement = calculateVectorDisplacement(angle, length)
        if (!returnTrueIfPointsOnSameVectorSide(element, startingPoint, { x: startingPoint.x + calculatedDisplacement.x, y: startingPoint.y + calculatedDisplacement.y })) {
            a = findIntersection(element, { start: { x: startingPoint.x, y: startingPoint.y }, end: { x: startingPoint.x + calculatedDisplacement.x, y: startingPoint.y + calculatedDisplacement.y } })
            if (a !== undefined) {
                const distanceFromPoint = Math.sqrt((a.x - startingPoint.x) * (a.x - startingPoint.x) + (a.y - startingPoint.y) * (a.y - startingPoint.y))
                element.proximity = distanceFromPoint
                relevantVectorMapData.push(element)
                element.intersection = a

                relevantVectorMapData.push(element)
                drawSquare(a.x, a.y, "black", 2, ctm)
            }
        }
    });
    if (relevantVectorMapData == []) { return undefined }
    relevantVectorMapData.sort((a, b) => a.proximity - b.proximity);
    //   if(a!==0&&a!==undefined){relevantVectorMapData[0].intersection = a}
    return (relevantVectorMapData[0])
}

function drawSquare(x, y, color, size, canvas) {
    canvas.fillStyle = color
    canvas.fillRect(x, y, size, size)
}
function returnLineFromVector(x0, y0, x1, y1, material) {
    vectorMapData.push(new MapVector(x0, y0, x1, y1, material))
    let dx = Math.abs(x1 - x0)
    let dy = Math.abs(y1 - y0)
    let sx = (x0 < x1) ? 1 : -1
    let sy = (y0 < y1) ? 1 : -1
    let dir = dx - dy
    let data = []
    while (true) {
        data.push(new MapPixel(x0, y0, material))

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
function MapVector(x0, y0, x1, y1, material) {
    this.start = { x: x0, y: y0 }
    this.end = { x: x1, y: y1 }
    this.material = material
}
function MapPixel(x, y, mat) {
    this.x = x
    this.y = y
    this.material = mat
}
makeLine(100, 100, 400, 400, "material-rainbow")
makeLine(100, 100, 400, 100, "materialblackwhitestripes")
makeLine(400, 100, 400, 400, "green")
makeLine(100,200,300,400,"pink")


function toRadians(angle) {
    return angle * (Math.PI / 180);
}
function calculateVectorDisplacement(angle, magnitude) {
    return { x: -magnitude * Math.cos(toRadians(angle)), y: -magnitude * Math.sin(toRadians(angle)) }
}
function calculateDotProduct(a, b) {
    return (a.x * b.x + a.y * b.y)
}
function returnTrueIfPointsOnSameVectorSide(vector, pointA, pointB) {
    const absoluteVector = { x: vector.end.x - vector.start.x, y: vector.end.y - vector.start.y }
    const absolutePointA = { x: pointA.x - vector.start.x, y: pointA.y - vector.start.y }
    const absolutePointB = { x: pointB.x - vector.start.x, y: pointB.y - vector.start.y }
    let perpendicularVector = { x: -absoluteVector.y, y: absoluteVector.x }
    if (Math.sign(calculateDotProduct(perpendicularVector, absolutePointA)) == Math.sign(calculateDotProduct(perpendicularVector, absolutePointB))) {
        return true
    }
    return false
}
function findIntersection(vector1, vector2) {
    let denominator = ((vector2.end.y - vector2.start.y) * (vector1.end.x - vector1.start.x)) - ((vector2.end.x - vector2.start.x) * (vector1.end.y - vector1.start.y))
    let numerator1 = ((vector2.end.x - vector2.start.x) * (vector1.start.y - vector2.start.y)) - ((vector2.end.y - vector2.start.y) * (vector1.start.x - vector2.start.x))
    let numerator2 = ((vector1.end.x - vector1.start.x) * (vector1.start.y - vector2.start.y)) - ((vector1.end.y - vector1.start.y) * (vector1.start.x - vector2.start.x))

    if (denominator == 0 && numerator1 == 0 && numerator2 == 0) {
        return undefined
    }

    if (denominator == 0) {
        return undefined
    }

    let r = numerator1 / denominator
    let s = numerator2 / denominator

    if (r >= 0 && r <= 1 && s >= 0 && s <= 1) {
        let intersectionX = vector1.start.x + (r * (vector1.end.x - vector1.start.x))
        let intersectionY = vector1.start.y + (r * (vector1.end.y - vector1.start.y))
        return { x: intersectionX, y: intersectionY }
    }

    return undefined
}
function printData() {
    console.log(isShiftPressed)
}
/*
function keyCleaner(){
    if (controller[keyMap['Shift']].pressed){
    for (let i = 0; i < Object.keys(controller).length; i++) {
        controller[i].pressed = false
 
    }}
}*/
let count = 0
function gameClock() {
    frameCount++
    moveMaker()
    drawMap()
    drawPlayerOnMap()
    drawFrame()
    // keyCleaner()

    setTimeout(() => {
        gameClock()
    }, gameSpeed / fps);
}


gameClock()

//console.log(returnTrueIfPointsOnSameVectorSide(vectorMapData[0],{x:160,y:150},{x:370,y:380}))