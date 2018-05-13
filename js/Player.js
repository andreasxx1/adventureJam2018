
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
				this.jp = 0;

				this.vals = {
					walkSpeed: 10,
					runSpeed: 30,
					jumpHeight: 200,
					dashDist: 100
				}
				this.move = phy.addToPhysicalWorld({
					gameObj: this,
					w:w, h:h, weight: 1
				});
		}
		update() {
			super.update();
			//handle inputs
			if(game.pressedKeys[KEY.LE]) this.moveLeft();
			if(game.pressedKeys[KEY.RI]) this.moveRight();
			if(game.pressedKeys[KEY.SP]) {
				if(this.jp < 2){
					this.jp++
					this.jump();
				}
			}else{
				this.jp = false;
			}
			//console.log(game.pressedKeys[KEY.SH])

			//update positions
			{
			let {x, y} = this.move(this.id)
			this.x = x;
			this.y = y;
			}
		}
		moveLeft() {
			if(phy.isOnFloor(this.id) && game.pressedKeys[KEY.SH]){
				phy.Left(this.id, this.vals.runSpeed)
			}else{
				phy.Left(this.id, this.vals.walkSpeed)
			}
		}
		moveRight(){
			if(phy.isOnFloor(this.id) && game.pressedKeys[KEY.SH]){
				phy.Right(this.id, this.vals.runSpeed)
			}else{
				phy.Right(this.id, this.vals.walkSpeed)
			}
		}
		jump(){
			if(phy.isOnFloor(this.id)){
				phy.Jump(this.id, this.vals.jumpHeight)
			}
		}
		dash(){

		}
	}

	game.constructors.Player = Player;

})();
