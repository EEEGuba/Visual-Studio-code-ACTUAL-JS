//context.setTransform(Xscale, Xskew, Yskew, Yscale, xMove, Ymove)
let DEBUGLOGGERKEY = false
function drawEntireFrameOfFloors(){
   //ctf.drawImage(cobblestone,0,0)
   const rightNearPoint = calculateVectorDisplacement(angleCorrector(mapData.playerData.azimuth+fov/2),100)
   const leftNearPoint = calculateVectorDisplacement(angleCorrector(mapData.playerData.azimuth-fov/2),100)
   const rightFarPoint = calculateVectorDisplacement(angleCorrector(mapData.playerData.azimuth+fov/2),200)
   const leftFarPoint = calculateVectorDisplacement(angleCorrector(mapData.playerData.azimuth-fov/2),200)
   ctf.fillStyle = "black"
   for (let linex = 0; linex < 500; linex++) {
      ctf.fillRect(linex*10,0,1,myFloorCanvas.height)
   }
   ctf.fillStyle = "brown"
   for (let liney = 0; liney < 500; liney++) {
      ctf.fillRect(0,liney*10,myFloorCanvas.width,1)
   }
   ctf.fillStyle = "pink"
   ctf.beginPath();
   ctf.moveTo(rightNearPoint.x+mapData.playerData.location.x,rightNearPoint.y+mapData.playerData.location.y);
   ctf.lineTo(leftNearPoint.x+mapData.playerData.location.x,leftNearPoint.y+mapData.playerData.location.y);
   ctf.lineTo(leftFarPoint.x+mapData.playerData.location.x,leftFarPoint.y+mapData.playerData.location.y);
   ctf.lineTo(rightFarPoint.x+mapData.playerData.location.x,rightFarPoint.y+mapData.playerData.location.y);
   ctf.lineTo(rightNearPoint.x+mapData.playerData.location.x,rightNearPoint.y+mapData.playerData.location.y);
   ctf.fill();
   ctf.resetTransform()
   ctf.translate(myFloorCanvas.width/2,myFloorCanvas.height/2)
   ctf.rotate(mapData.playerData.azimuth)
   ctf.translate(0,0)
}

//image rotation is 360-player azimuth!