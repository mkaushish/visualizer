function fnc(exp, color) {
	this.exp = exp;
	this.color=color;
	this.parse = parseFN(exp);
	this.evaluatefn = function(xval, time) {
		form = new Array();
		for (i = 0; i < this.parse.length; i++) {
			if (!isNaN(this.parse[i])) {
				form.push(this.parse[i]);
			} else if (this.parse[i] == "x") {
				form.push(xval);
			} else if (fns.indexOf(this.parse[i]) != -1) {
				form.push(operation(this.parse[i], form.pop(), 0));
			} else {
				form.push(operation(this.parse[i], form.pop(), form.pop()));
			}
		}
		if(time==null){
		return form[0];
	}
		return form[0]*time
	}

	function operation(op, lt, rt) {
		if (op == "+") {
			return lt + rt;
		}
		if (op == "-") {
			return rt - lt;
		}
		if (op == "*") {
			return lt * rt;
		}
		if (op == "/") {
			return rt / lt;
		}
		if (op == "^") {
			return Math.pow(rt, lt);
		}
		if (op == "q") {
			return Math.asin(lt);
		}
		if (op == "r") {
			return Math.acos(lt);
		}
		if (op == "k") {
			return Math.atan(lt);
		}
		if (op == "s") {
			return Math.sin(lt);
		}
		if (op == "c") {
			return Math.cos(lt);
		}
		if (op == "t") {
			return Math.tan(lt);
		}
		if (op == "u") {
			return 1 / Math.tan(lt);
		}
		if (op == "d") {
			return 1 / Math.cos(lt);
		}
		if (op == "o") {
			return 1 / Math.sin(lt);
		}
		if (op == "l") {
			return Math.log(lt);
		}
	}

	function isOperator(op) {
		opers = new Object();
		opers["^"] = 1;
		opers["/"] = 2;
		opers["*"] = 2;
		opers["+"] = 3;
		opers["-"] = 3;
		if (opers[op] != null) {
			return true;
		} else {
			return false;
		}
	}

	function parseFN(fn) {
		sop = new Object();
		sop["sin"] = "s";
		sop["cos"] = "c";
		sop["tan"] = "t";
		sop["pi"] = "p";
		sop["cosec"] = "o";
		sop["sec"] = "d";
		sop["cot"] = "u";
		sop["log"] = "l";
		sop["asin"] = "q";
		sop["acos"] = "r";
		sop["atan"] = "k";
		fns = ["q", "r", "k", "s", "c", "t", "o", "d", "u", "l"];
		ops = ["asin", "acos", "atan", "sin", "cosec", "cos", "sec", "tan", "cot", "pi", "log"];
		lbrac = ["(", "{", "[", "|"];
		rbrac = [")", "}", "]", "|"];
		for (i = 0; i < fn.length; i++) {
			if (fn.charAt(i) == " ") {
				fn = fn.substr(0, i) + fn.substr(i, fn.length);
			}
		}
		for (i = 0; i < ops.length; i++) {
			while (fn.indexOf(ops[i]) != -1) {
				fn = fn.substr(0, fn.indexOf(ops[i])) + sop[ops[i]] + fn.substr(fn.indexOf(ops[i]) + ops[i].length, fn.length);
			}
		}
		tokens = new Array();
		if (fn[0] == "-") {
			fn = "0" + fn;
		}
		for (i = 0; i < ops.length; i++) {
			if (fn[i] == "-" && fn[i - 1] == "(") {
				fn = fn.substr(0, i) + "0" + fn.substr(i, fn.length);
			}
		}

		var out = new queue();
		var op = new Array();
		for (i = 0; i < fn.length; i += 1) {
			var temp = fn.charAt(i);
			tokens.push(fn.charAt(i));
			if (fn.charAt(i) == "x") {
				if (!isNaN(tokens[tokens.length - 2]) || tokens[tokens.length - 2] == "p" || tokens[tokens.length - 2] == "e" || tokens[tokens.length - 2] == "x") {
					op.push("*");
				}
				out.enqueue("x");
			} else if (fn.charAt(i) == "p") {
				out.enqueue(Math.PI);
				if (!isNaN(tokens[tokens.length - 2]) || tokens[tokens.length - 2] == "x" || tokens[tokens.length - 2] == "e") {
					op.push("*");
				}
			} else if (fn.charAt(i) == "e") {
				out.enqueue(Math.E);
				if (!isNaN(tokens[tokens.length - 2]) || tokens[tokens.length - 2] == "x" || tokens[tokens.length - 2] == "p") {
					op.push("*");
				}
			} else if (!isNaN(temp)) {
				var nm = +temp;
				var j = 2;
				temp = fn.substr(i, j);
				while (!isNaN(temp) && j + i <= fn.length) {
					nm = +temp;
					j += 1;
					temp = fn.substr(i, j);
				}
				i = i + j - 2;
				out.enqueue(nm);
			} else if (fns.indexOf(fn.charAt(i)) != -1) {
				if (lbrac.indexOf(fn.charAt(i + 1)) == -1) {
					alert("Error: There has to be a bracket after trignometric, log functions");
					return false;
				}
				op.push(fn.charAt(i));
			} else if (isOperator(fn.charAt(i))) {
				while (op.length != 0 && isOperator(op[op.length - 1])) {
					if (["+", "-", "*", "/"].indexOf(fn.charAt(i)) != -1) {
						if (opers[fn.charAt(i)] >= opers[op[op.length - 1]]) {
							out.enqueue(op.pop());
						} else break;
					}
					if (fn.charAt(i) == "^") {
						if (opers[fn.charAt(i)] > opers[op[op.length - 1]]) {
							out.enqueue(op.pop());
						} else break;
					}
				}
				op.push(fn.charAt(i));
			} else if (lbrac.indexOf(fn.charAt(i)) != -1) {
				if (!isNaN(tokens[tokens.length - 2]) || tokens[tokens.length - 2] == "x" || tokens[tokens.length - 2] == "p" || tokens[tokens.length - 2] == "e" || rbrac.indexOf(tokens[tokens.length - 2]) != -1) {
					op.push("*");
				}
				op.push(fn.charAt(i));
			} else if (rbrac.indexOf(fn.charAt(i)) != -1) {
				while (op[op.length - 1] != lbrac[rbrac.indexOf(fn.charAt(i))]) {
					if (op.length == 0) {
						alert("Error: mismatched parentheses");
						return false;
					}
					out.enqueue(op.pop());
				}
				op.pop();
				if (fns.indexOf(op[op.length - 1]) != -1) {
					out.enqueue(op.pop());
				}
			} else {
				alert("Error: symbol not recognized");
				return false;
			}

		}

		while (op.length != 0) {
			if (op[op.length - 1] == "(") {
				alert("Error: mismatched parentheses");
				return false;
			}
			t = op.pop();
			out.enqueue(t);

		}

		var tr = out.arr();
		return tr;
	}


}

function queue() {
	this.ar = new Array();
	this.start = 0;
	this.end = this.ar.length;
	this.enqueue = function(v) {
		this.ar[this.end] = v;
		this.end += 1;
	}
	this.dequeue = function() {
		this.start += 1;
		return this.ar[this.start - 1];
	}
	this.peek = function() {
		return this.ar[this.start];
	}
	this.arr = function() {
		var aa = new Array();
		for (i = this.start; i < this.end; i++) {
			aa[i - this.start] = this.ar[i];
		}
		return aa;
	}
	this.toString = function() {
		var str = "";
		for (i = this.start; i < this.end; i += 1) {
			str += this.ar[i] + ", ";
		}
		return str;
	}
	this.empty = function() {
		if (this.end - this.start == 0) {
			return true;
		}
		return false;
	}
}