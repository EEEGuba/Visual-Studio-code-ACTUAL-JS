const simulationSpeed = 25 //ms per tick
const gravity = 0.07 //px per tick
const airResistance = 0.01
const bounceLoss = 0.95 //1 is no energy lost 0 is no bounce

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
    color: "green",
    wasInCollisionLastFrame:false
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
    physicsSimulation(testSquare)
    squareDrawLoop(testSquare)
    currentTick++
    if(currentTick<800)
    setTimeout(mainUpdate, simulationSpeed)
}

function physicsSimulation(object) {
    //gravity
    object.vector[1] += gravity
   //collision
    if(!object.wasInCollisionLastFrame){
    if (object.positionx + object.size > canvas.width) {
        object.vector[0] *= -bounceLoss
        object.vector[1] *= bounceLoss
        object.positionx = canvas.width-object.size
    }
    if(object.positionx < 0){
        object.vector[0] *= -bounceLoss
        object.vector[1] *= bounceLoss
        object.positionx = 0
    }
    if (object.positiony + object.size > canvas.height) {
        object.vector[0] *= bounceLoss
        object.vector[1] *= -bounceLoss
        object.positiony=canvas.height-object.size
    }
    if(object.positiony < 0){
        object.vector[0] *= bounceLoss
        object.vector[1] *= -bounceLoss
        object.positiony = 0
    }
    object.wasInCollisionLastFrame=true
}
else{object.wasInCollisionLastFrame=false}
    object.positionx += object.vector[0]
    object.positiony += object.vector[1]
    console.log(object.positionx + object.size, canvas.width, object.positiony + object.size, canvas.height)
//air resistance
    if (object.vector[0] > 0) {
        object.vector[0] -= airResistance
    }
    else { object.vector[0] += airResistance }

    if (object.vector[1] > 0) {
        object.vector[1] -= airResistance
    }
    else { object.vector[1] += airResistance }


}
mainUpdate()

