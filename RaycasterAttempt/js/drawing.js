// @ts-check
"use strict";

/**
 * @param {Vector} startingPoint
 * @param {Vector} endingPoint
 * @param {string} color
 * @param {CanvasRenderingContext2D} canvas
 */
function drawLine(startingPoint, endingPoint, color, canvas) {
    canvas.strokeStyle = color;
    canvas.lineWidth = 1;
    canvas.beginPath();
    canvas.moveTo(startingPoint.x, startingPoint.y);
    canvas.lineTo(endingPoint.x, endingPoint.y);
    canvas.stroke();
}
/**
 * @param {number} x
 * @param {number} y
 * @param {string} color
 * @param {number} size
 * @param {CanvasRenderingContext2D} canvas
 */
function drawSquare(x, y, color, size, canvas) {
    canvas.fillStyle = color;
    canvas.fillRect(x, y, size, size);
}