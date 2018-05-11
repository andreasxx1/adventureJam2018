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
     this.div(this.mag());
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
      this.blockLeft = false
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
      console.log(col.acc.x);
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
    distanceTo(id1,id2){
      let col1 = this.getCol(id1);
      let col2 = this.getCol(id2);

      let cen1 = new Vector(col1.pos.x + col1.dim.x/2, col1.pos.y + col1.dim.y/2);
      let cen2 = new Vector(col2.pos.x + col2.dim.x/2, col2.pos.y + col2.dim.y/2);

      return cen2.sub(cen1);
    }

    update(id){
      ///quickfix local static delta of 1000/60
      let delta = 1000/60;
      const col = this.getCol(id)

      ///MAKE A STEP INTO THE FUTURE(DELTA) BY CHANGING
      ///THE POSITION BASED ON THE VELOCITY
      col.pos.add(col.vel.copy().div(delta))

      ///for the sake of fixing floating point numbers
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

      ///airDrag
      col.acc.mul(this.world.airDrag)
      /*place for adding wind*/

      ///groundDrag
      if(this.isOnFloor(col)){
        col.acc.mul(this.world.groundDrag)
      }

      ///NOW THAT ALL THE FORCES HAVE BEEN ADDED
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
          coll = !(x1 || x2) && !(y1 || y2),
          touch = coll ? collider2.id : ''

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
          throw 'unhandled collision uccured'
        }

        newPos = p1.add(backdir)
        newPos.add(rest)

        collider1.pos = newPos
        collider1.vel = newVel
      }
      return touch
    }

    isOnFloor(col){
      if(typeof col === 'object') return col.floorId.length !== 0
      if(typeof col === 'string') return this.getCol(col).floorId !== ""
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
