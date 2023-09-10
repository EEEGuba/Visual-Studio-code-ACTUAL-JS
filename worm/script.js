let refreshRate = 150;
let gamestarted = false;
let direction = 'w';
let positionx = 13;
let positiony = 1;
let score = 0;
let nextSegment = false;
let worm = [13, 1];
let failstate = false;
const myCanvas = document.getElementById("content");
myCanvas.height = 250;
myCanvas.width = 250;
const ctx = myCanvas.getContext("2d");
let fruity = 0;
let fruitx = 0;

function gameStart() {
  if (gamestarted == false) {
    failstate = false;
    gamestarted = true;
    score = -1;
    addScore();
    direction = "w";
    positionx = 13;
    positiony = 1;
    worm = [13, 1];
    refreshRate = 150;
    ctx.clearRect(0, 0, 250, 250);
    fruit();
    refresh();
  }
}

function addScore() {
  score++;
  document.getElementById("score").textContent = (`Score: ${score}`);
  refreshRate *= 0.98;
}

function createSegment() {
  worm.push(positionx, positiony);
}

function draw(y, x, color) {
  ctx.strokeStyle = "black";
  ctx.fillStyle = color;
  ctx.fillRect(y * 10, 250 - x * 10, 10, 10);
  ctx.strokeRect((y * 10)-1, (250 - x * 10)-1, 10, 10);
}

function keyLogger() {
  let key = event.key;
  direction = key;
}

function pozycja() {
  switch (direction) {
    case "w":
      positiony++;
      break;
    case "s":
      positiony -= 1;
      break;
    case "a":
      positionx -= 1;
      break;
    case "d":
      positionx++;
      break;
  }
}

function wormLogic() {
  ctx.strokeStyle = "black";
  ctx.fillStyle = `rgb(50, 89, 55)`;
  for (let i = 0; i < worm.length - 2; i += 2) {
    ctx.fillRect(worm[i - 2] * 10, 250 - worm[i - 1] * 10, 10, 10); //this breaks every 3rd createSegment. too bad!
    ctx.strokeRect((worm[i - 2] * 10) - 1, (250 - worm[i - 1] * 10) - 1, 10, 10);
  }
  setTimeout(function () {
    ctx.fillStyle = "brown"
    ctx.fillRect(worm[worm.length - 2] * 10, 250 - worm[worm.length - 1] * 10, 10, 10);
  }, ~~refreshRate - 1);

}

function collision() {
  if (positiony == fruity && positionx == fruitx) {
    addScore();
    fruit();
    nextSegment = true;
  }

  for (let i = 0; i < worm.length - 1; i += 2) {
    if (positionx == worm[i] && positiony == worm[i + 1]) {
      failstate = true;
    }
    if (fruitx == worm[i] && fruity == worm[i + 1]) { fruit(); }
  }
}
function refresh() {
  pozycja();
  collision();
  insertAndShift(worm, 2);
  worm[0] = positionx;
  worm[1] = positiony;
  wormLogic();
  draw(positionx, positiony, `rgb(50, 89, 55)`);
  if (nextSegment == true) {
    createSegment();
    nextSegment = false;
  }

  if (failstate == false) {
    if (positionx < 25 && positionx > -1 && positiony < 26 && positiony > -1) {
      setTimeout(function () {
        refresh()
      }, refreshRate);
    } else {
      gamestarted = false;
      console.log("przegrales/as :c");
      failsequence()
    }
  } else {
    gamestarted = false;
    console.log("przegrales/as :c");
    failsequence()
  }
}

function fruit() {
  fruitx = Math.floor(Math.random() * 24) + 1;
  fruity = Math.floor(Math.random() * 24) + 1;
  draw(fruitx, fruity, "red");
}

function insertAndShift(data, len) {
  let cutOut = data.splice(-len); // cut <len> elements from the end
  data.splice(0, 0, ...cutOut)// insert it at the beggining of the array
}
function failsequence(){
  let rowNumber=-1
  setTimeout(function () {
    rowNumber++
    screenrolldown()
  }, 2*refreshRate)
  function screenrolldown(){
    ctx.fillStyle = "rgb(102, 51, 0)"
    ctx.fillRect(0,rowNumber* 10, 250, 10);
    if (rowNumber<25&&!gamestarted){setTimeout(function () {
      rowNumber++
      screenrolldown()
    }, 50)}
  }
  let blinkcheck = true
  {setTimeout(function () {
    losetext()
  }, 1000)}
  function losetext(){
    ctx.font = "30px sans-serif"
    ctx.textAlign = "center";
    if(!gamestarted){
    if (blinkcheck){blinkcheck=false;ctx.fillStyle="red";ctx.fillText("You lose :c",120,100)}
    else {blinkcheck=true;ctx.fillStyle="blue";ctx.fillText("You lose :c",120,100)}
    {setTimeout(function () {
      losetext()
    }, 500)}}
  }

}
//  if (positiony == fruity && positionx == fruitx) {
//    addScore();
//   zjadanieOwockaTime();
//   createSegment()
//}

//Math.floor(Math.random() * 24) + 1