class Color {

    #colorObject = [];

    constructor(color) {
        this.setColor(color === undefined ? 'transparent' : color);
    }

    #setColorObject() {
        var c = Array.isArray(arguments[0]) ? arguments[0] : arguments;
        if (c[0] || c[0] === 0) this.#colorObject[0] = (c[0] < 0 ? 0 : (c[0] > 255 ? 255 : Math.round(parseFloat(c[0]))));
        if (c[1] || c[1] === 0) this.#colorObject[1] = (c[1] < 0 ? 0 : (c[1] > 255 ? 255 : Math.round(parseFloat(c[1]))));
        if (c[2] || c[2] === 0) this.#colorObject[2] = (c[2] < 0 ? 0 : (c[2] > 255 ? 255 : Math.round(parseFloat(c[2]))));
        if (c[3] || c[3] === 0) this.#colorObject[3] = (c[3] < 0 ? 0 : (c[3] > 1 ? 1 : parseFloat(c[3])));
    }

    #getColorObject(r,g,b,a) {
        var c = [];
        if (r) c[c.length] = c.r = c.red   = this.#colorObject[0];
        if (g) c[c.length] = c.g = c.green = this.#colorObject[1];
        if (b) c[c.length] = c.b = c.blue  = this.#colorObject[2];
        if (a) c[c.length] = c.a = c.alpha = this.#colorObject[3];
        return (c.length === 1 ? c[0] : c);
    }

    setRgb(r, g, b) {
        this.#setColorObject(r, g, b);
        return this;
    }

    setRgba(r, g, b, a) {
        this.#setColorObject(r, g, b, a);
        return this;
    }

    applyMatrixFilter(M) {
        this.#setColorObject(
            M[0][0] * this.#colorObject[0] + M[1][0] * this.#colorObject[1] + M[2][0] * this.#colorObject[2] + M[3][0] * this.#colorObject[3] + M[4][0],
            M[0][1] * this.#colorObject[0] + M[1][1] * this.#colorObject[1] + M[2][1] * this.#colorObject[2] + M[3][1] * this.#colorObject[3] + M[4][1],
            M[0][2] * this.#colorObject[0] + M[1][2] * this.#colorObject[1] + M[2][2] * this.#colorObject[2] + M[3][2] * this.#colorObject[3] + M[4][2],
            M[0][3] * this.#colorObject[0] + M[1][3] * this.#colorObject[1] + M[2][3] * this.#colorObject[2] + M[3][3] * this.#colorObject[3] + M[4][3]
        );
        return this;
    }

    applyColorFilter(color) {
        color = (new this.constructor(color)).getRgba();
        this.applyMatrixFilter([
            [(255-color[0])/3/255, (255-color[1])/3/255, (255-color[2])/3/255, 0],
            [(255-color[0])/3/255, (255-color[1])/3/255, (255-color[2])/3/255, 0],
            [(255-color[0])/3/255, (255-color[1])/3/255, (255-color[2])/3/255, 0],
            [0, 0, 0, color[3]],
            [color[0], color[1], color[2], 0],
        ]);
        return this;
    }

    brightness(brightness) {
        return this.brightnessRgba(brightness, brightness, brightness, 1);
    }

    brightnessRgba(r,g,b,a) {
        this.applyMatrixFilter([
            [r,0,0,0],
            [0,g,0,0],
            [0,0,b,0],
            [0,0,0,a],
            [0,0,0,0],
        ]);
        return this;
    }

    setColor(color) {
        var h,
            i,
            result;

        if (color.constructor === Number && color <= 0xffffffff) {
            result = [
                Math.floor(color / 0x1000000),
                Math.floor(color % 0x1000000 / 0x10000),
                Math.floor(color % 0x1000000 % 0x10000 / 0x100),
                color % 256 / 255
            ];
        }
        else if (color.constructor === String) {
            if (this.constructor.keywords[color]) {
                result = this.constructor.keywords[color];
            }
            else if (h = color.match(/^\s*rgb(a?)\(\s*([0-9]+)(\%|)\s*\,\s*([0-9]+)\3\s*\,\s*([0-9]+)\3\s*(\,\s*(0?\.[0-9]+|0|1)\s*|)\)\s*$/i)) {
                result = (h[3] && h[3].length
                    ? [Math.round(parseInt(h[2]) * 2.55), Math.round(parseInt(h[4]) * 2.55), Math.round(parseInt(h[5]) * 2.55), parseFloat(h[1] && h[6] ? h[7] : 1)]
                    : [parseInt(h[2]), parseInt(h[4]), parseInt(h[5]), parseFloat(h[6] ? h[7] : 1)]
                );
            }
            else if (h = color.match(/^\s*rgb(a?)\(\s*([0-9]+)(\%|)\s*([0-9]+)\3\s*([0-9]+)\3\s*(\/\s*(0?\.[0-9]+|0|1)\s*|)\)\s*$/i)) {
                result = (h[3] && h[3].length
                    ? [Math.round(parseInt(h[2]) * 2.55), Math.round(parseInt(h[4]) * 2.55), Math.round(parseInt(h[5]) * 2.55), parseFloat(h[1] && h[6] ? h[7] : 1)]
                    : [parseInt(h[2]), parseInt(h[4]), parseInt(h[5]), parseFloat(h[6] ? h[7] : 1)]
                );
            }
            else if (h = color.match(/^\s*\#?(?:([0-9a-f])([0-9a-f])([0-9a-f])([0-9a-f])?|([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})?)\s*$/i)) {
                result = (h[1] && h[1].length
                    ? [parseInt(h[1]+h[1], 16), parseInt(h[2]+h[2], 16), parseInt(h[3]+h[3], 16), (h[4] ? parseInt(h[4]+h[4], 16) / 255 : 1)]
                    : [parseInt(h[5], 16), parseInt(h[6], 16), parseInt(h[7], 16), (h[8] ? parseInt(h[8], 16) / 255 : 1)]
                );
            }
        }
        else if (typeof color === 'object') {
            if (color instanceof this.constructor && typeof color.getRgba === 'function') {
                result = color.getRgba();
            }
            else if (color.constructor === Array && color.length > 2) {
                result = [
                    parseInt(color[0]),
                    parseInt(color[1]),
                    parseInt(color[2]),
                    (color[3] !== undefined ? parseFloat(color[3]) : 1)
                ];
            }
            else if (color.red !== undefined && color.green !== undefined && color.blue !== undefined) {
                result = [
                    parseInt(color.red),
                    parseInt(color.green),
                    parseInt(color.blue),
                    (color.alpha !== undefined ? parseFloat(color.alpha) : 1)
                ];
            }
            else if (color.r !== undefined && color.g !== undefined && color.b !== undefined) {
                result = [
                    parseInt(color.r),
                    parseInt(color.g),
                    parseInt(color.b),
                    (color.a !== undefined ? parseFloat(color.a) : 1)
                ];
            }
        }
        else if (typeof color === 'function') {
            result = color(this.#getColorObject(1,1,1,1));
            if (result !== color) {
                this.setColor(result);
                result = this.#colorObject;
            }
        }

        if (!result) throw new Error('invalid color value');

        this.#setColorObject(result);
        return this;
    }

    setHSV(h, s, v) {
        var result = [],
            xh,xi,x1,x2,x3,xr,xg,xb;
        h = (h % 360) / 360;
        s = s / 100;
        v = v / 100;

        if (s == 0) {
            result[0] = v * 255;
            result[1] = v * 255;
            result[2] = v * 255;
        } else {
            xh = h * 6;
            xi = Math.floor(xh);
            x1 = v * (1 - s);
            x2 = v * (1 - s * (xh - xi));
            x3 = v * (1 - s * (1 - (xh - xi)));

            if (xi == 0) {xr = v; xg = x3; xb = x1}
            else if (xi == 1) {xr = x2; xg = v; xb = x1}
            else if (xi == 2) {xr = x1; xg = v; xb = x3}
            else if (xi == 3) {xr = x1; xg = x2; xb = v}
            else if (xi == 4) {xr = x3; xg = x1; xb = v}
            else {xr = v; xg = x1; xb = x2};

            result[0] = xr * 255;
            result[1] = xg * 255;
            result[2] = xb * 255;
        }

        this.#setColorObject(result);

        return this;
    }

    getHSV() {
        var r = this.#colorObject[0] / 255;
        var g = this.#colorObject[1] / 255;
        var b = this.#colorObject[2] / 255;

        var minVal = Math.min(r, g, b);
        var maxVal = Math.max(r, g, b);
        var delta = maxVal - minVal;

        var result = [];

        result.v = maxVal;

        if (delta == 0) {
            result.h = 0;
            result.s = 0;
        } else {
            result.s = delta / maxVal;
            var del_R = (((maxVal - r) / 6) + (delta / 2)) / delta;
            var del_G = (((maxVal - g) / 6) + (delta / 2)) / delta;
            var del_B = (((maxVal - b) / 6) + (delta / 2)) / delta;

            switch (maxVal) {
                case r: result.h = del_B - del_G; break;
                case g: result.h = (1 / 3) + del_R - del_B; break;
                case b: result.h = (2 / 3) + del_G - del_R; break;
            }

            if (result.h < 0) {result.h += 1;}
            if (result.h > 1) {result.h -= 1;}
        }
        result.h *= 360;
        result.s *= 100;
        result.v *= 100;

        result[0] = result.h;
        result[1] = result.s;
        result[2] = result.v;

        return result;
    }

    invert() {
        this.#setColorObject(
            255 - this.#colorObject[0],
            255 - this.#colorObject[1],
            255 - this.#colorObject[2]
        );
        return this;
    }

    invertAlpha() {
        this.#setColorObject(
            null,
            null,
            null,
            1 - this.#colorObject[3]
        );
        return this;
    }

    getCss() {
        return (this.#colorObject[3] < 1 ? this.getCssRgba() : this.getCssRgb());
    }

    getCssRgb() {
        return 'rgb(' +
            this.#colorObject[0] + ',' +
            this.#colorObject[1] + ',' +
            this.#colorObject[2] + ')';
    }

    getCssRgba() {
        return 'rgba(' +
            this.#colorObject[0] + ',' +
            this.#colorObject[1] + ',' +
            this.#colorObject[2] + ',' +
            this.#colorObject[3] + ')';
    }

    getCssHex() {
        var alpha = Math.round(this.#colorObject[3] * 255);
        return '#' +
            (this.#colorObject[0] < 16 ? '0' : '') + (this.#colorObject[0]).toString(16) +
            (this.#colorObject[1] < 16 ? '0' : '') + (this.#colorObject[1]).toString(16) +
            (this.#colorObject[2] < 16 ? '0' : '') + (this.#colorObject[2]).toString(16) +
            (alpha < 255 ? alpha.toString(16) : '');
    }

    getRgb() {
        return this.#getColorObject(1,1,1,0);
    }

    getRgba() {
        return this.#getColorObject(1,1,1,1);
    }

    getRed() {
        return this.#getColorObject(1,0,0,0);
    }

    getGreen() {
        return this.#getColorObject(0,1,0,0);
    }

    getBlue() {
        return this.#getColorObject(0,0,1,0);
    }

    getAlpha() {
        return this.#getColorObject(0,0,0,1);
    }

    getRgbNumber() {
        return this.#colorObject[0] * 256 * 256 + this.#colorObject[1] * 256 + this.#colorObject[2];
    }

    getRgbaNumber() {
        return this.#colorObject[0] * 256 * 256 * 256 + this.#colorObject[1] * 256 * 256 + this.#colorObject[2] * 256 + Math.round(this.#colorObject[3] * 255);
    }

    toString() {
        return this.getCss();
    }

    toNumber() {
        return this.getRgbaNumber();
    }

    toArray() {
        return [this.#colorObject[0], this.#colorObject[1], this.#colorObject[2], this.#colorObject[3]];
    }
}

Color.keywords = {
    transparent: [0, 0, 0, 0],
    aliceblue: [240, 248, 255, 1],
    antiquewhite: [250, 235, 215, 1],
    aqua: [0, 255, 255, 1],
    aquamarine: [127, 255, 212, 1],
    azure: [240, 255, 255, 1],
    beige: [245, 245, 220, 1],
    bisque: [255, 228, 196, 1],
    black: [0, 0, 0, 1],
    blanchedalmond: [255, 235, 205, 1],
    blue: [0, 0, 255, 1],
    blueviolet: [138, 43, 226, 1],
    brown: [165, 42, 42, 1],
    burlywood: [222, 184, 135, 1],
    cadetblue: [95, 158, 160, 1],
    chartreuse: [127, 255, 0, 1],
    chocolate: [210, 105, 30, 1],
    coral: [255, 127, 80, 1],
    cornflowerblue: [100, 149, 237, 1],
    cornsilk: [255, 248, 220, 1],
    crimson: [220, 20, 60, 1],
    cyan: [0, 255, 255, 1],
    darkblue: [0, 0, 139, 1],
    darkcyan: [0, 139, 139, 1],
    darkgoldenrod: [184, 134, 11, 1],
    darkgray: [169, 169, 169, 1],
    darkgreen: [0, 100, 0, 1],
    darkgrey: [169, 169, 169, 1],
    darkkhaki: [189, 183, 107, 1],
    darkmagenta: [139, 0, 139, 1],
    darkolivegreen: [85, 107, 47, 1],
    darkorange: [255, 140, 0, 1],
    darkorchid: [153, 50, 204, 1],
    darkred: [139, 0, 0, 1],
    darksalmon: [233, 150, 122, 1],
    darkseagreen: [143, 188, 143, 1],
    darkslateblue: [72, 61, 139, 1],
    darkslategray: [47, 79, 79, 1],
    darkslategrey: [47, 79, 79, 1],
    darkturquoise: [0, 206, 209, 1],
    darkviolet: [148, 0, 211, 1],
    deeppink: [255, 20, 147, 1],
    deepskyblue: [0, 191, 255, 1],
    dimgray: [105, 105, 105, 1],
    dimgrey: [105, 105, 105, 1],
    dodgerblue: [30, 144, 255, 1],
    firebrick: [178, 34, 34, 1],
    floralwhite: [255, 250, 240, 1],
    forestgreen: [34, 139, 34, 1],
    fuchsia: [255, 0, 255, 1],
    gainsboro: [220, 220, 220, 1],
    ghostwhite: [248, 248, 255, 1],
    gold: [255, 215, 0, 1],
    goldenrod: [218, 165, 32, 1],
    gray: [128, 128, 128, 1],
    green: [0, 128, 0, 1],
    greenyellow: [173, 255, 47, 1],
    grey: [128, 128, 128, 1],
    honeydew: [240, 255, 240, 1],
    hotpink: [255, 105, 180, 1],
    indianred: [205, 92, 92, 1],
    indigo: [75, 0, 130, 1],
    ivory: [255, 255, 240, 1],
    khaki: [240, 230, 140, 1],
    lavender: [230, 230, 250, 1],
    lavenderblush: [255, 240, 245, 1],
    lawngreen: [124, 252, 0, 1],
    lemonchiffon: [255, 250, 205, 1],
    lightblue: [173, 216, 230, 1],
    lightcoral: [240, 128, 128, 1],
    lightcyan: [224, 255, 255, 1],
    lightgoldenrodyellow: [250, 250, 210, 1],
    lightgray: [211, 211, 211, 1],
    lightgreen: [144, 238, 144, 1],
    lightgrey: [211, 211, 211, 1],
    lightpink: [255, 182, 193, 1],
    lightsalmon: [255, 160, 122, 1],
    lightseagreen: [32, 178, 170, 1],
    lightskyblue: [135, 206, 250, 1],
    lightslategray: [119, 136, 153, 1],
    lightslategrey: [119, 136, 153, 1],
    lightsteelblue: [176, 196, 222, 1],
    lightyellow: [255, 255, 224, 1],
    lime: [0, 255, 0, 1],
    limegreen: [50, 205, 50, 1],
    linen: [250, 240, 230, 1],
    magenta: [255, 0, 255, 1],
    maroon: [128, 0, 0, 1],
    mediumaquamarine: [102, 205, 170, 1],
    mediumblue: [0, 0, 205, 1],
    mediumorchid: [186, 85, 211, 1],
    mediumpurple: [147, 112, 219, 1],
    mediumseagreen: [60, 179, 113, 1],
    mediumslateblue: [123, 104, 238, 1],
    mediumspringgreen: [0, 250, 154, 1],
    mediumturquoise: [72, 209, 204, 1],
    mediumvioletred: [199, 21, 133, 1],
    midnightblue: [25, 25, 112, 1],
    mintcream: [245, 255, 250, 1],
    mistyrose: [255, 228, 225, 1],
    moccasin: [255, 228, 181, 1],
    navajowhite: [255, 222, 173, 1],
    navy: [0, 0, 128, 1],
    oldlace: [253, 245, 230, 1],
    olive: [128, 128, 0, 1],
    olivedrab: [107, 142, 35, 1],
    orange: [255, 165, 0, 1],
    orangered: [255, 69, 0, 1],
    orchid: [218, 112, 214, 1],
    palegoldenrod: [238, 232, 170, 1],
    palegreen: [152, 251, 152, 1],
    paleturquoise: [175, 238, 238, 1],
    palevioletred: [219, 112, 147, 1],
    papayawhip: [255, 239, 213, 1],
    peachpuff: [255, 218, 185, 1],
    peru: [205, 133, 63, 1],
    pink: [255, 192, 203, 1],
    plum: [221, 160, 221, 1],
    powderblue: [176, 224, 230, 1],
    purple: [128, 0, 128, 1],
    rebeccapurple: [102, 51, 153, 1],
    red: [255, 0, 0, 1],
    rosybrown: [188, 143, 143, 1],
    royalblue: [65, 105, 225, 1],
    saddlebrown: [139, 69, 19, 1],
    salmon: [250, 128, 114, 1],
    sandybrown: [244, 164, 96, 1],
    seagreen: [46, 139, 87, 1],
    seashell: [255, 245, 238, 1],
    sienna: [160, 82, 45, 1],
    silver: [192, 192, 192, 1],
    skyblue: [135, 206, 235, 1],
    slateblue: [106, 90, 205, 1],
    slategray: [112, 128, 144, 1],
    slategrey: [112, 128, 144, 1],
    snow: [255, 250, 250, 1],
    springgreen: [0, 255, 127, 1],
    steelblue: [70, 130, 180, 1],
    tan: [210, 180, 140, 1],
    teal: [0, 128, 128, 1],
    thistle: [216, 191, 216, 1],
    tomato: [255, 99, 71, 1],
    turquoise: [64, 224, 208, 1],
    violet: [238, 130, 238, 1],
    wheat: [245, 222, 179, 1],
    white: [255, 255, 255, 1],
    whitesmoke: [245, 245, 245, 1],
    yellow: [255, 255, 0, 1],
    yellowgreen: [154, 205, 50, 1]
};
