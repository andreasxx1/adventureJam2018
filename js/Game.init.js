(function() {
	'use strict';

	const options = {
		player: { id: 'player', constructor: 'Player', index: 0, w: 50, h: 105  }
	};

	// ToDo: remove this function when GameHandler finished
	function init() {
		return new Promise(resolve => {
			// Player.
			const states = {};
			const screens = [ SCREEN.LEVEL1 ];
			//
			states[SPRITE.PLAYERIDLE] = { sprite: SPRITE.PLAYERIDLE, frames: 2, tpf: 500 };
			//
			const parameters = _.assign(options.player, { states, screens });
			//
			game.instantiate(options.player.id, options.player.constructor, parameters);
			
			//
			resolve();
		});
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
