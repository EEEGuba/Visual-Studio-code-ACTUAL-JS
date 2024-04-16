let hurb = 0
const myCanvas = document.getElementById("content");
const ctx = myCanvas.getContext("2d");
myCanvas.height = 500;
myCanvas.width = 1200;
const image = new Image(); // Using optional size for image
image.src = "bukit2.png";
image.onload = drawImageActualSize // Draw when image has loaded

// Load an image of intrinsic size 300x227 in CSS pixels


function drawImageActualSize(image2) {
  ctx.drawImage(image , 0,0,hurb,hurb);
}
function drawFrame(image){
    ctx.clearRect(0,0,myCanvas.width,myCanvas.height)
    drawImageActualSize(image)

}
function gameClock() {
    hurb++

    drawFrame()
    setTimeout(() => {
        gameClock()
    }, 1000/40);
}
gameClock()