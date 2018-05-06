(function() {
	'use strict';

	const opt = OPTIONS.PLAYER;

	// Player object
	class Player extends GameObject {
		draw() {
			super.draw();
			console.log('and also log this');
		}
	}

	// Instance, we could also do this => (game.Player = Player) to store the constructor for later use.
	game.player = new Player({ 
		id: 'player', 
		x: 0, 
		y: 0, 
		w: opt.w, 
		h: opt.h, 
		states: { 
			'player_idle': { 
				sprite: 'player_idle', 
				frames: 2, 
				tpf: 500 
			} 
		}, 
		screens: [ SCREEN.LEVEL1 ],
		index: opt.index
	});

	game.createObject(game.player);

})();