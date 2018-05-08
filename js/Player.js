(function() {
	'use strict';

	const GameObject = game.constructors.GameObject;

	// Player object
	class Player extends GameObject{
		draw() {
			super.draw();
		}
	}

	game.constructors.Player = Player;

})();