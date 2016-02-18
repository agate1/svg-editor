var svg = document.getElementById("svg");
var G = document.getElementById("g");
var path = G.getAttributeNS(null, "d").trim();
var debug = document.getElementById("debug");

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
    toPath() {
        return this.x + "," + this.y;
    }
} 

/**
 * SVGCPoint
 */
class SVGCPoint {
    private p1: Point;
    private p2: Point;
    private p3: Point;
    add(n: number, p: Point) {
        switch (n) {
            case 1: this.p1 = p; break;
            case 2: this.p2 = p; break;
            case 3: this.p3 = p; break;
        }
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
    private el: HTMLElement;
    constructor(p: Point, r: string, css: string, id: string) {
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
        circle.setAttribute("id", this.id);
        svg.appendChild(circle);
        this.el = document.getElementById(this.id);
    }
    update(id: string, p: Point) {
        var circle = document.getElementById(id);
        this.p = p;
        circle.setAttribute("cx", p.x);
        circle.setAttribute("cy", p.y);
    }
}


/**
 * Line
 */
class Line {
    private p1: Point;
    private p2: Point;
    private css: string;
    private id: string;
    private el: HTMLElement;
    constructor(p1, p2, css, id) {
        this.p1 = p1;
        this.p2 = p2;
        this.css = css;
        this.id = id;
    }
    draw() {
        var line = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
        line.setAttribute("points", this.p1.toPath() + " " + this.p2.toPath());
        line.setAttribute("class", this.css);
        line.setAttribute("id", this.id);
        svg.appendChild(line);
        this.el = document.getElementById(this.id);
    }
    update(id: string, p1: Point, p2: Point) {
        var line = this.el;
        this.p1 = p1;
        this.p2 = p2;
        line.setAttribute("points", p1.toPath() + " " + p2.toPath());
    }
}

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

var pts = commands.map((c) => {
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

