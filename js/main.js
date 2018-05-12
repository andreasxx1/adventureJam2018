(function() { // Anonymous function to wrap our code and protect our scope from polution.
	'use strict'; // Add some rules/errors on bad javascript practices or that I believe.

	// Globals;
	window.KEY = { SP: 32, LE: 37, UP: 38, RI: 39, DO: 40, A: 65, D: 68, X: 88 };
	//
	window.ASSETS_FOLDER = 'assets/';
	window.SPRITE_FORMAT = '.png';
	window.SPRITE = { PLAYERIDLE: 'player_idle', MOB6ATT: 'mob6attack' };
	//
	window.MODE = { DEV: 'dev', GAME: 'game' };
	window.ACTUAL_MODE = MODE.DEV;
	//
	window.SCREEN = { 
		MENU: 'menu', BACKGROUND: 'background', INTERFACE: 'interface',
		LEVEL1: 'level_1', LEVEL2: 'level_2' 
	};
	//
	window.requestAnimFrame = (function() { // Getting smooth animation interval function provided by the target browser.
		return window.requestAnimationFrame ||
		       window.webkitRequestAnimationFrame ||
		       window.mozRequestAnimationFrame ||
		       window.msRequestAnimationFrame ||
		       function (callback) {
		       		window.setTimeout(callback, 1000/60);
		       };
	}());

})(); // Self invoked function to start our code.
