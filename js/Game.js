(function() {
	
	class Game {
		constructor(w, h, g) {
			this.width = w;
			this.height = h;
			this.gravity = g;
			this.pressedKeys = [];
			this.world = [];
			this.screens = [];
			this.activeScreens = [];
			this.sprites = [];
		}

		initialize() {
			this.setScreens();
		}

		setScreens() {
			Object.keys(SCREEN).map((key, value) => { this.screens[key] = value; });
			this.activeScreens.push(START_SCREEN);
		}

		start() {
			this.initialize();
			this.update();
			this.draw();
		}

		update() {
			this.execOnActiveObjects(DICTIONARY.UPDATE);
			setTimeout(() => { this.update(); }, 1000/60); // 1000/60 = 60 frames per seconds.
		}

		draw() {
			this.clearCanvas();
			this.execOnActiveObjects(DICTIONARY.DRAW);
			requestAnimFrame(() => { this.draw(); }); // requestAnimFrame uses delta time and adapts the frame rate for a smooth drawing.
		}

		execOnActiveObjects(fName) {
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

		createObject(object) {
			this.world.push(object);
			this.reArrangeWorld();
		}

		reArrangeWorld() {
			this.world.sort(function(a, b) {
				if (a.index > b.index) { return 1; }
				if (a.index < b.index) { return -1; }
				return 0;
			});
		}

		load() {
			return new Promise(resolve => {
				_.each(SPRITES, (spriteName, index) => {
					if (!game.sprites.some((v, key) => {
						return key === spriteName;
					})) {
						game.sprites[spriteName] = new Image();
						game.sprites[spriteName].src = ASSETS_FOLDER + spriteName + SPRITE_FORMAT;
					}
					if (index+1 >= SPRITES.length) {
						resolve();
					}
				});
			});
		}

		clearCanvas() {
			this.context.clearRect(0, 0, this.width, this.height);
		}

	};

	window.Game = Game;

})()





