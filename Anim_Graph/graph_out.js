function graph_out(canvas, context) {
	var off = 25;
	var state;
	var zoompos = 180;
	var minnegx = null;
	var maxnegx = null;
	var minposx = null;
	var maxposx = null;
	var minnegy = null;
	var maxnegy = null;
	var minposy = null;
	var maxposy = null;
	var maxx = null;
	var maxy = null;
	var minx = null;
	var miny = null;
	var cx = canvas.width / 2;
	var cy = canvas.height / 2;
	var width = 0;
	var czoom = 1;
	this.graph = {
		mode:"trace",
		selected:null,
		num: 10,
		centerx: (canvas.width) / 2,
		centery: (canvas.height) / 2,
		snum: 10,
		mid: 0,
		diff: 1,
		off: off,
		zbarc: zoompos,
		initz: zoompos,
		zoomin: [1, 0.5, 0.25, 0.2, 0.1, 0.05],
		zoomout: [1, 2, 5, 10, 50, 100],
		zoominf: [1, 2, 4, 5, 10, 20],
		iewid: Math.floor((canvas.width - 2 * off) / 100),
		ewid: Math.floor((canvas.width - 2 * off) / 100),
		lower: 40,
		upper: 320,
		ldiv: 20,
		fdiff: 1,
		movemid: function(mousex, downx, mousey, downy) {
			var mmovx = mousex - downx;
			var mmovy = mousey - downy;
			this.centerx += mmovx;
			this.centery += mmovy;
			return [mousex, mousey];
		},
		zoom: function(dist) {
			this.ewid = (this.iewid - 2.5) * (dist / this.ldiv) + 2.5;
			width = this.ewid * this.snum;
		},
		moveZBar: function(mousey, downy) {
			var mmov = mousey - downy;
			downy = mousey;
			if (mmov + this.zbarc <= this.upper - this.ldiv - 1 && mmov + this.zbarc >= this.lower + this.ldiv + 1) {
				this.zbarc += mmov;
				zoompos = this.zbarc;
				if (this.zbarc > this.initz) {
					this.diff = this.zoomout[Math.floor((this.zbarc - this.initz) / this.ldiv)];
					czoom = this.diff;
					this.zoom(this.ldiv - (this.zbarc - this.initz) + Math.floor((this.zbarc - this.initz) / this.ldiv) * this.ldiv);
				} else {
					this.diff = this.zoomin[Math.floor((this.initz - this.zbarc) / this.ldiv)];
					czoom = this.diff;
					this.fdiff = this.zoominf[Math.floor((this.initz - this.zbarc) / this.ldiv)];
					this.zoom((this.initz - this.zbarc) - Math.floor((this.initz - this.zbarc) / this.ldiv) * this.ldiv);
				}
			}
		},
		curpos: function(mousex, mousey) {
			m = this.ewid * this.snum
			writeMessage("x=" + Math.round((this.diff * (mousex - this.centerx) / m) * 100) / 100 + ", y=" + Math.round((this.diff * (this.centery - mousey) / m) * 100) / 100);
		},
		drawZBar: function() {
			context.strokeStyle = "black";
			pzba = new Image();
			pzba.onload = function() {
				context.drawImage(pzba, 3, this.lower - 14);
			}
			pzba.src = "assets/plus.png";
			mzba = new Image();
			mzba.onload = function() {
				context.drawImage(mzba, 3, this.upper);
			}
			mzba.src = "assets/minus.png";
			drawLine(5, this.zbarc - this.ldiv, 5, this.zbarc + this.ldiv);
			drawLine(5, this.zbarc + this.ldiv, 15, this.zbarc + this.ldiv);
			drawLine(15, this.zbarc + this.ldiv, 15, this.zbarc - this.ldiv);
			drawLine(15, this.zbarc - this.ldiv, 5, this.zbarc - this.ldiv);
		},
		draw: function(type) {
			context.strokeStyle = "e3e3e3";
			var first = canvas.width - off;
			var last = off;
			t = this.mid;
			var ct = this.mid;
			var cou = 0;
			for (i = this.centerx; i >= off; i -= this.ewid * this.snum) {
				if (i <= canvas.width - off) {
					if (cou == 0) {
						maxnegx = t;
					}
					cou += 1;
					drawLine(i, off, i, canvas.height - off);
					if (i != this.centerx) {
						if (type == "dec" || this.diff >= 1) {
							context.font = "9pt Calibri";
							context.fillStyle = "black";
							if ((Math.round(t * 1000) / 1000).toString().length < 2) {
								context.fillText(Math.round(t * 1000) / 1000, i - 5, this.centery + 10);
							} else if ((Math.round(t * 1000) / 1000).toString().length < 3) {
								context.fillText(Math.round(t * 1000) / 1000, i - 10, this.centery + 10);
							} else if ((Math.round(t * 1000) / 1000).toString().length < 4) {
								context.fillText(Math.round(t * 1000) / 1000, i - 15, this.centery + 10);
							} else if ((Math.round(t * 1000) / 1000).toString().length < 5) {
								context.fillText(Math.round(t * 1000) / 1000, i - 20, this.centery + 10);
							} else {
								context.fillText(Math.round(t * 1000) / 1000, i - 25, this.centery + 10);
							}
						} else {
							var num = -ct;
							var den = this.fdiff;
							var hcf = gcd(num, den);
							num = Math.round(num / hcf);
							den = Math.round(den / hcf);
							context.font = "9pt Calibri";
							context.fillStyle = "black";
							if (den != 1) {
								context.fillText(-num, i - 9, this.centery + 5);
								context.fillText("__", i - 9, this.centery + 5);
								context.fillText(den, i - 9, this.centery + 10)
							} else {
								context.fillText(-num, i - 9, this.centery + 5);
							}
						}
					}
				}
				minnegx = t;
				t -= this.diff;
				ct -= 1;
			}
			context.fillText(0, this.centerx - 5, this.centery + 10);
			ct = this.mid;
			t = this.mid;
			cou = 0;
			for (i = this.centerx; i <= canvas.width - off; i += this.ewid * this.snum) {
				if (i >= off) {

					if (cou == 0) {
						minposx = t;
					}
					cou += 1;
					drawLine(i, off, i, canvas.height - off);
					if (i != this.centerx) {
						if (type == "dec" || this.diff >= 1) {
							context.font = "9pt Calibri";
							context.fillStyle = "black";
							if ((Math.round(t * 1000) / 1000).toString().length < 2) {
								context.fillText(Math.round(t * 1000) / 1000, i - 5, this.centery + 10);
							} else if ((Math.round(t * 1000) / 1000).toString().length < 3) {
								context.fillText(Math.round(t * 1000) / 1000, i - 10, this.centery + 10);
							} else if ((Math.round(t * 1000) / 1000).toString().length < 4) {
								context.fillText(Math.round(t * 1000) / 1000, i - 15, this.centery + 10);
							} else if ((Math.round(t * 1000) / 1000).toString().length < 5) {
								context.fillText(Math.round(t * 1000) / 1000, i - 20, this.centery + 10);
							} else {
								context.fillText(Math.round(t * 1000) / 1000, i - 25, this.centery + 10);
							}
						} else {
							var num = ct;
							var den = this.fdiff;
							var hcf = gcd(num, den);
							num = Math.round(num / hcf);
							den = Math.round(den / hcf);
							context.font = "9pt Calibri";
							context.fillStyle = "black";
							if (den != 1) {
								context.fillText(num, i - 9, this.centery + 5);
								context.fillText("__", i - 9, this.centery + 5);
								context.fillText(den, i - 9, this.centery + 5);
							} else {
								context.fillText(-num, i - 9, this.centery + 5);
							}
						}
					}
				}
				maxposx = t;
				t += this.diff;
				ct += 1;
			}


			t = this.mid;
			var ct = 0;
			cou = 0;
			for (i = this.centery; i >= off; i -= this.ewid * this.snum) {
				if (i <= canvas.width - off) {
					if (cou == 0) {
						minposy = t;
					}
					cou += 1;
					drawLine(off, i, canvas.width - off, i);
					if (i != this.centery) {
						if (type == "dec" || this.diff >= 1) {
							context.font = "9pt Calibri";
							context.fillStyle = "black";
							if ((Math.round(t * 1000) / 1000).toString().length < 2) {
								context.fillText(Math.round(t * 1000) / 1000, this.centerx - 5, i + 10);
							} else if ((Math.round(t * 1000) / 1000).toString().length < 3) {
								context.fillText(Math.round(t * 1000) / 1000, this.centerx - 10, i + 10);
							} else if ((Math.round(t * 1000) / 1000).toString().length < 4) {
								context.fillText(Math.round(t * 1000) / 1000, this.centerx - 15, i + 10);
							} else if ((Math.round(t * 1000) / 1000).toString().length < 5) {
								context.fillText(Math.round(t * 1000) / 1000, this.centerx - 20, i + 10);
							} else {
								context.fillText(Math.round(t * 1000) / 1000, this.centerx - 25, i + 10);
							}
						} else {
							var num = -ct;
							var den = this.fdiff;
							var hcf = gcd(num, den);
							num = Math.round(num / hcf);
							den = Math.round(den / hcf);
							context.font = "9pt Calibri";
							context.fillStyle = "black";
							if (den != 1) {
								context.fillText(-num, this.centerx - 10, i - 3);
								context.fillText("__", this.centerx - 10, i - 3);
								context.fillText(den, this.centerx - 10, i + 2)
							} else {
								context.fillText(-num, this.centerx - 10, i);
							}
						}
					}
				}
				maxposy = t;
				t += this.diff;
				ct += 1;
			}
			ct = 0;
			t = this.mid;
			cou = 0;
			for (i = this.centery; i <= canvas.height - off; i += this.ewid * this.snum) {
				if (i >= off) {

					if (cou == 0) {
						maxnegy = t;
					}
					cou += 1;
					drawLine(off, i, canvas.width - off, i);
					if (i != this.centerx) {
						if (type == "dec" || this.diff >= 1) {
							context.font = "9pt Calibri";
							context.fillStyle = "black";
							if ((Math.round(t * 1000) / 1000).toString().length < 2) {
								context.fillText(Math.round(t * 1000) / 1000, this.centerx - 5, i + 10);
							} else if ((Math.round(t * 1000) / 1000).toString().length < 3) {
								context.fillText(Math.round(t * 1000) / 1000, this.centerx - 10, i + 10);
							} else if ((Math.round(t * 1000) / 1000).toString().length < 4) {
								context.fillText(Math.round(t * 1000) / 1000, this.centerx - 15, i + 10);
							} else if ((Math.round(t * 1000) / 1000).toString().length < 5) {
								context.fillText(Math.round(t * 1000) / 1000, this.centerx - 20, i + 10);
							} else {
								context.fillText(Math.round(t * 1000) / 1000, this.centerx - 25, i + 10);
							}
						} else {
							var num = ct;
							var den = this.fdiff;
							var hcf = gcd(num, den);
							num = Math.round(num / hcf);
							den = Math.round(den / hcf);
							context.font = "9pt Calibri";
							context.fillStyle = "black"

							if (den != 1) {
								context.fillText(num, this.centerx - 10, i - 3);
								context.fillText("__", this.centerx - 10, i - 3);
								context.fillText(den, this.centerx - 10, i + 2);
							} else {
								context.fillText(-num, this.centerx - 10, i);
							}
						}
					}
				}
				minnegy = t;
				t -= this.diff;
				ct -= 1;
			}
			if (minnegx != null) {
				minx = minnegx;
			} else {
				minx = minposx;
			}
			if (maxposx != null) {
				maxx = maxposx;
			} else {
				maxx = maxnegx;
			}
			if (minnegy != null) {
				miny = minnegy;
			} else {
				miny = minposy;
			}
			if (maxposy != null) {
				maxy = maxposy;
			} else {
				maxy = maxnegy;
			}
			cx = this.centerx;
			cy = this.centery;
			width = this.ewid * this.snum;
		},
		drawfnc: function(fnc, time) {
			var values = new Array();
			var pos = new Array();
			var ke;
			var ve;
			for (q = off; q < canvas.width - off; q += 1) {
				xpos = q;
				curx = czoom * (xpos - cx) / width;
				//alert("cur= "+q);
				cury = fnc.evaluatefn(curx, time) / czoom;
				ypos = (cy - width * cury);
				//alert(q+", "+ypos);
				if (ypos >= 0 && ypos <= canvas.height + off) {
					values.push([curx, cury]);
					pos.push([q, Math.round(ypos)]);
					if (q > off) {
						context.strokeStyle=(fnc.color);
						drawLine(ke[0], ke[1], xpos, ypos);
						context.strokeStyle="black";
					}
				}
				ke = [xpos, ypos];
				ve = [curx, cury];
			}
			return [values, pos];
		},
		trace:function(mousex){
			context.strokeStyle=this.selected.color;
			curx = czoom * (mousex - cx) / width;
			cury = this.selected.evaluatefn(curx) / czoom;
			ypos = (cy - width * cury);
			drawPoint(mousex, ypos);
			context.strokeStyle="black";
 		   	writeMessage("("+(Math.round(curx*100)/100)+", "+(Math.round(cury*100)/100)+")");
 		   	writeMessageDown("");
		}
	}

	function drawLine(x1, y1, x2, y2) {
		context.beginPath();
		context.moveTo(x1, y1);
		context.lineTo(x2, y2);
		context.stroke();
		context.closePath();
	}

	function writeMessage(message) {
		context.clearRect(0, 0, canvas.width, 25);
		context.font = "10pt Calibri";
		context.fillStyle = "black";
		context.fillText(message, 10, 20);
	}
	this.graph.draw("dec");
	this.graph.drawZBar();
	function distance(x1, y1, x2, y2) {
		xdiff = x1 - x2;
		ydiff = y1 - y2;
		return Math.sqrt(xdiff * xdiff + ydiff * ydiff);
	}
	function drawPoint(x,y){
		context.beginPath();
		context.arc(x,y,2,0,2*Math.PI);
		context.lineWidth=2;
		context.stroke();
		context.lineWidth=1;
	}

	function drawLine(x1, y1, x2, y2) {
		context.beginPath();
		context.moveTo(x1, y1);
		context.lineTo(x2, y2);
		context.stroke();
		context.closePath();
	}
	function writeMessageDown(message){
		context.clearRect(0,canvas.height-25,canvas.width,25);
		context.font = "10pt Calibri";
		context.fillStyle = "black";
		context.fillText(message, 10, 20);
	}
}