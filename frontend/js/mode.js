(function() {
	'use strict';

	/*
		Here we'll add different game modes that affect in some way the gameplay (ingame or html/css).

		Examples: 
		- Development mode: to display development options.
		- Debuffs: players is poisoned or in any effect that distort the game (view/gameplay/etc).
		- Cheat codes / easter eggs: flying mode, god mode, etc.

		Important: 
		1. all game modes should have a start and stop functions:
			- in case is creating external html/css elements (start creates them and stop destroys them);
			- in case is a debuff then start set a game.mode.your_mode_name.your_flag_name = true (could be more than one flag, by example isPlayerPoisoned: true, isNight: true, etc...);
		2. all game modes should be instanciated at the end of this file:
			- all of them are inactive till the start function is called (and active till the stop function is called).
	*/	

	class DevelopmentEnvironment {
		constructor() {}

		start() {
			this.setGameVersionDisplay(GAME_VERSION);
			this.setOptionsDisplay();
			this.setInputsDisplay();
			this.setScreenButtonsDisplay();
			this.setDrawCollidersCallback();
			this.setRestartGameButton();
			this.setPauseButton();
		}

		drawColliders() {
			if (options.modes.dev.drawColliders) {
				const gameWorld = Object.keys(game.world).map(key => { return game.world[key] });

				_.each(gameWorld, gameObject => {
					if (gameObject.isActive) {
						const physicalObject = game.getPhysicalObjectById(gameObject.id);
						//
						if (physicalObject && physicalObject.weight !== -1) {
							let alpha = game.context.globalAlpha
							game.context.globalAlpha = 0.3;
							game.context.fillStyle ="#FFB6C1";
							game.context.fillRect(physicalObject.pos.x, physicalObject.pos.y, physicalObject.dim.x, physicalObject.dim.y);
							game.context.globalAlpha = alpha;
						}
					}
				});
			}
	    }

		setScreenButtonsDisplay() {
			const area = document.getElementById("button-area");
			area.innerHTML = "Screen selection: ".bold();
			//
			_.each(Object.values(SCREEN), screen => {
				// Creating button in HTML.
				const button = document.createElement("BUTTON");
				// Config.
				button.id = screen;
				button.appendChild(document.createTextNode(screen));
				//
				button.addEventListener("click", () => {
					game.sm.go(screen);
			    	// Cleaning all buttons.
					_.each(Object.values(SCREEN), screen => {
						if (document.getElementById(screen)) document.getElementById(screen).style.backgroundColor = '#FFF';
					});
					// Set active button background.
			    	button.style.backgroundColor = '#CCC';
				});
				// Pushing button in html.
				area.appendChild(button);
				//	
				if (screen === game.sm.getActiveScreen()) document.getElementById(screen).style.backgroundColor = '#CCC';
			});
		}


		setGameVersionDisplay(version) {
			document.getElementById("version").innerHTML = "Version: ".bold() + version;
		}

		setOptionsDisplay() {
			const area = document.getElementById("options");
			//
			area.appendChild(document.createTextNode("options: "));
			area.innerHTML = area.innerHTML.bold();
			//
			_.each(Object.keys(options.modes.dev), (key, index) => {
				// 
				area.appendChild(document.createElement("SPAN").appendChild(document.createElement("br")));
				// 
				const optionCheck = document.createElement("INPUT");
				const optionLabel = document.createElement("SPAN");
				//
				optionLabel.appendChild(document.createTextNode(common.firstToUppercase(common.uncamelize(key))));
				//
				optionCheck.type = "checkbox";
				optionCheck.checked = options.modes.dev[key];
				optionCheck.addEventListener("click", () => {
					options.modes.dev[key] = !options.modes.dev[key];
					this.updateDisplay(key);
				});
				area.appendChild(optionCheck);
				area.appendChild(optionLabel);
				//
			});
		}

		setInputsDisplay() {
			const area = document.getElementById("input-area");
			const inputs = [
				{ id:'player', prefixes: ['vals'], parameter: 'walkSpeed', display: 'player: walk speed.' },
				{ id:'player', prefixes: ['vals'], parameter: 'jumpHeight', display: 'player: jump strength.' }
			];
			// 
			area.appendChild(document.createTextNode("Inputs: "));
			area.innerHTML = area.innerHTML.bold();
			//
			_.each(inputs, data => {
				// 
				area.appendChild(document.createElement("SPAN").appendChild(document.createElement("br")));
				// 
				const input = document.createElement("INPUT");
				const label = document.createElement("SPAN");
				//
				label.appendChild(document.createTextNode(data.display));
				//
				let wObject = game.getWorldObjectById(data.id);
				// let pObject = game.getPhysicalObjectById(data.id);
				//
				if (wObject) {
					_.each(data.prefixes, prefix => {
						wObject = wObject[prefix];
					});
					//
					input.value = wObject[data.parameter];
					input.addEventListener("change", e => {
						wObject[data.parameter] = parseInt(input.value);
					});
					// 
					area.appendChild(input);
					area.appendChild(label);
				}
			});
		}

		setDrawCollidersCallback() {
			game.pushCallback('draw', this.drawColliders);
		}

		setRestartGameButton() {
			// const area = document.getElementById("restart");
			// const button = document.createElement("BUTTON"); // restart button.
			// //
			// button.appendChild(document.createTextNode("RESTART"));
			// button.addEventListener("click", () => {

			// });
			// //
			// area.appendChild(button);
		}

		setPauseButton() {
			const area = document.getElementById("pause");
			const button = document.createElement("BUTTON"); // restart button.
			//
			button.appendChild(document.createTextNode("PAUSE"));
			button.addEventListener("click", () => {
				if (game.isRunning) {
					game.pause();
				} else {
					game.start();
				}
			});
			//
			area.appendChild(button);
		}

		updateDisplay(isUpdated) {
			const buttons = game.getWorldObjectsByGroup('button');
			const backgrounds = game.getWorldObjectsByGroup('background');
			switch(isUpdated) {
			    case "displayVersion": if (options.modes.dev.displayVersion) {  common.setCss("version", "display", ""); } else { common.setCss("version", "display", "none"); } break;
			    case "displayScreenSelection": if (options.modes.dev.displayScreenSelection) { common.setCss("button-area", "display", ""); } else { common.setCss("button-area", "display", "none"); }	 break;
			    case "displayIngameButtons": if (options.modes.dev.displayIngameButtons) { _.each(buttons, button => { button.isVisible = true }); } else { _.each(buttons, button => { button.isVisible = false }); } break;
			    case "displayBackgrounds": if (options.modes.dev.displayBackgrounds) { _.each(backgrounds, background => { background.isVisible = true }); } else { _.each(backgrounds, background => { background.isVisible = false }); } break;
			    default: break;
			}
		}

	}
	
	// All game modes instances here.
	game.mode = {
		dev: new DevelopmentEnvironment()
	}

})();