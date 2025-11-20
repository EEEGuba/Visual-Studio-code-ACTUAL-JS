const keyMap = {
    'w': 0,
    'a': 1,
    's': 2,
    'd': 3,
    'j': 4,
    'l': 5,
    ' ': 6,
    'i': 7,
    'k': 8,
    'm': 9
};
/** @type {Record<number, ControllerKey>} */
const controller = {
    0: { key: "w", pressed: false },
    1: { key: "a", pressed: false },
    2: { key: "s", pressed: false },
    3: { key: "d", pressed: false },
    4: { key: "j", pressed: false },
    5: { key: "l", pressed: false },
    6: { key: " ", pressed: false },
    7: { key: "i", pressed: false },
    8: { key: "k", pressed: false },
    9: { key: "m", pressed: false }

}
document.addEventListener("keydown", (event) => {
    keySwitchboard(event, true, event.shiftKey);

    if (event.key === " ") {
        event.preventDefault();
    }
});
document.addEventListener("keyup", (event) => {
    keySwitchboard(event, false, event.shiftKey);
});
function moveMaker() {
    for (let i = 0; i < Object.keys(controller).length; ++i) {
        if (controller[i].pressed) {
            keyInterpreter(controller[i].key);
        }
    }
}
/**
 * @param {KeyboardEvent} event
 * @param {boolean} isDown
 * @param {boolean} isShiftDown
 */
function keySwitchboard(event, isDown, isShiftDown) {
    const key = event.key.toLowerCase();
    if (key.search(/^[wasd jlikm]$/g) === 0) {
        const index = keyMap[key];
        controller[index].pressed = isDown;
    }
    if (event.shiftKey || event.key.search(/^[WASD]$/gi) === 0) {
        isShiftPressed = isShiftDown;
    }
}
function keyInterpreter(key) {
    switch (key) {
        case "w":
            movement(stepLength, 0);
            break;
        case "a":
            movement(stepLength, 270);
            break;
        case "s":
            movement(stepLength, 180);
            break;
        case "d":
            movement(stepLength, 90);
            break;
        case "j":
            mapData.playerData.azimuth = angleCorrector(mapData.playerData.azimuth - turnSensitivity);
            break;
        case "l":
            mapData.playerData.azimuth = angleCorrector(mapData.playerData.azimuth + turnSensitivity);
            break;
        case "i":
            canvasHeight += turnSensitivity * 5;
            break;
        case "k":
            canvasHeight -= turnSensitivity * 5;
            break;
        case " ":
            console.log("augh")
        default:
            break;
    }
}
/**
 * @param {number} ammount
 * @param {number} azimuth
 */
function movement(ammount, azimuth) {
    let stepDistance = ammount;
    if (isShiftPressed && ammount === stepLength) {
        stepDistance *= sprintRate;
    }
    const vectorChange = calculateVectorDisplacement(angleCorrector(mapData.playerData.azimuth + azimuth), stepDistance);
    const currentVelocityVector = calculateVectorDisplacement(mapData.playerData.velocity.azimuth, mapData.playerData.velocity.magnitude);
    const newVector = { x: vectorChange.x + currentVelocityVector.x, y: vectorChange.y + currentVelocityVector.y };
    const newMagVector = returnAzimuthAndMagnitudeFromZero(newVector);
    //console.log(newMagVector)
    mapData.playerData.velocity.magnitude = Math.abs(newMagVector.magnitude);
    mapData.playerData.velocity.azimuth = newMagVector.angle;
    //if(consolelogprint<20){console.log(mapData.playerData.velocity);consolelogprint++}
}
function playerMovementExecuter() {
    if (!(controller[0].pressed || controller[1].pressed || controller[2].pressed || controller[3].pressed)) {
        mapData.playerData.velocity.magnitude *= 1 - speedDampening;
        if (mapData.playerData.velocity.magnitude < 0.1) {
            mapData.playerData.velocity.magnitude = 0;
        }
    }

    if (mapData.playerData.velocity.magnitude > maxSpeed) {
        mapData.playerData.velocity.magnitude = maxSpeed;
    }
    newLocationVector = calculateVectorDisplacement(mapData.playerData.velocity.azimuth, mapData.playerData.velocity.magnitude);
    mapData.playerData.location = addtwo2DVectors(mapData.playerData.location,newLocationVector)

}