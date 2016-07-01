var svg = document.getElementById("svg");
var G = document.getElementById("g");
var path = G.getAttributeNS(null, "d").trim();
var debug = document.getElementById("debug");
/**
 * Point
 */
var P = (function () {
    function P(x, y) {
        this.x = x;
        this.y = y;
    }
    P.prototype.toPath = function () {
        return this.x + "," + this.y;
    };
    return P;
}());
/**
 * SVGPointC
 */
var SVGPointC = (function () {
    function SVGPointC() {
    }
    SVGPointC.prototype.add = function (n, p) {
        switch (n) {
            case 1:
                this.cp1 = p;
                break;
            case 2:
                this.p = p;
                break;
            case 3:
                this.cp2 = p;
                break;
        }
    };
    return SVGPointC;
}());
/**
 * SVGMPoint
 */
var SVGPointM = (function () {
    function SVGPointM() {
    }
    SVGPointM.prototype.add = function (n, p) {
        switch (n) {
            case 1:
                this.p = p;
                break;
            case 2:
                this.cp2 = p;
                break;
        }
    };
    return SVGPointM;
}());
/**
 * SVG Path
 */
var MySVGPath = (function () {
    function MySVGPath(d) {
        var temp = d.replace(/[A-Z]/g, "");
        this.cos = temp;
    }
    MySVGPath.prototype.addPathStartPoint = function (p) {
        this.points.push(p);
    };
    MySVGPath.prototype.addPoint = function (p) {
        this.points.push(p);
    };
    return MySVGPath;
}());
//svg path to points
var svgpath = new MySVGPath(path);
//d=" M 190,21 C 213,7 246,10 266,28 C 261,34 256,40 251,46 C 242,38 229,33 216,35 C 210,36 204,40 200,45 C 188,57 189,78 201,90 C 208,97 219,99 229,98 C 233,97 238,95 242,93 C 242,84 242,75 242,65 C 250,65 257,65 265,65 C 265,79 265,93 265,107 C 249,117 230,123 211,120 C 196,118 181,109 173,96 C 164,84 162,68 166,54 C 169,40 178,28 190,21 Z"></path>
debug.innerText = svgpath.cos;
