//THIS TAKES STUFF FROM SCRIPT JS AND DECIDES DRAWING AND EXECUTES THE DRAWING
for (let index = 300; index>0; index--) {
    ctx.fillStyle = "pink";
    (function(ind) {
       setTimeout(()=>{ctx.fillRect(index,index,index,index)}, 100 + (30 * ind));
   })(index);

    
}