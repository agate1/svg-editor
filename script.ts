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
    cp1(): Point {
        return this.p1;
    }
    cp2(): Point {
        return this.p2;
    }
    curr(): Point {
        return this.p3;
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

//svg path to points
var commands = path.split(/(?=[LMCZ])/);

var pts: Array<SVGCPoint> = commands.map((c, k) => {
    var points = c.slice(1, c.length).split(' '); //svg 3points
    points.shift();
    points.pop();

    var svgCPoint = new SVGCPoint();
    debug.innerText += '\n';

    //if first point then add to array as third
    if (k == 0) {
        var xy = points[0].split(',');
        var pt = new Point(xy[0], xy[1]);
        var n = 3;
        svgCPoint.add(n, pt);
        debug.innerText += '| x:' + pt.x + ", y:" + pt.y + ', ';
        return svgCPoint;
    }
    if (k > 0) {
        for (var i = 0; i < points.length; i++) {
            var xy = points[i].split(',');
            var pt = new Point(xy[0], xy[1]);
            var n = i + 1;
            svgCPoint.add(n, pt);
            debug.innerText += '| x:' + pt.x + ", y:" + pt.y + ', ';
        }
        return svgCPoint;
    }
});

pts.pop();

//draw lines and circles
var p0: Point;
pts.forEach((pkt: SVGCPoint, i: number) => {
    if (i == 0) {
        p0 = pkt.curr();
    }
    if ((i >= 1) && (i < pts.length)) {
        debug.innerText = i + ' \n';
        var p1: Point = pkt.cp1();
        
        var circle1 = new Circle(p1, "3", "controlPoint", "cp1-" + i);
        circle1.draw();

        var line1 = new Line(p0, p1, "controlLine", "cl1-" + i);
        line1.draw();

        var p2: Point = pkt.cp2();
        var circle2 = new Circle(p2, "3", "controlPoint", "cp2-" + i);
        circle2.draw();

        var p3: Point = pkt.curr();
        var circle3 = new Circle(p3, "3", "currentPoint", "cp3-" + i);
        circle3.draw();
        p0 = new Point(p3.x, p3.y);

        var line2 = new Line(p2, p3, "controlLine", "cl2-" + i);
        line2.draw();
    }
})

var currPoints = document.getElementsByClassName('currentPoint');
[].forEach.call(currPoints, (item) => {
  item.onmousedown = (e) => {
    document.onmousemove = (e) => {
        
      var pktX = item.getAttributeNS(null, "cx");
      var pktY = item.getAttributeNS(null, "cy");
      var newX = e.pageX;
      var newY = e.pageY;
      item.setAttributeNS(null, "cx", newX);
      item.setAttributeNS(null, "cy", newY);
      var s = pktX + "," + pktY;
      var news = newX + "," + newY;
      //debug.innerText += 'punkty:' + s + '\n';
      //debug.innerText += 'punktynowe:' + news + '\n';
      var pp = G.getAttributeNS(null, "d");
      var newd = pp.replace(s, newX + "," + newY);

    //   //control points
    //   var itemId = item.getAttributeNS(null, "pID");
    //   var numID = itemId.split('-')[1];
    //   var nn = parseInt(numID);
    //   debug.innerText = nn;

    //   var cp1 = document.getElementById("cp1-" + nn);
    //   var cp1X = cp1.getAttributeNS(null, "cx");
    //   var cp1Y = cp1.getAttributeNS(null, "cy");
    //   //debug.innerText = 'punktynowe:';
    //   var newd1 = newd.replace(cp1X + "," + cp1Y, newX + "," + newY);
    //   //debug.innerText += newd;
    //   //debug.innerText += 'punkty:' + pktX + "," + pktY + '\n';
    //   G.setAttributeNS(null, "d", newd1);
      
    //   var next = nn;
      
    //   updateCircle(newX - cp1X,newY - cp1Y,"cp2-" + next)
    //   updateCircle(newX - cp1X,newY - cp1Y,"cp1-" + next)

    //   //check what id is to be udated
    //   var itemId = item.getAttributeNS(null, "pID");
    //   var numID = itemId.split('-')[1];
    //   var next = parseInt(numID) + 1;
    //   //debug.innerText = "idgnext: " + next;
    //   updateLine(newX - cp1X, newY - cp1Y, newX, newY, "cl1-" + next);
    //   // debug.innerText = "idg: " + next;
    //   // }
    //   //cp0 till last element
    //   //if (i == 0)  drawLine(p[i][0][0], p[i][0][1], p[p.length -1][2][0], p[p.length -1][2][1], "controlLine", "cl1-" + i);
    //   //each point has only one line
    //   updateLine(newX - cp1X, p[numID][1][1], newX, newY, "cl2-" + numID);
     }
  }
})

document.onmouseup = function() {
  document.onmousemove = null;
};




