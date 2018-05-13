(function() {
	'use strict';

	// Globals;
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
	//
	window.KEY = { SP: 32, LE: 37, UP: 38, RI: 39, DO: 40, A: 65, D: 68, X: 88 };
	//
	window.GAME_VERSION = "ab.2-beta"; // Check CHANGELOG
	//
	window.ASSETS_FOLDER = 'assets/';
	window.SPRITE_FORMAT = '.png';
	//
	window.SPRITE = { PLAYERIDLE: 'player_idle', MOB6ATT: 'mob6attack' };
	window.SCREEN = { MENU: 'menu', GAMEOVER: 'gameover', LEVEL1: 'level_1', LEVEL2: 'level_2' };
	window.MODE = { DEV: 'dev', GAME: 'game' };
	//
	window.ACTUAL_MODE = MODE.DEV;

	// Game instance.
	window.game = new Game(800, 600, 0.5);
	//
	window.options = {
		dev: { displayVersion: true, drawColliders: true, displayScreenButtons: true },
		player: { id: 'player', constructor: 'Player', index: 0, w: 50, h: 105  },
		enemy6: { id: 'enemy6', constructor: 'Enemy6', index: 1, w: 655/5, h: 103 }
	};

	// ToDo: remove this function when GameHandler finished
	function init() {
		return new Promise(resolve => {
			createTestLevel();
			resolve();
		});
	}

	// Level creation here:

	function createTestLevel(index) {
		createPlayer();
		createEnemy6();
		//
		// game.sm.go(SCREEN.LEVEL1);
		game.sm.go(SCREEN.LEVEL2);
	}

	// Object creation here:

	function createEnemy6() {
		const states = {};
		const screens = [ SCREEN.LEVEL1, SCREEN.LEVEL2 ];
		//
		states[SPRITE.MOB6ATT] = { sprite: SPRITE.MOB6ATT, frames: 5, tpf: 250 };
		//
		const parameters = _.assign(options.enemy6, { states, screens });
		//
		game.instantiate(options.enemy6.id, options.enemy6.constructor, parameters);
	}

	function createPlayer() {
		const states = {};
		const screens = [ SCREEN.LEVEL1 ];
		//
		states[SPRITE.PLAYERIDLE] = { sprite: SPRITE.PLAYERIDLE, frames: 2, tpf: 500 };
		//
		const parameters = _.assign(options.player, { states, screens });
		//
		game.instantiate(options.player.id, options.player.constructor, parameters);
	}

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
		game.load() // Loading assets here
		.then(() => {
			return init();
		})
		.then(() => {
			return setDevelopment();
		})
		.then(() => {
			game.start(); // Global function from GameInit.js (all the objects that need to be init at the begining here)
		});
	});

	// Development mode -> ACTUAL_MODE = MODE.DEV;

	function drawColliders() {
		if (options.dev.drawColliders) {
			const gameWorld = Object.keys(game.world).map(key => { return game.world[key] });
			const physicsWorld = game.phy.getPhysicalWorld();
			const objects = (gameWorld).concat(physicsWorld);
			//
			_.each(objects, obj => {
				if (obj.weight === -1 || obj.isActive) {
					game.context.fillStyle = "#666666";
					game.context.fillRect((obj.pos ? obj.pos.x : obj.x), (obj.pos ? obj.pos.y : obj.y), (obj.dim ? obj.dim.x : obj.width), (obj.dim ? obj.dim.y : obj.height));
				}
			});	
		}
    }

	function setScreenButtonsDisplay() {
		const area = document.getElementById("button-area");
		area.innerHTML = "Choose screen: ".bold();
		//
		_.each(Object.values(SCREEN), screen => {
			// Creating button in HTML.
			const button = document.createElement("BUTTON");
			// Config.
			button.id = screen;
			button.appendChild(document.createTextNode(screen));
			button.addEventListener("click", function() { 
				game.sm.go(screen); 
		    	// Cleaning all buttons.
				_.each(Object.values(SCREEN), screen => {
					if (document.getElementById(screen)) document.getElementById(screen).style.backgroundColor = '#FFF';
				});
				// Set active button background.
		    	button.style.backgroundColor = '#CCC'; 
			});
			//
			// Pushing button in html.
			area.appendChild(button);
			//
			if (screen === game.sm.getActiveScreen()) document.getElementById(screen).style.backgroundColor = '#CCC';
		});
	}


	function setGameVersionDisplay(version) {
		document.getElementById("version").innerHTML = "Version: ".bold() + version;
	}

	function setOptionsDisplay() {
		const area = document.getElementById("options");
		//
		area.appendChild(document.createTextNode("options.dev: "));
		area.innerHTML = area.innerHTML.bold();
		//
		_.each(Object.keys(options.dev), (key, index) => {
			const optionCheck = document.createElement("INPUT");
			const optionLabel = document.createElement("SPAN");
			//
			optionLabel.appendChild(document.createTextNode(key+ ":"));
			//
			optionCheck.type = "checkbox";
			optionCheck.checked = options.dev[key];
			optionCheck.addEventListener("click", function() {
				options.dev[key] = !options.dev[key];
				updateElementsVisibility();
			});
			area.appendChild(optionLabel);
			area.appendChild(optionCheck);
			//
			if (index < Object.keys(options.dev).length-1) {
				area.appendChild(document.createElement("SPAN").appendChild(document.createTextNode(", ")));
			}
		});
	}

	function setDrawCollidersCallback() {
		game.pushCallback('draw', drawColliders);
	}

	function updateElementsVisibility() {
		if (options.dev.displayVersion) { common.setCss("version", "visibility", "visible") } else { common.setCss("version", "visibility", "hidden"); }
		if (options.dev.displayScreenButtons) { common.setCss("button-area", "visibility", "visible"); } else { common.setCss("button-area", "visibility", "hidden"); }
	}

	function setDevelopment() {
		if (ACTUAL_MODE === MODE.DEV) {
			setOptionsDisplay();
			setGameVersionDisplay(GAME_VERSION);
			setScreenButtonsDisplay();
			setDrawCollidersCallback();
		}
	}

})();
