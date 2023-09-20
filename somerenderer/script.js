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
let playerpos = { order: 0, x: 0, y: 0, z: 0 }
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

    const fovangle = toRadians(fov/2)

    const pitch = playerrot.pitch
    const yaw = playerrot.yaw
    const heightvectordistance = renderDistance
    const heightvector = calculateGridDisplacement(heightvectordistance,playerpos,playerrot)

    //vision pyramid height vector = pyramid height
    //calculate side vectors perpendicular to the pyramid height, no z axis, since no rotation of sight
    
    const sideheight = heightvectordistance/Math.cos(fovangle)
    const sidevectorlength = Math.sqrt((sideheight*sideheight)-(heightvectordistance*heightvectordistance))

    //figuring out coords for sidevectors, z is flat, since no rotation
    const playerx = playerpos.x
    const playery= playerpos.y
    const heightvectorx = heightvector.x
    const heightvectory = heightvector.y
    /*need to do sightvector-playerpos to find angle, then +90 and -90 degrees*/
    const heightvectorangle = (Math.atan((heightvectorx-playerx)/(heightvectory-playery)) * 180) / Math.PI;
    let rightbasevectorangle = heightvectorangle + 90
    let leftbasevectorangle = heightvectorangle - 90
        if (rightbasevectorangle > 359) { rightbasevectorangle -= 360 }
        if (leftbasevectorangle < 0) {leftbasevectorangle += 359 }
const rightbasevectorxy = calculateSideVectors(rightbasevectorangle, sidevectorlength)
const leftbasevectorxy =  calculateSideVectors(leftbasevectorangle, sidevectorlength)

const rightbasevector = {x: rightbasevectorxy.x+heightvectorx, y: rightbasevectorxy.y+heightvectory, z:heightvector.z}
const leftbasevector =  {x: leftbasevectorxy.x+heightvectorx, y: leftbasevectorxy.y+heightvectory, z:heightvector.z}
console.log(heightvector)
console.log(rightbasevector, leftbasevector)

    const visionPyramidPointApex = [playerpos.x, playerpos.y, playerpos.z]
//    console.log(visionPyramidPoint1, visionPyramidPoint2, visionPyramidPoint3, visionPyramidPoint4)

}

function calculateSideVectors(angle,length){
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
}}
return {x:x,y:y}
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