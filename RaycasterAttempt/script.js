//settings

let fov = 60 //make it even, not odd
let fps = 40
let renderAccuracy = 1200 //ammount of blocks per frame
let turnSensitivity = 3 //degrees turning on click of a or d
let stepLength = 0.3 //how far you go every frame
let renderDistance = 250 //impacts how far away a wall has to be to not appear, much longer distances might slow down the game
let gameSpeed = 1000//lower the number to make it faster 1000 is default
let sprintRate = 10// sprint is this number * regular speed
let speedDampening = 0.05 //how fast you slow down, 0 makes you go on ice, 1 is instant
let maxSpeed = 20
let recoilSeverity = 10
let bounceDampening = 0.5 //0 no bounce, 1 same speed
let gametickPause = false
let noclip = false
//end of settings
let isFiring = false
let currentFrame = 1
const playerVector = { magnitude: 0, angle: 0 }
let playerpos = { x: 250, y: 240, rotation: 90 }
const keyMap = {
    'w': 0,
    'a': 1,
    's': 2,
    'd': 3,
    'j': 4,
    'l': 5,
    ' ': 6,
    'i': 7,
    'k': 8
};
const myCanvas = document.getElementById("content");
myCanvas.height = 500;
let canvasHeight = myCanvas.height
myCanvas.width = 1200;
const myMap = document.getElementById("map");
myMap.height = 500;
myMap.width = 500;
const ctm = myMap.getContext("2d", { alpha: false });
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
    7: { key: "i", pressed: false },
    8: { key: "k", pressed: false }
}

