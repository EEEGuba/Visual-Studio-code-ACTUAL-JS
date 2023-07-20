
document.getElementById("submit").addEventListener("click", submit, false);

let ground = { x: 0, y: 140, width: 300, height: 5 }
document.getElementById("content").getContext("2d").fillRect(ground.x, ground.y, ground.width, ground.height)

function submit() {
  let nr1 = { x: get("x1"), y: get("y1") }
  let nr2 = { x: get("x2"), y: get("y2") }
  calculate(nr1.x, nr1.y, 5, 0)
  //calculate(nr2.x, nr2.y, 5, 0)

  function get(id) {
    return document.getElementById(id).value;
  }

function calculate (x,y,z,time){
  if (time < 80) {
  let vectorx = x
  let vectory = -y
  let groundacceleration = 1 * time * time
  let speedy = vectory + groundacceleration
  let speedx = vectorx * time
  launch(speedx, speedy, 5, 5)
  console.log(x,vectorx,speedx)
  setTimeout(function () {
    calculate(vectorx, speedy, z, ++time)
  }, 50)}


}

  function launch(x, y, z, w) {
    let canvas = document.getElementById("content");
    let ctx = canvas.getContext("2d");
    ctx.fillStyle = "#0066FF";
    ctx.fillRect(x, y, z, w);
    setTimeout(function () {
      ctx.fillStyle = "#00FFFF"
      ctx.fillRect(x, y, z, w)
    }, 100)
  }


}