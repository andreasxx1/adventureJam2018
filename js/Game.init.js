(function() {
	'use strict';
	//
	const options = {
		player: { id: 'player', constructor: 'Player', index: 0, w: 50, h: 105  },
		enemy6: { id: 'enemy6', constructor: 'Enemy6', index: 1, w: 655/5, h: 103 }
	};

	// ToDo: remove this function when GameHandler finished
	function init() {
		return new Promise(resolve => {
			createPlayer();
			createEnemy6();
			//
			game.addCallback('draw', drawColliders);
			//
			// game.sm.go(SCREEN.LEVEL1);
			game.sm.go(SCREEN.LEVEL1);
			//
			resolve();
		});
	}

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

	// Game instance.
	window.game = new Game(800, 600, 0.5);

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
			// temporal for testing screens easily.
			setTestScreenButtons();
		})
		.then(() => {
			game.start(); // Global function from GameInit.js (all the objects that need to be init at the begining here)
		});
	});

	// Temporal testing functions here.

	function drawColliders() {
		const physicEngine = game.phy;
		_.each(physicEngine.getPhysicalWorld(), obj => {
			if (obj.weight === -1) {
				const col = physicEngine.getCol(obj.id);
				//
				game.context.fillStyle = "rgba(6,6,6,1)";
				game.context.fillRect(col.pos.x, col.pos.y, col.dim.x, col.dim.y);
			}
		});
    }

	function setTestScreenButtons() {
		const buttons = [];
		//
		_.each(document.getElementsByTagName('button'), button => { buttons.push(button); });
		//
		_.each(SCREEN, screen => {
			buttons.some(button => {
				const buttonText = button.firstChild.nodeValue;
				if (buttonText === screen) {
					button.addEventListener('click', () => {
						game.sm.go(buttonText);
					});
				}
			});
		});
	}

})();
