(function() {
	'use strict';

	// Here all the reusable functions like random, math, etc
	window.common = { abs , round, pr, hexToRGB, removeElement, setCss, sortBy };

	//////////

	function sortBy(array, property) { // sort by only one property (ToDo if needed sort for more than one).
	    return array.sort((a, b) => {
	        return a[property] - b[property];
	    });
	}

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

	function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}
	function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
	function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
	function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}
	function hexToRGB(hex, opacity) { return "rgba("+hexToR(hex)+","+hexToG(hex)+","+hexToB(hex)+")"; }
	
	function removeElement(element) {
		element.parentNode.removeChild(element);
	}

	function setCss(id, property, value) {
		document.getElementById(id).style[property] = value;
	}

})();
