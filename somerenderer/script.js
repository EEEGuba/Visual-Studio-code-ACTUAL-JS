//settings
const movementspeed = 1
const turnsensitivity = 1

//end of settings

const canvas = document.getElementById("content");
canvas.width = 500;
canvas.height = 500;
const ctx = canvas.getContext("2d");

let pointlist = [{ order: 1, x: 0, y: 0, z: 0 }]
let playerpos = { order: 0, x: 0, y: 0, z: 0 }
let playerrot = { pitch: 0, yaw: 0, roll: 0 }

for (i=1;i<21;i++){
    addPoint()
}

function keyLogger() {
    commandcenter(event.key)
}

function turning(key) {
    switch (key) {
        case "u":
            playerrot.pitch += turnsensitivity
            break;
        case "h":
            playerrot.yaw -= turnsensitivity
            break;
        case "j":
            playerrot.pitch -= turnsensitivity
            break;
        case "k":
            playerrot.yaw += turnsensitivity
            break;
        case "y":
            playerrot.roll -= turnsensitivity
            break;
        case "i":
            playerrot.roll += turnsensitivity
            break;
    }
    if (playerrot.pitch >= 360) { playerrot.pitch -= 360 }
    else if (playerrot.pitch < 0) { playerrot.pitch += 359 }
    if (playerrot.yaw > 359) { playerrot.yaw -= 360 }
    else if (playerrot.yaw < 0) { playerrot.yaw += 359 }
    if (playerrot.roll >= 360) { playerrot.roll -= 360 }
    else if (playerrot.roll < 0) { playerrot.roll += 359 }
    console.log(playerrot)
}
function movement(key) {
    if (key == "w") {
        const result = calculateGridDisplacement()
        console.log(result)
        playerpos = result

    }
}
function commandcenter(key) {
    if (key == "u" || key == "h" || key == "j" || key == "k" || key == "y" || key == "i") {
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


function calculateGridDisplacement() {
    // Initial position
    const x0 = playerpos.x;
    const y0 = playerpos.y;
    const z0 = playerpos.z;

    // Rotation angles (in radians)
    const roll = toRadians(playerrot.roll); // Example roll angle (30 degrees in radians)
    const pitch = toRadians(playerrot.pitch); // Example pitch angle (45 degrees in radians)
    const yaw = toRadians(playerrot.yaw); // Example yaw angle (60 degrees in radians)

    // Calculate rotation matrix
    const rotationMatrix = [
        [
            Math.cos(yaw) * Math.cos(pitch),
            -Math.sin(yaw) * Math.cos(roll) + Math.cos(yaw) * Math.sin(pitch) * Math.sin(roll),
            Math.sin(yaw) * Math.sin(roll) + Math.cos(yaw) * Math.sin(pitch) * Math.cos(roll)
        ],
        [
            Math.sin(yaw) * Math.cos(pitch),
            Math.cos(yaw) * Math.cos(roll) + Math.sin(yaw) * Math.sin(pitch) * Math.sin(roll),
            -Math.cos(yaw) * Math.sin(roll) + Math.sin(yaw) * Math.sin(pitch) * Math.cos(roll)
        ],
        [
            -Math.sin(pitch),
            Math.cos(pitch) * Math.sin(roll),
            Math.cos(pitch) * Math.cos(roll)
        ]
    ];

    // Forward vector
    const forwardVector = [
        rotationMatrix[0][0], // x-component
        rotationMatrix[0][1], // y-component
        rotationMatrix[0][2]  // z-component
    ];

    // Calculate displacement vector
    const displacementVector = [
        forwardVector[0] * movementspeed,
        forwardVector[1] * movementspeed,
        forwardVector[2] * movementspeed
    ];
    //newPlayerPos
    const newPlayerPos = {
        order: 0,
        x: x0 + displacementVector[0],
        y: y0 + displacementVector[1],
        z: z0 + displacementVector[2]
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