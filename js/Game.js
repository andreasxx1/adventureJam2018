(function() {

	class Game {
		constructor(w, h, g) {
			this.width = w;
			this.height = h;
			this.gravity = g;
			this.pressedKeys = [];
			this.world = [];
			this.activeScreens = [];
			this.sprites = [];
			this.constructors = {};
			this.sm = new ScreenManager(); // Class below
		}

		start() {
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
				if (object.getScreens().some(screen => {
					return screen === this.sm.getActiveScreen();
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
			_.sortBy(this.world, a => { a.index});
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

	class ScreenManager {
		constructor() {
			this.screens = [];
			this.activeScreen = null;
			this.lastActiveScreen = null;
			//
			this.initialize();
		}

		initialize() {
			Object.keys(SCREEN).map(key => { this.setScreen(SCREEN[key]); });
			this.go(START_SCREEN);
		}

		go(screen) {
			this.setActiveScreen(screen);
		}

		setScreen(newScreen) {
			if (!this.screens.some(screen => {
				return screen === newScreen;
			})) {
				this.screens.push(newScreen);
			}
		}

		getScreens() {
			return this.screens;
		}

		getActiveScreen() {
			return this.activeScreen;
		}

		setActiveScreen(screen) {
			this.lastActiveScreen = this.activeScreen;
			this.activeScreen = screen;
		}

		backToLastActiveScreen() {
			this.activeScreen = this.lastActiveScreen;
		}
	}

	window.Game = Game;

})()
