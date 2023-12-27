const simulationSpeed = 25 //ms per tick
const gravity = 0.7 //px per tick
const airResistance = 0.01
const bounceLoss = 0.8 //1 is no energy lost 0 is no bounce

const canvas = document.getElementById("content");
canvas.width = 500;
canvas.height = 500;
const ctx = canvas.getContext("2d");

let currentTick = 0

let testSquare = {
    vector: [10, 0],
    positionx: 50,
    positiony: 50,
    size: 50,
    color: "red"
}

function clearFrame() {
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, 500, 500)
}
function squareDrawLoop(object) {
    clearFrame()
    ctx.fillStyle = (object.color)
    ctx.fillRect(object.positionx, object.positiony, object.size, object.size)
}
function mainUpdate() {
    airResistanceAdder(testSquare)
    gravityAdder(testSquare)
    physicsSimulation(testSquare)
    squareDrawLoop(testSquare)
    currentTick++
    setTimeout(mainUpdate, simulationSpeed)
}
function airResistanceAdder(object) {
    if (object.vector[0] > 0) {
        object.vector[0] -= airResistance
    }
    else { object.vector[0] += airResistance }
    if (object.vector[1] > 0) {
        object.vector[1] -= airResistance
    }
    else { object.vector[1] += airResistance }
}
function gravityAdder(object) {
    object.vector[1] += gravity
}
function physicsSimulation(object) {
    if (object.positionx + object.size > canvas.width || object.positionx < 0) {
        object.vector[0] *= -bounceLoss
    }
    if (object.positiony + object.size > canvas.height) {
        object.vector[1] *= -bounceLoss
    }

    object.positionx += object.vector[0]
    object.positiony += object.vector[1]
    console.log(object.positionx + object.size, canvas.width, object.positiony + object.size, canvas.height)
}
mainUpdate()

