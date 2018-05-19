(function() {
	'use strict';

	class Boss {
		constructor({id, x, y, w, h, states, screens, constructor, index}){
				super({id, x, y, w, h, states, screens, constructor, index})
		}
	}

	game.constructors.Boss = Boss;

})();