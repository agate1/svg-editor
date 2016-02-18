var svg = document.getElementById("svg");
var G = document.getElementById("g");
var path = G.getAttributeNS(null, "d").trim();
var debug = document.getElementById("debug");
/**
 * Point
 */
var Point = (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    Point.prototype.toPath = function () {
        return this.x + "," + this.y;
    };
    return Point;
}());
/**
 * SVGCPoint
 */
var SVGCPoint = (function () {
    function SVGCPoint() {
    }
    SVGCPoint.prototype.add = function (n, p) {
        switch (n) {
            case 1:
                this.p1 = p;
                break;
            case 2:
                this.p2 = p;
                break;
            case 3:
                this.p3 = p;
                break;
        }
    };
    return SVGCPoint;
}());
/**
 * SVGMPoint
 */
var SVGMPoint = (function () {
    function SVGMPoint(p) {
        this.p = p;
    }
    return SVGMPoint;
}());
/**
 * Circle
 */
var Circle = (function () {
    function Circle(p, r, css, id) {
        this.p = p;
        this.r = r;
        this.css = css;
        this.id = id;
    }
    Circle.prototype.draw = function () {
        var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("class", this.css);
        circle.setAttribute("cx", this.p.x);
        circle.setAttribute("cy", this.p.y);
        circle.setAttribute("r", this.r);
        circle.setAttribute("id", this.id);
        svg.appendChild(circle);
        this.el = document.getElementById(this.id);
    };
    Circle.prototype.update = function (id, p) {
        var circle = document.getElementById(id);
        this.p = p;
        circle.setAttribute("cx", p.x);
        circle.setAttribute("cy", p.y);
    };
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
    }
    Line.prototype.draw = function () {
        var line = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
        line.setAttribute("points", this.p1.toPath() + " " + this.p2.toPath());
        line.setAttribute("class", this.css);
        line.setAttribute("id", this.id);
        svg.appendChild(line);
        this.el = document.getElementById(this.id);
    };
    Line.prototype.update = function (id, p1, p2) {
        var line = this.el;
        this.p1 = p1;
        this.p2 = p2;
        line.setAttribute("points", p1.toPath() + " " + p2.toPath());
    };
    return Line;
}());
// var p1 = new Point("100", "100");
// var p2 = new Point("200", "200");
// var p3 = new Point("300", "300");
// var c = new Circle(p1, "5", "controlPoint", "dg");
// c.draw();
// c.update("dg", p2);
// var l = new Line(p1, p2, "controlLine", "ddd");
// l.draw();
// l.update("ddd", p2, p3);
// debug.innerText = p3.x;
var commands = path.split(/(?=[LMCZ])/);
var pts = commands.map(function (c) {
    var points = c.slice(1, c.length).split(' '); //svg 3points
    points.shift();
    points.pop();
    var svgCPoint = new SVGCPoint();
    debug.innerText += 'new \n';
    for (var i = 0; i < points.length; i++) {
        var xy = points[i].split(',');
        var pt = new Point(xy[0], xy[1]);
        var n = i + 1;
        svgCPoint.add(n, pt);
        debug.innerText += pt.x + ", " + pt.y + '\n';
    }
});
