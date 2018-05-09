
(function() {
	'use strict';

	const phy = game.phy
	const GameObject = game.constructors.GameObject;

	// Player object
	class Player extends GameObject {
		constructor({id, x, y, w, h, states, screens, constructor, index}){
				super({id, x, y, w, h, states, screens, constructor, index})
				///jump cooldown, lol like flies can have infinit jump for fly
				this.jc = 0;
				this.jp = false;

				this.vals = {
					walkSpeed: 4,
					runSpeed: 10,
					jumpHeight: 250,
					dashDist: 100
				}
				this.move = phy.addToPhysicalWorld({
					gameObj: this,
					w:w, h:h, weight: 10
				});
		}
		update() {
			super.update();
			//handle inputs
			if(game.pressedKeys[KEY.LE]) this.moveLeft();
			if(game.pressedKeys[KEY.RI]) this.moveRight();
			if(game.pressedKeys[KEY.SP]) {
				if(!this.jp){
					this.jp = true
					this.jump();
				}
			}else{
				this.jp = false;
			}


			//update positions
			{
			let {x, y} = this.move(this.id)
			this.x = x;
			this.y = y;
			}
		}
		moveLeft() {
			game.pressedKeys[KEY.SH]
			? phy.Left(this.id, this.vals.walkSpeed)
			: phy.Left(this.id, this.vals.runSpeed)
		}
		moveRight(){
			game.pressedKeys[KEY.SH]
			? phy.Right(this.id, this.vals.walkSpeed)
			: phy.Right(this.id, this.vals.runSpeed)
		}
		jump(){
			if(phy.isOnFloor(this.id)){
				phy.Jump(this.id, this.vals.jumpHeight)
			}
		}
		dash(){
			///todo dash physics
		}
	}

	game.constructors.Player = Player;

})();
