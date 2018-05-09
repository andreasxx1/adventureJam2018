(function(){
  'use strict';

  const GameObject = game.constructors.GameObject;
  let abs = common.abs
  const round = common.round

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
    static dist(vec1, vec2){
      return vec2.copy().sub(vec1)
    }
		mag(){
			return Math.sqrt(this.x * this.x + this.y * this.y)
		}
		mul(scalar){
      if(scalar !== NaN) this.x *= scalar, this.y *= scalar;
      return this
		}
    div(scalar){
      if(scalar !== NaN) this.x /= scalar,  this.y /= scalar;
      return this
    }
	}

  class Collider{
    constructor({id, x, y, w, h, weight}){
      this.id = id
      this.weight = weight,
      this.floorId = '',
      this.pos = new Vector(x, y);
      this.vel = new Vector(0,0);
      this.acc = new Vector(0,0);
      this.dim = new Vector(w || 50, h || 50);
    }
  }

  class Physics{
    constructor(){
      this.Vector = Vector
      this.Collider = Collider
      //
      this.world = {
        floor: ['main-floor'],
        walls: ['left-wall', 'right-floor'],
        obstacles: [],
        airDrag: 0.95,
        groundDrag: 0.95,
        grav: 10
      }
      this.physicalWorld = [
        new Collider({
          id: 'main-floor',
          x: -5000,
          y: game.height,
          w: 10000,
          h: 10000,
          weight: -1
        }),
        new Collider({
          id: 'left-wall',
          x: -10000,
          y: game.height - 5000,
          w: 10000,
          h: 10000,
          weight: -1
        }),
        new Collider({
          id: 'right-wall',
          x: game.width,
          y: game.height - 5000,
          w: 10000,
          h: 10000,
          weight: -1
        }),
        new Collider({
          id: 'platform',
          x: 0,
          y: game.height -100,
          w: 100,
          h: 100,
          weight: -1
        })
      ]
    }
    addToPhysicalWorld({gameObj, x, y, w, h, weight}){
      if(gameObj instanceof GameObject){
        ///
        this.physicalWorld.push(new Collider({
          id: gameObj.id,
          x: x || 0,
          y: y || 0,
          w: w || 50,
          h: h || 50,
          weight: weight || 1
        }))
        ///
        return ( () =>{
          return this.update(gameObj.id)
        }).bind(this)

      }
      throw 'All objects that want to get added to the physical world must be a GameObject'
    }
    getCol(id){
      let col = _.find(this.physicalWorld,((o)=> o.id === id));
      if( !col ){
        throw 'trying to move a non-exsisting object';
      }
      return col;
    }
    Left(id, speed){
      let col = this.getCol(id)
      col.acc.add({x: -speed})
    }
    Right(id, speed){
      let col = this.getCol(id)
      col.acc.add({x: speed})
    }
    Jump(id, height){
      let col = this.getCol(id)
      col.acc.add({y: -height })
    }
    collideWithObjects(col){
      ///collide with all other object in the physical world
    }
    collideWithImmovableObjects(col){
      let touch = ''
      _.forEach(this.physicalWorld, obj => {
        if(obj.id !== col.id && obj.weight === -1){
          touch += Physics.collision('imm', col, obj)
        }
      })
      col.floorId = touch
    }

    update(id){
      ///quickfix local static delta of 1000/60
      let delta = 1000/60;

      ///fix any collisions and change velocity if nessessary

      let col = this.getCol(id)
      col.vel.div(delta)
      ///collisions with other gameObjects
      this.collideWithObjects(col)
      ///collide with non movable objects
      this.collideWithImmovableObjects(col)
      ///update position
      col.pos.add(col.vel)
      col.vel.mul(delta)


      ///add all global forces

      ///gravity
      col.acc.add({y: this.world.grav})
      ///update speeds and reset all accelerations
      col.vel.add(col.acc)
      col.acc = new Vector(0,0);
      /// add drag and friction
      col.vel.x *= this.world.airDrag
      if(this.isOnFloor(col)){
        col.vel.x *= this.world.groundDrag
      }
      return col.pos.copy()
    }

    static collision(mode, col1, col2){
      let p1 = col1.pos.copy(),
          p2 = col2.pos.copy(),
          v1 = col1.vel.copy(),
          v2 = col2.vel.copy(),
          c1 = {x: p1.x+v1.x, y: p1.y+v1.y,
                w: col1.dim.x, h: col1.dim.y},
          c2 = {x: p2.x+v2.x, y: p2.y+v2.y,
                w: col2.dim.x, h: col2.dim.y},
          x1 = ((c1.x + c1.w) < c2.x),
          x2 = (c1.x > (c2.x + c2.w)),
          y1 = ((c1.y + c1.h) < c2.y),
          y2 = (c1.y > (c2.y + c2.h)),
          coll = !(x1 || x2) && !(y1 || y2),
          touch = ''

      if(coll && mode == 'imm'){
        let cen1 = new Vector( c1.x+c1.w/2, c1.y+c1.h/2)
        let cen2 = new Vector( c2.x+c2.w/2, c2.y+c2.h/2)
        let to1 = Vector.dist(cen2, cen1)


        if(abs(to1.x) > abs(to1.y)){
          if(to1.x > 0){///colliding with right wall
            if(p1.x > (p2.x + c2.w)) v1.x = p1.x - (p2.x + c2.w)
            if(round(p1.x,3) === round((p2.x + c2.w),3)) v1.x = 0
            if(p1.x < (p2.x + c2.w)){
              v1.x = ((p2.x+c2.w) - p1.x)
              console.log('if you see this message then you have found the glitch')
            }
          }else{///colliding with left wall
            if((p1.x + c1.w) < p2.x) v1.x = p2.x - (p1.x + c1.w)
            if(round(p1.x + c1.w,3) === round(p2.x,3)) v1.x = 0
            if((p1.x + c1.w) > p2.x) v1.x = ((p1.x+c1.w) - p2.x)
          }
        }else{
          if(to1.y > 0){
            ///no cieling collision yet
          }else{
            if((p1.y + c1.h) < p2.y) v1.y = p2.y - (p1.y + c1.h)
            if(round((p1.y + c1.h),3) === round(p2.y,3)) v1.y = 0
            if((p1.y + c1.h) > p2.y) v1.y = (p1.y + c1.h) - p2.y
            touch = col2.id
          }
        }
        col1.vel = v1
      }

      return touch
    }

    isOnFloor(col){
      if(typeof col === 'object') return col.floorId.length !== 0
      if(typeof col === 'string') return this.getCol(col).floorId !== ""
    }

    checkCurrentWorldCollisions(){

    }
  }

  game.phy = new Physics();

})()
