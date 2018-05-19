(function() {
	'use strict';

	const GameObject = game.constructors.GameObject;

	class Menu extends GameObject {
		constructor({ constructor }){
			super({ id: 'menu', screens: ['menu'], index: 1, constructor, isAbstract: true });

			// subscreens data.
			this.subscreens = {
				'main': { 
					buttons: [
						{ 
							id: 'newGameButton', 
						  	index: 2, x: 0, y: 0,
						  	states: {
						  		'start_button': { sprite: 'start_button', frames: 1, tpf: 0 }
						  	}, 
						  	callback: () => { 
						  		console.log('new game'); 
						  	}
						}
					],
					background: null // ToDo background manager class.
				}
				// {
				// 	name: 'controls'
				// },
				// {
				// 	name: 'credits'
				// }
			};
			//
			this.activeScreen = 'main';
			this.lastActiveScreen = null;
			//
			this.subscreenObjects = [];
		}

		draw() {
			// Temporal background
			game.context.fillStyle="#CCC";
			game.context.fillRect(0, 0, game.width, game.height);
			//
		}

		update() {
			this.updateSubscreens();
		}

		updateSubscreens() {
			if (this.activeScreen !== this.lastActiveScreen) {
				//
				this.destroySubscreen(this.lastActiveScreen);
				this.createSubscreen(this.activeScreen);
				//
				this.lastActiveScreen = this.activeScreen;
			}
		}

		setActiveScreen(name) {
			this.activeScreen = name;
		}

		createSubscreen(name) {
			if (name) {
				const options = this.subscreens[name];
				// creating buttons
				_.each(options.buttons, button => {
					game.instantiate(button.id, 'Button', _.assign(button, {
						screens: this.screens
					}));
				});
				// creating background
				// ToDo.
			}
		}

		destroySubscreen(name) {
			if (name) {
				const options = this.subscreens[name];
				// destroying buttons.
				_.each(options.buttons, button => {
					game.destroyObject(button.id);
				});
				// destroying background.
				// ToDo.
			}
		}

	}
	
	game.constructors.Menu = Menu;

})();