
(function() {
	'use strict';

	const phy = game.phy
	const GameObject = game.constructors.GameObject;

	// Player object
	class Player extends GameObject {
		constructor({id, x, y, w, h, states, screens, index, constructor}){
				super({id, x, y, w, h, states, screens, index, constructor})
				///jump cooldown, lol like flies can have infinit jump for fly
				this.jc = 0;
				this.jp = 0;

				this.vals = {
					walkSpeed: 20,
					runSpeed: 35,
					jumpHeight: 180,
					dashDist: 500
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
			if (phy.isOnFloor(this.id)) {
				if(!game.pressedKeys[KEY.RI] && !game.pressedKeys[KEY.LE]) this.setStates(SPRITE.PLAYERIDLE);
			} else {
				this.setStates(SPRITE.PLAYERJUMP);
			}

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
				if (phy.isOnFloor(this.id) && this.activeState.sprite !== SPRITE.PLAYERRUN) this.setStates(SPRITE.PLAYERRUN) // Only run available
				phy.Left(this.id, this.vals.walkSpeed)
			}
			this.isRotated = true;
		}
		moveRight(){
			if(phy.isOnFloor(this.id) && game.pressedKeys[KEY.SH]){
				phy.Right(this.id, this.vals.runSpeed)
			}else{
				if (phy.isOnFloor(this.id) && this.activeState.sprite !== SPRITE.PLAYERRUN) this.setStates(SPRITE.PLAYERRUN) // Only run available
				phy.Right(this.id, this.vals.walkSpeed)
			}
			this.isRotated = false;
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
