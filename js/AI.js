
(function() {
	'use strict';

	const physicEngine = game.phy;
	const GameObject = game.constructors.GameObject;

	// 
	class ArtificialInteligence extends GameObject {
		constructor({id, x, y, w, h, states, screens, constructor, index}){
				super({id, x, y, w, h, states, screens, constructor, index});

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
					w:w, h:h, weight: 10
				});

				console.info('AI instanciated');
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

	game.constructors.ArtificialInteligence = ArtificialInteligence;

})();