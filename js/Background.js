(function() {
	'use strict';

	const GameObject = game.constructors.GameObject;
	
	class Background extends GameObject {
		constructor({ id, screens, index, states, constructor }){
			super({ id, screens, index, states, constructor });

			// ToDo: layer manager, in order to manage different background layers with different attributes.
		}
	}

	game.constructors.Background = Background;

})();