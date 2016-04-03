var svg = document.getElementById("svg");
var G = document.getElementById("g");
var path = G.getAttributeNS(null, "d").trim();
var debug = document.getElementById("debug");


/**
 * Point
 */
class Point {
	x:string;
	y:string;

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
	private p1:Point;
	private p2:Point;
	private p3:Point;

	add(n:number, p:Point) {
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
	}

	cp1():Point {
		return this.p1;
	}

	cp2():Point {
		return this.p2;
	}

	curr():Point {
		return this.p3;
	}
}

/**
 * SVGMPoint
 */
class SVGMPoint {
	private p:Point;

	constructor(p) {
		this.p = p;
	}
}


/**
 * Circle
 */
class Circle {
	private p:Point;
	private r:string;
	private css:string;
	private id:string;
	private el:HTMLElement;

	constructor(p:Point, r:string, css:string, id:string) {
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

	update(p:Point) {
		var circle = this.el;
		this.p = p;
		circle.setAttribute("cx", p.x);
		circle.setAttribute("cy", p.y);
	}
}


/**
 * Line
 */
class Line {
	private p1:Point;
	private p2:Point;
	private css:string;
	private id:string;
	private el:HTMLElement;

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

	update(id:string, p1:Point, p2:Point) {
		var line = this.el;
		this.p1 = p1;
		this.p2 = p2;
		line.setAttribute("points", p1.toPath() + " " + p2.toPath());
	}
}

class SVGPath {
	points:Array<any> = [];

	addToPath(p:SVGCPoint) {
		this.points.push(p);
	}

	updateSVGPoint(itemId, p:Point, dx, dy, all) {
		var id = parseInt(itemId.split("-")[1]);

		this.points[id + 1].p1.x = this.points[id + 1].p1.x - dx;
		this.points[id + 1].p1.y = this.points[id + 1].p1.y - dy;
		this.points[id].p2.x = this.points[id].cp2().x - dx;
		this.points[id].p2.y = this.points[id].cp2().y - dy;
		this.points[id].curr().x = p.x;
		this.points[id].curr().y = p.y;
	}

	updateSVGPointPath(itemId, p:Point, dx, dy, all) {
		var id = parseInt(itemId.split("-")[1]);

		this.points[id + 1].p1.x = this.points[id + 1].p1.x - dx;
		this.points[id + 1].p1.y = this.points[id + 1].p1.y - dy;
		this.points[id].p2.x = parseFloat(this.points[id].cp2().x) + parseFloat(dx);
		this.points[id].p2.y = parseFloat(this.points[id].cp2().y) + parseFloat(dy);
	}

