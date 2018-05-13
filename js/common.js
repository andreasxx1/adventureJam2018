(function() {
	'use strict';

	// Here all the reusable functions like random, math, etc
	window.common = { example, abs , round, pr, hexToRGB };

	//////////

	function example() {
		//
	}

	function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}
	function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
	function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
	function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}
	function hexToRGB(hex, opacity) { return "rgba("+hexToR(hex)+","+hexToG(hex)+","+hexToB(hex)+")"; }

	function abs(val){
		return val < 0 ? -val : val
	}

	function sin(val){
		Math.sin(val)
	}

	function round(val, precision){
		var factor = Math.pow(10, precision);
		return Math.round(val * factor) / factor;
  	}

	function pr(obj){
		console.log(JSON.stringify(obj))
	}

})();
