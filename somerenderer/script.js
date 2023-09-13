//settings
const movementSpeed = 10
const turnSensitivity = 1
const renderDistance = 100

//end of settings

const canvas = document.getElementById("content");
canvas.width = 500;
canvas.height = 500;
const ctx = canvas.getContext("2d");

let pointlist = [{ order: 1, x: 0, y: 0, z: 0 }]
let playerpos = { order: 0, x: 0, y: 0, z: 0 }
let playerrot = { pitch: 0, yaw: 0 }

for (i = 1; i < 21; i++) {
    addPoint()
}

function keyLogger() {
    commandcenter(event.key)
}

function turning(key) {
    switch (key) {
        case "u":
            playerrot.pitch += turnSensitivity
            break;
        case "h":
            playerrot.yaw -= turnSensitivity
            break;
        case "j":
            playerrot.pitch -= turnSensitivity
            break;
        case "k":
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
        const result = calculateGridDisplacement(movementSpeed)
        console.log(result)
        playerpos = result

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

/*function visionPyramid(){
    const visionPyramidHeight = calculateGridDisplacement(movementSpeed)

    const visionPyramidHeightX = visionPyramidHeight.x
    const visionPyramidHeightY = visionPyramidHeight.y
    const visionPyramidHeightZ = visionPyramidHeight.z

    const visionPyramidApexX = playerpos.x
    const visionPyramidApexY = playerpos.y
    const visionPyramidApexZ = playerpos.z



}
*/

function calculateGridDisplacement(shiftValue) {

    /*
x=r sin ϕ cos θ
y=r sin ϕ sin θ
z=r cos ϕ
    */
    const phiAzimuth = toRadians(playerrot.yaw)
    const thetaPolarAngle = toRadians(playerrot.pitch)
    const r = shiftValue
    const playerx = playerpos.x
    const playery = playerpos.y
    const playerz = playerpos.z

const newPlayerPos = {
    order:  0,
    x:      (r*Math.sin(phiAzimuth)*Math.cos(thetaPolarAngle)).toFixed(5),
    y:      (r*Math.sin(phiAzimuth)*Math.sin(thetaPolarAngle)).toFixed(5),
    z:      (r*Math.cos(phiAzimuth)).toFixed(5)
}

    return (newPlayerPos);


}

/**
 * Converts angle to radians
 * @param {*} angle 
 * @returns Angle in radians
 */
function toRadians(angle) {
    return angle * (Math.PI / 180);
}