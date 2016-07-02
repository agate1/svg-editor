var svg = document.getElementById("svg");
var G = document.getElementById("g");
var path = G.getAttributeNS(null, "d").trim();
var debug = document.getElementById("debug");


/**
 * Point
 */
class P {
	x:number;
	y:number;
	constructor(point:string) {
		this.x = parseFloat(point.split(",")[0]);
		this.y = parseFloat(point.split(",")[1]);
	}
	toPath() {
		return this.x.toString() + "," + this.y.toString();
	}
}

/**
 * SVGPointC
 */
class SVGPointC {
	cp1:P;
	cp2:P;
	p:P;

	constructor(cp1:P, p:P, cp2:P) {
		this.p = p;
		this.cp2 = cp2;
		this.cp1 = cp1;
	}

}


/**
 * SVGMPoint
 */
class SVGPointM {
	p:P;
	cp2:P;

	constructor(p:P, cp2:P) {
		this.p = p;
		this.cp2 = cp2;
	}
}

/**
 * SVG Path
 */
class MySVGPath {
	points:Array<any>;

	constructor(d:string) {
		var temp = d.replace(/[A-Z]/g,"").split(" ");
		var cleanArr = temp.filter(s => s !="");
		var p1 = new P(cleanArr[0]);
		var p2 = new P(cleanArr[1]);

		var p = new SVGPointM(p1,p2);
		this.points=[];
		this.points.push(p); 

		var i:number;
		for (i=2; i <= cleanArr.length - 3; i+=3){
			let cp1 = new P(cleanArr[i]);
			let p = new P(cleanArr[i+1]);
			let cp2 = new P(cleanArr[i+2]);
			var pkt = new SVGPointC(cp1, p,cp2);
			this.points.push(pkt);
		}

	}
}

/**
 * Circle
 */
class Circle {
	private center:P;
	private r:string;
	private css:string;
	private id:string;
	private el:HTMLElement;

	constructor(p:P, r:string, css:string, id:string) {
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
}


//svg path to points
var svgpath = new MySVGPath(path);

//d=" M 190,21 C 213,7 246,10 266,28 C 261,34 256,40 251,46 C 242,38 229,33 216,35 C 210,36 204,40 200,45 C 188,57 189,78 201,90 C 208,97 219,99 229,98 C 233,97 238,95 242,93 C 242,84 242,75 242,65 C 250,65 257,65 265,65 C 265,79 265,93 265,107 C 249,117 230,123 211,120 C 196,118 181,109 173,96 C 164,84 162,68 166,54 C 169,40 178,28 190,21 Z"></path>

svgpath.points.forEach((pkt,i)=>{
	var pointCircle = new Circle(pkt.p,"3", "currentPoint", "p-" + i + 1);
	var cp2Circle = new Circle(pkt.cp2,"3", "controlPoint", "cp2-" + i + 1);

	if (i > 0) {
		var cp1Circle = new Circle(pkt.cp1,"3", "controlPoint", "cp1-" + i + 1);
	}
	
})


debug.innerText = "kk";
