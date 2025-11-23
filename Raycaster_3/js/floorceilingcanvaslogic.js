//context.setTransform(Xscale, Xskew, Yskew, Yscale, xMove, Ymove)
let DEBUGLOGGERKEY = false
function drawEntireFrameOfFloors() {
   ctf.resetTransform()
   ctf.clearRect(0, 0, myFloorCanvas.width, myFloorCanvas.height)
   const floorStartDistance = 100
   const floorEndDistance = 200
   //ctf.drawImage(cobblestone,0,0)
   const rightNearPoint = calculateVectorDisplacement(angleCorrector(mapData.playerData.azimuth + fov / 2), floorStartDistance)
   const leftNearPoint = calculateVectorDisplacement(angleCorrector(mapData.playerData.azimuth - fov / 2), floorStartDistance)
   const rightFarPoint = calculateVectorDisplacement(angleCorrector(mapData.playerData.azimuth + fov / 2), floorEndDistance)
   const leftFarPoint = calculateVectorDisplacement(angleCorrector(mapData.playerData.azimuth - fov / 2), floorEndDistance)
   const imageWidthNear = -2 * calculateVectorDisplacement(angleCorrector(90 - (fov / 2)), floorEndDistance-floorStartDistance).x
   const imageWidthFar = imageWidthNear * 2
   //ctf.setTransform(1,0,0,1,-rightFarPoint.x,-rightFarPoint.y)
   //ctf.translate(leftFarPoint.x,leftFarPoint.y)
   const rectifiedCoordinates = addtwo2DVectors(calculateClockwiseRotatedCoordinatesByXYandAngle(mapData.playerData.location, angleCorrector((-mapData.playerData.azimuth)+90)),{x:myFloorCanvas.width/2,y:myFloorCanvas.height  /2})   
   ctf.setTransform(1, 0, 0, 1,-rectifiedCoordinates.x,-rectifiedCoordinates.y)
   ctf.rotate(toRadians(angleCorrector(-mapData.playerData.azimuth + 90)))
   ctf.fillRect(rectifiedCoordinates.x, rectifiedCoordinates.y, 10, 10)
   ctf.translate(-rectifiedCoordinates.x, -rectifiedCoordinates.y)
   ctf.fillStyle = "black"
   for (let linex = 0; linex < 1000; linex++) {
      ctf.fillRect(linex * 10, 0, 1, 1000)
   }
   ctf.fillStyle = "brown"
   for (let liney = 0; liney < 100; liney++) {
      ctf.fillRect(0, liney * 10, 1000, 1)
   }
   //ctf.fillStyle = "red"
   //ctf.fillRect(-5, -5, 10, 10)
   //ctf.beginPath();
   //ctf.moveTo(rightNearPoint.x + mapData.playerData.location.x, rightNearPoint.y + mapData.playerData.location.y);
   //ctf.lineTo(leftNearPoint.x + mapData.playerData.location.x, leftNearPoint.y + mapData.playerData.location.y);
   //ctf.lineTo(leftFarPoint.x + mapData.playerData.location.x, leftFarPoint.y + mapData.playerData.location.y);
   //ctf.lineTo(rightFarPoint.x + mapData.playerData.location.x, rightFarPoint.y + mapData.playerData.location.y);
   //ctf.lineTo(rightNearPoint.x + mapData.playerData.location.x, rightNearPoint.y + mapData.playerData.location.y);
   //ctf.stroke();
   const imageData = ctf.getImageData(rectifiedCoordinates.x, rectifiedCoordinates.y, imageWidthFar, floorEndDistance - floorStartDistance);
   ctx.putImageData(imageData, 0, myCanvas.height / 2);
}

//image rotation is 360-player azimuth!