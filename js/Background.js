(function() {
	'use strict';

	const GameObject = game.constructors.GameObject;
	
	class Background extends GameObject {
		constructor({ id, screens, index, states, constructor }){
			super({ id, screens, index, states, constructor });

			// ToDo: layer manager, different layers with different attributes (effects).
		}
	}

	game.constructors.Background = Background;

})();