(function() { // Anonymous function to wrap our code and protect our scope from polution.
	'use strict'; // Add some rules/errors on bad javascript practices or that I believe.

	// Configuration consts.
	const KEY = { SP: 32, LE: 37, UP: 38, RI: 39, DO: 40, A: 65, D: 68, X: 88 };
	const DICTIONARY = { DRAW: 'draw', UPDATE: 'update' };
	const SCREEN = { MENU: 'menu', BACKGROUND: 'background', LEVEL1: 'level_1', INTERFACE: 'interface' };
	const START_SCREEN = SCREEN.LEVEL1;
	const ASSETS = 'assets/'; // assets folder name;
	const SPRITES = ['player_idle'];
	const SPRITE_FORMAT = '.png';

	// Game instance.
	const game = new Game(800, 600, 0.5);

	// Globals;
	window.game = game;
	window.KEY = KEY;
	window.DICTIONARY = DICTIONARY;
	window.SCREEN = SCREEN;

	//////////

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
		game.start();
	});

	//////////

	// Game related functions here.
	function Game(w, h, g) {
		this.width = w;
		this.height = h;
		this.g = g;
		this.pressedKeys = [];
		this.world = [];
		this.screens = [];
		this.activeScreens = [];
		this.sprites = [];
		// Functions
		this.initialize = initialize;
		this.setScreens = setScreens;
		this.load = load;
		this.start = start;
		this.update = update;
		this.draw = draw;
		this.execOnActiveObjects = execOnActiveObjects;
		this.createObject = createObject;
		this.reArrangeWorld = reArrangeWorld;
		//
	};

	function initialize() {
		this.setScreens();
	}

	function setScreens() {
		Object.keys(SCREEN).map((key, value) => { this.screens[key] = value; });
		this.activeScreens.push(START_SCREEN);
	}

	function start() {
		this.initialize();
		this.update();
		this.draw();
	}

	function update() {
		this.execOnActiveObjects(DICTIONARY.UPDATE);
		setTimeout(() => { this.update(); }, 1000/60); // 1000/60 = 60 frames per seconds.
	}

	function draw() {
		this.execOnActiveObjects(DICTIONARY.DRAW);
		requestAnimFrame(() => { this.draw(); }); // requestAnimFrame uses delta time and adapts the frame rate for a smooth drawing.
	}

	function execOnActiveObjects(fName) {
		_.each(this.world, object => {
			if (object.screens.some(scr => {
				return this.activeScreens.some(actScr => {
					return actScr === scr;
				});
			})) {
				object[fName]();
			}
		});
	}

	function createObject(object) {
		this.world.push(object);
		this.reArrangeWorld();
	}

	function reArrangeWorld() {
		this.world.sort(function(a, b) {
			if (a.index > b.index) { return 1; }
			if (a.index < b.index) { return -1; }
			return 0;
		});
	}

	function load() {
		return new Promise(resolve => {
			_.each(SPRITES, spriteName => {
				if (!game.sprites.some((v, key) => {
					return key === spriteName;
				})) {
					game.sprites[spriteName] = new Image();
					game.sprites[spriteName].src = ASSETS + spriteName + SPRITE_FORMAT;
				}
				if (game.sprites.length >= SPRITES.length) {
					resolve();
				}
			});
		});
	}

})(); // Self invoked function to start our code.



