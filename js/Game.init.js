(function() {
	'use strict';

	// Globals;

	window.requestAnimFrame = (function() { // Getting smooth animation interval function provided by the target browser.
		return window.requestAnimationFrame ||
		       window.webkitRequestAnimationFrame ||
		       window.mozRequestAnimationFrame ||
		       window.msRequestAnimationFrame ||
		       function (callback) {
		       		window.setTimeout(callback, 1000/60);
		       };
	}());
	//
	window.KEY = { SP: 32, LE: 37, UP: 38, RI: 39, DO: 40, A: 65, D: 68, X: 88 };
	window.GAME_VERSION = "0.0.1-beta";
	window.ASSETS_FOLDER = 'assets/';
	window.SPRITE_FORMAT = '.png';
	window.MODES = ['dev']; // forced modes on game.init;
	//
	window.SPRITE = { 
		PLAYERIDLE: 'player_idle', PLAYERRUN: 'player_run', PLAYERJUMP: 'player_jump', 
		MOB6ATT: 'mob6attack',
		STARTBUTTON: 'start_button'
	};
	//
	window.SCREEN = { 
		MENU: 'menu', GAMEOVER: 'gameover', 
		LEVEL1: 'level_1', LEVEL2: 'level_2', LEVEL3: 'level_3' 
	};
	//
	window.options = {
		modes: {
			dev: { displayVersion: true, drawColliders: true, displayScreenButtons: true }
		},
		player: { id: 'player', constructor: 'Player', index: 0, w: 50, h: 105  },
		enemy6: { id: 'enemy6', constructor: 'Enemy6', index: 1, w: 655/5, h: 103 }
	};

	// Game instance.
	window.game = new Game(960, 640, 0.5);

	//////////

	const initialScreen = SCREEN.MENU;

	//////////

	// Game initialization/creation here...

	function init() {
		return new Promise(resolve => {
			// starting forced modes. (see: window.MODES, js/modes.js && js/Game.js);
			_.each(game.modes, m => {
				game.mode[m].start();
			});
			// create screens here.
			game.instantiate('menu', 'Menu');
			//
			game.sm.go(initialScreen); // initial screen here
			//
			resolve();
		});
	}

	// Level creation example:

	// function createTestLevel(index) {
	// 	createPlayer();
	// 	createEnemy6();
	// 	//
	// 	game.sm.go(SCREEN.LEVEL1);
	// }

	// // Object creation here:

	// function createEnemy6() {
	// 	const states = {};
	// 	const screens = [ SCREEN.LEVEL2, SCREEN.LEVEL3 ];
	// 	//
	// 	states[SPRITE.MOB6ATT] = { sprite: SPRITE.MOB6ATT, frames: 5, tpf: 250 };
	// 	//
	// 	const parameters = _.assign(options.enemy6, { states, screens });
	// 	//
	// 	game.instantiate(options.enemy6.id, options.enemy6.constructor, parameters);
	// }

	// function createPlayer() {
	// 	const states = {};
	// 	const screens = [ SCREEN.LEVEL1, SCREEN.LEVEL3 ];
	// 	//
	// 	states[SPRITE.PLAYERIDLE] = { sprite: SPRITE.PLAYERIDLE, frames: 2, tpf: 500 };
	// 	states[SPRITE.PLAYERRUN]  = { sprite: SPRITE.PLAYERIRUN, frames: 8, tpf: 125 };
	// 	states[SPRITE.PLAYERJUMP] = { sprite: SPRITE.PLAYERJUMP, frames: 1, tpf: 0 };
	// 	//
	// 	const parameters = _.assign(options.player, { states, screens });
	// 	//
	// 	game.instantiate(options.player.id, options.player.constructor, parameters);
	// }

	//////////

	// Document ready.

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

		// Loading, initializing and starting game and environment mode.
		game.load() // Loading assets here
		.then(() => {
			return init(); // Initializing game here.
		})
		.then(() => {
			game.start(); // Starting game after loading and initializing all screens, levels and objects.
		});
	});

})();
