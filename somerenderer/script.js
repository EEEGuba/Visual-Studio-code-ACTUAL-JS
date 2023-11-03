//settings
const movementSpeed = 1
const turnSensitivity = 18
const renderDistance = 50
const fov = 100
const pointSize = 10

//end of settings

const canvas = document.getElementById("content");
canvas.width = 500;
canvas.height = 500;
const ctx = canvas.getContext("2d");

let pointlist = [{ order: 1, x: 2, y: 0, z: 0 }, { order: 2, x: 2, y: 0, z: 2 }, { order: 3, x: 4, y: 0, z: 2 }, { order: 4, x: 4, y: 0, z: 0 }, { order: 5, x: 2, y: 2, z: 0 }, { order: 6, x: 2, y: 2, z: 2 }, { order: 7, x: 4, y: 2, z: 2 }, { order: 8, x: 4, y: 2, z: 0 },]
let linelist = [{ p1: 1, p2: 2, color: "blue", usedThisFrame: false }, { p1: 3, p2: 2, color: "blue", usedThisFrame: false }, { p1: 3, p2: 4, color: "blue", usedThisFrame: false }, { p1: 4, p2: 1, color: "blue", usedThisFrame: false }, { p1: 5, p2: 6, color: "blue", usedThisFrame: false }, { p1: 6, p2: 7, color: "blue", usedThisFrame: false }, { p1: 7, p2: 8, color: "blue", usedThisFrame: false }, { p1: 1, p2: 5, color: "blue", usedThisFrame: false }, { p1: 2, p2: 6, color: "blue", usedThisFrame: false }, { p1: 3, p2: 7, color: "blue", usedThisFrame: false }, { p1: 4, p2: 8, color: "blue", usedThisFrame: false }, { p1: 8, p2: 5, color: "blue", usedThisFrame: false }]
let playerpos = { x: 0, y: 0, z: 0 }
let playerrot = { pitch: 90, yaw: 0 }
let visionPyramidPoint1 = 0
let visionPyramidPoint2 = 0
let visionPyramidPoint3 = 0
let visionPyramidPoint4 = 0

//for (i = 1; i < 21; i++) {
//    addPoint(Math.floor(Math.random() * 10),Math.floor(Math.random() * 10),Math.floor(Math.random() * 10))
//}
/*
for(i=-10; i<10; i++){
    for(j=-10; j<10; j++){
        for(k=-10; k<10; k++){
            addPoint(i,j,k)
        }
    }
}*/
addPoint(10, 10, 10)
addPoint(10, 10, -10)
addPoint(10, -10, -10)
addPoint(10, -10, 10)
function keyLogger() {
    commandcenter(event.key)
}
function replaceplayerpos() {

}
//findVisionAngle
theBigCheck()
function turning(key) {
    switch (key) {
        case "j":
            playerrot.pitch += turnSensitivity
            break;
        case "k":
            playerrot.yaw += turnSensitivity
            break;
        case "u":
            playerrot.pitch -= turnSensitivity
            break;
        case "h":
            playerrot.yaw -= turnSensitivity
            break;
        case "y":
    }
    if (playerrot.pitch >= 180) { playerrot.pitch = 180 }
    else if (playerrot.pitch <= 0) { playerrot.pitch = 0 }
    if (playerrot.yaw > 359) { playerrot.yaw -= 360 }
    else if (playerrot.yaw < 0) { playerrot.yaw += 359 }

}
function movement(key) {
    if (key == "w") {
        const result = calculateGridDisplacement(movementSpeed, playerpos, playerrot)
        playerpos = result
    }
    if (key == "s") {
        const result = calculateGridDisplacement(-movementSpeed, playerpos, playerrot)
        playerpos = result
    }
    if (key == "f") { playerpos.z -= movementSpeed }
    if (key == "r") { playerpos.z += movementSpeed }
    if (key == "a") {
        const result = calculateSideVectors(playerrot.yaw, movementSpeed)

        playerpos = { x: playerpos.x + result.x, y: playerpos.y + result.y, z: playerpos.z }
        console.log(playerrot.yaw, playerpos)
    }
}
function commandcenter(key) {
    if (key == "u" || key == "h" || key == "j" || key == "k") {
        turning(key)
    }
    else if (key == "w" || key == "a" || key == "s" || key == "d" || key == "r" || key == "f") {
        movement(key)
    }
    theBigCheck()
}
function drawvector(beginx, beginy, endx, endy, color) {
    ctx.fillStyle = color
    ctx.beginPath();
    /*ctx.moveTo(beginx+3,beginy+3);
    ctx.lineTo(beginx-3,beginy-3)
    ctx.lineTo(endx-3, endy-3);
    ctx.lineTo(endx+3,endy+3)
    ctx.closePath();
    ctx.fill();
    */
    ctx.moveTo(beginx, beginy)
    ctx.lineTo(endx, endy)
    ctx.closePath()
    ctx.stroke()
}

