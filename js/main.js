(function() { // Anonymous function to wrap our code and protect our scope from polution.
	'use strict'; // Add some rules/errors on bad javascript practices or that I believe.

	// Game instance.
	const game = new Game(800, 600, 0.5);

	// Globals;
	window.KEY = { SP: 32, LE: 37, UP: 38, RI: 39, DO: 40, A: 65, D: 68, X: 88 };
	window.DICTIONARY = { DRAW: 'draw', UPDATE: 'update' };
	window.SCREEN = { MENU: 'menu', BACKGROUND: 'background', LEVEL1: 'level_1', INTERFACE: 'interface' };
	window.START_SCREEN = SCREEN.LEVEL1;
	window.ASSETS_FOLDER = 'assets/';
	window.SPRITES = ['player_idle'];
	window.SPRITE_FORMAT = '.png';
	window.OPTIONS = { PLAYER: { w: 50, h: 50, index: 0 } };
	window.game = game;

	// Getting smooth animation interval function provided by the target browser.
	window.requestAnimFrame = (function() { 
		return window.requestAnimationFrame ||
		       window.webkitRequestAnimationFrame ||
		       window.mozRequestAnimationFrame ||
		       window.msRequestAnimationFrame ||
		       function (callback) {
		       		window.setTimeout(callback, 1000/60);
		       };
	}());

	//////////

	// Jquery document ready (this code executes after the HTML is fully loaded).
	$(function() { 
		// Getting canvas object from HTML and setting it's context to "2d", context is just one of the canvas APIs also possible to set it to "WebGL".
		game.canvas = document.querySelectorAll("canvas")[0];
		game.context = game.canvas.getContext("2d");

		// Setting canvas options.
		game.canvas.width = game.width;
		game.canvas.height = game.height;

		// Setting event listeners (keydown and keyup).
		$(document).keydown(e => { game.pressedKeys[e.which] = true; });
		$(document).keyup(e => { game.pressedKeys[e.which] = false; });

		// 
		game.load().then(() => {
			game.start();
		});
	});

	//////////

})(); // Self invoked function to start our code.



