for (let index = 300; index>0; index--) {
    (function(ind) {
       setTimeout(()=>{ctf.rotate(20 * Math.PI / 180);ctf.setTransform(1, 0.5, -0.5, 1, 0, index);ctf.drawImage(testTexture1, -20, -20, testTexture1.width, testTexture1.height);
;}, 100 + (30 * ind));
       
   })(index);

    
}