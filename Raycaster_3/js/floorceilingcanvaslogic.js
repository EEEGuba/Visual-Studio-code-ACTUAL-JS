//context.setTransform(Xscale, Xskew, Yskew, Yscale, xMove, Ymove)

let DEBUGLOGGERKEY = false
function drawEntireFrameOfFloors() {
   ctf.resetTransform()
   ctf.clearRect(0, 0, myFloorCanvas.width, myFloorCanvas.height)
   ctf.setTransform(1, 0, 0, 1, myFloorCanvas.width / 2 - (mapData.playerData.location.x - 500), myFloorCanvas.height / 2 - (mapData.playerData.location.y - 500))
   const floorStartDistance = 100
   const floorEndDistance = 200
   //ctf.drawImage(cobblestone,0,0)
   const rightNearPoint = calculateVectorDisplacement(angleCorrector(90 + fov / 2), floorStartDistance)
   const leftNearPoint = calculateVectorDisplacement(angleCorrector(90 - fov / 2), floorStartDistance)
   const rightFarPoint = calculateVectorDisplacement(angleCorrector(90 + fov / 2), floorEndDistance)
   const leftFarPoint = calculateVectorDisplacement(angleCorrector(90 - fov / 2), floorEndDistance)
   const imageWidthNear = -2 * calculateVectorDisplacement(angleCorrector(90 - (fov / 2)), floorEndDistance - floorStartDistance).x
   const imageWidthFar = imageWidthNear * 2
   //ctf.setTransform(1,0,0,1,-rightFarPoint.x,-rightFarPoint.y)
   const rotationVector = { x: mapData.playerData.location.x - 500, y: mapData.playerData.location.y - 500 }
   ctf.translate(rotationVector.x, rotationVector.y)
   //const rectifiedCoordinates = addtwo2DVectors(calculateClockwiseRotatedCoordinatesByXYandAngle(mapData.playerData.location, angleCorrector((-mapData.playerData.azimuth)+90)),{x:myFloorCanvas.width/2,y:myFloorCanvas.height  /2})   
   ctf.rotate(toRadians(angleCorrector(-mapData.playerData.azimuth + 90)))
   ctx.fillRect(myFloorCanvas.width / 2 - 5, myFloorCanvas.height / 2 - 5, 10, 10)
   //ctf.translate(-rectifiedCoordinates.x, -rectifiedCoordinates.y)
   ctf.translate(-rotationVector.x, -rotationVector.y)
   ctf.fillStyle = "black"

   ctf.fillStyle = "pink"
   for (let liney = -600; liney < 600; liney = liney + 60) {
      for (let linex = -460; linex < 460; linex = linex + 46) {
         ctf.drawImage(testTexture1,linex, liney)
      }
   }
   //ctx.fillStyle = "red"
   //ctx.fillRect(-5, -5, 10, 10)
   const offScreenCanvas = new OffscreenCanvas(Math.abs(calculateVectorDisplacement(angleCorrector(90 - fov / 2), 100).x - calculateVectorDisplacement(angleCorrector(90 + fov / 2), 100).x), floorEndDistance - floorStartDistance)

   const osc = offScreenCanvas.getContext('2d')

   for (let i = 1; i < 101; i++) {
      const nextDistance = (i * i) / 30 + 1
      const left = calculateVectorDisplacement(angleCorrector(90 - fov / 2), nextDistance)
      const right = calculateVectorDisplacement(angleCorrector(90 + fov / 2), nextDistance)
      ctx.beginPath();
      ctx.moveTo(left.x + myFloorCanvas.width / 2, left.y + myFloorCanvas.height / 2);
      ctx.lineTo(right.x + myFloorCanvas.width / 2, right.y + myFloorCanvas.height / 2);
      ctx.stroke();
      const imageData = ctf.getImageData(left.x + myFloorCanvas.width / 2, left.y + myFloorCanvas.height / 2, Math.abs(left.x - right.x) + 1, 3);
      osc.putImageData(imageData, 0, 0)
      ctx.drawImage(offScreenCanvas, 0, 0, Math.abs(left.x - right.x) + 1, 3, 0, 600 - i * 3, 1200, 3)
      osc.reset()
   }
   //ctx.drawImage(offScreenCanvas,i*0.9,i,imageWidthFar-i*1.8,1,0,i*3+300,1200,3)

}

//image rotation is 360-player azimuth!