makeLine(100, 100, 400, 400, "material-rainbow", false, "wall")
makeLine(100, 100, 400, 100, "materialverticalblackwhitesinewave", false, "wall")
makeLine(400, 100, 400, 400, "material verticalblacklineonwhite", false, "wall")
makeLine(500, 200, 500, 300, "materialverticalseawave", true, "passThroughMaterial")
makeLine(100, 200, 300, 400, "pink", false, "wall")
makeLine(198, 200, 301, 200, "materialglass", true, "wall")
makeLine(248, 250, 301, 200, "material-glass", true, "wall")
document.addEventListener("keydown", (event) => {
    keySwitchboard(event, true, event.shiftKey);
    if (event.key == " ") { event.preventDefault(); }
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
    if (key.search(/^[wasd jlik]$/g) == 0) {
        const index = keyMap[key];
        controller[index].pressed = isDown;
    }
    if (event.shiftKey || event.key.search(/^[WASD]$/gi == 0)) {
        isShiftPressed = isShiftDown
    }
}
function apply() {
    fov = +document.getElementById("fov").value
    fps = +document.getElementById("fps").value
    renderAccuracy = +document.getElementById("renderAccuracy").value
    turnSensitivity = +document.getElementById("turnSensitivity").value
    stepLength = +document.getElementById("stepLength").value
    renderDistance = +document.getElementById("renderDistance").value
    gameSpeed = +document.getElementById("gameSpeed").value
    sprintRate = +document.getElementById("sprintRate").value
    gametickPause = document.getElementById("gametickPause").checked
    noclip = document.getElementById("noclip").checked
}
let fireCooldown = false
function keyInterpreter(key) {
    switch (key) {

        case "w":
            movement(stepLength, 0)
            break;

        case "a":
            movement(stepLength, 270)
            break;
        case "s":
            movement(stepLength, 180)
            break;
        case "d":
            movement(stepLength, 90)
            break;
        case "j":
            playerpos.rotation = angleCorrector(playerpos.rotation - turnSensitivity)
            break;
        case "l":
            playerpos.rotation = angleCorrector(playerpos.rotation + turnSensitivity)
            break;
        case "i":
            canvasHeight += turnSensitivity * 5
            break;
        case "k":
            canvasHeight -= turnSensitivity * 5
            break;
        case " ":
            let recoilCount = 0
            const randomNumber = (Math.random() * 2 - 1) * recoilSeverity
            const correctPitch = canvasHeight
            movement(0.1 * recoilSeverity, angleCorrector(180))
            function recoil() {
                fireCooldown = true
                if (recoilCount <= 10) {
                    isFiring = true
                    canvasHeight += randomNumber
                    playerpos.rotation += randomNumber * 0.1
                    recoilCount++
                }
                if (recoilCount > 10) {
                    isFiring = false
                    canvasHeight -= randomNumber
                    playerpos.rotation -= randomNumber * 0.1
                    recoilCount++
                }
                if (recoilCount < 21) {
                    setTimeout(() => {
                        recoil()
                    }, gameSpeed / fps / 3)
                }

                else {
                    recoilCount = 0;
                    canvasHeight = correctPitch
                    fireCooldown = false
                    return
                }
            }
            if (!fireCooldown) { recoil() }
        default:
            break;
    }
}
function movement(ammount, angle) {
    let stepDistance = ammount
    if (isShiftPressed && ammount === stepLength) { stepDistance *= sprintRate }
    const vectorChange = calculateVectorDisplacement(angleCorrector(playerpos.rotation + angle), stepDistance)
    const currentPlayerVector = calculateVectorDisplacement(playerVector.angle, playerVector.magnitude)
    const newVector = { x: vectorChange.x + currentPlayerVector.x, y: vectorChange.y + currentPlayerVector.y }
    const newMagVector = returnAngleAndMagnitudeFromZero(newVector)
    playerVector.magnitude = Math.abs(newMagVector.magnitude)
    playerVector.angle = newMagVector.angle
    //if(consolelogprint<20){console.log(playerVector);consolelogprint++}
}
function movementExecuter() {
    if (controller[0].pressed == false && controller[1].pressed == false && controller[2].pressed == false && controller[3].pressed == false) {
        playerVector.magnitude *= 1 - speedDampening
        if (playerVector.magnitude < 0.1) { playerVector.magnitude = 0 }
    }

    if (playerVector.magnitude > maxSpeed) { playerVector.magnitude = maxSpeed }
    let playerShift = calculateVectorDisplacement(playerVector.angle, playerVector.magnitude)
    let wallDetection = wallCollision(playerpos, playerVector.angle, playerVector.magnitude)
    const bounceResult = bounceCalculator(wallDetection, playerShift, noclip)
    playerpos.x += bounceResult.x
    playerpos.y += bounceResult.y
    if (bounceResult.angle != undefined) {
        playerVector.angle = bounceResult.angle
    }
}
function bounceCalculator(wallDetection, shift, ignoreCollision) {
    if (!ignoreCollision && wallDetection != undefined) {
        let wallNormal = undefined
        if (Object.keys(wallDetection).length < 7) {
            wallNormal = normaliseVector({ x: -(wallDetection[0].end.y - wallDetection[0].start.y), y: (wallDetection[0].end.x - wallDetection[0].start.x) })
        }
        else { wallNormal = normaliseVector({ x: -(wallDetection.end.y - wallDetection.start.y), y: (wallDetection.end.x - wallDetection.start.x) }) }
        let dotOfWallNormal = calculateDotProduct(shift, wallNormal)
        if (Math.sign(dotOfWallNormal) <= 0) { wallNormal.x *= -1; wallNormal.y *= -1; dotOfWallNormal = calculateDotProduct(shift, wallNormal) }
        shift.x -= 2 * (wallNormal.x * dotOfWallNormal)
        shift.y -= 2 * (wallNormal.y * dotOfWallNormal)  
        const bounceVector = returnAngleAndMagnitudeFromZero(shift)
        const nextCollision = wallCollision(wallDetection.intersection, bounceVector.angle, bounceVector.magnitude)
        if(nextCollision!=undefined&&nextCollision!=[undefined]){
            console.log(nextCollision)
        if (nextCollision.length<7) {
            const nextBounce = bounceCalculator(nextCollision, calculateVectorDisplacement(bounceVector.angle, bounceVector.magnitude))
            console.log(nextBounce,wallDetection)
           return { x: nextBounce.x, y: nextBounce.y, angle: nextBounce.angle }
        }}
        return { x: shift.x, y: shift.y, angle: bounceVector.angle }

    }
    else {
        return { x: shift.x, y: shift.y, angle: undefined }
    }
}
function normaliseVector(vector) {
    const magVector = returnAngleAndMagnitudeFromZero(vector)
    return { x: vector.x / magVector.magnitude, y: vector.y / magVector.magnitude }
}
function wallCollision(start, angle, magnitude) {
    const collisionResult = rayCastingReturnWall(start, angle, magnitude)
    return collisionResult 
    
}
function angleCorrector(angle) {
    if (angle > 359) { return (angle - (360 * ((angle - (angle % 360)) / 360))) }
    else if (angle < 0) { return (angle + 359 + 360 * ((angle - (angle % 360)) / 360)) }
    return (angle)
}
let currentFrameData = []
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
            if (rayResult[1] == undefined) {
                const distance = Math.cos(toRadians(playerpos.rotation - currentAngle)) * (rayResult.proximity)
                const wallProportionsY = Math.round(myCanvas.height / distance)
                let materialResult = rayResult.material
                if (rayResult.material.search(/(material)[- ]?[a-z]{1,20}/gi) == 0) { materialResult = materialEncyclopedia(rayResult.material.replace(/(material)[- ]?/gi, ""), returnIntersectionDistanceFromOrigin(rayResult, rayResult.intersection)) }
                const currentWallPositionX = (myCanvas.width - currentLine * wallProportionsX) + wallProportionsX / 2
                currentFrameData.push({ xPos: currentWallPositionX - (wallProportionsX / 2), yPos: (canvasHeight / 2) - wallProportionsY, xWidth: wallProportionsX + 1, yWidth: wallProportionsY * 2, material: materialResult, proximity: rayResult.proximity })
            }
            else {

                for (let f = 0; f < rayResult.length; f++) {
                    const currentRayResult = rayResult[f]
                    const distance = Math.cos(toRadians(playerpos.rotation - currentAngle)) * (currentRayResult.proximity)
                    const wallProportionsY = Math.round(myCanvas.height / distance)
                    let materialResult = currentRayResult.material
                    if (currentRayResult.material.search(/(material)[- ]?[a-z]{1,20}/gi) == 0) { materialResult = materialEncyclopedia(currentRayResult.material.replace(/(material)[- ]?/gi, ""), returnIntersectionDistanceFromOrigin(currentRayResult, currentRayResult.intersection)) }
                    const currentWallPositionX = (myCanvas.width - currentLine * wallProportionsX) + wallProportionsX / 2
                    currentFrameData.push({ xPos: currentWallPositionX - (wallProportionsX / 2), yPos: (canvasHeight / 2) - wallProportionsY, xWidth: wallProportionsX + 1, yWidth: wallProportionsY * 2, material: materialResult, proximity: currentRayResult.proximity })

                }

            }
        }
        currentAngle += angleDifference
        currentLine--
    }
    frameExecuter()
}
let consolelogprint = 0
function frameExecuter() {
    currentFrameData.sort((a, b) => b.proximity - a.proximity);
    //i need to make one where the background is 1 color and then you imprint another on that line because them bricks are frame murderers
    currentFrameData.forEach(element => {
        if (isObject(element.material)) {
            const lineLength = element.yWidth
            let currentHeight = element.yPos
            materialApplier: for (let v = 0; v < Object.keys(element.material).length; v++) {
                if (v == 0) {

                    ctx.fillStyle = Object.values(element.material)[0]
                    if (element.material.color !== undefined) {
                        ctx.fillStyle = element.material.color
                    }
                    const calc = (lineLength * parseFloat(Object.keys(element.material)[0]))
                    ctx.fillRect(element.xPos, element.yPos, element.xWidth, calc)
                    currentHeight += calc
                }
                if (v >= Object.keys(element.material).length - 1) {
                    ctx.fillStyle = Object.values(element.material)[v]
                    ctx.fillRect(element.xPos, currentHeight, element.xWidth, lineLength * (1 - parseFloat(Object.keys(element.material)[v])))
                }
                else {
                    const calc = lineLength * ((parseFloat(Object.keys(element.material)[v + 1])) - parseFloat(Object.keys(element.material)[v]))
                    ctx.fillStyle = Object.values(element.material)[v]
                    ctx.fillRect(element.xPos, currentHeight, element.xWidth, calc)
                    currentHeight += calc

                }
            }
        }
        else {
            ctx.fillStyle = element.material
            ctx.fillRect(element.xPos, element.yPos, element.xWidth, element.yWidth)
        }
    });
    currentFrameData = []
    if (isFiring) {
        drawSquare(myCanvas.width / 2 - 80, myCanvas.height - 190, "rgba(255, 175, 0, 0.5)", 160, ctx)
        drawSquare(myCanvas.width / 2 - 40, myCanvas.height - 150, "rgba(255, 0, 0, 0.61)", 80, ctx)

    }
    ctx.fillStyle = "rgb(140, 140, 140)"
    ctx.fillRect(myCanvas.width / 2 - 10, myCanvas.height - 100, 20, 100)
}
function materialEncyclopedia(materialName, wallDistanceFromOrigin) {

    switch (materialName) {
        case "rainbow":
            const r = (Math.sin(wallDistanceFromOrigin + currentFrame / 3)) * 255;
            const g = (Math.sin(wallDistanceFromOrigin + 2 + currentFrame / 3)) * 255;
            const b = (Math.sin(wallDistanceFromOrigin + 4 + currentFrame / 3)) * 255;
            return (`rgb(${r}, ${g}, ${b})`)
        case "blackwhitestripes":
            if (Math.floor(wallDistanceFromOrigin) % 2 < 1) {
                return "black"
            } else {
                return "white"
            }
        case "verticalblackwhitesinewave":
            const waveHeight = getDecimalPart(Math.sin(wallDistanceFromOrigin * 2) / 2 + 0.5).slice(0, 4)
            return { 0: "white", [waveHeight]: "black" }
        case "verticalbricks":
            const wallBlockPos = getDecimalPart(wallDistanceFromOrigin)
            const wallBlockDecisionNum = wallBlockPos.toString().slice(2, 4)
            if (wallBlockDecisionNum % 25 <= 2) { return "black" }
            if (wallBlockDecisionNum < 25) {
                return { 0: "orange", 0.09: "black", 0.10: "orange", 0.19: "black", 0.20: "orange", 0.29: "black", 0.30: "orange", 0.39: "black", 0.40: "orange", 0.49: "black", 0.50: "orange", 0.59: "black", 0.60: "orange", 0.69: "black", 0.70: "orange", 0.79: "black", 0.80: "orange", 0.89: "black", 0.90: "orange", 0.99: "black" }
            }
            if (wallBlockDecisionNum > 50 && wallBlockDecisionNum < 75) {
                return { 0: "orange", 0.09: "black", 0.10: "orange", 0.19: "black", 0.20: "orange", 0.29: "black", 0.30: "orange", 0.39: "black", 0.40: "orange", 0.49: "black", 0.50: "orange", 0.59: "black", 0.60: "orange", 0.69: "black", 0.70: "orange", 0.79: "black", 0.80: "orange", 0.89: "black", 0.90: "orange", 0.99: "black" }
            }
            return { 0: "orange", 0.04: "black", 0.05: "orange", 0.14: "black", 0.15: "orange", 0.24: "black", 0.25: "orange", 0.34: "black", 0.35: "orange", 0.44: "black", 0.45: "orange", 0.54: "black", 0.55: "orange", 0.64: "black", 0.65: "orange", 0.74: "black", 0.75: "orange", 0.84: "black", 0.85: "orange", 0.94: "black", 0.95: "orange" }

        case "glass":
            if (getDecimalPart(wallDistanceFromOrigin) > 0.94) {
                return "black"
            }
            return "rgba(0,0,255,0.1)"

        case "verticalblacklineonwhite":
            return { 0: "white", 0.33: "gray", 0.66: "black" }
        case "verticalseawave":
            const calc = (Math.sin(wallDistanceFromOrigin * 2 + currentFrame / 10) / 2 + 0.5 / (wallDistanceFromOrigin * 0.1))

            if (calc > 1) { return "rgba(0,0,0,0)" }
            const waveSize = getDecimalPart(calc).slice(0, 4)
            return { 0: "rgba(0,0,0,0)", [waveSize - 0.1]: "rgba(0,0,150,0.1)", [waveSize]: "rgba(0,0,200,0.4)" }
        case "verticalbluby": //WIP
            const singleBlock = (getDecimalPart(wallDistanceFromOrigin)) * 4
            // if(singleBlock>0.95){return "black"}
            const fish = getDecimalPart((singleBlock - 0.1) * 2 * singleBlock + 0.1)
            return { 0: "rgba(0,0,0,0)", [fish]: "lightblue", [1 - fish]: "rgba(0,0,0,0)" }
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
function returnAngleAndMagnitudeFromZero(vector) {
    //cartesian->polar m = √(x² + y²) and θ = arccos(x / m), painfull 
    const m = Math.sqrt(vector.x * vector.x + vector.y * vector.y)
    return { magnitude: m, angle: toDegrees(Math.atan2(vector.y, vector.x)) + 180 }
}
let animcount = 0
function testAnim() {
    if (animcount != 0) {
        const animationAdress = vectorMapData.findIndex(i => i.wallFunction == "animation1")
        if (animationAdress >= 0) { vectorMapData.splice(animationAdress, 1), mapData.splice(animationAdress, 1) }
        if (consolelogprint < 20) { console.log(animationAdress); consolelogprint++ }
    }

    makeLine(0, animcount, 500, animcount, "red", false, "animation1")
    animcount++
    if (animcount == 300) { console.log(vectorMapData) }
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
                drawSquare(a.x, a.y, "white", 2, ctm)
            }
        }
    });
    if (relevantVectorMapData == [] || relevantVectorMapData[0] == undefined) { return undefined }
    relevantVectorMapData.sort((a, b) => a.proximity - b.proximity);
    if (relevantVectorMapData[2] == undefined) { return relevantVectorMapData[0] }

    //   if(a!==0&&a!==undefined){relevantVectorMapData[0].intersection = a}
    if (!relevantVectorMapData[0].isSeeThrough) { return relevantVectorMapData[0] }
    relevantVectorMapData.forEach(function (element, index) {
        if (!relevantVectorMapData[index + 1] == [undefined]/*undefined doesnt work, only [undefined], i love JS*/) {
            if (Math.abs(element.proximity - relevantVectorMapData[index + 1].proximity) < 1) {
                relevantVectorMapData.splice(index, 1)
            }
        }
        //if (consolelogprint < 20) {console.log(relevantVectorMapData); consolelogprint++}
    });

    let returnMapData = []
    for (let r = 0; r < relevantVectorMapData.length; r++) {
        returnMapData.push(relevantVectorMapData[r])
        if (!relevantVectorMapData[r].isSeeThrough || relevantVectorMapData[r + 1] == undefined) {
            return (returnMapData)
        }
    }
}
function drawSquare(x, y, color, size, canvas) {
    canvas.fillStyle = color
    canvas.fillRect(x, y, size, size)
}
function returnLineFromVector(x0, y0, x1, y1, material, isSeeThrough, wallFunction) {
    vectorMapData.push(new MapVector(x0, y0, x1, y1, material, isSeeThrough, wallFunction))
    let dx = Math.abs(x1 - x0)
    let dy = Math.abs(y1 - y0)
    let sx = (x0 < x1) ? 1 : -1
    let sy = (y0 < y1) ? 1 : -1
    let dir = dx - dy
    let data = []
    while (true) {
        data.push(new MapPixel(x0, y0))

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
function makeLine(startX, startY, endX, endY, material, isSeeThrough, wallFunction) {
    const drawData = returnLineFromVector(startX, startY, endX, endY, material, isSeeThrough, wallFunction)

    mapData.push(drawData)
    for (let i = 0; i < drawData.length; i++) {
        drawSquare(drawData[i].x, drawData[i].y, material, 1, ctm);

    }
}
function MapVector(x0, y0, x1, y1, material, isSeeThrough, wallFunction) {
    this.start = { x: x0, y: y0 }
    this.end = { x: x1, y: y1 }
    this.material = material
    this.isSeeThrough = isSeeThrough
    this.wallFunction = wallFunction
}
function MapPixel(x, y) {
    this.x = x
    this.y = y
    this.material = "brown"
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
    const perpendicularVector = { x: -absoluteVector.y, y: absoluteVector.x }
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
    consolelogprint = 0
}
let count = 0
function gameClock() {
    //   if(animcount<500){testAnim()}
    moveMaker()
    movementExecuter()
    drawMap()
    drawPlayerOnMap()
    drawFrame()
    if (!gametickPause) { currentFrame++ }
    setTimeout(() => {
        gameClock()
    }, gameSpeed / fps);

}


gameClock()
function isObject(value) {
    //I ripped this function from https://bobbyhadz.com/blog/javascript-check-if-value-is-object, its why it doesnt look like my code
    return (
        typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value)
    );
}
function getDecimalPart(x) {
    if (Number.isInteger(x)) {
        return 0;
    }

    let string = x.toString()
    return string.replace(/^(.*)\./, "0.")
}

function toRadians(angle) {
    return angle * (Math.PI / 180);
}
function toDegrees(angle) {
    return angle * (180 / Math.PI)
}
//console.log(returnTrueIfPointsOnSameVectorSide(vectorMapData[0],{x:160,y:150},{x:370,y:380}))


