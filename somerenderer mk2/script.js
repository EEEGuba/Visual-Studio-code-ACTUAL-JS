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

const cuboid1 = new Cuboid([0,0,0],2,2,2)
objectList.push(cuboid1)
function Cuboid(originPoint, sizex, sizey, sizez) {
    this.originPoint = originPoint;
    this.sizex = sizex
    this.sizey = sizey
    this.sizez= sizez
  }
console.log(objectList)
const rayOrigin = { x: 1, y: 1, z: -5 };
const rayDirection = { x: 0, y: 0, z: 1 };
console.log(rayCuboidIntersection(rayOrigin, rayDirection, cuboid1))

function rayCuboidIntersection(rayOrigin, rayDirection, cuboid) {
    const tMin = -renderDistance;
    const tMax = renderDistance;

    const invDirection = {
        x: 1 / rayDirection.x,
        y: 1 / rayDirection.y,
        z: 1 / rayDirection.z
    };

    const t1 = (cuboid.originPoint[0] - rayOrigin.x) * invDirection.x;
    const t2 = (cuboid.originPoint[0] + cuboid.sizex - rayOrigin.x) * invDirection.x;
    const t3 = (cuboid.originPoint[1] - rayOrigin.y) * invDirection.y;
    const t4 = (cuboid.originPoint[1] + cuboid.sizey - rayOrigin.y) * invDirection.y;
    const t5 = (cuboid.originPoint[2] - rayOrigin.z) * invDirection.z;
    const t6 = (cuboid.originPoint[2] + cuboid.sizez - rayOrigin.z) * invDirection.z;

    const tMinX = Math.min(t1, t2);
    const tMaxX = Math.max(t1, t2);
    const tMinY = Math.min(t3, t4);
    const tMaxY = Math.max(t3, t4);
    const tMinZ = Math.min(t5, t6);
    const tMaxZ = Math.max(t5, t6);

    const tEnter = Math.max(tMinX, tMinY, tMinZ);
    const tExit = Math.min(tMaxX, tMaxY, tMaxZ);

    if (tEnter > tExit || tExit < 0) {
        // No intersection
        return null;
    }

    const intersectionPoint = {
        x: rayOrigin.x + tEnter * rayDirection.x,
        y: rayOrigin.y + tEnter * rayDirection.y,
        z: rayOrigin.z + tEnter * rayDirection.z
    };

    return intersectionPoint;
}

// Example usage:



