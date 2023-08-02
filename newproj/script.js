const canvas = document.getElementById("content");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d")
ctx.fillRect(0,0,window.innerWidth,window.innerHeight)
ctx.fillStyle="white"

let resizeCooldown=false

if(!resizeCooldown){window.addEventListener("resize", function(event){draw();resizeCooldown=true; setTimeout(function () {resizeCooldown = false}, 500)})}

function keyLogger(){
    keyDistributor(event.key)
}
function keyDistributor(key){

}
function draw(){
    ctx.fillStyle="black"
    ctx.fillRect(0,0,window.innerWidth,window.innerHeight)
    ctx.fillStyle="white"
    ctx.fillRect(10,10,10,10) 
    console.log(5)
}