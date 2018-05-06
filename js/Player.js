(function() {
	'use strict';

	const opt = OPTIONS.PLAYER;

	// Instance, we could also do this => (game.Player = Player) to store the constructor for later use.
	game.player = new Player(0, 0, opt.w, opt.h, opt.index);

	// Inherit from GameObject.
	Player.prototype = Object.create(GameObject.prototype);
	Player.prototype.constructor = Player;

	// Player object
	function Player(x, y, w, h, index) {
		const screens = [ SCREEN.LEVEL1 ];
		const states = { 
			'player_idle': { sprite: 'player_idle', frames: 2, tpf: 500 }
		};
		//
		GameObject.call(this, { id: 'player', x, y, w, h, states, screens, index });
		//
		game.createObject(this);
	}

})();