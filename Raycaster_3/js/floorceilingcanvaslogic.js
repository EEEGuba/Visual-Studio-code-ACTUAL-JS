//context.setTransform(Xscale, Xskew, Yskew, Yscale, xMove, Ymove)

let DEBUGLOGGERKEY = false
let test = 1
function drawEntireFrameOfFloors() {
   test++
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
   const rotationVector = { x: mapData.playerData.location.x - 500, y: mapData.playerData.location.y - 500 + myFloorCanvas.height/2 }
   ctf.translate(rotationVector.x, rotationVector.y)
   //const rectifiedCoordinates = addtwo2DVectors(calculateClockwiseRotatedCoordinatesByXYandAngle(mapData.playerData.location, angleCorrector((-mapData.playerData.azimuth)+90)),{x:myFloorCanvas.width/2,y:myFloorCanvas.height  /2})   
   ctf.rotate(toRadians(angleCorrector(-mapData.playerData.azimuth + 90)))
   ctx.fillRect(myFloorCanvas.width / 2 - 5, myFloorCanvas.height - 5, 10, 10)
   ctf.translate(-rotationVector.x, -rotationVector.y)
   for (let liney = -600; liney < 600; liney = liney + 60) {
      for (let linex = -460; linex < 460; linex = linex + 46) {
         ctf.drawImage(testTexture1,linex, liney)
      }
   }
   //ctx.fillStyle = "red"
   //ctx.fillRect(-5, -5, 10, 10)
   const offScreenCanvas = new OffscreenCanvas(1200,4)

   const osc = offScreenCanvas.getContext('2d',)
   for (let i = 15; i < 101; i++) {
      const nextDistance = (i * i*i) / test

      const left = calculateVectorDisplacement(angleCorrector(90 - fov / 2), nextDistance)
      const right = calculateVectorDisplacement(angleCorrector(90 + fov / 2), nextDistance)
      ctx.beginPath();
      ctx.moveTo(left.x + myFloorCanvas.width / 2, left.y + myFloorCanvas.height);
      ctx.lineTo(right.x + myFloorCanvas.width / 2, right.y + myFloorCanvas.height);
      ctx.stroke();
      const imageData = ctf.getImageData(left.x + myFloorCanvas.width / 2, left.y + myFloorCanvas.height, Math.abs(left.x - right.x) + 1, 4);
      const rayWidth = Math.abs(left.x - right.x)

         osc.putImageData(imageData, 0, 0)

      ctx.drawImage(offScreenCanvas, 0, 0, rayWidth + 1, 4, 10, 600 - i * 3, 1200, 4)
      osc.reset()
   }
   //ctx.drawImage(offScreenCanvas,i*0.9,i,imageWidthFar-i*1.8,1,0,i*3+300,1200,3)

}

//image rotation is 360-player azimuth!