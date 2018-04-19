//needs vector2D.js 



 var Enemy = function(x,y,type){
	this.x = x;
	this.y = y; 
	this.radius;
	this.enemyType = type; 
	this.health;
	//this.ID;
	this.eAttackCoordX;
	this.eAttackCoordY;
	this.attackCooldown = 0;
	this.attackCounter = 0;

	
	if(this.enemyType == "rusher"){
	
		this.aggroRadius = 200; // will detect and subsequently chase the player if within this radius
		this.attackDist = 25; 
		this.attackRadius = 25;
		this.attackRange = 40;
		this.radius = 10;	
		this.maxSpeed = 5;
		this.speed = 5;	
		this.health = 1; // the enemy's current health, this is a variable.
		this.maxHealth = 1; // value of this enemy's original total health, this is a constant (used for health bars)		
		this.score = 5; // number added to score when the enemy is killed
		this.damage = .8; // how much damage the enemy deals during their attack.
        this.knockBackDist = -3; // how far this enemy is knocked back by the player's attack.
		// this.animation is an object containing animation frame counters for various animations and ticks per frame (speed of animation). 
		this.animation = {tickCount: 0, frameIndexWalk:0, frameIndexAttack:0, frameIndexDie:0, ticksPerFrameWalk:5, ticksPerFrameAttack:8, ticksPerFrameDie:10, lastFrame:"up"};
		this.spriteSize = 64;
		this.spriteYOffset = 5;
	}

	if( this.enemyType == "ranger"){
		this.spriteSize = 114;
		this.spriteYOffset = 14;
		this.maxSpeed = 2;
		this.fleeRange = 150;
		this.shootCooldown = 0;
		this.health = 3;
		this.maxHealth = 3;  
		this.knockBackDist = -5;
		this.radius = 20;
		this.score = 2;
		this.damage = .55;
		this.animation = {tickCount: 0, frameIndexWalk:0, frameIndexAttack:0, frameIndexDie:0, ticksPerFrameWalk:5, ticksPerFrameAttack:8, ticksPerFrameDie:10, lastFrame:"up"};
		this.spriteSize = 64;
		this.spriteYOffset = 5;
	}

	if( this.enemyType == "spawner"){
		this.spriteSize = 114;
		this.spriteYOffset = 14;
		this.maxSpeed = 1;
		this.radius = 20;
		this.health = 1;
		this.maxHealth = 1;
		this.knockBackDist = -10;
		this.score = 3;
		this.damage = .5;     
        this.knockBackDist = -3;
		this.animation = {tickCount: 0, frameIndexWalk:0, frameIndexAttack:0, frameIndexDie:0, ticksPerFrameWalk:10, ticksPerFrameAttack:5, ticksPerFrameDie:10, lastFrame:"up"};
		this.spriteSize = 64;
		this.spriteYOffset = 5;
		this.numberOfSpawned = 1;
	}

	if( this.enemyType == "tank"){
		this.spriteSize = 110;
		this.spriteSizeAttack = 330;
		this.spriteYOffset = 12;
		this.maxSpeed = .5;
		this.refMaxSpeed = .5;
		this.health = 70;
		this.maxHealth = 70;
		this.attackRange = 90;
		this.attackDist = 40;
		this.attackRadius = 40;
		this.countDown = 3;
        this.knockBackDist = -1;
		this.radius = 28;
		this.score = 10;
		this.damage = 2;
		this.animation = {tickCount: 0, frameIndexWalk:0, frameIndexAttack:0, frameIndexDie:0, ticksPerFrameWalk:10, ticksPerFrameAttack:8, ticksPerFrameDie:10, lastFrame:"up"};
	}

	if(this.enemyType == "bullet"){
		this.radius = 8;
		this.maxSpeed = 3;
		this.health = 100;
		this.damage = 1;
	}

	if(this.enemyType == "flocker"){
		this.attackRange = 35;
		this.attackDist = 20;
		this.attackRadius = 20;
		this.radius = 10;
		this.maxSpeed = 2;
		this.health = 1;
		this.maxHealth = 1;
		this.score = 1;
		this.damage = .1;
        this.knockBackDist = -6;
		this.animation = {tickCount: 0, frameIndexWalk:0, frameIndexAttack:0, frameIndexDie:0, ticksPerFrameWalk:4, ticksPerFrameAttack:8, ticksPerFrameDie:10, lastFrame:"up"};
		this.spriteSize = 44;
		this.spriteYOffset = 4;
	}

	if(this.enemyType == "trash"){	
		this.attackRange = 50;
		this.attackDist = 25;
		this.attackRadius = 18;
		this.radius = 20;
		this.maxSpeed = 5;
		this.health = 5;
		this.maxHealth = 5;
		this.score = 2;
		this.damage = 2;
        this.knockBackDist = -5;
		this.animation = {tickCount: 0, frameIndexWalk:0, frameIndexAttack:0, frameIndexDie:0, ticksPerFrameWalk:10, ticksPerFrameAttack:5, ticksPerFrameDie:10, lastFrame:"up"};
		this.spriteSize = 64;
		this.spriteYOffset = 5;
	}
	
	
	
	this.enemyState = "alive";
	this.enemyCombatState = "chasing";
	
	this.location = new Vector2D(this.x,this.y);
	this.velocity = new Vector2D(0,0);
	this.acceleration = new Vector2D(0,0);
	this.friction = .5;
	
		
	this.desiredVelocity = new Vector2D(0,0);
	this.steer = new Vector2D(0,0);
	
	//constants for the wander function 
	this.circleDistance = .0005;
	this.circleRadius = .05;
	this.angleChange = 5;
	this.wanderAngle = 0;
	
	//internal cooldown for the shoot function 
	this.cd = 0;
	
	this.r = 0;
	
	this.bullet;
	
	this.vector = this.location.subtract(this.velocity);
	


}

