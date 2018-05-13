
(function() {
	'use strict';

	const physicEngine = game.phy;
	const GameObject = game.constructors.GameObject;

	class AI {
		constructor() {

		}

	}

	game.constructors.AI = AI;

	// test enemy
	class Enemy6 extends GameObject {
		constructor({id, x, y, w, h, states, screens, constructor, index}){
				super({id, x, y, w, h, states, screens, constructor, index});
				this.AI = new game.constructors.AI;
				this.isColliding = { x: false, y: false };

				this.jc = 0;
				this.jp = false;
				//
				this.vals = {
					walkSpeed: 4,
					runSpeed: 10,
					jumpHeight: 250,
					dashDist: 100
				}
				//
				this.move = physicEngine.addToPhysicalWorld({
					gameObj: this,
					w:w, h:h, weight: 2
				});
		}

		isCollidingPlayer() {
			_.each(physicEngine.getPhysicalWorld(), obj => {
				if (obj.id === 'player') {
					this.isColliding.x = this.x + this.width >= obj.pos.x && this.x <= obj.pos.x + obj.dim.x;
					this.isColliding.y = this.y + this.height >= obj.pos.y && this.y <= obj.pos.y + obj.dim.y;
				}
			});
		}

		update() {
			super.update();

			//handle inputs
			if(game.pressedKeys[KEY.LE]) { this.moveLeft(); }
			if(game.pressedKeys[KEY.RI]) { this.moveRight(); }
			if(game.pressedKeys[KEY.SP]) {
				if (!this.jp) {
					this.jp = true
					this.jump();
				}
			}else{
				this.jp = false;
			}

			this.isCollidingPlayer();

			//update positions
			{
			let {x, y} = this.move(this.id);
			this.x = x;
			this.y = y;
			}
		}

		moveLeft() {
			physicEngine.Left(this.id, this.vals.runSpeed);
		}

		moveRight(){
			physicEngine.Right(this.id, this.vals.runSpeed);
		}

		jump() {
			if (physicEngine.isOnFloor(this.id)) {
				physicEngine.Jump(this.id, this.vals.jumpHeight);
			}
		}

		dash(){
			///todo dash physics
		}
	}

	game.constructors.Enemy6 = Enemy6;

})();