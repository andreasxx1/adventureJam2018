(function() {
	'use strict';

	////////// Development mode -> when: window.ACTUAL_MODE = window.MODE.DEV (ACTUAL_MODE = MODE.DEV).

	class DevelopmentEnvironment {
		constructor() {}

		start() {
			this.setGameVersionDisplay(GAME_VERSION);
			this.setOptionsDisplay();
			this.setScreenButtonsDisplay();
			this.setDrawCollidersCallback();
		}

		drawColliders() {
			if (options.dev.drawColliders) {
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
				button.addEventListener("click", function() {
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
			_.each(Object.keys(options.dev), (key, index) => {
				// 
				area.appendChild(document.createElement("SPAN").appendChild(document.createElement("br")));
				// 
				const optionCheck = document.createElement("INPUT");
				const optionLabel = document.createElement("SPAN");
				//
				optionLabel.appendChild(document.createTextNode(key));
				//
				optionCheck.type = "checkbox";
				optionCheck.checked = options.dev[key];
				optionCheck.addEventListener("click", () => {
					options.dev[key] = !options.dev[key];
					this.updateElementsDisplay();
				});
				area.appendChild(optionCheck);
				area.appendChild(optionLabel);
				//
			});
		}

		setDrawCollidersCallback() {
			game.pushCallback('draw', this.drawColliders);
		}

		updateElementsDisplay() {
			if (options.dev.displayVersion) { common.setCss("version", "display", "") } else { common.setCss("version", "display", "none"); }
			if (options.dev.displayScreenButtons) { common.setCss("button-area", "display", ""); } else { common.setCss("button-area", "display", "none"); }
		}

	}

	////////// Other environments here (maybe one pseudo "easter" egg activated with the konami code).

	// Create environment mode.
	game.dev = new DevelopmentEnvironment();

})();