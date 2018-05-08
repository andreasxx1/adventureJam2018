
(function() {
	'use strict';

	const phy = game.phy
	const GameObject = game.constructors.GameObject;

	// Player object
	class Player extends GameObject {
		constructor({id, x, y, w, h, states, screens, index}){
				super({id, x, y, w, h, states, screens, index})
				///jump cooldown, lol like flies can have infinit jump for fly
				this.jc = 0;
				//returns a method to be called when the players position is wanted
				const settings = {
					walkSpeed: 4,
					runSpeed: 10,
					jumpHeight: 50,
					dashDist: 100
				}
				this.move = phy.addToPhysicalWorld(this, settings);
		}
		update() {
			super.update();
			//handle inputs
			if(game.pressedKeys[KEY.LE]) this.moveLeft();
			if(game.pressedKeys[KEY.RI]) this.moveRight();
			if(game.pressedKeys[KEY.SP]) this.jump();

			//update positions
			{
			let {x, y} = this.move(this.id)
			this.x = x;
			this.y = y;
			}
		}
		moveLeft() {
			game.pressedKeys[KEY.SH]
			? phy.walkLeft(this.id)
			: phy.runLeft(this.id)
		}
		moveRight(){
			game.pressedKeys[KEY.SH]
			? phy.walkRight(this.id)
			: phy.runRight(this.id)
		}
		jump(){
			this.jc = jc !== null ? jc <= 0 ? null : jc-1 : null
			if(jc === null){
				phy.jump(this.id)
			}
		}
	}

	game.constructors.Player = Player;

})();
