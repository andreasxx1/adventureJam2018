(function() { // Anonymous function to wrap our code and protect our scope from polution.
	'use strict'; // Add some rules/errors on bad javascript practices or that I believe.

	// Globals;
	window.KEY = { SP: 32, LE: 37, UP: 38, RI: 39, DO: 40, A: 65, D: 68, X: 88 };
	window.DICTIONARY = { DRAW: 'draw', UPDATE: 'update', PLAYER_IDLE: 'player_idle' };
	window.SCREEN = { MENU: 'menu', BACKGROUND: 'background', LEVEL1: 'level_1', INTERFACE: 'interface' };
	window.START_SCREEN = SCREEN.LEVEL1;
	window.ASSETS_FOLDER = 'assets/';
	window.SPRITE_FORMAT = '.png';
	window.SPRITES = [ DICTIONARY.PLAYER_IDLE ]; // Include sprite names here (must be .png);
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



