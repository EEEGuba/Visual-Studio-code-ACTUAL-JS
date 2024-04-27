// This file is for development only. There's no need to load it at runtime.

/**
 * @typedef {Object} PlayerVector
 * @property {number} magnitude
 * @property {number} angle
 */

/**
 * @typedef {Object} Vector
 * @property {number} x
 * @property {number} y
 */

/**
 * @typedef {Object} VectorRotation
 * @property {number} rotation
 * 
 * @typedef {Vector & VectorRotation} PlayerPosition
 */

/**
 * @typedef {Object} VectorAngle
 * @property {number | undefined} angle
 * 
 * @typedef {Vector & VectorAngle} AngledVector
 */

/**
 * @typedef {Object} ControllerKey
 * @property {string} key
 * @property {boolean} pressed
 */

/**
 * @typedef {Object} FrameData
 * @property {number} xPos
 * @property {number} yPos
 * @property {number} xWidth
 * @property {number} yWidth
 * @property {string | Record<number, string> | undefined} material
 * @property {number} proximity
 */

/**
 * @typedef {Object} MaterialTexture
 * @property {HTMLImageElement} image,
 * @property {number} position
 */