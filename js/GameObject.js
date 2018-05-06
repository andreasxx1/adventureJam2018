(function() {
	'use strict';

	function GameObject(id, w, h, index) {
		this.id = id;
		this.index = index || -1;
		this.width = w;
		this.height = h;
		this.screens = [];
		this.isVisible = true; 	// Affects object visibility.
		this.isActive = true; 	// Affects object interaction with the world.
		this.states = [];
		this.activeState = null;
		this.isBoundingboxVisible = false;
	}

	GameObject.prototype.draw = function() {
		if (this.isActive && this.activeState) {
			if (this.isVisible) {	
				//  
				const img = this.getActiveSprite();
				const frx = img.width / this.activeState.frames * this.activeState.frame;
				const fry = 0;
				const spw = img.width / this.activeState.frames;
				const sph = img.height;
				const pox = this.x;
				const poy = this.y - img.height;
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

	GameObject.prototype.update = function() {
		if (this.isActive && this.activeState) {

		}
	}

	GameObject.prototype.getActiveSprite = function() {
		return this.activeState ? game.sprites[this.activeState.name] : null;
	}

	GameObject.prototype.getObjectDimentions = function() {
		const img = this.getActiveSprite();
		const spw = img.width / this.activeState.frames;
		const sph = img.height;
		//
		this.width = spw;
		this.height = sph;
	}

	GameObject.prototype.create = function() {
		game.createObject(this);
	}

	GameObject.prototype.createState = function(name, sprite, frames) {
		this.states[name] = { name, sprite, frames, frame: 0, isRotated: false };
	}

	GameObject.prototype.setstates = function(state) {
		if (this.states[state]) {
			this.activeState = this.states[state];
		} else {
			throw 'Error: trying to set state: ' + state + ', but is: ' + this.states[state];
		}
	}

})();