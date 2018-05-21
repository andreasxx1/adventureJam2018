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
							id: 'gameButton', 
						  	index: 2, x: (game.width/2) - 50, y: (game.height/2) - 42.5,
						  	states: {
						  		'start_button': { sprite: 'start_button', frames: 1, tpf: 0 }
						  	}, 
						  	callback: () => { 
						  		console.log('start game'); 
						  	}
						},
						{ 
							id: 'controlsButton', 
						  	index: 2, x: (game.width/2) - 50, y: (game.height/2) - 12.5,
						  	states: {
						  		'controls_button': { sprite: 'controls_button', frames: 1, tpf: 0 }
						  	}, 
						  	callback: () => { 
						  		console.log('controls'); 
						  	}
						},
						{ 
							id: 'creditsButton', 
						  	index: 2, x: (game.width/2) - 50, y: (game.height/2) + 17.5,
						  	states: {
						  		'credits_button': { sprite: 'credits_button', frames: 1, tpf: 0 }
						  	}, 
						  	callback: () => { 
						  		console.log('credits'); 
						  	}
						}
					],
					background: [
						{
							id: 'background',
							index: -1, x: 0, y: 0, w: game.width, h: game.height, 
							states: {
								'fd_menu_bg': { sprite: 'fd_menu_bg', frames: 1, tpf: 0 }
							}
						}
					]
				}
				// {
				// 	name: 'controls' // ToDo: controls screen
				// },
				// {
				// 	name: 'credits' // ToDo: credits screen
				// }
			};
			//
			this.activeScreen = 'main';
			this.lastActiveScreen = null;
			//
			this.subscreenObjects = [];
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
				_.each(options.background, layer => {
					game.instantiate(layer.id, 'Background', _.assign(layer, {
						screens: this.screens
					}));
				});
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
				_.each(options.background, layer => {
					game.destroyObject(layer.id);
				});
			}
		}

	}
	
	game.constructors.Menu = Menu;

})();