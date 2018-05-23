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
			this.setScreenButtonsDisplay();
			this.setDrawCollidersCallback();
		}

		drawColliders() {
			if (options.modes.dev.drawColliders) {
				const gameWorld = Object.keys(game.world).map(key => { return game.world[key] });
				const physicsWorld = game.phy.getPhysicalWorld();
				const objects = (gameWorld).concat(physicsWorld);
				//
				_.each(objects, obj => {
					if (obj.weight === -1 || obj.isActive) {
						let alpha = game.context.globalAlpha
						game.context.globalAlpha = 0.3;
						game.context.fillStyle ="#FFB6C1";
						game.context.fillRect((obj.pos ? obj.pos.x : obj.x), (obj.pos ? obj.pos.y : obj.y), (obj.dim ? obj.dim.x : obj.width), (obj.dim ? obj.dim.y : obj.height));
						game.context.globalAlpha = alpha;
					}
				});
			}
	    }

		setScreenButtonsDisplay() {
			const area = document.getElementById("button-area");
			area.innerHTML = "Screens: ".bold();
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
			area.appendChild(document.createTextNode("development options: "));
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

		setDrawCollidersCallback() {
			game.pushCallback('draw', this.drawColliders);
		}

		updateDisplay(isUpdated) {
			const menuButtons = game.getWorldObjectsByGroup('menuButton');
			const backgrounds = game.getWorldObjectsByGroup('background');
			switch(isUpdated) {
			    case "displayVersion": if (options.modes.dev.displayVersion) {  common.setCss("version", "display", ""); } else { common.setCss("version", "display", "none"); } break;
			    case "displayScreenButtons": if (options.modes.dev.displayScreenButtons) { common.setCss("button-area", "display", ""); } else { common.setCss("button-area", "display", "none"); }	 break;
			    case "displayDoll": if (options.modes.dev.displayDoll) { game.apply('background_layer_1', 'isVisible', true); } else { game.apply('background_layer_1', 'isVisible', false); } break;
			    case "displayMenuButtons": if (options.modes.dev.displayMenuButtons) { _.each(menuButtons, button => { button.isVisible = true }); } else { _.each(menuButtons, button => { button.isVisible = false }); } break;
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