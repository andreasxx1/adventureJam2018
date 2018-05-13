<<<<<<< HEAD
(function(){
    'use strict';

    const phy = game.phy;
    const GameObject = game.constructors.GameObject;
    const abs = common.abs;

    class Boss extends GameObject{

        constructor({id, x, y, w, h, states, screens, constructor, index}){
            super({id, x, y, w, h, states, screens, constructor, index})
            ///jump cooldown, lol like flies can have infinit jump for fly
            this.jc = 0;
            this.jp = false;

            
            this.vals = {
                walkSpeed: 2,
                runSpeed: 10,
                jumpHeight: 350,
                dashDist: 100,
                //Distance from boss to player when on passive mode
                defensiveDistance: game.width/3,
                //Same for offensive mode
                offensiveDistance: game.width/6
            }
            this.move = phy.addToPhysicalWorld({
                gameObj: this,
                w:w, h:h, weight: 35, x:x, y:y
            });
            this.playerInstance =  game.player;
            console.log(game.player);
       }
        update() {
            super.update();

            
            this.bossState('OFFENSIVE');
            
            
            //update positions
            {
            let {x, y} = this.move(this.id)
            this.x = x;
            this.y = y;
            }
        }
        moveLeft() {
            phy.Left(this.id, this.vals.walkSpeed);
        }
        moveRight(){
            
            phy.Right(this.id, this.vals.walkSpeed);
        }
        jump(){
            phy.Jump(this.id, this.vals.jumpHeight);
        }
        //Used to keep distance if necessary
        keepDistance(){
            
            let {x,y} = phy.distanceTo(this.id, this.playerInstance.id); 
            
            //If player is on the left
            if(x < 0){
            
                //We check if the distance is smaller than the allowed distance between player and boss
                if(abs(x) < this.vals.defensiveDistance){
                    this.moveRight();
                }
            }else{
                
                console.log(abs(x), this.vals.defensiveDistance);
                if(abs(x) < this.defensiveDistance){
                    this.moveLeft();
                }
            }
        }

        towardsPlayer(){
            let {x,y} = phy.distanceTo(this.id, this.playerInstance.id); 
            
            if(x < 0){
                if(!(abs(x) < this.offensiveDistance)){
                    this.moveLeft();
                }
            }else{
                if(!(abs(x) < this.offensiveDistance)){
                    this.moveRight();
                }
            }
        }

        
        changeMoveSpeed(howFast){
            switch(howFast){
                case 'BERSERKER':
                    this.walkSpeed = 6;
                    break;
                case 'FASTER':
                    this.walkSpeed = 4;
                    break;
                case 'STOPPED':
                    this.walkSpeed = 0;
                    break;
                default:
                    this.walkSpeed = 2;
            }

        }


        attack(){
        }

        bossState(state){
            switch(state){
                case 'DEFENSIVE':
                    this.keepDistance();
                    break;
                case 'OFFENSIVE':
                    this.towardsPlayer();
                    break;
                case 'ENRAGED_1':
                    //do first enrange stuff
                    break;
                case 'ENRAGED_2':
                    //do second enrange stuff
                   break;
                case 'ATTACK':
                    attack();
                    break;
            }
        }
    }
    game.constructors.Boss = Boss;

})();