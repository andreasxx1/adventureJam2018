(function() {
	'use strict';
	
	const GameObject = game.constructors.GameObject;

	class GameButton extends GameObject { // GameButton instead of Button due reserved word "Button".
		constructor({ id, x, y, w, h, states, screens, index, constructor, callback, group, text, fontStyle, fontSize, fontColor }){
			super({ id, x, y, w, h, states: states || null, screens, index, constructor, group });
			// 
			this.fontStyle = fontStyle || "Pixelmix";
			this.fontSize = this.fontSize || 24;
			this.fontColor = this.fontColor || "white";
			this.text = text || null;
			this.callback = callback; // callback function 
		}

		draw() {
			if (this.text && this.isVisible) {
				game.context.font = this.fontSize + "px " + this.fontStyle;
				game.context.fillStyle = this.fontColor;
				game.context.fillText(this.text, this.x, this.y);
			}
		}

		click() {
			this.callback();
		}
	}
	
	game.constructors.Button = GameButton;

})();