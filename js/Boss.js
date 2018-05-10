(function(){
    'use strict';

    const phy = game.phy;
    const GameObject = game.constructors.GameObject;
  
    

    class Boss extends GameObject{

        constructor({id, x, y, w, h, states, screens, constructor, index}){
            super({id, x, y, w, h, states, screens, constructor, index})
            ///jump cooldown, lol like flies can have infinit jump for fly
            this.jc = 0;
            this.jp = false;

            this.vals = {
                walkSpeed: 2,
                runSpeed: 10,
                jumpHeight: 250,
                dashDist: 100,
                //Distance from boss to player when on passive mode
                defensiveDistance: game.weight/3,
                //Same for offensive mode
                offensiveDistance: game.weight/6
            }
            this.move = phy.addToPhysicalWorld({
                gameObj: this,
                w:w, h:h, weight: 35
            });
            this.playerInstance =  game.player;
            console.log(game.player);
       }
        update() {
            super.update();

            bossState(DEFENSIVE);
            //update positions
            {
            let {x, y} = this.move(this.id)
            this.x = x;
            this.y = y;
            }
        }
        moveLeft() {
            phy.moveLeft(this.id, this.vals.walkSpeed);
        }
        moveRight(){
            phy.moveRight(this.id, this.vals.walkSpeed);
        }
        jump(){
            phy.Jump(this.id, this.vals.jumpHeight)
        }
        //Used to keep distance if necessary
        keepDistance(){
            
            let {x,y} = phy.distanceTo(this.id, this.playerInstance.id); 
            //If player is on the left
            if(x < 0){
                //We check if the distance is smaller than the allowed distance between player and boss
                if(x < this.defensiveDistance){
                    moveRight();
                }
            }else{
                if(x < this.defensiveDistance){
                    moveLeft();
                }
            }
        }
        
        towardsPlayer(){
            if(Player.x < this.x){
                if(!((this.x-Player.x) < this.offensiveDistance)){
                    moveLeft();
                }
            }else{
                if(!((this.x-Player.x) < this.offensiveDistance)){
                    moveRight();
                }
            }
        }

        
        changeMoveSpeed(howFast){
            switch(howFast){
                case BERSERKER:
                    this.walkSpeed = 6;
                    break;
                case FASTER:
                    this.walkSpeed = 4;
                    break;
                default:
                    this.walkSpeed = 2;
            }

        }


        attack(){
        }

        bossState(state){
            switch(state){
                case DEFENSIVE:
                    keepDistance();
                    break;
                case OFFENSIVE:
                    towardsPlayer();
                    break;
                case ENRAGED_1:
                    //do first enrange stuff
                    break;
                case ENRAGED_2:
                    //do second enrange stuff
                   break;
                case ATTACK:
                    attack();
                    break;
            }
        }
    }
    game.constructors.Boss = Boss;

})();