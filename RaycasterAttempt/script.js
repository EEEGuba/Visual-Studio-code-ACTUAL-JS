//settings

const fov =30 //this isnt degrees, its arbitrary
const refreshrate = 100 //arbitrary
const renderaccuracy = 1 //bigger number faster, less accurate
const turnsensitivity = 6 //degrees turning on click of a or d
const steplength = 1 //how far you go after w or s
const renderdistance = 200 //impacts how far away a wall has to be to not appear, much longer distances might slow down the game

//end of settings









function toRadians(angle) {
    return angle * (Math.PI / 180);
}