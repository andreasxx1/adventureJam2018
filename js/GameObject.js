(function() {
	'use strict';

	window.GameObject = GameObject;

	function GameObject({ id, x, y, w, h, states, screens, index }) {
		this.id = id;
		this.x = x;
		this.y = y;
		this.width = w;
		this.height = h;
		this.index = index || index === 0 ? index : -1; // Drawing index (the bigger the closer).
		this.screens = screens;
		this.isVisible = true; 	 // Affects object visibility.
		this.isActive = true; 	 // Affects object interaction with the world.
		this.states = [];
		this.activeState = null;
		this.isBoundingboxVisible = false;

		//
		this.initialize = initialize;
		this.draw = draw;
		this.update = update;
		this.getObjectDimentions = getObjectDimentions;
		this.getActiveSprite = getActiveSprite;
		this.setstates = setstates;
		this.animate = animate;

		//////////

		this.initialize();

		//////////

		function initialize() {
			_.each(Object.keys(states), name => {
				this.states[name] = { 
					sprite: name, 
					frames: states[name].frames, 
					tpf: states[name].tpf, 
					frame: 0, 
					isRotated: false 
				};
				_.each(Object.keys(this.states), key => {
					if (!this.activeState) { this.activeState = this.states[key]; }
				});
				this.animate();
			});
		}

		function draw() {
			if (this.isActive && this.activeState) {
				if (this.isVisible) {	
					//  
					const img = this.getActiveSprite();
					const frx = (img.width / this.activeState.frames) * this.activeState.frame;
					const fry = 0;
					const spw = img.width / this.activeState.frames;
					const sph = img.height;
					const pox = this.x;
					const poy = this.y;
					const drw = img.width / this.activeState.frames;
					const drh = img.height;

					// Getting object dimentions based on the active state sprite.
					this.getObjectDimentions();

					// Rendering
					if (this.activeState.isRotated) {
						game.context.save();
						game.context.translate(game.width, 0);
						game.context.scale(-1, 1);
						game.context.drawImage(img,frx,fry,spw,sph,game.width-pox-this.width,poy,drw,drh);
						game.context.restore();
					} else {
						game.context.drawImage(img,frx,fry,spw,sph,pox,poy,drw,drh);
					}
				}
				//
				if (this.isBoundingboxVisible) {
					// ToDo: draw object's bounding box here.
				}
			}
		}

		function update() {
			if (this.isActive && this.activeState) {

			}
		}

		function getObjectDimentions() {
			const img = this.getActiveSprite();
			const spw = img.width / this.activeState.frames;
			const sph = img.height;
			//
			this.width = spw;
			this.height = sph;
		}

		function getActiveSprite() {
			return this.activeState ? game.sprites[this.activeState.sprite] : null;
		}

		function setstates(state) {
			if (this.states[state]) {
				this.activeState = this.states[state];
			} else {
				throw 'Error: trying to set state: ' + state + ', but is: ' + this.states[state];
			}
		}

		// Animation

		function animate() {
			const state = this.activeState;
			state.frame = 0;
			if (this.animationLoop) { clear(this.animationLoop); }
			this.animationLoop = setInterval(() => {
				if (state.frame < state.frames-1) {
					state.frame++;
				} else {
					state.frame = 0;
				}
			}, this.activeState.tpf)
		}

	}

})();




