//settings

const fov = 40 //this isnt degrees, its arbitrary
const refreshrate = 100 //arbitrary
const renderaccuracy = 1 //bigger number faster, less accurate
const turnsensitivity = 6 //degrees turning on click of a or d
const steplength = 2 //how far you go after w or s

//end of settings

let checky = 0
let checkx = 0
let checkcoly = 0
let checkcolx = 0
let lastvector = [0, 0, 0, 0]
/* map, add block here if you want*/ const mapdata = [{ x: 10, y: 10 }, {
    x: 5,
    y: 6
}, {
    x: 6,
    y: 6
}, {
    x: 7,
    y: 6
}, {
    x: 8,
    y: 6
}, {
    x: 9,
    y: 6
}, {
    x: 10,
    y: 6
}, {
    x: 11,
    y: 6
}, {
    x: 12,
    y: 6
}, {
    x: 5,
    y: 7
}, {
    x: 5,
    y: 8
}, {
    x: 5,
    y: 9
}, {
    x: 5,
    y: 15
}, {
    x: 6,
    y: 15
}, {
    x: 7,
    y: 15
}, {
    x: 8,
    y: 6
}, {
    x: 9,
    y: 6
}, {
    x: 10,
    y: 15
}, {
    x: 11,
    y: 15
}, {
    x: 18,
    y: 15
}, {
    x: 9,
    y: 15
}, {
    x: 8,
    y: 15
}, {
    x: 18,
    y: 7
}, {
    x: 18,
    y: 8
}, {
    x: 18,
    y: 9
}, {
    x: 18,
    y: 10
}, {
    x: 18,
    y: 11
}, {
    x: 18,
    y: 12
}, {
    x: 18,
    y: 13
}, {
    x: 18,
    y: 14
}, {
    x: 17,
    y: 15
}, {
    x: 16,
    y: 15
}, {
    x: 15,
    y: 15
}, {
    x: 14,
    y: 15
}, {
    x: 13,
    y: 15
}, {
    x: 12,
    y: 15
}, {
    x: 5,
    y: 14
}, {
    x: 5,
    y: 13
}, {
    x: 5,
    y: 12
}, {
    x: 5,
    y: 11
}, {
    x: 5,
    y: 10
}, {
    x: 18,
    y: 6
}, {
    x: 17,
    y: 6
}, {
    x: 16,
    y: 6
}, {
    x: 15,
    y: 6
}, {
    x: 14,
    y: 6
}, {
    x: 13,
    y: 6
}
]
const myCanvas = document.getElementById("content");
myCanvas.height = 250;
myCanvas.width = 250;
const myMap = document.getElementById("map");
myMap.height = 250;
myMap.width = 250;
const ctm = myMap.getContext("2d");
const ctx = myCanvas.getContext("2d");
let directioncooldown = false
let direction = 0
let playerpos = [100, 70]
generatemap()
function roll(x) {
    return Math.floor(Math.random() * x) + 1;
}
function keyLogger() {
    movement(event.key)
}
function generatemap(x) {
    for (let i = 1; i < 25; i++) {
        const x = i

        for (let j = 1; j < 25; j++) {
            if (returnmapdata(x, j)) {
                draw(j, x, "black")
            }
        }
    }

}
function drawplayer(pos, color) {
    ctm.fillStyle = color;
    ctm.fillRect(Math.round(pos[0]), 250 - Math.round(pos[1]), 1, 1);
}
function draw(y, x, color) {
    ctm.fillStyle = color;
    ctm.fillRect(y * 10, 250 - x * 10, 10, 10);
}
function displacement(isForward) {
    let playerx = 0
    let playery = 0
    let angle = direction
    switch (direction) {
        case 0:

            if (isForward) { playery += steplength } else { playery -= steplength }
            break;
        case 90:
            if (isForward) { playerx += steplength } else { playerx -= steplength }
            break;
        case 180:
            if (!isForward) { playery += steplength } else { playery -= steplength }
            break;
        case 270:
            if (!isForward) { playerx += steplength } else { playerx -= steplength }
        default:
            if (direction > 0 && direction < 90) {
                if (isForward) {
                    playerx = steplength * Math.sin(toRadians(angle));
                    playery = Math.sqrt(steplength * steplength - playerx * playerx)
                }
                else {
                    playerx = -steplength * Math.sin(toRadians(angle));

                    playery = -Math.sqrt(steplength * steplength - playerx * playerx)
                }
            }
            else if (direction > 90 && direction < 180) {
                angle = 180 - direction
                if (isForward) {
                    playerx = steplength * Math.sin(toRadians(angle));
                    playery = -Math.sqrt(steplength * steplength - playerx * playerx)
                }
                else {
                    playerx = -steplength * Math.sin(toRadians(angle));

                    playery = Math.sqrt(steplength * steplength - playerx * playerx)

                }
            }
            else if (direction > 180 && direction < 270) {
                angle = direction - 180
                if (isForward) {
                    playerx = -steplength * Math.sin(toRadians(angle));
                    playery = -Math.sqrt(steplength * steplength - playerx * playerx)
                }
                else {
                    playerx = steplength * Math.sin(toRadians(angle));

                    playery = Math.sqrt(steplength * steplength - playerx * playerx)
                }
            }
            else {
                angle = 360 - direction
                if (isForward) {
                    playerx = -steplength * Math.sin(toRadians(angle));
                    playery = Math.sqrt(steplength * steplength - playerx * playerx)
                }
                else {
                    playerx = steplength * Math.sin(toRadians(angle));

                    playery = -Math.sqrt(steplength * steplength - playerx * playerx)
                }
            }

    }

    playerpos[0] += playerx
    playerpos[1] += playery
}
function interpreter(distance, angle, islastline) {
    const sidespace = Math.abs(250 / fov) * (direction - angle)
    const length = 200 - distance
    const col = 255 - distance * 3
    const color = `rgb(0,0,${col})`
    drawvector(125 - sidespace, 200 - length, 125 - sidespace, length, color, islastline)
    lastvector = [125 - sidespace, 200 - length, 125 - sidespace, length]
}
function wallsightloop(i) {
    let lookx = 0
    let looky = 0
    for (let j = 1; j < 100; j += renderaccuracy) {

        let angle = i
        switch (angle) {
            case 0:
                looky += renderaccuracy
                break;
            case 90:
                lookx += renderaccuracy
                break;
            case 180:
                looky -= renderaccuracy
                break;
            case 270:
                lookx -= renderaccuracy
            default:
                if (angle > 0 && angle < 90) {
                    lookx = j * Math.sin(toRadians(angle));
                    looky = Math.sqrt(j * j - lookx * lookx)
                }
                else if (angle > 90 && angle < 180) {
                    angle = 180 - angle
                    lookx = j * Math.sin(toRadians(angle));
                    looky = -Math.sqrt(j * j - lookx * lookx)
                }
                else if (angle > 180 && angle < 270) {
                    angle = angle - 180
                    lookx = -j * Math.sin(toRadians(angle));
                    looky = -Math.sqrt(j * j - lookx * lookx)
                }
                else {
                    angle = 360 - angle
                    lookx = -j * Math.sin(toRadians(angle));
                    looky = Math.sqrt(j * j - lookx * lookx)
                }

        }

        if (mapcollision(playerpos[0] + lookx, playerpos[1] + looky)) {
            return j;
        }
    } function mapcollision(x, y) {
        checkcolx = x / 10
        checkcoly = y / 10
        if (mapdata.some(returncollision)) {
            return true;
        }

    }
}
function wallsight() {
    const firstcondition = direction - fov / 2
    const secondcondition = direction + fov / 2
    for (let i = firstcondition; i < secondcondition; i++) {
        if (i==secondcondition||i== firstcondition) 
        {
            interpreter(wallsightloop(i), i, true)
        }
        else {
            interpreter(wallsightloop(i), i, false)
        }
    }

    /*get playerloc
    get direction
    for loop for every direction
    for loop check with returnmapdata on an increasing ray length 
    
    if true, drawvector defaultlength/raylentgh
    further = slightly darker color??
    */

}
function returncollision(array) {
    if (array.x <= checkcolx && array.x + 1 > checkcolx && array.y >= checkcoly && array.y - 1 < checkcoly) {
        ctm.fillStyle = "green";
        ctm.fillRect(Math.round(10 * checkcolx), 250 - Math.round(10 * checkcoly), 2, 2);
        return true;
    }
}
function movement(x) {
    switch (x) {
        case "w":
            displacement(true)
            drawplayer(playerpos, 'red');
            break;
        case "s":
            displacement(false)
            drawplayer(playerpos, 'red');
            break;
        case "a":
            direction -= turnsensitivity
            if (direction == -turnsensitivity) { direction = 360 - turnsensitivity };
            setTimeout(function () {
                directioncooldown = true
            }, 50);
            break;
        case "d":
            direction += turnsensitivity;
            if (direction >= 360) { direction = 0 };
            setTimeout(function () {
                directioncooldown = true
            }, refreshrate);
            break;

    }ctx.clearRect(0, 0, 250, 250)
    wallsight()
}
function drawvector(beginx, beginy, endx, endy, color, islastline) {
    ctx.fillStyle = color
    ctx.beginPath();
    ctx.moveTo(beginx, beginy);
    ctx.lineTo(endx, endy);
    if (!islastline) {
        ctx.lineTo(lastvector[2], lastvector[3])
        ctx.lineTo(lastvector[0], lastvector[1])
    }
    ctx.closePath();
    ctx.fill();
}
function returnmapdata(x, y) {
    checkx = y
    checky = x
    if (mapdata.some(returnbool)) {
        return true;
    }

}
function returnbool(array) {
    if (array.x == checkx && array.y == checky) {
        return true
    }
    return false;
}
/**
 * Converts angle to radians
 * @param {*} angle 
 * @returns Angle in radians
 */
function toRadians(angle) {
    return angle * (Math.PI / 180);
}