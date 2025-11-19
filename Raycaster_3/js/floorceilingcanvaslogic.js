//context.setTransform(Xscale, Xskew, Yskew, Yscale, xMove, Ymove)

ctf.setTransform(1,0, 0, 1, myFloorCanvas.width/2, myFloorCanvas.height/2);
for (let index = 300; index>0; index--) {
    (function(ind) {
       setTimeout(()=>{ctf.rotate(20 * Math.PI / 180);ctf.drawImage(testTexture1, 0, 0, testTexture1.width, testTexture1.height);
;}, 100 + (30 * ind));
       
   })(index);

    
}