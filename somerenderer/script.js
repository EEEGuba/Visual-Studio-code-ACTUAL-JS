//settings
const movementSpeed = 10
const turnSensitivity = 6
const renderDistance = 100
const fov = 50

//end of settings

const canvas = document.getElementById("content");
canvas.width = 500;
canvas.height = 500;
const ctx = canvas.getContext("2d");

let pointlist = [{ order: 1, x: 0, y: 0, z: 0 }]
let playerpos = { x: 0, y: 0, z: 0 }
let playerrot = { pitch: 90, yaw: 0 }

for (i = 1; i < 21; i++) {
    addPoint()
}

function keyLogger() {
    commandcenter(event.key)
}

//findVisionAngle

function turning(key) {
    switch (key) {
        case "j":
            playerrot.pitch += turnSensitivity
            break;
        case "k":
            playerrot.yaw -= turnSensitivity
            break;
        case "u":
            playerrot.pitch -= turnSensitivity
            break;
        case "h":
            playerrot.yaw += turnSensitivity
            break;
        case "y":
    }
    if (playerrot.pitch >= 180) { playerrot.pitch = 180 }
    else if (playerrot.pitch <= 0) { playerrot.pitch = 0 }
    if (playerrot.yaw > 359) { playerrot.yaw -= 360 }
    else if (playerrot.yaw < 0) { playerrot.yaw += 359 }
    console.log(playerrot)
}
function movement(key) {
    if (key == "w") {
        const result = calculateGridDisplacement(movementSpeed, playerpos, playerrot)
        playerpos = result
        console.log(result)

    }
}
function commandcenter(key) {
    if (key == "u" || key == "h" || key == "j" || key == "k") {
        turning(key)
    }
    else if (key == "w" || key == "a" || key == "s" || key == "d") {
        movement(key)
    }
}
function drawvector(beginx, beginy, endx, endy, color) {
    ctx.fillStyle = color
    ctx.beginPath();
    ctx.moveTo(beginx, beginy);
    ctx.lineTo(endx, endy);
    ctx.closePath();
    ctx.stroke();
}

function addPoint() {
    console.log(pointlist.length)
    console.log(pointlist[pointlist.length - 1])
    const a = Math.floor(Math.random() * 10);
    const b = Math.floor(Math.random() * 10);
    const c = Math.floor(Math.random() * 10);
    pointlist.push({ order: pointlist.length + 1, x: a, y: b, z: c })
}