Enemy.prototype = {

	draw: function(ctx){
				ctx.beginPath();
				ctx.arc(this.location.x,this.location.y,this.radius,0,Math.PI*2,false);
				ctx.closePath();
				ctx.fillStyle = "black";
				ctx.fill();
				ctx.closePath();	
	},
	drawAttack: function(ctx){
		
		ctx.beginPath();
		//ctx.strokeStyle = "black";
		ctx.fillStyle = "rgba(255, 0, 0, 0.4)";
		ctx.arc(this.eAttackCoordX, this.eAttackCoordY, this.attackRadius, 0, Math.PI*2, false);
		//ctx.moveTo(e.location.x,e.location.y);
		//ctx.lineTo(e.eAttackCoordX,e.eAttackCoordY);
		ctx.fill();
		ctx.closePath();
	},
	move: function(){
		this.velocity.incrementBy(this.acceleration);
		if( this.velocity >= this.maxSpeed){
			this.velocity == this.maxSpeed;
		}
		this.location.incrementBy(this.velocity);
		this.acceleration.scaleBy(0);
		
		if(this.velocity >= this.maxSpeed){
			this.velocity == this.maxSpeed;
		}
	
		
		
		
	},
	 
	
	knockBack: function(targetVector){
		//targetVector.scaleBy(-1);
		this.desiredVelocity = targetVector.subtract(this.location);
		this.desiredVelocity.normalize();
		this.maxSpeed *= this.friction;
		if(Math.round(this.maxSpeed) >= 0){
			if(this.health <= 0){
				this.enemyCombatState = "fallen";
				this.tickCount = 0;
			}else{
				this.enemyCombatState = "chasing";
			}
		}		
		this.desiredVelocity.scaleBy(this.maxSpeed);
		this.steer = this.desiredVelocity.subtract(this.velocity);
		if( this.steer >= this.maxSpeed){
				this.steer == this.maxSpeed;
		
		}
		
		if(this.enemyState == "dead"){
					this.maxSpeed = 0;
		}
		this.acceleration.incrementBy(this.steer);
		
		
	},
	
	//param must be a vector
	seek: function(targetVector){
		if(this.enemyType == "rusher")this.maxSpeed = this.speed;
		this.desiredVelocity = targetVector.subtract(this.location);
		this.desiredVelocity.normalize();
		this.desiredVelocity.scaleBy(this.maxSpeed);
		this.steer = this.desiredVelocity.subtract(this.velocity);
		if( this.steer >= this.maxSpeed){
				this.steer == this.maxSpeed;
		
		}
		
		if(this.enemyState == "dead"){
					this.maxSpeed = 0;	
				}
		
		this.acceleration.incrementBy(this.steer);
			
	},

	//function to shoot
	//the hackyest, most messed up function i think i have ever wrote. 
	shoot: function(x,y,targetVector,array,angle){
		
		//if(this.cd <= 0){
				
				//ctx.beginPath();
				//ctx.arc(this.location.x,this.location.y,5,0,Math.PI*2,false);
				//ctx.closePath();
				//ctx.fillStyle = "black";
				//ctx.fill();
				//ctx.closePath();
				//console.log(this.animation.frameIndexAttack);
				//if(this.animation.frameIndexAttack >= 12){
					var bullet = new Enemy(this.location.x,this.location.y,"bullet");
					
					bullet.targetVec = targetVector;
					//console.log(bullet.targetVec);
					bullet.targetVec.normalize();
					bullet.targetVec.scaleBy(1000);
					bullet.targetVec.x += this.location.x;
					bullet.targetVec.y += this.location.y;
					//console.log(bullet.targetVec);
					bullet.arrowAngle = angle;
					//bullet.seek(targetVector);
					//bullet.move();
					array.push(bullet);
					
				//}
		//}
		//this.cd++;
		//if(this.cd >= shootCounter){
		//	this.cd = 0;
		//	this.enemyCombatState = "attacking";
		//}
		
	},
	//function for the tank's aoe attack
	//bad solution, rework it
	//the idea is good but some adjustments need to be made
	aoeAttack:function(targetVector,ctx,array){
		this.countDown -= .05;
		
		if(this.aoeCd <= 0 && this.countDown <= 0){
	
				ctx.beginPath();
				ctx.arc(this.location.x,this.location.y,this.r,0,Math.PI*2,false);
				ctx.closePath();
				ctx.stroke();
				this.r++;
				
				if(this.r >= 80){
				this.countDown = 5;
				this.r = 0;
				}
				
				
		}
		
		//console.log(this.r);
	},
	  growingStrength: function(){
		var strengthBuff = 16 - this.health;
		var speedBuff = 16 - this.health;
		this.damage += (strengthBuff /= 2);
		this.maxSpeed += (speedBuff /= 4);
		this.refMaxSpeed += (speedBuff /= 4);
		//console.log(this.maxSpeed);
		
		},
    
    //increases enemy health and damage as time goes on
//enemies are limited to 12(may need to be adjusted) spawned per wave. so difficulty is increased by more enemy damage and health over time
		//this function is only called when the difficulty variable reaches 15 and enemy damage and health is doubled every 15 difficulty
		increaseDifficulty:function(difficulty){
			var difficultyIncrease = difficulty /= 15;
			console.log(this.health);
			this.health = Math.floor(difficulty *= this.health);
			this.damage = Math.floor(difficulty *= this.damage);
			
			
		},
		
	wander: function(){
		if(this.enemyType == "rusher")this.maxSpeed = this.speed;
		//calculates the wander circle
		var circleCenter = this.velocity.clone();
		circleCenter.normalize();
		circleCenter.scaleBy(this.circleDistance);
		
		
		//the displacement force
		var dis = new Vector2D(0,-1);
		dis.scaleBy(this.circleRadius);
		
		//randomly changes the vector direction
		this.setAngle(dis,this.wanderAngle);
		
		this.wanderAngle += (Math.random() * this.angleChange) - (this.angleChange * .5);
		
		var wanderForce = circleCenter.add(dis);
		
		if(wanderForce >= this.maxSpeed){
			wanderForce == this.maxSpeed;
		}
		
		this.acceleration.incrementBy(wanderForce);
		
		
	},
	
	separate: function(array){
		var desiredSeparation = this.radius * 4;

		var sum = new Vector2D(0,0);
		var count = 0;
		//looping backwards? WHY????
		for(var i = array.length - 1; i >= 0; i--){
			var d = Vector2D.distance(this.location,array[i].location);
			//console.log(d)
			if(d >= 1 && d <= desiredSeparation){
				var diff = new Vector2D(0,0);
				diff = this.location.subtract(array[i].location);
				diff.normalize();
				diff.divideBy(d);
				//console.log(d);
				sum = sum.add(diff);
				
				count ++;
				
			}
		}
		if(count >= 1){
			sum.divideBy(count); 
			sum.normalize();
			sum.scaleBy(this.maxSpeed);
			
			
			var separation = new Vector2D(0,0);
			separation = sum.subtract(this.velocity)
			
			var maxForce = .5;
			if(separation.x >= maxForce || separation.y >= maxForce){
			
			separation.x = maxForce;
			separation.y = maxForce;
			}
			this.acceleration.incrementBy(separation);
		
		}
		
		
	},
	
	cohesion: function(array){
		var neighborDistance = 200;
		var sum = new Vector2D(0,0);
		var count = 0;
		
		for(var i = array.length - 1; i >= 0; i--){
			var d = Vector2D.distance(this.location,array[i].location);
			
			if(d >= 1 && d <= neighborDistance){
				sum = sum.add(array[i].location);
				count ++;	
			}
		}
		if( count >= 1){
			sum.divideBy(count);
			
			
			return this.seekOtherEnemies(sum);
			
			
		}
		else{
			var vect = new Vector2D(0,0);
			return vect;
			
			
		}
		
		
	},
	
	
	flee: function(targetVector){
		 this.desiredVelocity = this.location.subtract(targetVector);
		this.desiredVelocity.normalize();
		this.desiredVelocity.scaleBy(this.maxSpeed);
		this.steer = this.desiredVelocity.subtract(this.velocity);
		if( this.steer >= this.maxSpeed){
				this.steer == this.maxSpeed;
		
		}
		
		if(this.enemyState == 1){
					this.maxSpeed = 0;
					
				
				}
		this.acceleration.incrementBy(this.steer);
	
	},
	
	//function to check the boundaries of a specified area
	//array param is the array item you want to check. ex. enemies[i]
	//vector param is the vector you want to flee from
		checkBounds: function(array,x,y,w,h){
		//if(array.location.x >= x && array.location.x <= x + w && array.location.y >= y && array.location.y <= y + h){
			//array.flee(vector);
			var a = array.location;
			var r = x+w+array.radius-3;
			var b = y+h+array.radius-3;
			var l = x-array.radius+3;
			var t = y-array.radius+3;
			
			if(a.x >= l && a.x <= r && a.y >= t && a.y <= b){
				if(a.x >= l && a.x <= l+4) a.x = l-1;
				else if(a.x <= r && a.x >= r-4) a.x = r+1;
				else if(a.y >= t && a.y <= t+4) a.y = t-1;
				else if(a.y <= b && a.y >= b-4) a.y = b+1;
		
		
			}							
		//}
			
	},
	
		setAngle: function(vector,value){
			var len = vector.length();
	
			vector.x = Math.cos(value) * len;
			vector.y = Math.sin(value) * len;
			
			
		},

	



}