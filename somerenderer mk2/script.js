//settings
const movementSpeed = 1
const turnSensitivity = 18
const renderDistance = 50
const fov = 90
const pointSize = 5
const resolutionx = 500
const resolutiony = 500

//end of settings

const canvas = document.getElementById("content");
canvas.width = 500;
canvas.height = 500;
const ctx = canvas.getContext("2d");
let objectList = []

const cuboid1 = new cuboid([0,0,0],2,2,2)
objectList.push(cuboid1)
function cuboid(originPoint, sizex, sizey, sizez) {
    this.originPoint = originPoint;
    this.sizex = sizex
    this.sizey = sizey
    this.sizez= sizez
  }
console.log(objectList)

