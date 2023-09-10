//settings
const turnsensitivity = 1

//end of settings
const canvas = document.getElementById("content");
canvas.width = 500;
canvas.height = 500;
const ctx = canvas.getContext("2d");

let pointlist = [{ order: 1, x: 0, y: 0, z: 0 }]
let playerpos = { order: 0, x: 0, y: 0, z: 0 }
let playerrot = { updown: 0, leftright: 0 }


function keyLogger() {
    commandcenter(event.key)
}

function turning(key) {
    switch (key) {
        case "u":
            playerrot.updown += turnsensitivity
            break;
        case "h":
            playerrot.leftright -= turnsensitivity
            break;
        case "j":
            playerrot.updown -= turnsensitivity
            break;
        case "k":
            playerrot.leftright += turnsensitivity
            break;
    }
    if (playerrot.updown >= 360) { playerrot.updown -= 360 }
    else if (playerrot.updown < 0) { playerrot.updown += 359 }
    if (playerrot.leftright > 359) { playerrot.leftright -= 360 }
    else if (playerrot.leftright < 0) { playerrot.leftright += 359 }
    console.log(playerrot)
}
function movement() {

}
function commandcenter(key) {
    if (key == "u" || key == "h" || key == "j" || key == "k") {
        turning(key)
    }
    else if (key == "w" || key == "a" || key == "s" || key == "d") {
        movement(key)
    }
}
function drawvector(beginx, beginy, endx, endy, color) {
    ctx.fillStyle = color
    ctx.beginPath();
    ctx.moveTo(beginx, beginy);
    ctx.lineTo(endx, endy);
    ctx.closePath();
    ctx.stroke();
}

function addPoint() {
    console.log(pointlist.length)
    console.log(pointlist[pointlist.length - 1])
    const a = Math.floor(Math.random() * 10);
    const b = Math.floor(Math.random() * 10);
    const c = Math.floor(Math.random() * 10);
    pointlist.push({ order: pointlist.length + 1, x: a, y: b, z: c })
} 