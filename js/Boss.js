(function() {
	'use strict';

	class Boss {
		constructor({id, x, y, w, h, states, screens, constructor, index}){
				super({id, x, y, w, h, states, screens, constructor, index})
				// this.vals = {
				// 	walkSpeed: 4,
				// 	runSpeed: 10,
				// 	jumpHeight: 250,
				// 	dashDist: 100
				// }
				// this.move = phy.addToPhysicalWorld({
				// 	gameObj: this,
				// 	w:w, h:h, weight: 10
				// });
		}

		
	}

	game.constructors.Boss = Boss;

})();