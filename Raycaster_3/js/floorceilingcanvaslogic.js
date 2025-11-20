//context.setTransform(Xscale, Xskew, Yskew, Yscale, xMove, Ymove)

ctf.setTransform(1,0, 0, 1,1000+ myFloorCanvas.width/2, myFloorCanvas.height/2);
for (let index = 300; index>0; index--) {
    (function(ind) {
       setTimeout(()=>{ctf.rotate(toRadians(20));ctf.drawImage(missingTexture, 0, 0, missingTexture.width, missingTexture.height);
;}, 100 + (30 * ind));
       
   })(index);

    
}