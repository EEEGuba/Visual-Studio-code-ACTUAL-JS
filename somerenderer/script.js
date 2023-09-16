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
let playerrot = { pitch: 0, yaw: 0 }

for (i = 1; i < 21; i++) {
    addPoint()
}

function keyLogger() {
    commandcenter(event.key)
}

//findVisionAngle

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

function visionPyramid() {
    //polar angle and azimuth are flipped incorrectly

    //the spherical coordinates shift the pyramid base based on polar angle as azimuth has more or less weight in the position


    /*calc right angle for the pyramid side, how to determine angle?? 
    */
    const pitch = playerrot.pitch
    const yaw = playerrot.yaw
    const visionPyramidPoint1 = calculateGridDisplacement(renderDistance, playerpos, { pitch: pitch + (fov / 2), yaw: yaw - (fov / 2) })
    const visionPyramidPoint2 = calculateGridDisplacement(renderDistance, playerpos, { pitch: pitch + (fov / 2), yaw: yaw + (fov / 2) })
    const visionPyramidPoint3 = calculateGridDisplacement(renderDistance, playerpos, { pitch: pitch - (fov / 2), yaw: yaw - (fov / 2) })
    const visionPyramidPoint4 = calculateGridDisplacement(renderDistance, playerpos, { pitch: pitch - (fov / 2), yaw: yaw + (fov / 2) })

    const visionPyramidPointApex = [playerpos.x, playerpos.y, playerpos.z]

    console.log(fov, (fov / 2))
    console.log(visionPyramidPoint1, visionPyramidPoint2, visionPyramidPoint3, visionPyramidPoint4)

}

function calculateGridDisplacement(shiftValue, position, rotation) {

    /*
x=r sin ϕ cos θ
y=r sin ϕ sin θ
z=r cos ϕ
    */
    const phiAzimuth = toRadians(rotation.yaw)
    const thetaPolarAngle = toRadians(rotation.pitch)
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