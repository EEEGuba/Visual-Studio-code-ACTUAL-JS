//JUST A BUNCHA MATH TO CALL IN RANDOM PLACES WHEN NEEDED

// @ts-check
"use strict";

class MapVector {
    /** @type {number} */
    x1;
    /** @type {number} */
    y1;
    /** @type {number} */
    x2;
    /** @type {number} */
    y2;
    /** @type {string} */
    material;

    /**
     * @param {number} x1
     * @param {number} y1
     * @param {number} x2
     * @param {number} y2
     * @param {string} material
     * @param {boolean} isSeeThrough
     */
    constructor(x1, y1, x2, y2, material, isSeeThrough) {
        this.x1 = x1, 
        this.y1 = y1,
        this.x2 = x2, 
        this.y2 = y2,
        this.material = material;
    }
}

class MapPixel {
    /** @type {number} */
    x;
    /** @type {number} */
    y;
    /** @type {string} */
    material;

    /**
     * @param {number} x
     * @param {number} y
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
        
    }
}

/**
 * @param {number} x
 * @returns {number}
 */
function getDecimalPart(x) {
    return x-Math.floor(x)
}

/**
 * @param {number} angle
 * @returns {number}
 */
function toRadians(angle) {
    return angle * (Math.PI / 180);
}

/**
 * @param {number} angle
 * @returns {number}
 */
function toDegrees(angle) {
    return angle * (180 / Math.PI);
}

/**
 * @param {MapVector} vector1
 * @param {MapVector} vector2
 * @returns {Vector | undefined}
 */
function findIntersection(vector1, vector2) {
    const denominator = ((vector2.end.y - vector2.start.y) * (vector1.end.x - vector1.start.x)) - ((vector2.end.x - vector2.start.x) * (vector1.end.y - vector1.start.y));
    const numerator1 = ((vector2.end.x - vector2.start.x) * (vector1.start.y - vector2.start.y)) - ((vector2.end.y - vector2.start.y) * (vector1.start.x - vector2.start.x));
    const numerator2 = ((vector1.end.x - vector1.start.x) * (vector1.start.y - vector2.start.y)) - ((vector1.end.y - vector1.start.y) * (vector1.start.x - vector2.start.x));

    if (denominator === 0) {
        return undefined;
    }

    const r = numerator1 / denominator;
    const s = numerator2 / denominator;

    if (r >= 0 && r <= 1 && s >= 0 && s <= 1) {
        const intersectionX = vector1.start.x + (r * (vector1.end.x - vector1.start.x));
        const intersectionY = vector1.start.y + (r * (vector1.end.y - vector1.start.y));
        return { x: intersectionX, y: intersectionY };
    }

    return undefined;
}

/**
 * @param {number} angle
 * @param {number} magnitude
 * @returns {Vector}
 */
function calculateVectorDisplacement(angle, magnitude) {
    const radians = toRadians(angle);
    return { x: -magnitude * Math.cos(radians), y: -magnitude * Math.sin(radians) };
}

/**
 * @param {Vector} a
 * @param {Vector} b
 * @returns {number}
 */
function calculateDotProduct(a, b) {
    return (a.x * b.x + a.y * b.y);
}

/**
 * @param {MapVector} vector
 * @param {Vector} pointA
 * @param {Vector} pointB
 * @returns {boolean}
 */
function returnTrueIfPointsOnSameVectorSide(vector, pointA, pointB) {
    const absoluteVector = { x: vector.end.x - vector.start.x, y: vector.end.y - vector.start.y };
    const absolutePointA = { x: pointA.x - vector.start.x, y: pointA.y - vector.start.y };
    const absolutePointB = { x: pointB.x - vector.start.x, y: pointB.y - vector.start.y };
    const perpendicularVector = { x: -absoluteVector.y, y: absoluteVector.x };
    return Math.sign(calculateDotProduct(perpendicularVector, absolutePointA)) === Math.sign(calculateDotProduct(perpendicularVector, absolutePointB));
}

/**
 * @param {Vector} vector
 * @returns {Vector}
 */
function normaliseVector(vector) {
    const magVector = returnAngleAndMagnitudeFromZero(vector);
    return { x: vector.x / magVector.magnitude, y: vector.y / magVector.magnitude };
}

/**
 * @param {Vector} vector
 * @returns {PlayerVector}
 */
function returnAngleAndMagnitudeFromZero(vector) {
    //cartesian->polar m = √(x² + y²) and θ = arccos(x / m), painfull 
    const m = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
    return { magnitude: m, angle: toDegrees(Math.atan2(vector.y, vector.x)) + 180 };
}

/**
 * @param {number} angle
 * @returns {number}
 */
function angleCorrector(angle) {
    if (angle > 359) {
        return (angle - (360 * ((angle - (angle % 360)) / 360)));
    } else if (angle < 0) {
        return (angle + 359 + 360 * ((angle - (angle % 360)) / 360));
    }
    
    return angle;
}

/**
 * @param {MapVector} wallVector
 * @param {Vector} intersectionPoint
 * @returns {number}
 */
function returnIntersectionDistanceFromOrigin(wallVector, intersectionPoint) {
    return Math.sqrt((wallVector.start.x - intersectionPoint.x) * (wallVector.start.x - intersectionPoint.x) + (wallVector.start.y - intersectionPoint.y) * (wallVector.start.y - intersectionPoint.y));
}