var svg = document.getElementById("svg");
var G = document.getElementById("g");
var path = G.getAttributeNS(null, "d").trim();
var debug = document.getElementById("debug");

function drawCircle(x, y, r, css, id) {
    var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("class", css);
    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y);
    circle.setAttribute("r", r);
    circle.setAttribute("pID", id);
    circle.setAttribute("id", id);
    svg.appendChild(circle);
}

function updateCircle(x, y, id) {
    var circle = document.getElementById(id);
    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y);
}

function drawLine(x1, y1, x2, y2, css, id) {
    var line = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    line.setAttribute("points", x1 + "," + y1 + " " + x2 + "," + y2);
    line.setAttribute("class", css);
    line.setAttribute("id", id);
    svg.appendChild(line);
}

function updateLine(x1, y1, x2, y2, id) {
    var line = document.getElementById(id)
    line.setAttribute("points", x1 + "," + y1 + " " + x2 + "," + y2);
}

/**
 * Point
 */
class Point {
    x: string;
    y: string;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
} 

/**
 * SVGCPoint
 */
class SVGCPoint {
    private p1: Point;
    private p2: Point;
    private p3: Point;
    constructor(p1, p2, p3) {
        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;
    }
}

/**
 * SVGMPoint
 */
class SVGMPoint {
    private p: Point;
    constructor(p) {
        this.p = p;
    }
}

/**
 * Circle
 */
class Circle {
    private p: Point;
    private r: string;
    private css: string;
    private id: string;
    constructor(p, r, css, id) {
        this.p = p;
        this.r = r;
        this.css = css;
        this.id = id;
    }
    draw() {
        var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("class", this.css);
        circle.setAttribute("cx", this.p.x);
        circle.setAttribute("cy", this.p.y);
        circle.setAttribute("r", this.r);
        circle.setAttribute("pID", this.id);
        circle.setAttribute("id", this.id);
        svg.appendChild(circle);
    }
    update(p, id) {
        var circle = document.getElementById(id);
        circle.setAttribute("cx", this.p.x);
        circle.setAttribute("cy", this.p.y);
    }
}

var p1 = new Point("100", "100");
var c = new Circle(p1,"5","controlPoint", "dg" );
c.draw();

debug.innerText = p1.x;