function generateVisionPyramid() {

    const fovAngle = toRadians(fov / 2)

    const pitch = playerrot.pitch
    const yaw = playerrot.yaw
    const heightVectordistance = renderDistance
    const heightVector = calculateGridDisplacement(heightVectordistance, playerpos, playerrot)
    //convert to an absolute vector 
    const heightVectorFromZero = subtractVectors(heightVector, playerpos)

    //vision pyramid height vector = pyramid height
    //calculate side vectors perpendicular to the pyramid height, no z axis, since no rotation of sight

    const sideheight = heightVectordistance / Math.cos(fovAngle)
    const sidevectorlength = Math.sqrt((sideheight * sideheight) - (heightVectordistance * heightVectordistance))

    //figuring out coords for sidevectors, z is flat, since no rotation

    /*need to do sightvector-playerpos to find Angle, then +90 and -90 degrees*/
    const heightVectorAngle = (Math.atan((heightVectorFromZero.x) / (heightVectorFromZero.y)) * 180) / Math.PI;
    let rightBaseVectorAngle = heightVectorAngle + 90
    let leftBaseVectorAngle = heightVectorAngle - 90
    if (rightBaseVectorAngle > 359) { rightBaseVectorAngle -= 360 }
    if (leftBaseVectorAngle < 0) { leftBaseVectorAngle += 359 }
    const rightBaseVectorxy = calculateSideVectors(rightBaseVectorAngle, sidevectorlength)
    const leftBaseVectorxy = calculateSideVectors(leftBaseVectorAngle, sidevectorlength)
    const rightBaseVector = { x: rightBaseVectorxy.x + heightVector.x, y: rightBaseVectorxy.y + heightVector.y, z: heightVector.z }
    const leftBaseVector = { x: leftBaseVectorxy.x + heightVector.x, y: leftBaseVectorxy.y + heightVector.y, z: heightVector.z }
    //calculate sidevector as beeing from <0 0 0> 
    const rightBaseVectorFromZero = subtractVectors(rightBaseVector, heightVector)
    const leftBaseVectorFromZero = subtractVectors(leftBaseVector, heightVector)
    //now vector cross product from height and side vector
    const upBaseVectorCrossProduct = calculateVectorCrossProduct(heightVectorFromZero, rightBaseVectorFromZero)
    const downBaseVectorCrossProduct = calculateVectorCrossProduct(rightBaseVectorFromZero, heightVectorFromZero)
    const upBaseVectorCrossProductFromZero = subtractVectors(upBaseVectorCrossProduct, heightVector)
    const downBaseVectorCrossProductFromZero = subtractVectors(downBaseVectorCrossProduct, heightVector)
    const upUnitVector = Math.sqrt(upBaseVectorCrossProductFromZero.x * upBaseVectorCrossProductFromZero.x + upBaseVectorCrossProductFromZero.y * upBaseVectorCrossProductFromZero.y + upBaseVectorCrossProductFromZero.z * upBaseVectorCrossProductFromZero.z)
    const downUnitVector = Math.sqrt(downBaseVectorCrossProductFromZero.x * downBaseVectorCrossProductFromZero.x + downBaseVectorCrossProductFromZero.y * downBaseVectorCrossProductFromZero.y + downBaseVectorCrossProductFromZero.z * downBaseVectorCrossProductFromZero.z)
    const upBaseVectorMultiplier = sidevectorlength / upUnitVector
    const downBaseVectorMultiplier = sidevectorlength / downUnitVector
    const upBaseVectorFromZero = { x: upBaseVectorMultiplier * upBaseVectorCrossProductFromZero.x, y: upBaseVectorMultiplier * upBaseVectorCrossProductFromZero.y, z: upBaseVectorMultiplier * upBaseVectorCrossProductFromZero.z }
    const downBaseVectorFromZero = { x: downBaseVectorMultiplier * downBaseVectorCrossProductFromZero.x, y: downBaseVectorMultiplier * downBaseVectorCrossProductFromZero.y, z: downBaseVectorMultiplier * downBaseVectorCrossProductFromZero.z }
    const upBaseVector = addVectors(upBaseVectorFromZero, heightVector)
    const downBaseVector = addVectors(downBaseVectorFromZero, heightVector)
    const visionPyramidPoint1 = addVectors(heightVector, addVectors(leftBaseVectorFromZero, upBaseVectorFromZero))
    const visionPyramidPoint2 = addVectors(heightVector, addVectors(rightBaseVectorFromZero, upBaseVectorFromZero))
    const visionPyramidPoint3 = addVectors(heightVector, addVectors(leftBaseVectorFromZero, downBaseVectorFromZero))
    const visionPyramidPoint4 = addVectors(heightVector, addVectors(rightBaseVectorFromZero, downBaseVectorFromZero))
    console.log("left", leftBaseVector)
    console.log("right", rightBaseVector)
    console.log("up", upBaseVector)
    console.log("down", downBaseVector)
    console.log("middle", heightVector)

    console.log(visionPyramidPoint1, visionPyramidPoint2, visionPyramidPoint3, visionPyramidPoint4)
    //it works, i could probably make it better, but this works great :D
}
//https://stackoverflow.com/questions/1966587/given-3-points-how-do-i-calculate-the-normal-vector
//need a func to make a normal from 3 vectors 
function calculatePlaneNormalVector(vectorA, vectorB, vectorC) {
    //Create three vectors (A,B,C) from the origin to the three points (P1, P2, P3) respectively.
    //Using vector subtraction, compute the vectors U = A - B and W = A - C
    //Compute the vector cross product, V = U x W
    //Compute the unit vector of V,
    const vectorU = subtractVectors(vectorA, vectorB)
    const vectorW = subtractVectors(vectorA, vectorC)
    const vectorCrossProduct = calculateVectorCrossProduct(vectorU, vectorW)
    const vectorLength = Math.sqrt(vectorCrossProduct.x * vectorCrossProduct.x + vectorCrossProduct.y * vectorCrossProduct.y + vectorCrossProduct.z * vectorCrossProduct.z)
    return ({ x: (vectorCrossProduct.x) / vectorLength, y: (vectorCrossProduct.y) / vectorLength, z: (vectorCrossProduct.z) / vectorLength })

    //this was also first try, funny how 1,2,3,4,5,6,7,8,9 values give a nan lol
    //^^^^
    //that makes a line, now it makes sense
}
function addVectors(vectorA, vectorB) {
    return { x: vectorA.x + vectorB.x, y: vectorA.y + vectorB.y, z: vectorA.z + vectorB.z }
}
function subtractVectors(vectorA, vectorB) {
    return { x: vectorA.x - vectorB.x, y: vectorA.y - vectorB.y, z: vectorA.z - vectorB.z }
}
//input of 2 vectors gives cross product 
function calculateVectorCrossProduct(vectorA, vectorB) {
    return ({ x: vectorA.y * vectorB.z - vectorA.z * vectorB.y, y: vectorA.z * vectorB.x - vectorA.x * vectorB.z, z: vectorA.x * vectorB.y - vectorA.y * vectorB.x })
}//first tryyy
function calculateVectorDotProduct(vectorA, vectorB) {
    return (vectorA.x * vectorB.x + vectorA.y * vectorB.y + vectorA.z * vectorB.z)
}
function giveAngleDifference(point) {
    const calcPoint = subtractVectors(point, playerpos)
    const pointFromZero = { order: point.order, x: calcPoint.x, y: calcPoint.y, z: calcPoint.z }
    const pointTheta = Math.atan2((Math.sqrt(point.x*point.x+point.y*point.y))/point.z) 
    
    //WIP
}
function calculateSideVectors(angle, length) {
    let x = undefined
    let y = undefined
    switch (angle) {
        case 0:
            y += length
            break;
        case 90:
            x += length
            break;
        case 180:
            y -= length
            break;
        case 270:
            x -= length
        default:
            if (angle > 0 && angle < 90) {
                x = length * Math.sin(toRadians(angle));
                y = Math.sqrt(length * length - x * x)
            }
            else if (angle > 90 && angle < 180) {
                angle = 180 - angle
                x = length * Math.sin(toRadians(angle));
                y = -Math.sqrt(length * length - x * x)
            }
            else if (angle > 180 && angle < 270) {
                angle = angle - 180
                x = -length * Math.sin(toRadians(angle));
                y = -Math.sqrt(length * length - x * x)
            }
            else {
                angle = 360 - angle
                x = -length * Math.sin(toRadians(angle));
                y = Math.sqrt(length * length - x * x)
            }
    }
    return { x: x, y: y }
}

function calculateGridDisplacement(shiftValue, position, rotation) {

    /*
x=r sin ϕ cos θ
y=r sin ϕ sin θ
z=r cos ϕ
    */
    const phiAzimuth = toRadians(rotation.pitch)
    const thetaPolarAngle = toRadians(rotation.yaw)
    const r = shiftValue
    const playerx = position.x
    const playery = position.y
    const playerz = position.z

    const newPosition = {
        x: playerx + Number((r * Math.sin(phiAzimuth) * Math.cos(thetaPolarAngle)).toFixed(5)),
        y: playery + Number((r * Math.sin(phiAzimuth) * Math.sin(thetaPolarAngle)).toFixed(5)),
        z: playerz + Number((r * Math.cos(phiAzimuth)).toFixed(5))
    };

    return (newPosition);


}

/**
 * Converts angle to radians
 * @param {*} angle 
 * @returns Angle in radians
 */
function toRadians(angle) {
    return angle * (Math.PI / 180);
}