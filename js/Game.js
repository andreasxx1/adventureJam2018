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
			this.modes = window.MODES; // active modes (see modes in js/modes.js and GameInit.js -> window.MODES).
 			this.callbacks = {};
		}

		start() {
			this.update();
			this.draw();
		}

		// ToDo: clean draw and update functions.

		update() {
			this.updateObjectStatus(); // set isActive flag.
			this.execCallbacks('update'); // Injected functions for updating (to inject function use pushCallback);
			this.execFunctionOnActiveObjects('update');
			setTimeout(() => { this.update(); }, 1000/60); // 1000/60 = 60 frames per seconds.
		}

		draw() {
			this.clearCanvas();
			this.execCallbacks('draw'); // Injected functions for drawing (to inject function use pushCallback)
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
			//
			this.reArrangeWorld();
		}

		destroyObject(id) {
			const index = this.getWorldObjectById(id, true, false);
			//
			this.world.splice(index, 1);
			//		
			delete this[name];
			//
			this.reArrangeWorld();
		}

		getWorldObjectById(id, isIndex=false, isObject=true) {
			let index = null;
			let object = null;
			//
			for (let i = 0; i < this.world.length; i++) {
				if (this.world[i].id === id) {
					index = i;
					object = this.world[i];
					break;
				}
			}
			//
			return isObject && isIndex ? [object, index] : (isIndex ? index : (isObject ? object : null))  ;
		}

		reArrangeWorld() {
			common.sortBy(this.world, 'index');
		}

		load() {
			return new Promise(resolve => {
				const sprites = Object.keys(SPRITE).map(key => SPRITE[key]);
				//
				_.each(sprites, (name, index) => {
					if (!_.has(game.sprites, name)){
						game.sprites[name] = new Image();
						game.sprites[name].src = ASSETS_FOLDER + name + SPRITE_FORMAT;
					}
					if (index+1 >= sprites.length) {
						resolve();
					}
				});
			});
		}

		clearCanvas() {
			this.context.clearRect(0, 0, this.width, this.height);
		}

		startMode(mode) {
			if (!this.modes.some(m => m === mode)) {
				this.modes.push(mode);
			}
		}

		stopMode(mode) {
			const index = this.modes.indexOf(mode);
			//
			if (index !== -1) { 
				this.modes.splice(index, 1);
			}
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
