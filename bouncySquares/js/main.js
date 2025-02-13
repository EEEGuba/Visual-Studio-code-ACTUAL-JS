const displayWidth = 1600
const displayHeight =800
let movingDown = true
let count = 0
const canvas = document.getElementById("maincanvas");
const ctx = canvas.getContext("2d");
canvas.width = displayWidth
canvas.height = displayHeight
const fps = 60
let mainCounter = 0
let cursorX;
let cursorY;
let mousedown=false
let squarelist = []

function updateSquare() {
    ctx.clearRect(0,0,displayWidth,displayHeight)
    console.log(squarelist.length)
    squarelist.forEach(element => {
        moveSquare(element,element.color)
        if(element.positionY>displayHeight-40){element.velocityY=-element.velocityY*0.9; element.positionY-=10;element.velocityX+=Math.random() * (1 - (-1)) + (-1)}
        if(element.positionX>displayWidth||element.positionX<-40){squarelist.splice(squarelist.indexOf(element),1)}
    });
}
function updateCursorPosition(event) {
    cursorX = event.clientX-30;
    cursorY = event.clientY-30;
  }

  // Add a mousemove event listener to the document
  document.addEventListener("mousemove", updateCursorPosition);
function addSquare(positionX, positionY, height, width, color, velocityX, velocityY) {
    this.positionX = cursorX
    this.positionY = cursorY
    this.height = height
    this.width = width
    this.color = color
    this.velocityX = velocityX
    this.velocityY = velocityY
    this.birthDate = mainCounter
}
function drawSquare(startX, startY, height, width, color) {
    ctx.fillStyle = color
    ctx.fillRect(startX, startY, height, width)
}
function fireSquare() {
    const force = count //parseInt(document.getElementById("force").value)
    squarelist.push(new addSquare(0, 0, 40, 40, `rgba(${Math.random() * (255 - 0) + 0},${Math.random() * (255 - 0) + 0},${Math.random() * (255 - 0) + 0})`, Math.random() * (10 - -10) + -10, Math.random() * (10 - -10) + -10))
}
function moveSquare(squareElement,color) {
    squareElement.positionX += squareElement.velocityX
    squareElement.positionY += squareElement.velocityY
    squareElement.velocityY +=0.1
    drawSquare(squareElement.positionX, squareElement.positionY,squareElement.height,squareElement.width,color)
}
function mainClock() {
    updateSquare()
    mainCounter += 1
    if (count>5){movingDown = false}else if(count<0){movingDown = true}
    if(movingDown){count+=Math.random() * (10 - 0) + 0}else{count-=Math.random() * (10 - 0) + 0}
    if(mousedown){fireSquare()} 
    setTimeout(() => {
        mainClock()
    }, 1000 / fps);

}
mainClock()
document.addEventListener("mousedown", ()=>{mousedown=true});document.addEventListener("mouseup", ()=>{mousedown=false});

//<body>
//    <button class="button" onClick="fireSquare()">F I R E</button>
//    <input value="60" id="force" type="number">fireforce</input>
//    <canvas id="maincanvas"></canvas>
//  <script src="js/main.js"></script>
//</body>
