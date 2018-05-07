(function() {
	'use strict';

	const opt = OPTIONS.PLAYER;

	class Vector{
		constructor(x,y){
			this.x = x, this.y = y
		}
		init(x,y){
			this.x = x, this.y = y
		}
		add(vec){
			if(vec.x !== undefined) this.x += vec.x;
			if(vec.y !== undefined) this.y += vec.y;
			return new Vector(this.x, )
		}
		sub(){
			if(vec.x !== undefined) this.x -= vec.x;
			if(vec.y !== undefined) this.y -= vec.y;
		}
		mag(){
			return Math.sqrt(this.x * this.x + this.y * this.y)
		}
		mul(scalar){
			this.x *= scalar;
			this.y *= scalar;
		}
	}

	// Player object
	class Player extends GameObject {

		constructor({id, x, y, w, h, states, screens, index}){
				super({id, x, y, w, h, states, screens, index})

				this.physics = {
					pos: new Vector(this.x, this.y),
					vel: new Vector(0,0), acc: new Vector(0,0),
					grav: 1.5, speed: 4, maxSpeed: 20,
					jump: -50, coolDown: null, fric: 0.9,
					floor: game.height, walls: [0, game.width-this.width],
					near: ()=>{
						let p = this.physics
						if(p.pos.y >= p.floor){
							p.pos.y = p.floor
						}
					}
				}
			}


		update() {
			super.update();
			//handle inputs
			if(game.pressedKeys[KEY.LE]) this.moveLeft()
			if(game.pressedKeys[KEY.RI]) this.moveRight()

			let jc = this.physics.coolDown
			this.physics.coolDown = jc !== null ? jc <= 0 ? null : jc-1 : null
			if(game.pressedKeys[KEY.SP]) this.jump()
			//update positions
			this.move()
			this.x = this.physics.pos.x + this.width/2;
			this.y = this.physics.pos.y - (this.height +11);

		}

		moveLeft(yn) {
			this.physics.acc.add({x: -this.physics.speed * this.physics.fric})
		}
		moveRight(){
			this.physics.acc.add({x: this.physics.speed})
		}
		jump(){
			if(this.physics.coolDown === null){
				this.physics.acc.add({y: this.physics.jump})
				this.physics.coolDown = 20
			}
		}
		move(){
			let p = this.physics;
			//add gravity if not on floor
			if(p.pos.y !== p.floor){
				p.acc.add({y: p.grav})
			}

			//friction

			/// do mathy thing
			p.vel.add(p.acc)
			//p.vel.mul(p.fric)
			//reset acceleration
			p.acc.init(0,0)

			///clip player to wall or floor
			p.near()
			///move
			if(p.vel.mag() < 0.1) p.vel.init(0,0)
			p.pos.add(p.vel)
		}

	}

	// Instance, we could also do this => (game.Player = Player) to store the constructor for later use.
	game.player = new Player({
		id: 'player',
		x: 600,
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
