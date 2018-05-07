(function(){
  'use strict';

  function round(val){
    Math.round(val)
  }

  class Vector{
		constructor(x,y){
			this.x = x, this.y = y
		}
    unit(){
      this.div(this.mag());
    }
    copy(){
      return new Vector(this.x, this.y)
    }
		add(vec){
			if(vec.x !== undefined) this.x += vec.x;
			if(vec.y !== undefined) this.y += vec.y;
			return this
		}
		sub(vec){
			if(vec.x !== undefined) this.x -= vec.x;
			if(vec.y !== undefined) this.y -= vec.y;
      return this
		}
		mag(){
			return Math.sqrt(this.x * this.x + this.y * this.y)
		}
		mul(scalar){
      if(scalar !== undefined) this.x *= scalar, this.y *= scalar;
      return this
		}
    div(scalar){
      if(vec.x !== undefined) this.x /= scalar,  this.y /= scalar;
      return this
    }
	}

  class Collider{
    constructor({id, x,y,walkSpeed,runSpeed,jump}){
      this.objRef = id
      this.pos = new Vector(this.x, this.y);
      this.vel = new Vector(0,0);
      this.acc = new Vector(0,0);
      this.grav = 1.5;
      this.walkSpeed = walkSpeed;
      this.runSpeed = runSpeed;
      this.jump = jump;
      this.isOnGround = false;
      this.coolDown = null;
      this.fric = 0.9;
      this.floor = game.height;
      this.walls = [0, game.width-this.width];
      this.collider = {
        type: 'circle',
        mode: 'center',
        radius: 20
      }
    }
  }

  class Physics{
    constructor(){
      this.Vector = Vector
      this.Collider = Collider
      //
      this.world = {
        floor: game.width,
        walls: [],
        airDrag: 0.85,
        groundDrag: 0.8
      }
      this.gameObjects = []
      this.physicalWorld = []
    }
    hello(){
      return 'hello phy'
    }
    addToPhysicalWorld(obj, settings){
      if(obj instanceof GameObject){
        ///
        this.physicalWorld.push(new Collider({
          id: obj.id,
          x: 0,
          y: 0,
          walkSpeed: settings.walkSpeed,
          runSpeed: settings.runSpeed,
          jump: settings.jump,
          dash: settings.dashDist
        }))
        ///
        return ((gameObject) =>{
          return this.update(gameObject)
        }).bind(this)

      }
      throw 'All objects that want to get added to the physical world must be a GameObject'
    }
    getCol(id){
      let col = _.find(this.physicalWorld,((o)=> o.id === id));
      if( !col ) throw 'trying to move a non-exsisting object';
      return col;
    }
    walkLeft(id){
      let col = this.getCol(id)
      col.acc.add({x: -col.walkSpeed})
    }
    runLeft(id){
      let col = this.getCol(id)
      col.acc.add({x: -col.runSpeed })
    }
    walkRight(id){
      let col = this.getCol(id)
      col.acc.add({x: col.walkSpeed })
    }
    runRight(id){
      let col = this.getCol(id)
      col.acc.add({x: col.runSpeed })
    }
    jump(id){
      let col = this.getCol(id)
      col.acc.add({y: -col.jump })
    }
    isOnGround(col){

    }
    addAirDrag(){

    }
    addGroundDrag(){

    }
    collide(col, vel){
      return vel.copy()
    }
    floor(position, velocity){
      let vel = velocity.copy()
      if(round(position.y) === round(this.world.floor)){
        ///clip to ground if only small bounce
        if(vel.y < 0.1){
          vel.y = 0;
        }
      }else if(position.y < this.world.floor){
        //object already in floor
        vel.y = this.world.floor - position.y
      }else if(position.y + vel.y < this.world.floor){
        ///object above floor do nothing
      }else if(position.y + vel.y > this.world.floor){
        /// will go through floor
        vel.y = this.world.floor - position.y
      }else if(col.y + vel.y === this.world.floor){
        ///is going to land on floor, do nothing
      }else{
        console.log(col)
        throw 'unhandled floor logic see collision object above'
      }
      return vel
    }
    walls(col, vel){
      return vel
    }
    update(id, delta){
      let col = this.getCol(id)
      let vel = col.vel.mul(delta)
      ///collisions with other gameObjects
      vel = this.collide(col.pos, vel)
      ///clip to floor
      vel = this.floor(col.pos, vel)
      ///clip to walls
      vel = this.walls(col.pos, vel)
      ///update position
      col.pos.add(vel)
      ///
      ///gravity
      col.acc.add(col.grav)
      ///friction
      this.isOnGround()
      ? this.addAirDrag(col)
      : this.addGroundDrag(col)
      ///update speeds and reset all accelerations
      vel.add(col.acc)
      col.vel = vel;
      col.acc = new Vector(0,0);

      return col.pos
    }
  }

  game.phy = new Physics();

})()
