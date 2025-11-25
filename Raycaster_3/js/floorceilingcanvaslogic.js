//context.setTransform(Xscale, Xskew, Yskew, Yscale, xMove, Ymove)
let DEBUGLOGGERKEY = false
function drawEntireFrameOfFloors() {
   ctf.resetTransform()
   ctf.clearRect(0, 0, myFloorCanvas.width, myFloorCanvas.height)
   ctf.setTransform(1, 0, 0, 1,myFloorCanvas.width/2-(mapData.playerData.location.x-500),myFloorCanvas.height/2-(mapData.playerData.location.y-500))
   const floorStartDistance = 100
   const floorEndDistance = 200
   //ctf.drawImage(cobblestone,0,0)
   const rightNearPoint = calculateVectorDisplacement(angleCorrector(90 + fov / 2), floorStartDistance)
   const leftNearPoint = calculateVectorDisplacement(angleCorrector(90 - fov / 2), floorStartDistance)
   const rightFarPoint = calculateVectorDisplacement(angleCorrector(90 + fov / 2), floorEndDistance)
   const leftFarPoint = calculateVectorDisplacement(angleCorrector(90 - fov / 2), floorEndDistance)
   const imageWidthNear = -2 * calculateVectorDisplacement(angleCorrector(90 - (fov / 2)), floorEndDistance-floorStartDistance).x
   const imageWidthFar = imageWidthNear * 2
   //ctf.setTransform(1,0,0,1,-rightFarPoint.x,-rightFarPoint.y)
   const rotationVector = {x:mapData.playerData.location.x-500,y:mapData.playerData.location.y-500}
   ctf.translate(rotationVector.x,rotationVector.y)
   //const rectifiedCoordinates = addtwo2DVectors(calculateClockwiseRotatedCoordinatesByXYandAngle(mapData.playerData.location, angleCorrector((-mapData.playerData.azimuth)+90)),{x:myFloorCanvas.width/2,y:myFloorCanvas.height  /2})   
   ctf.rotate(toRadians(angleCorrector(-mapData.playerData.azimuth + 90)))
   ctx.fillRect(myFloorCanvas.width/2-5,myFloorCanvas.height/2-5, 10, 10)
   //ctf.translate(-rectifiedCoordinates.x, -rectifiedCoordinates.y)
   ctf.translate(-rotationVector.x,-rotationVector.y)
   ctf.fillStyle = "black"
   for (let linex = -500; linex < 1000; linex++) {
      ctf.fillRect(linex * 10, -500, 1, 1000)
   }
   ctf.fillStyle = "brown"
   for (let liney = -500; liney < 1000; liney++) {
      ctf.fillRect(-500, liney * 10, 1000, 1)
   }
   ctx.fillStyle = "red"
   ctx.fillRect(-5, -5, 10, 10)
   ctx.beginPath();
   ctx.moveTo(rightNearPoint.x + myFloorCanvas.width/2, rightNearPoint.y + myFloorCanvas.height/2);
   ctx.lineTo(leftNearPoint.x + myFloorCanvas.width/2, leftNearPoint.y + myFloorCanvas.height/2);
   ctx.lineTo(leftFarPoint.x + myFloorCanvas.width/2, leftFarPoint.y + myFloorCanvas.height/2);
   ctx.lineTo(rightFarPoint.x + myFloorCanvas.width/2, rightFarPoint.y + myFloorCanvas.height/2);
   ctx.lineTo(rightNearPoint.x + myFloorCanvas.width/2, rightNearPoint.y + myFloorCanvas.height/2);
   ctx.stroke();
   const offScreenCanvas = new OffscreenCanvas(imageWidthFar, floorEndDistance - floorStartDistance)
   const osc = offScreenCanvas.getContext('2d')
   const imageData = ctf.getImageData(myFloorCanvas.width/2+leftFarPoint.x,myFloorCanvas.height/2+leftFarPoint.y, imageWidthFar, floorEndDistance - floorStartDistance);    
   osc.putImageData(imageData,0,0)
   
   for (let i = 0; i<100; i++) {
      ctx.drawImage(offScreenCanvas,i*0.9,i,imageWidthFar-i*1.8,1,0,i*3+300,1200,3)
   }
   
}

//image rotation is 360-player azimuth!