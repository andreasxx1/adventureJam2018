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
	window.GAME_VERSION = "0.0.7-beta";
	window.ASSETS_FOLDER = 'assets/';
	window.SPRITE_FORMAT = '.png';
	window.MODES = ['dev']; // forced modes on game.init;
	//
	window.SPRITE = { 
		PLAYERIDLE: 'player_idle', PLAYERRUN: 'player_run', PLAYERJUMP: 'player_jump', 
		//
		MOB6ATT: 'mob6attack',
		//
		STARTBUTTON: 'start_button', CONTROLSBUTTON: 'controls_button', CREDITSBUTTON: 'credits_button', 
		MENUBG0: 'fd_menu_bg', MENUBG1: 'fd_menu_doll'
	};
	//
	window.SCREEN = { 
		MENU: 'menu', GAMEOVER: 'gameover', 
		LEVEL1: 'level_1', LEVEL2: 'level_2', LEVEL3: 'level_3' 
	};
	//
	window.options = {
		modes: {
			dev: { displayVersion: true, displayScreenSelection: true, displayIngameButtons: true, displayBackgrounds: true, drawColliders: true }
		},
		player: { id: 'player', class: 'Player', index: 0, w: 50, h: 105  },
		enemy6: { id: 'enemy6', class: 'Enemy6', index: 1, w: 655/5, h: 103 }
	};

	//////////

	// Game instance.
	window.game = new Game(960, 640, 0.5);

	//////////

	window.initialScreen = SCREEN.MENU;

	//////////

	// Object creation here:
	game.createEnemy6 = function() {
		const states = {};
		const screens = [ SCREEN.LEVEL2, SCREEN.LEVEL3 ];
		//
		states[SPRITE.MOB6ATT] = { sprite: SPRITE.MOB6ATT, frames: 5, tpf: 250 };
		//
		const parameters = _.assign(options.enemy6, { states, screens });
		//
		this.instantiate(options.enemy6.id, options.enemy6.class, parameters);
	}

	game.createPlayer = function () {
		const states = {};
		const screens = [ SCREEN.LEVEL1, SCREEN.LEVEL3 ];
		//
		states[SPRITE.PLAYERIDLE] = { sprite: SPRITE.PLAYERIDLE, frames: 2, tpf: 500 };
		states[SPRITE.PLAYERRUN]  = { sprite: SPRITE.PLAYERIRUN, frames: 8, tpf: 125 };
		states[SPRITE.PLAYERJUMP] = { sprite: SPRITE.PLAYERJUMP, frames: 1, tpf: 0 };
		//
		const parameters = _.assign(options.player, { states, screens });
		//
		this.instantiate(options.player.id, options.player.class, parameters);
	}

	// Level creation example:
	game.createTestLevel = function() {
		this.createPlayer();
		this.createEnemy6();
	}

	//////////

	game.init = () => {
		return new Promise(resolve => {
			// setting initial screen;
			game.sm.go(initialScreen);
			// create screens here.
			game.instantiate('menu', 'Menu');
			// create levels here.
			game.createTestLevel();
			//
			resolve();
		});
	}

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

		// Loading assets here
		game.load() 
		// Initializing game here.
		.then(() => {
			return game.init(); 
		})
		// 
		.then(() => {
			// starting game modes. (see: window.MODES, js/modes.js && js/Game.js);
			_.each(game.modes, m => {
				game.mode[m].start();
			});
			// Starting game after loading and initializing all screens, levels and objects.
			game.start(); 
		});
	});

})();
