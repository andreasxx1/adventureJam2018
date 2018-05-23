(function() {
	'use strict';
	
	const GameObject = game.constructors.GameObject;

	class GameButton extends GameObject { // GameButton instead of Button due reserved word "Button".
		constructor({ id, x, y, w, h, states, screens, index, constructor, callback, group }){
			super({ id, x, y, w, h, states, screens, index, constructor, group });
			// 
			this.callback = callback; // callback function 
		}

		click() {
			this.callback();
		}
	}
	
	game.constructors.Button = GameButton;

})();