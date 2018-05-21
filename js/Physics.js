(function(){
  'use strict';

  const GameObject = game.constructors.GameObject;
  const abs = common.abs
  const round = common.round
  const flb = common.flb///not used
  const pr = common.pr

  class Vector{
		constructor(x,y){
			this.x = x, this.y = y
		}
    set({x,y}){
      this.x = x || 0
      this.y = y || 0
    }
    null(){
      this.x = 0;
      this.y = 0;
    }
    unit(){
     if(this.mag() !== 0) this.div(this.mag());
     return this
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
    static flb(arr){
      return _.map(arr, v=>{
        return new Vector(round(v.x, 3),round(v.y, 3))
      })
    }
    flb(){
      this.set({x: round(this.x, 3), y: round(this.y, 3)})
    }
		mag(){
			return Math.sqrt(this.x * this.x + this.y * this.y)
		}
    magsq(){
      return this.x * this.x + this.y * this.y
    }
		mul(scalar){
      if(scalar !== NaN) this.x *= scalar, this.y *= scalar;
      return this
		}
    mulVec(vec){
      if(vec.constructor.name === 'Vector'){
        this.x *= vec.x;
        this.y *= vec.y;
      }
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
      this.blockLeft = false
      //
      this.world = {
        floors: ['main-floor', 'platform'],
        walls: ['left-wall', 'right-floor'],
        obstacles: [],
        drag: new Vector(0.10, 0.03),
        groundFriction: 0.04,
        grav: 10
      }
      this.physicalWorld = [
        // new Collider({
        //   id: 'main-floor',
        //   x: -5000,
        //   y: game.height,
        //   w: 10000,
        //   h: 10000,
        //   weight: -1
        // }),
        // new Collider({
        //   id: 'left-wall',
        //   x: -10000,
        //   y: game.height - 5000,
        //   w: 10000,
        //   h: 10000,
        //   weight: -1
        // }),
        // new Collider({
        //   id: 'platform-2',
        //   x: 700,
        //   y: 0,
        //   w: 100,
        //   h: game.height,
        //   weight: -1
        // }),
        // new Collider({
        //   id: 'platform',
        //   x: 0,
        //   y: game.height -100,
        //   w: 100,
        //   h: 100,
        //   weight: -1
        // })
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
      if(col.acc.x === 0 || !this.blockLeft){
        col.acc.add({x: -speed})
      }
    }
    Right(id, speed){
      let col = this.getCol(id)
      col.acc.add({x: speed})
    }
    Jump(id, height){
      let col = this.getCol(id)
      col.acc.add({y: -height })
    }
    Dash(id, dist){
      let col = this.getCol(id)
      col.acc.add({x: dist})
    }
    collideWithObjects(col){
      ///collide with all other object in the physical world
    }
    collideWithImmovableObjects(col){
      _.forEach(this.physicalWorld, obj => {
        if(obj.id !== col.id && obj.weight === -1){
          Physics.collision('imm', col, obj)
        }
      })
    }

    getPhysicalWorld() {
      return this.physicalWorld;
    }

    update(id){
      ///quickfix local static delta of 1/60
      let delta = 1000/60;
      const col = this.getCol(id)

      ///MAKE A STEP INTO THE FUTURE(DELTA) BY CHANGING
      ///THE POSITION BASED ON THE VELOCITY
      col.pos.add(col.vel.copy().div(delta * col.weight))
      //pr(col.pos)
      ///for the sake of fixing floating point numbersw
      //we round everything in the collider to the 3rd percision
      //this.refineCollider(col)

      ///check for any new collisions with immovable gameObjects
      this.collideWithImmovableObjects(col)

      ///collisions with other gameObjects
      this.collideWithObjects(col)

      ///AT THIS POINT col.acc HAS ANY FORCES ADDED SINCE
      ///THE LAST UPDATE CALL

      ///NOW WE ADD ANY WORLD RELATED FORCES

      ///gravity
      col.acc.add({y: this.world.grav})

      col.acc.add(this.getDrag(col))

      //NOW THAT ALL THE FORCES HAVE BEEN ADDED
      ///WE UPDATE THE VELOCITY WHICH WILL BE USED
      ///IN THE NEXT UPDATE CALL
      col.vel.add(col.acc)

      ///WE CAN RESET THE ACCELERATION BECAUSE THAT
      ///IS A PROPERTY OF ACCELERATION BY DEFINITION
      col.acc.null();

      ///WE ARE DONE AND CAN RETURN THE OBJECTS POSITION
      ///TO USE IN THE DRAW FUNCTION
      return col.pos.copy()
    }

    static collision(mode, collider1, collider2){
      let p1 = collider1.pos.copy(),
          p2 = collider2.pos.copy(),
          v1 = collider1.vel.copy(),
          v2 = collider2.vel.copy(),
          d1 = collider1.dim.copy(),
          d2 = collider2.dim.copy(),

          le1 = p1.x,
          ri1 = p1.x + d1.x,
          up1 = p1.y,
          dw1 = p1.y + d1.y,
          ce1x = p1.x + d1.x / 2,
          ce1y = p1.y + d1.y / 2,

          le2 = p2.x,
          ri2 = p2.x + d2.x,
          up2 = p2.y,
          dw2 = p2.y + d2.y,
          ce2x = p2.x + d2.x / 2,
          ce2y = p2.y + d2.y / 2,

          x1 = (ri2 <= le1),
          x2 = (ri1 <= le2),
          y1 = (dw1 <= up2),
          y2 = (dw2 <= up1),
          coll = !(x1 || x2) && !(y1 || y2)



      if(coll && mode == 'imm'){
        let back = v1.copy().mul(-1),
            backdir = back.unit(),

            xe2 = backdir.x >=0 ? ri2 : le2,
            ye2 = backdir.y >=0 ? dw2 : up2,
            xe1 = backdir.x >=0 ? le1 : ri1,
            ye1 = backdir.y >=0 ? up1 : dw1,
            xdist = xe1 < xe2 ? xe2-xe1 : xe1-xe2,
            ydist = ye1 < xe2 ? ye2-ye1 : ye1-ye2,
            xmul = xdist / backdir.x,
            ymul = ydist / backdir.y,

            newPos = p1.copy(),
            newVel = v1.copy(),
            rest

        if(backdir.x !== 0 && abs(xmul) < abs(ymul)){
          backdir.mul(abs(xmul))
          let magNew = backdir.mag()
          rest = v1.unit().mul(magNew)
          rest.x = 0
          newVel.x = 0
        }else if(backdir.y !== 0 && abs(ymul) <= abs(xmul)){
          backdir.mul(abs(ymul))
          let magNew = backdir.mag()
          rest = v1.unit().mul(magNew)
          rest.y = 0
          newVel.y = 0
        }else{
          console.log(collider1, collider2)
          throw 'unhandled collision'
        }

        newPos = p1.add(backdir)
        newPos.add(rest)

        collider1.pos = newPos
        collider1.vel = newVel
      }
    }
    getDrag(col){
      let f,d = col.vel.copy().mul(-1)
      ///
      f = this.world.drag.copy()
      ///
      if(this.isOnFloor(col)){
        f.x += this.world.groundFriction
      }
      ///
      return d.mulVec(f)
    }

    isOnFloor(col){
      if(typeof col === 'string') col = this.getCol(col)
      let isonfloor = false;
      _.each(this.physicalWorld, (f) => {
        if(_.includes(this.world.floors, f.id)){
          let isY = col.pos.y + col.dim.y === f.pos.y
          let isX1 = (col.pos.x+col.dim.x < f.pos.x),
              isX2 = (col.pos.x > f.pos.x+f.dim.x)
          isonfloor = (isY && !isX1 && !isX2) || isonfloor
        }
      })
      return isonfloor
    }
    refineCollider(col){
        col.pos.flb()
        col.vel.flb()
        col.acc.flb()
    }

    checkCurrentWorldCollisions(){

    }
  }

  game.phy = new Physics();

})()
