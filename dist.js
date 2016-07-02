var svg = document.getElementById("svg");
var G = document.getElementById("g");
var path = G.getAttributeNS(null, "d").trim();
var debug = document.getElementById("debug");
/**
 * Point
 */
var P = (function () {
    function P(point) {
        this.x = parseFloat(point.split(",")[0]);
        this.y = parseFloat(point.split(",")[1]);
    }
    P.prototype.toPath = function () {
        return this.x.toString() + "," + this.y.toString();
    };
    return P;
}());
/**
 * SVGPointC
 */
var SVGPointC = (function () {
    function SVGPointC(cp1, p, cp2) {
        this.p = p;
        this.cp2 = cp2;
        this.cp1 = cp1;
    }
    return SVGPointC;
}());
/**
 * SVGMPoint
 */
var SVGPointM = (function () {
    function SVGPointM(p, cp2) {
        this.p = p;
        this.cp2 = cp2;
    }
    return SVGPointM;
}());
/**
 * SVG Path
 */
var MySVGPath = (function () {
    function MySVGPath(d) {
        var temp = d.replace(/[A-Z]/g, "").split(" ");
        var cleanArr = temp.filter(function (s) { return s != ""; });
        var p1 = new P(cleanArr[0]);
        var p2 = new P(cleanArr[1]);
        var pkt1 = new SVGPointM(p1, p2);
        this.points = [];
        this.points.push(pkt1);
        var pointCircle = new Circle(pkt1.p, "3", "currentPoint", "p-" + i + 1);
        var cp2Circle = new Circle(pkt1.cp2, "3", "controlPoint", "cp2-" + i + 1);
        var cp2Line = new Line(pkt1.p, pkt1.cp2, "controlLine", "cl2-" + i + 1);
        this.controls = [];
        var controlSet1 = [pointCircle, cp2Circle, cp2Line];
        this.controls.push(controlSet1);
        var i;
        var k = 1;
        for (i = 2; i <= cleanArr.length - 3; i += 3) {
            var cp1 = new P(cleanArr[i]);
            var p = new P(cleanArr[i + 1]);
            var cp2 = new P(cleanArr[i + 2]);
            var pkt = new SVGPointC(cp1, p, cp2);
            this.points.push(pkt);
            var pointCircle = new Circle(pkt.p, "3", "currentPoint", "p-" + k);
            var cp2Circle = new Circle(pkt.cp2, "3", "controlPoint", "cp2-" + k);
            var cp2Line = new Line(pkt.p, pkt.cp2, "controlLine", "cl2-" + k);
            if (i > 0) {
                var cp1Circle = new Circle(pkt.cp1, "3", "controlPoint", "cp1-" + k);
                var cp1Line = new Line(pkt.p, pkt.cp1, "controlLine", "cl1-" + k);
            }
            var controlSet = [pointCircle, cp2Circle, cp1Circle, cp2Line, cp1Line];
            this.controls.push(controlSet);
            k++;
        }
    }
    return MySVGPath;
}());
/**
 * Circle
 */
var Circle = (function () {
    function Circle(p, r, css, id) {
        this.center = p;
        this.r = r;
        this.css = css;
        this.id = id;
        var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("class", this.css);
        circle.setAttribute("cx", this.center.x);
        circle.setAttribute("cy", this.center.y);
        circle.setAttribute("r", this.r);
        circle.setAttribute("id", this.id);
        svg.appendChild(circle);
        this.el = document.getElementById(this.id);
    }
    return Circle;
}());
/**
 * Line
 */
var Line = (function () {
    function Line(p1, p2, css, id) {
        this.p1 = p1;
        this.p2 = p2;
        this.css = css;
        this.id = id;
        var line = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
        line.setAttribute("points", this.p1.toPath() + " " + this.p2.toPath());
        line.setAttribute("class", this.css);
        line.setAttribute("id", this.id);
        svg.appendChild(line);
        this.el = document.getElementById(this.id);
    }
    return Line;
}());
function updateLine(id, lineType, dx, dy) {
    var itemId = parseInt(id.split("-")[1]);
    var tid = lineType == "cl1" ? itemId + 1 : itemId;
    //var tid = (itemId) + 1;
    var line = document.getElementById(lineType + "-" + tid);
    var points = line.getAttributeNS(null, "points").split(" ");
    var startPoint = points[0];
    var startXY = startPoint.split(",");
    var endPoint = points[1];
    var endXY = endPoint.split(",");
    var newStartX = parseFloat(startXY[0]) - dx;
    var newStartY = parseFloat(startXY[1]) - dy;
    var newEndX = parseFloat(endXY[0]) - dx;
    var newEndY = parseFloat(endXY[1]) - dy;
    line.setAttribute("points", newStartX + "," + newStartY + " " + newEndX + "," + newEndY);
}
//svg path to points
var svgpath = new MySVGPath(path);
//d=" M 190,21 C 213,7 246,10 266,28 C 261,34 256,40 251,46 C 242,38 229,33 216,35 C 210,36 204,40 200,45 C 188,57 189,78 201,90 C 208,97 219,99 229,98 C 233,97 238,95 242,93 C 242,84 242,75 242,65 C 250,65 257,65 265,65 C 265,79 265,93 265,107 C 249,117 230,123 211,120 C 196,118 181,109 173,96 C 164,84 162,68 166,54 C 169,40 178,28 190,21 Z"></path>
//draw control points and lines
svgpath.points.forEach(function (pkt, i) {
    var pointCircle = new Circle(pkt.p, "3", "currentPoint", "p-" + i + 1);
    var cp2Circle = new Circle(pkt.cp2, "3", "controlPoint", "cp2-" + i + 1);
    var cp2Line = new Line(pkt.p, pkt.cp2, "controlLine", "cl2-" + i + 1);
    if (i > 0) {
        var cp1Circle = new Circle(pkt.cp1, "3", "controlPoint", "cp1-" + i + 1);
        var cp1Line = new Line(pkt.p, pkt.cp1, "controlLine", "cl1-" + i + 1);
    }
});
debug.innerText = "kk";
