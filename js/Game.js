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
			this.callbacks = {};
		}

		start() {
			this.update();
			this.draw();
		}

		update() {
			this.updateObjectStatus(); // set isActive flag.
			this.execCallbacks('update'); // Injected functions (to inject function use pushCallback);
			this.execFunctionOnActiveObjects('update');
			setTimeout(() => { this.update(); }, 1000/60); // 1000/60 = 60 frames per seconds.
		}

		draw() {
			this.clearCanvas();
			this.execCallbacks('draw');
			this.execFunctionOnActiveObjects('draw');
			this.execFunctionOnActiveObjects('drawOnMiniMap');
			requestAnimFrame(() => { this.draw(); }); // requestAnimFrame uses delta time and adapts the frame rate for a smooth drawing.
		}

		instantiate(name, constructorName, ...args) {
			this[name] = new this.constructors[constructorName](_.assign(...args, { constructor: this.constructors[constructorName] } ));
		}

		updateObjectStatus() {
			_.each(this.world, object => {
				object.isActive = object.getScreens().some(screen => { return screen === this.sm.getActiveScreen() });
			});
		}

		execFunctionOnActiveObjects(fName) {
			_.each(this.world, object => {
				if (object.isActive && typeof object[fName] === 'function') object[fName]();
			});
		}

		execCallbacks(cName) {
			if (this.callbacks[cName]) this.callbacks[cName]();
		}

		pushCallback(cName, callback) {
			this.callbacks[cName] = callback;
		}

		createObject(object) {
			this.world.push(object);
			this.reArrangeWorld();
		}

		reArrangeWorld() {
			_.sortBy(this.world, a => {'index'});
		}

		load() {
			return new Promise(resolve => {
				const spriteNames = Object.keys(SPRITE).map(key => { return SPRITE[key]; });
				_.each(spriteNames, (spriteName, index) => {
					if (!_.has(game.sprites, spriteName)){
						game.sprites[spriteName] = new Image();
						game.sprites[spriteName].src = ASSETS_FOLDER + spriteName + SPRITE_FORMAT;
					}
					if (index+1 >= spriteNames.length) {
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
