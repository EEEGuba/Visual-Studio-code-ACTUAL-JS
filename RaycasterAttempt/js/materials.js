// @ts-check
"use strict";

class Material {
    constructor() {
        if (this.constructor === Material) {
            throw new Error("Cannot instantiate abstract class Material.");
        }
    }

    /**
     * @param {HTMLCanvasElement} canvas
     * @param {CanvasRenderingContext2D} ctx
     * @param {FrameData} data
     * @param {number} accuracy
     */
    draw(canvas, ctx, data, accuracy) {
        throw new Error("Method draw is not implemented.");
    }
}

class TextureMaterial extends Material {
    /** @type {HTMLImageElement} */
    image;
    /** @type {number} */
    position;

    /**
     * @param {HTMLImageElement} img
     * @param {number} position
     */
    constructor(img, position) {
        super();
        this.image = img;
        this.position = position;
    }

    /**
     * @param {HTMLCanvasElement} canvas
     * @param {CanvasRenderingContext2D} ctx
     * @param {FrameData} data
     * @param {number} accuracy
     */
    draw(canvas, ctx, data, accuracy) {
        ctx.drawImage(this.image, this.position, 0, canvas.width / accuracy, this.image.height, data.xPos, data.yPos, data.xWidth, data.yWidth);
    }
}

class RGBMaterial extends Material {
    /** @type {number} */
    r;
    /** @type {number} */
    g;
    /** @type {number} */
    b;
    /** @type {number | undefined} */
    a;

    /**
     * @param {number} r
     * @param {number} g
     * @param {number} b
     * @param {number | undefined} a
     */
    constructor(r, g, b, a = undefined) {
        super();
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    /**
     * @param {HTMLCanvasElement} canvas
     * @param {CanvasRenderingContext2D} ctx
     * @param {FrameData} data
     * @param {number} accuracy
     */
    draw(canvas, ctx, data, accuracy) {
        ctx.fillStyle = this.a === undefined ? `rgb(${this.r}, ${this.g}, ${this.b})` : `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
        ctx.fillRect(data.xPos, data.yPos, data.xWidth, data.yWidth);
    }
}

class SimpleMaterial extends Material {
    /** @type {string} */
    style;

    /** @param {string} style */
    constructor(style) {
        super();
        this.style = style;
    }

    /**
     * @param {HTMLCanvasElement} canvas
     * @param {CanvasRenderingContext2D} ctx
     * @param {FrameData} data
     * @param {number} accuracy
     */
    draw(canvas, ctx, data, accuracy) {
        ctx.fillStyle = this.style;
        ctx.fillRect(data.xPos, data.yPos, data.xWidth, data.yWidth);
    }
}

class MappedMaterial extends Material {
    /** @type {Record<number, string>} */
    map;

    /** @param {Record<number, string>} map */
    constructor(map) {
        super();
        this.map = map;
    }

    /**
     * @param {HTMLCanvasElement} canvas
     * @param {CanvasRenderingContext2D} ctx
     * @param {FrameData} data
     * @param {number} accuracy
     */
    draw(canvas, ctx, data, accuracy) {
        const lineLength = data.yWidth;
        const keys = Object.keys(this.map);
        const values = Object.values(this.map);
        let currentHeight = data.yPos;

        for (let v = 0; v < keys.length; v++) {
            const val = v >= keys.length - 1 ? (1 - parseFloat(keys[v])) : (parseFloat(keys[v + 1]) - parseFloat(keys[v]));
            const calc = lineLength * val;
            ctx.fillStyle = values[v];
            ctx.fillRect(data.xPos, currentHeight, data.xWidth, calc);
            currentHeight += calc;
        }
    }
}