	pathToString() {
		var stringPath:string = "";
		this.points.forEach((p) => {
			if (!p.p1) {
				stringPath += "M " + p.curr().toPath() + " ";
			}
			else {
				stringPath += "C " + p.p1.toPath() + " " + p.cp2().toPath() + " " + p.curr().toPath() + " ";
			}
		});
		stringPath += "Z";
		return stringPath;
	}
}


//svg path to points
var commands = path.split(/(?=[LMCZ])/);
var svgPath = new SVGPath();

var pts:Array<SVGCPoint> = commands.map((c, k) => {
	var points = c.slice(1, c.length).split(' '); //svg 3points
	points.shift();
	points.pop();

	var svgCPoint = new SVGCPoint();

	debug.innerText += '\n';

	//if initial (M) point then add to array as third
	if (k == 0) {
		var xy = points[0].split(',');
		var pt = new Point(xy[0], xy[1]);
		var n = 3;
		svgCPoint.add(n, pt);
		debug.innerText += '| x:' + pt.x + ", y:" + pt.y + ', ';
		svgPath.addToPath(svgCPoint);
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
		svgPath.addToPath(svgCPoint);
		return svgCPoint;
	}
});

pts.pop();
svgPath.points.pop();

//draw lines and circles
var p0:Point;
pts.forEach((pkt:SVGCPoint, i:number) => {
	if (i == 0) {
		p0 = pkt.curr();
	}
	if ((i >= 1) && (i < pts.length)) {
		debug.innerText = i + ' \n';
		var p1:Point = pkt.cp1();

		//blue
		var circle1 = new Circle(p1, "3", "controlPoint", "cp1-" + i);
		circle1.draw();

		var line1 = new Line(p0, p1, "controlLine", "cl1-" + i);
		line1.draw();
		//green
		var p2:Point = pkt.cp2();
		var circle2 = new Circle(p2, "3", "controlPoint", "cp2-" + i);
		circle2.draw();

		var p3:Point = pkt.curr();
		var circle3 = new Circle(p3, "3", "currentPoint", "cp3-" + i);
		circle3.draw();
		p0 = new Point(p3.x, p3.y);

		var line2 = new Line(p2, p3, "controlLine", "cl2-" + i);
		line2.draw();
	}
});

function updateControlPoint(id:string, cp, dx, dy) {
	var itemId = parseInt(id.split("-")[1]);
	var tid = cp == "cp1" ? itemId + 1 : itemId;
	var circle = document.getElementById(cp + "-" + tid);
	var pktX = circle.getAttributeNS(null, "cx");
	var pktY = circle.getAttributeNS(null, "cy");
	var newX = parseFloat(pktX) - dx;
	var newY = parseFloat(pktY) - dy;
	circle.setAttribute("cx", newX.toString());
	circle.setAttribute("cy", newY.toString());
}
/////////////////////
function updateLine(id:string, cl, dx, dy) {
	var itemId = parseInt(id.split("-")[1]);
	var tid = cl == "cl1" ? itemId + 1 : itemId;
	//var tid = (itemId) + 1;
	var line = document.getElementById(cl + "-" + tid);
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

function partialUpdateLine(id:string, cl, x1, y1, x2, y2, option) {
	var itemId = parseInt(id.split("-")[1]);

	if(option == 1) {
		var tid = (cl == "cl1")? itemId + 1 : itemId;
	} else {
		var tid = (cl == "cl1")? itemId : itemId;

	}

	//if (cl == "cl1") var tid = itemId + 1;
	//if (cl == "cl2") var tid = itemId;


	//var tid = (itemId) + 1;
	var line = document.getElementById(cl + "-" + tid);
	var points = line.getAttributeNS(null, "points").split(" ");
	var startPoint = points[0];
	var startXY = startPoint.split(",");
	var endPoint = points[1];
	var endXY = endPoint.split(",");

	//find current point, this stays the other moves
	// if((parseFloat(startXY[0]) == anchorX) && (parseFloat(startXY[1]) == anchorY)) {
	// 	var newX = parseFloat(endXY[0]) - dx;
	// 	var newY = parseFloat(endXY[1]) - dy;
		line.setAttribute("points", x1 + "," + y1 + " " + x2 + "," + y2);
	//
	// } else {
	// 	var newX = parseFloat(startXY[0]) - dx;
	// 	var newY = parseFloat(startXY[1]) - dy;
	// 	line.setAttribute("points", newX + "," + newY + " " + anchorX + "," + anchorY);
	// }
}

function getIdNumber (s:string) {
	var idNumber = parseInt(s.split("-")[1]);
	return idNumber;
}

function getItemFullId (idNum:number, itemType:string) {
	return itemType + "-" + idNum;
}

function getItemType (item:HTMLElement) {
	return item.id.split("-")[0];
}

function getOtherControlPoint (item:HTMLElement) {
	var itemType = getItemType(item);
	var idNum, siblingId;
	switch (itemType) {
		case "cp1":
			idNum = getIdNumber(item.id);
			siblingId = getItemFullId(idNum - 1,"cp2");
			break;
		case "cp2":
			idNum = getIdNumber(item.id);
			siblingId = getItemFullId(idNum,"cp1");
			break;
	}
	return document.getElementById(siblingId);
}

function getCurrentPoint (item:HTMLElement) {
	var itemType = getItemType(item);
	var idNum, siblingId;
	switch (itemType) {
		case "cp1":
			idNum = getIdNumber(item.id);
			siblingId = getItemFullId(idNum - 1,"cp3");
			break;
		case "cp2":
			idNum = getIdNumber(item.id);
			siblingId = getItemFullId(idNum,"cp3");
			break;
	}
	return document.getElementById(siblingId);
}

function getX (item) {
	return item.getAttributeNS(null, "cx");
}

function getY (item) {
	return item.getAttributeNS(null, "cy");
}

///user moves current point
var currPoints = document.getElementsByClassName('currentPoint');
[].forEach.call(currPoints, (item) => {
	item.onmousedown = (e) => {
		document.onmousemove = (e) => {

			var pktX = item.getAttributeNS(null, "cx");
			var pktY = item.getAttributeNS(null, "cy");
			var newX = e.pageX;
			var newY = e.pageY;


			//updating current point
			item.setAttributeNS(null, "cx", newX);
			item.setAttributeNS(null, "cy", newY);

			//update control point1
			var przesX = pktX - newX;
			var przesY = pktY - newY;

			//var newC1Point = new Point(e.pageX, e.pageY);
			updateControlPoint(item.id, "cp1", przesX, przesY);
			updateControlPoint(item.id, "cp2", przesX, przesY);
			updateLine(item.id, "cl1", przesX, przesY);
			updateLine(item.id, "cl2", przesX, przesY);

			//update path
			var newC1Point = new Point(e.pageX, e.pageY);
			svgPath.updateSVGPoint(item.id, newC1Point, przesX, przesY, true);
			var newPath = svgPath.pathToString();
			debug.innerHTML = newPath;
			G.setAttributeNS(null, "d", newPath);

		}
	}
});

///user moves control point 1
var currPoints = document.getElementsByClassName('controlPoint');
[].forEach.call(currPoints, (item) => {
	item.onmousedown = (e) => {
		document.onmousemove = (e) => {

			var pktX = item.getAttributeNS(null, "cx");
			var pktY = item.getAttributeNS(null, "cy");
			var newX = e.pageX;
			var newY = e.pageY;

			//updating current point
			item.setAttributeNS(null, "cx", newX);
			item.setAttributeNS(null, "cy", newY);

			var otherCP = getOtherControlPoint(item);
			//update control point1
			var przesX =  pktX - newX;
			var przesY =  pktY - newY;
			var otherCPType = getItemType(otherCP);
			//parseFloat(getY(otherCP))

			updateControlPoint(otherCP.id, otherCPType, -przesX, -przesY);
			//get cuurent point position
			var curr = getCurrentPoint(item);
			var currX = getX(curr);
			var currY =  getY(curr);
			var c2X = getX(otherCP);
			var c2Y = getY(otherCP);

			if ( getItemType(item) == "cp1") {
				partialUpdateLine(otherCP.id, "cl1", currX, currY, newX, newY,1);
				partialUpdateLine(otherCP.id, "cl2", currX, currY, c2X, c2Y,1);
			} else {

				var firstCp = getOtherControlPoint(item);
				var c1X = getX(firstCp);
				var c1Y = getY(firstCp);
				partialUpdateLine(otherCP.id, "cl1", currX, currY, c2X, c2Y, 2);
				partialUpdateLine(otherCP.id, "cl2", currX, currY, newX, newY, 2);
			}

			//partialUpdateLine(otherCP.id, "cl1", currX, currY, przesX, przesX);
			//partialUpdateLine(otherCP.id, "cl2", currX, currY, -przesX, -przesY);

			//update path
			var newC1Point = new Point(e.pageX, e.pageY);
			if ( getItemType(item) == "cp1") {
				svgPath.updateSVGPointPath(otherCP.id, newC1Point, przesX, przesY, false);
			} else {
				svgPath.updateSVGPointPath(otherCP.id, newC1Point, -przesX, -przesY, false);
			}

			var newPath = svgPath.pathToString();
			debug.innerHTML = newPath;
			G.setAttributeNS(null, "d", newPath);
		}
	}
});

document.onmouseup = function () {
	document.onmousemove = null;
};




