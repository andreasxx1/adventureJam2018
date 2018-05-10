(function() {
	'use strict';

	// Here all the reusable functions like random, math, etc
	window.common = { example, print1000Dicks, abs , round, pr};

	//////////

	function example() {
		//
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

	function print1000Dicks() {
		for(let i=1;i<=1000;i++) console.log(i, i > 1 ? 'dicks' : 'dick');
	}

	function pr(obj){
		console.log(JSON.stringify(obj))
	}

})();
