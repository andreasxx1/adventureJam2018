(function() {
	'use strict';

	// Here all the reusable functions like random, math, etc
	window.common = { example, print1000Dicks, abs , round };

	//////////

	function example() {
		//
	}

	function abs(val){
		return val < 0 ? -val : val
	}

	function round(val, presision){
    Math.round(val, presision || 0)
  }

	function print1000Dicks() {
		for(let i=1;i<=1000;i++) console.log(i, i > 1 ? 'dicks' : 'dick');
	}

})();
