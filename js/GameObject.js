(function() {
	'use strict';

	class GameObject {
		constructor({ id, x, y, w, h, states, screens, index, isInstanciated, constructor }) {
			this.id = id || 'gameObject';
			this.x = x || 0;
			this.y = y || 0;
			this.width = w || 0;
			this.height = h || 0;
			this.screens = screens; // screens where the object will be active [array].
			this.states = [];
			this.index = index || index === 0 ? index : -1; // Drawing index (the bigger the closer).
			this.isVisible = true; 	 // Affects object visibility.
			this.isActive = true; 	 // Affects object interaction with the world.
			this.activeState = null;
			this.isBoundingboxVisible = false;
			this.isInstanciated = isInstanciated || true;
			this.constructorClass = constructor;
			
			// Setting states
			_.each(Object.keys(states), name => {
				this.states[name] = {
					sprite: name,
					frames: states[name].frames,
					tpf: states[name].tpf,
					frame: 0,
					isRotated: false
				};
				if (!this.activeState) {
					this.activeState = this.states[name];
				}
			});
			//
			this.initialize();

		}

		//////////

		initialize() {
			if (this.isInstanciated) {
				game.createObject(this);
				this.animate();
			}
		}

		draw() {
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

		update() {
			if (this.isActive && this.activeState) {

			}
		}

		getObjectDimentions() {
			const img = this.getActiveSprite();
			const spw = img ? img.width / this.activeState.frames : 0;
			const sph = img ? img.height : 0;
			//
			this.width = spw;
			this.height = sph;
		}

		getActiveSprite() {
			return this.activeState ? game.sprites[this.activeState.sprite] : null;
		}

		setstates(state) {
			if (this.states[state]) {
				this.activeState = this.states[state];
			} else {
				throw 'Error: trying to set state: ' + state + ', but is: ' + this.states[state];
			}
		}

		getScreens() {
			return this.screens;
		}

		// Animation

		animate() {
			const state = this.activeState;
			state.frame = 0;
			if (this.animationLoop) { clear(this.animationLoop); }
			this.animationLoop = setInterval(() => {
				if (state.frame < state.frames-1) {
					state.frame++;
				} else {
					state.frame = 0;
				}
			}, this.activeState.tpf); // time per frame
		}

	}

	game.constructors.GameObject = GameObject;

})();