function addPoint(x, y, z) {
    const a = x;
    const b = y;
    const c = z;
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
    const heightVectorAngle = toDegrees(Math.atan2((heightVectorFromZero.x), (heightVectorFromZero.y)));

    let rightBaseVectorAngle = heightVectorAngle + 90
    let leftBaseVectorAngle = heightVectorAngle - 90
    if (rightBaseVectorAngle > 359) { rightBaseVectorAngle -= 360 }
    if (leftBaseVectorAngle < 0) { leftBaseVectorAngle += 359 }
    console.log()
    const rightBaseVectorxy = calculateSideVectors(rightBaseVectorAngle, sidevectorlength)
    const leftBaseVectorxy = calculateSideVectors(leftBaseVectorAngle, sidevectorlength)
    console.log(leftBaseVectorxy)
    const rightBaseVector = { x: rightBaseVectorxy.x + heightVector.x, y: rightBaseVectorxy.y + heightVector.y, z: heightVector.z }
    const leftBaseVector = { x: leftBaseVectorxy.x + heightVector.x, y: leftBaseVectorxy.y + heightVector.y, z: heightVector.z }
    console.log(leftBaseVector)
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
    visionPyramidPoint1 = addVectors(heightVector, addVectors(leftBaseVectorFromZero, upBaseVectorFromZero))
    visionPyramidPoint2 = addVectors(heightVector, addVectors(rightBaseVectorFromZero, upBaseVectorFromZero))
    visionPyramidPoint3 = addVectors(heightVector, addVectors(leftBaseVectorFromZero, downBaseVectorFromZero))
    visionPyramidPoint4 = addVectors(heightVector, addVectors(rightBaseVectorFromZero, downBaseVectorFromZero))
    console.log("left", leftBaseVector)
    console.log("right", rightBaseVector)
    console.log("up", upBaseVector)
    console.log("down", downBaseVector)
    console.log("middle", heightVector)

    console.log(visionPyramidPoint1, visionPyramidPoint2, visionPyramidPoint3, visionPyramidPoint4)
    console.log(calculatePlaneNormalVector(playerpos, visionPyramidPoint1, visionPyramidPoint2))
    console.log(calculatePlaneNormalVector(playerpos, visionPyramidPoint2, visionPyramidPoint1))
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
    return ({ x: vectorA.x + (vectorCrossProduct.x) / vectorLength, y: vectorA.y + (vectorCrossProduct.y) / vectorLength, z: vectorA.z + (vectorCrossProduct.z) / vectorLength })

    //this was also first try, funny how 1,2,3,4,5,6,7,8,9 values give a nan lol
    //^^^^
    //that makes a line, now it makes sense
}
function calculateD(point1, point2, point3, normal) {
    return (Math.max(calculateVectorDotProduct(normal, point1), calculateVectorDotProduct(normal, point2), calculateVectorDotProduct(normal, point3)))
}
function returnPointByOrder(orderInFunction) {
    return pointlist.find(obj => obj.order === orderInFunction);
}
function returnLineByPoint(point, isp1) {
    if (isp1) {
        return linelist.find(obj => obj.p1 === point);
    }
    return linelist.find(obj => obj.p2 === point);
}
///ITS ALIIIIIIVEEE
function theBigCheck() {
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, 500, 500);
    ctx.fillStyle = "red"
    pointlist.forEach(point => {
        if (isPointInPyramid(point)) {
            const angle = giveAngleDifference(point)
            const up = angle.pitch * 250 / (fov / 2) + 250
            const side = angle.yaw * 250 / (fov / 2) + 250
            ctx.fillRect(side-(pointSize/2), up-(pointSize/2), pointSize, pointSize)
            linelist.forEach(line => {
                if (point.order === line.p1 && !line.usedThisFrame) {
                    const p2angle = giveAngleDifference(returnPointByOrder(line.p2))
                    const p2up = p2angle.pitch * 250 / (fov / 2) + 250
                    const p2side = p2angle.yaw * 250 / (fov / 2) + 250
                    drawvector(side, up, p2side, p2up, line.color)
                    line.usedThisFrame = true
                }
                if (point.order === line.p2 && !line.usedThisFrame) {
                    const p1angle = giveAngleDifference(returnPointByOrder(line.p1))
                    const p1up = p1angle.pitch * 250 / (fov / 2) + 250
                    const p1side = p1angle.yaw * 250 / (fov / 2) + 250
                    drawvector(side, up, p1side, p1up, line.color)
                    line.usedThisFrame = true
                }
            })

        }
    })
    linelist.forEach(line => { line.usedThisFrame = false })
}
function isPointInPyramid(point) {
    const angleDifference = giveAngleDifference(point)
    if (calculateDistanceFromPoint(point, playerpos) < renderDistance) {
        if (angleDifference.pitch >= -(fov / 2) && angleDifference.pitch <= (fov / 2)) {
            if (angleDifference.yaw >= -(fov / 2) && angleDifference.yaw <= (fov / 2)) {
                return (true)
            }
        }
    }
    return (false)
}
function normalizeVector(vector) {
    const length = Math.sqrt(vector.x * vector.x + vector.y * vector.y + vector.z * vector.z);
    return { x: vector.x / length, y: vector.y / length, z: vector.z / length };
}
function calculateDistanceFromPoint(pointA, pointB) {
    return Math.sqrt((pointB.x - pointA.x) * (pointB.x - pointA.x) + (pointB.y - pointA.y) * (pointB.y - pointA.y) + (pointB.z - pointA.z) * (pointB.z - pointA.z))
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
    const pointFromZero = subtractVectors(point, playerpos)
    let pointTheta = toDegrees(Math.atan2((Math.sqrt(pointFromZero.x * pointFromZero.x + pointFromZero.y * pointFromZero.y)), pointFromZero.z))
    let pointPhi = toDegrees(Math.atan2(pointFromZero.y, pointFromZero.x)) - playerrot.yaw
    if (pointPhi < -180) { pointPhi += 360 }
    const vectorAngleDifference = { pitch: pointTheta - playerrot.pitch, yaw: pointPhi }
    return (vectorAngleDifference)

    //WIP
    //i think its done??
    //its wrong, god dammit
}
function findVectorLengthFromZero(point) {
    return (Math.sqrt(point.x * point.x + point.y * point.y + point.z * point.z))
}
function calculateSideVectors(angle, length) {
    let x = 0
    let y = 0
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
function toDegrees(angle) {
    return angle * (180 / Math.PI)
}

// WORK IN PROGRESS WORK IN PROGRESS WORK IN PROGRESS WORK IN PROGRESS WORK IN PROGRESS WORK IN PROGRESS
// WORK IN PROGRESS WORK IN PROGRESS WORK IN PROGRESS WORK IN PROGRESS WORK IN PROGRESS WORK IN PROGRESS
// WORK IN PROGRESS WORK IN PROGRESS WORK IN PROGRESS WORK IN PROGRESS WORK IN PROGRESS WORK IN PROGRESS

function multiplyMatrixVector(matrix, vector) {
    const result = [];
    for (let i = 0; i < matrix.length; i++) {
        let sum = 0;
        for (let j = 0; j < vector.length; j++) {
            sum += matrix[i][j] * vector[j];
        }
        result.push(sum);
    }
    return result;
}

function lookAt(camerapos, lookAtPoint, upVector) {
    const zAxis = normalizeVector(subtractVectors(lookAtPoint, camerapos));
    const xAxis = normalizeVector(calculateVectorCrossProduct(upVector, zAxis));
    const yAxis = calculateVectorCrossProduct(zAxis, xAxis);

    return [
        [xAxis.x, xAxis.y, xAxis.z, -calculateVectorDotProduct(xAxis, camerapos)],
        [yAxis.x, yAxis.y, yAxis.z, -calculateVectorDotProduct(yAxis, camerapos)],
        [zAxis.x, zAxis.y, zAxis.z, -calculateVectorDotProduct(zAxis, camerapos)],
        [0, 0, 0, 1]
    ];
}

function perspective(fov, aspectRatio, near, far) {
    const f = 1 / Math.tan(fov / 2);
    const depth = near - far;

    return [
        [f / aspectRatio, 0, 0, 0],
        [0, f, 0, 0],
        [0, 0, (far + near) / depth, 2 * far * near / depth],
        [0, 0, -1, 0]
    ];
}

function projectPoints(points3D, viewMatrix, projectionMatrix) {
    const points2D = [];

    for (const point3D of points3D) {
        const point4D = [point3D.x, point3D.y, point3D.z, 1];
        const viewPoint = multiplyMatrixVector(viewMatrix, point4D);
        const projectedPoint = multiplyMatrixVector(projectionMatrix, viewPoint);

        // Normalize by dividing by w
        const normalizedPoint = {
            x: projectedPoint[0] / projectedPoint[3],
            y: projectedPoint[1] / projectedPoint[3],
        };

        // Map to screen coordinates if needed (e.g., 800x600 screen)
        normalizedPoint.x = (normalizedPoint.x + 1) * 250; // Assuming screen width is 800
        normalizedPoint.y = (-normalizedPoint.y + 1) * 250; // Assuming screen height is 600

        points2D.push(normalizedPoint);
    }

    return points2D;
}
const points3D = [
    { x: 1, y: 2, z: 3 },
    { x: 4, y: 5, z: 6 },
    // Add more 3D points as needed
];

const lookAtPoint = normalizeVector(heightVector)
const upVector = {x:playerpos.x,y:playerpos.y, z:playerpos.z++};

const viewMatrix = lookAt(playerpos, lookAtPoint, upVector);
const projectionMatrix = perspective(Math.PI / 4, 800 / 600, 0.1, 1000);
const points2D = projectPoints(points3D, viewMatrix, projectionMatrix);

console.log(points2D);