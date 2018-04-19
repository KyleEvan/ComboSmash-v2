(function(){
	"use strict";

	/*__________________________Sources__________________________*/
	//http://gaurav.munjal.us/Universal-LPC-Spritesheet-Character-Generator/#

	/*__________________________Global Constants & Vars__________________________*/
	// upper case vars are constants meaning they do not change value

		/*___________Canvas Vars___________*/
		var canvas, ctx;
		var CANVAS_WIDTH = 1024, CANVAS_HEIGHT = 768;
		var BACKGROUND_COLOR = "black";

		/*___________Game Vars___________*/
		var GAME_STATE_START = 1;
		var GAME_STATE_PLAY = 2;
		var GAME_STATE_END = 3;
		var GAME_STATE_HIGH_SCORES = 4;
		var GAME_STATE_STORE = 5;
		var gameState = GAME_STATE_START;
		var paused = false;
		var tutorialOver = 0;

		var pickUpSoundEffect;


		/*______________Combo & Score Vars______________*/
		var scorePerKill = 10; // 10 points per single kill
		var scoreCounter = 0;
		var totalScore = 0; // score for the round
		var newScores;
		var hs = [0,0,0,0,0,0,0,0,0,0]; // if no high scores already store, set them all to 0
		var deathCounter = 0;
		var comboTimer = 40;
		var comboCounter = 0;
			//var comboMeter = 1;
			//var comboMeterMax = 5;
			//var comboVal = .25;
			//var healthCounter = 0;
			//var staminaCounter = 0;
			//var scoreCounter = 0;
			//var damageCounter = 0;

		/*_______________DEBUG Vars_______________*/
		var displayHitCircles = false; // show hitcircles or not


		/*______________________PLAYER Vars______________________*/

		var ATTACK_DIST = 20; // distance of hit-circle from player
		var ATTACK_RADIUS = 25; // radius of the attack (size of the attack)
		var ATTACK_SPEED = 2; // weapon speed
		var ATTACK_DAMAGE = 2; // weapon damage
		var staminaCost = 1;
		var stamRegen = .4;
		var attackKnockBack = -5; //extra distance the weapon will knock back an
		var PLAYER_SPEED = 150;
		var PLAYER_HEALTH = 100;
		var PLAYER_SIZE = 10;
		var PLAYER_COLOR = "black";
		var PLAYER_STAMINA = 100;
		var PLAYER_STATE_NORMAL = 1;
		var PLAYER_STATE_ATTACK = 2;
		var PLAYER_STATE_DEAD = 3;
		var playerHasSpecial = false;
		var p = {}; // player object
		var attackCoordX,attackCoordY;
		var playerMaxHealth = 100;
			// Player Animation Vars
			var character;
			character = new Image();
			character.src = 'media/character.png';
			var tickCount = 0;
			var frameIndex = 0;
			var frameIndex2 = 0;
			var frameIndex3 = 0;
			var ticksPerFrame = 3; // walking speed
			var ticksPerFrame2 = ATTACK_SPEED; // attack speed
			var ticksPerFrame3 = 10; // death animation speed
			var numberOfFrames = 9; // for walk animation
			var numberOfFrames2 = 6; // for attack animation
			var lastFrame = "up"; // for when the player is idle



		/*___________Enemy Vars___________*/
		// enemy spawning vars
		var WAVE_TIMER = 10; // enemies spawn every 10 seconds
		var waveTimer = WAVE_TIMER; // waveTimer changes value throughout game play (counts down from WAVE_TIMER until 0 sec, then resets)
		var waveCounter = 0; // keeps track of # of enemy waves
		var MAX_ENEMIES_SPAWNED = 8; // max number of enemies that can be spawned in a wave
		/* end spawning vars __________________________________________________*/

		var enemies = [];
		//var aoeCD;
		//var numberOfSpawned = 2; // # of flockers initially spawned by spawners
		var spawnInterval = 500; // how often spawners create flocks
		var aoeAttack = 5;
		var spawnPoints = [{x:60,y:80}, {x:700,y:110}, {x:50, y:400}, {x:540,y:430}];
		var seek = false;

		var rangerAttackSpeed = 160;
		var tankAttackSpeed = 140;
		var flockerAttackSpeed = 150;
		var trashAttackSpeed = 250;
		var rusherAttackSpeed = 80;
		var attackDelay = 15;
			// Enemy Counters
			var wayPointCounter = 0;
			var spawningCounter = 0;

		/*_________________Enemy Animation Vars_________________*/
				var WALKCYCLE_FRAMES = 9; // number of frames for walk animations
				var DEATH_FRAMES = 5; // number of frames for death animations
				var RANGE_ATTACK_FRAMES = 13; // for enemy rangers
				var ATTACK_FRAMES = 6;
				var eNumberOfFramesCast = 7; // for spawners
				//Tank
				var tank = new Image();
				tank.src = 'media/tank.png';
				//Ranger
				var ranger = new Image();
				ranger.src = 'media/ranger.png';
				//Spawner
				var spawner = new Image();
				spawner.src = 'media/spawner.png';
				//Flocker
				var flocker = new Image();
				flocker.src = 'media/flocker.png';
				//Rusher
				var rusher = new Image();
				rusher.src = 'media/rusher.png';
				//Trash
				var trash = new Image();
				trash.src = 'media/trash.png';
				//Bullet
				var arrow = new Image();
				arrow.src = 'media/arrow.png';




		//variables for keeping track of player damage
		//pDam just tracks the player's damage and is used to revert the player damage back AFTER the damage special is used
		var pDam = 1;
		var playerDamage = pDam;

		//timer for when the next wave is spawned
		var nextWave = 10;

		/*
		//store variables
		//button class for the store
		var buttons = [];
		var Button = function(x,y,r,ID,color){
			this.x = x;
			this.y = y;
			this.r = r;
			this.ID = ID;
			this.color = color;
		};
		//the upgrade costs for items in the store
		var comboUpgradeCost = 10;
		var healthUpgredeCost = 20;
		var invincibiltyCost = 10000;
		var unlimitedStamCost = 10000;
		var healCost = 10000;
		var damageCost = 10000;
		var staminaStoreCost = 50;
		var daggerCost = 20000;
		var greatSwordCost = 20000;
		var longSwordCost = 0;
		// equipped weapon
		var dagger = "dagger equipped";
		var longSword = "longSword equipped";
		var greatSword = "greatSword equipped";
		//keeps track of equipped weapon
		var equippedWeapon = longSword;
		//special attack variables
		//equippedSpecial keeps track of the currently used special attack
		var equippedSpecial;
		//used to displace what special is equipped
		var equipText = "equipped";
		var eX;
		var eY;
		//weapon equip text
		var wequipText = "equipped";
		var wEX = 185;
		var wEY = 655;
		//the 4 special attacks currently in the game. more can be added
		var invincibilty = "invincible";
		var unlimitedStam = "stamina";
		var heal = "healBoost";
		var damageBuff = "uber damage!";
		//the duration of the special. when 0 the special is over
		var specialDuration = 10;

		//variables for the tank enemy aoe
		var aoeAttack = 5;
		*/


		// Calculations & Collisions Vars
		var dotProd;

		// HUD Vars
		var showHealthStam = false;
		//var fullSpecial = 20;
		//var specialCounter = 0;

		// MISC. Function Vars
		var lastTime = 0;
		var dt; // delta time
		var animationID;
		var alpha = 1;
		var comboFeedback = [];
		//var comboTextCounter = 0;
		//var comboTextTimer = 100;
		//var textAlpha = 1;
		//var moveTextY = 0;

		// Keyboard & Mouse Vars
		var Keys = {
			up:false,
			down:false,
			left:false,
			right:false,
			space: false
		};
		var mouse = {};

		// Background
		var background = new Image();
		background.src = "media/background2.jpg";

		// NOTIFICATIONS
		var lsClearFeedback = false;
		var notificationCounter = 0;
		var notificationTimer = 50;

		window.onload = init;


		// INITIALIZE the game *******************************************************************
		function init(){
			console.log("init called");

			//set up buttons for the store
			/*
			var button = new Button(830,100,20,"Combo","#00CC00");
				buttons.push(button);

			var button2 = new Button(490,100,20,"Health","#00CC00");
			buttons.push(button2);

			var button7 = new Button(150,100,20,"stamIncrease","#00CC00");
			buttons.push(button7);

			var button3 = new Button(150,230,20,"Stamina","#9FEE00");
			buttons.push(button3);

			var button4 = new Button(490,230,20,"Invincibilty","#9FEE00");
			buttons.push(button4);

			var button5 = new Button(150,360,20,"heal","#9FEE00");
			buttons.push(button5);

			var button6 = new Button(490,360,20,"damageBuff","#9FEE00");
			buttons.push(button6);

			var button8 = new Button(830,230,20,"dagger","red");
			buttons.push(button8);

			var button9 = new Button(830,360,20,"greatSword","red");
			buttons.push(button9);

			var button10 = new Button(490,490,20,"longSword","red");
			buttons.push(button10);

			*/

			// Sounds
			//pickUpSoundEffect = new Audio('media/pickUpSound2.wav')
			//var backgroundSoundEffect = new Audio('media/backgroundSound2.mp3');
			//backgroundSoundEffect.volume = .06;
			//backgroundSoundEffect.play();
			//backgroundSoundEffect.loop = true;

			// Canvas
			canvas = document.querySelector("canvas");
			ctx = canvas.getContext("2d");



				//calls a function that updates the time until the next wave is spawned
			window.setInterval(function(){nextWaveTimer(gameState)},1000);
			// Window Events
			window.onblur = function(){
				paused = true;
				Keys.up = false;
				Keys.down = false;
				Keys.right = false;
				Keys.left = false;
				Keys.space = false;
				cancelAnimationFrame(animationID);
				// call update() once so that our paused screen gets drawn
				update();
			};
			window.onfocus = function(){
				cancelAnimationFrame(animationID);
				paused = false;
				update();
			}
			window.onkeydown = function(e){ // For player Movement
				var k = e.keyCode;
				e.preventDefault();
				if(k === 65){ Keys.left = true;}
				else if(k === 83){ Keys.up = true; }
				else if(k === 68){ Keys.right = true;}
				else if(k === 87){ Keys.down = true;}
				else if(k === 32){ Keys.space = true;}
			};
			window.onkeyup = function(e){
				var k = e.keyCode;
				e.preventDefault();
				if(k === 65){ Keys.left = false;}
				else if(k === 83){ Keys.up = false; }
				else if(k === 68){ Keys.right = false; }
				else if(k === 87){ Keys.down = false; }
				else if(k === 32){ Keys.space = false;}
			};

			//makeTutorial();
			makePlayer();
			update();

			window.addEventListener("keydown", changeGameState, false);
			window.addEventListener("keydown", clearHighScores, false);
			window.onmousemove = updateMouse;
			canvas.addEventListener("mousedown", p.attack, false); //attack on click
			//window.onmousedown = p.attack; // attack on click
		}

		// Press enter to change the game state
		function changeGameState(e){
			if(e.keyCode == "89"){
				if(gameState == GAME_STATE_START && tutorialOver == 0) tutorialOver ++;
			}
			if(e.keyCode == "78"){
				if(gameState == GAME_STATE_START) tutorialOver = 7;
			}
			if(e.keyCode == "13"){
				if(gameState == GAME_STATE_START){
					if(tutorialOver >= 1 && tutorialOver != 5) tutorialOver++;
					if(tutorialOver >= 7) gameState = GAME_STATE_PLAY;
				}
				else if(gameState == GAME_STATE_END){
					storeScores(scoreCounter);
					gameState = GAME_STATE_HIGH_SCORES;
				}
				else if(gameState == GAME_STATE_HIGH_SCORES){
					reset();
					gameState = GAME_STATE_START;

				}

			}
		}
		 // Clear local storage
		 function clearHighScores(e){
			if(e.keyCode == "48"){
			console.log("clearing scores");
				localStorage.removeItem("scores");
				lsClearFeedback = true;
			}
		 }

		// UPDATE*********************************************************************************
		function update(){
			dt = calculateDeltaTime(); // calculate delta time
			animationID = requestAnimationFrame(update);
			// Background Refresh

			// BACKGROUND
			ctx.drawImage(background,0,0);

			// fade black background when gameplay begins
			backgroundTransition();


			// Text feedback if localStorage is cleared
			checkLS();



			// PAUSED?
				if(paused){
					drawPauseScreen();
					return;
				}

			// GAME START*************************************************************************
			if(gameState == GAME_STATE_START){

				//if(Keys.space){
					//Special move

					//cashOut();
				//}
				//checkEquippedWeapon();


				// DRAW
				drawAttack();
				drawPlayer();

				// MOVE
				p.move(dt);

				// CALCULATE
				calculateAttack();

				// COLLISIONS
				checkSwordCollisions();

				// ENEMIES
				updateEnemies();
				renderEnemyAnimations();
				drawEnemyHealth();

				// INTERFACE
				//comboFeedback();


				// TUTORIAL
				if(tutorialOver >= 7){
					showHealthStam = true;
					gameState = GAME_STATE_PLAY;
				}

			}

			// GAME PLAY**************************************************************************
			if(gameState == GAME_STATE_PLAY){
				//console.log(deathCounter);
				//console.log(equippedSpecial);
				//console.log(comboMeter);

				//activate special attack when special is full
				/*if(specialCounter >= fullSpecial && equippedSpecial != "undefined"){
					activateSpecial();
				}*/
				//checks what weapon is equipped and changes the attack stats based on the weapon
				//checkEquippedWeapon();

				//if(Keys.space){
					//Special move

					//cashOut();
				//}

				// TEXT
				//tutorialText();

				// PAUSED?
				//if(paused){
				//	drawPauseScreen();
				//	return;
				//}



				// DRAW & UPDATE

				drawAttack();
				drawPlayer();

				// ENEMIES
				updateEnemies();
				renderEnemyAnimations();
				drawEnemyHealth();

				// MOVE
				p.move(dt);

				// CALCULATE
				calculateAttack();

				// CHECK COLLISIONS
				checkSwordCollisions();
				checkPlayerEnemyCollisions();

				// COMBO & SCORE CALCULATIONS
				calculateScore();
				drawComboFeedback();



			}
			//if(gameState == GAME_STATE_STORE){
			//		canvas.onmousedown = findMouseCoor;
			//}

			// DRAW Hud
			drawHUD();
		}



		//*********************************************************************************************************************************
		//Once the special meter is full, this calles the function and uses the equipped special
		/*function activateSpecial(){

			//This special grants temporary immunity to damage
			//May need some sort of graphic such as a bubble around the player
			if(equippedSpecial == invincibilty && specialDuration >= 0){
				specialDuration -= .1;
				var invincibleHealth = 10000000;
				p.health = invincibleHealth;

			}
			//Grants temporary unlimited stamina
			else if( equippedSpecial == unlimitedStam && specialDuration >= 0){
				specialDuration -= .05;
				var unlimitedStamSpecial = 100000000;
				p.stamina = unlimitedStamSpecial;
			}
			//special that heals the player for an amount of health
			else if( equippedSpecial == heal && specialDuration >= 0){
				p.health += 1;
				PLAYER_HEALTH += 1;
				specialDuration -= .5;

			}
			//Large damage boost for a short amount of time
			 else if( equippedSpecial == damageBuff && specialDuration >= 0){
				var damageBoost = 50;
				playerDamage = damageBoost;
				specialDuration -= .3;

			 }
			//resets the special meter and the player once the specials are over
			else if(specialDuration <= 0){

				p.health = PLAYER_HEALTH;
				p.stamina = PLAYER_STAMINA;
				playerDamage = pDam;
				specialCounter = 0;
				specialDuration = 10;
			}
		}

		//checks the equipped weapon and adjusts weapon variables accordingly
		 function checkEquippedWeapon(){
			if(equippedWeapon == longSword){
				ATTACK_DIST = 20;
				ATTACK_RADIUS = 30;
				ATTACK_SPEED = 2;
				ATTACK_DAMAGE = 2;
				staminaCost = 1;
				attackKnockBack = -5;
			}
			else if(equippedWeapon == greatSword){
				ATTACK_DIST = 35;
				ATTACK_RADIUS = 45;
				ATTACK_SPEED = 2;
				ATTACK_DAMAGE = 5;
				staminaCost = 2.5;
				attackKnockBack = -12;
			}
			else if(equippedWeapon == dagger){
			 ATTACK_DIST = 15;
			 ATTACK_RADIUS = 20;
			 ATTACK_SPEED = 2;
			 ATTACK_DAMAGE = 1;
			 staminaCost = .5;
			 attackKnockBack = 0;
			}
		}
		//**********************************************************************************************************************************************
		*/





		/* WORK IN PROGRESS

		function drawSprites(){
			var sprites = []; // array created to store the y location of every sprite on the canvas.
			//console.log(p.y);
			sprites.push(p.y)
			for(var i = enemies.length - 1; i >= 0; i--){
				var e = enemies[i];
				if(e.enemyState == "alive" && e.enemyType != "bullet"){
					//console.log(e.location.y);
					sprites.push(e.location.y);
				}
			}
			console.log(sprites);
		}


		*/




		// PLAYER Functions***********************************************************************
		function makePlayer(){
			p.x = CANVAS_WIDTH/2;
			p.y = CANVAS_HEIGHT/2;
			p.speed = PLAYER_SPEED;
			p.state = PLAYER_STATE_NORMAL;
			p.radius = PLAYER_SIZE;
			p.fillStyle = PLAYER_COLOR;
			p.move = _playerMove;
			p.attack = _playerAttack;
			p.stamina = PLAYER_STAMINA;
			p.health = PLAYER_HEALTH;
			p.damage = ATTACK_DAMAGE;
		}
		var _playerMove = function(dt){ // move player
			if(p.state == PLAYER_STATE_NORMAL || p.state == PLAYER_STATE_ATTACK){
				if(Keys.up){
					this.y += this.speed*dt;
					this.y = clamp(this.y, 0,CANVAS_HEIGHT);
				}
				else if(Keys.down){
					this.y -= this.speed*dt;
					this.y = clamp(this.y, 0,CANVAS_HEIGHT);
				}
				if(Keys.left){
					this.x -= this.speed*dt;
					this.x = clamp(this.x, 0,CANVAS_WIDTH);
				}
				else if(Keys.right){
					this.x += this.speed*dt;
					this.x = clamp(this.x, 0,CANVAS_WIDTH);
				}
			}
		}
		var _playerAttack = function(){ // attack
			if(p.state == PLAYER_STATE_NORMAL){ //&& p.stamina >= 18){
				if(p.stamina >= 10){
					p.state = PLAYER_STATE_ATTACK;
				}
			}
			else{
				console.log("attack not ready");
			}
		}
		// PLAYER Draw & Animate******************************************************************
		function drawPlayer(){
			if(p.state == PLAYER_STATE_NORMAL){
				renderWalkAnimation();
			}else if(p.state == PLAYER_STATE_ATTACK){
				p.stamina -= staminaCost;
				renderAttackAnimation();
			}
			else if(p.state == PLAYER_STATE_DEAD){
				renderDeathAnimation();
			}
		}
		function drawAttack(){ // projected area for attack
			if(p.state == PLAYER_STATE_ATTACK){
			    ctx.save();
				ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
				ctx.beginPath();
				ctx.arc(attackCoordX, attackCoordY, ATTACK_RADIUS, 0, Math.PI*2, false);
				ctx.closePath();
				ctx.fill();
				ctx.restore();
			}
		}
			// PLAYER Animation Functions
			// Walking
			function renderWalkAnimation(){
				var x = p.x - 64/2;
				var y = p.y - (64/2)-10;

				tickCount += 1;
				if(tickCount > ticksPerFrame){
					tickCount = 0;
					if(frameIndex < numberOfFrames - 1){
						frameIndex += 1;
					}else{
						frameIndex = 0;
					}
				}
					// left
					if(Keys.left == true){
						ctx.drawImage(character,frameIndex*64,64*9,64,64,x,y,64,64);
						lastFrame = "left";
					}
					// right
					else if(Keys.right == true){
						ctx.drawImage(character,frameIndex*64,64*11,64,64,x,y,64,64);
						lastFrame = "right";
					}
					// up
					else if(Keys.up == true){
						ctx.drawImage(character,frameIndex*64,64*10,64,64,x,y,64,64);
						lastFrame = "up";
					}
					// down
					else if(Keys.down == true){
						ctx.drawImage(character,frameIndex*64,64*8,64,64,x,y,64,64);
						lastFrame = "down";
					}
					// else the player faces the last direction they were moving
					else{
						if(lastFrame == "left")ctx.drawImage(character,0,64*9,64,64,x,y,64,64);
						if(lastFrame == "right")ctx.drawImage(character,0,64*11,64,64,x,y,64,64);
						if(lastFrame == "up")ctx.drawImage(character,0,64*10,64,64,x,y,64,64);
						if(lastFrame == "down")ctx.drawImage(character,0,64*8,64,64,x,y,64,64);
					}
			}
			// Attacking
			function renderAttackAnimation(){
				var x = p.x - 64/2;
				var y = p.y - 64/2-10;
				tickCount += 1;
				if(tickCount > ticksPerFrame2){
					tickCount = 0;
					if(frameIndex2 < numberOfFrames2 - 1){
						frameIndex2 += 1;
					}else{
						frameIndex2 = 0;
						p.state = PLAYER_STATE_NORMAL;
					}
				}
					// right
					if(dotProd < (Math.PI/4) || dotProd >= ((7*Math.PI)/4)){
						ctx.drawImage(character,frameIndex2*64,64*15,64,64,x,y,64,64);
						return;
					}
					// left
					else if(dotProd < ((5*Math.PI)/4) && dotProd >= ((3*Math.PI)/4)){
						ctx.drawImage(character,frameIndex2*64,64*13,64,64,x,y,64,64);
						return;
					}
					// up
					else if(dotProd < ((3*Math.PI)/4) && dotProd >= (Math.PI/4)){
						ctx.drawImage(character,frameIndex2*64,64*12,64,64,x,y,64,64);
						return;
					}
					// down
					else if(dotProd < ((7*Math.PI)/4) && dotProd >= ((5*Math.PI)/4)){
						ctx.drawImage(character,frameIndex2*64,64*14,64,64,x,y,64,64);
						return;
					}
			}
			// Dying
			function renderDeathAnimation(){
				var x = p.x - 64/2;
				var y = p.y - 64/2-10;
				tickCount += 1;
				if(tickCount > ticksPerFrame3){
					tickCount = 0;
					if(frameIndex3 < numberOfFrames2 - 1){
						frameIndex3 += 1;
					}else{
						frameIndex3 = 0;
						gameState = GAME_STATE_END;
					}
				}
				ctx.drawImage(character,frameIndex3*64,64*20,64,64,x,y,64,64);
			}
			/*function cashOut(){
				scoreCounter *= comboMeter;
				healthCounter *= comboMeter;
				staminaCounter *= comboMeter;
				damageCounter *= comboMeter;


				totalScore += Math.floor(scoreCounter);
				if(p.health <= playerMaxHealth){
					p.health += healthCounter;
				}
				//PLAYER_HEALTH += healthCounter;
				p.stamina += staminaCounter;
				//playerDamage += damageCounter;
				p.damage += damageCounter;

				healthCounter = 0;
				staminaCounter = 0;
				scoreCounter = 0;
				damageCounter = 0;
				comboMeter = 1;
			}
		*/




		// ENEMY Functions************************************************************************
		function makeEnemies(){
				console.log("making enemies");
				var limit;
				var type;


				if(waveCounter >= MAX_ENEMIES_SPAWNED){
					limit = MAX_ENEMIES_SPAWNED;
				}else{
					limit = waveCounter;
				}

				for(var i = 0; i<limit; i++){
					var picker = getRandom(1,100);

					if( picker <= 30){
						type = "trash";
					}
					 else if( picker > 30 && picker <= 50){
						if(waveCounter >= 3){
							type = 'rusher';
						}
						else{type = "trash";}
					}
					else if( picker > 50  && picker <= 70){
						if(waveCounter >= 8){
							type = "ranger";
						}
						else{type = "trash";}
					}
					else if( picker > 70 && picker <= 90){
						if(waveCounter >= 14){
							type = "spawner";
						}
						else{type = "trash";}
					}
					else if(picker > 90 && picker <= 100){
						if(waveCounter >= 14){
							type = "tank";
						}
						else{type = "trash";}
					}


						var direction = getRandom(0,2);
						if(direction == 0){
						var xPos = getNum(0,CANVAS_WIDTH);
						var yPos = getRandom(0,CANVAS_HEIGHT);
						}
						else if(direction == 1){
							xPos = getRandom(0,CANVAS_WIDTH);
							yPos = getNum(0,CANVAS_HEIGHT);
						}

					var enemy = new Enemy(xPos,yPos,type);
					enemies.push(enemy);
				}
			}


	/*____________________________________________Update Enemies____________________________________________*/
	// updateEnemies loops through all "alive" enemies.
	// updateEnemies tells each enemy what to do based on coded behaviors unique to their enemyType.
	// Examples of behaviors (chasing, knocked-back, wandering, flocking or attacking)
		function updateEnemies(){
			var vec = new Vector2D(p.x,p.y);
				for(var i = 0; i<enemies.length; i++){
				var vec2 = new Vector2D(enemies[i].x,enemies[i].y);
				if(enemies[i].enemyState == "alive"){

				// ENEMY RUSHER*******************************************************************
					if(enemies[i].enemyType == "rusher"){
						if(enemies[i].enemyCombatState == "knockBack"){
							enemies[i].knockBack(vec);
							if(gameState == GAME_STATE_START)enemies[i].move();
						}
						else if(enemies[i].enemyCombatState == "chasing"){
							if( gameState == GAME_STATE_PLAY){
								if(Math.abs(p.x - enemies[i].location.x) <= enemies[i].aggroRadius && Math.abs(p.y - enemies[i].location.y) <= enemies[i].aggroRadius){
									if(distance(p.x,p.y,enemies[i]) <= enemies[i].attackRange){
										if(enemies[i].attackCooldown >= rusherAttackSpeed){
											enemies[i].enemyCombatState = "attacking";
											enemies[i].attackCooldown = 0;
											enemies[i].attackCounter = 0;
										}
									}else{
										//enemies[i].enemyCombatState = "chasing";
										enemies[i].seek(vec);
									}
								}
								else{
									enemies[i].wander();
								}
								enemies[i].attackCooldown++;
							}
						}
						else if(enemies[i].enemyCombatState == "attacking"){
							if( gameState == GAME_STATE_PLAY){
								if(enemies[i].animation.frameIndexAttack < ATTACK_FRAMES - 1){
									if(enemies[i].attackCounter >= attackDelay){
										calculateEnemyAttacks();
										checkEnemyAttacks(enemies[i]);
										enemies[i].drawAttack(ctx);
									}
								}
								if(distance(p.x,p.y,enemies[i]) >= enemies[i].attackRange && enemies[i].animation.frameIndexAttack >= ATTACK_FRAMES - 1){
									enemies[i].enemyCombatState = "chasing";
									enemies[i].maxSpeed = 1;
								}else{
									enemies[i].wander();
								}
								enemies[i].attackCounter ++;
							}
						}
					}
				// ENEMY RANGER*******************************************************************
					else if(enemies[i].enemyType == "ranger"){
						if(enemies[i].enemyCombatState == "knockBack"){
							enemies[i].knockBack(vec);
							if(gameState == GAME_STATE_START)enemies[i].move();
						}
						else if(enemies[i].enemyCombatState == "attacking" || enemies[i].enemyCombatState == "chasing"){
							if( gameState == GAME_STATE_PLAY){

								if(enemies[i].shootCooldown < rangerAttackSpeed){
									if(seek){
										if(enemies[i].enemyCombatState == "chasing")enemies[i].seek(vec);
									}else{
										if(enemies[i].enemyCombatState == "chasing")enemies[i].flee(vec);
									}
								}
								else if (enemies[i].shootCooldown >= rangerAttackSpeed){
									enemies[i].shootCooldown = 0;
									enemies[i].enemyCombatState = "attacking";
									if(Math.round(distance(p.x,p.y,enemies[i])/10)*10 > enemies[i].fleeRange){
										seek = true;
									}else{
										seek = false;
									}
								}
								enemies[i].shootCooldown++;
							}
						}
					}
				// ENEMY TANK*********************************************************************
					else if(enemies[i].enemyType == "tank"){
						if(enemies[i].enemyCombatState == "knockBack"){
							enemies[i].knockBack(vec);
							if(gameState == GAME_STATE_START)enemies[i].move();
						}
						else if(enemies[i].enemyCombatState == "chasing"){
							if( gameState == GAME_STATE_PLAY){
								if(distance(p.x,p.y,enemies[i]) <= enemies[i].attackRange){
									if(enemies[i].attackCooldown >= tankAttackSpeed){
										enemies[i].attackCooldown = 0;
										//console.log("tank is attacking");
										enemies[i].enemyCombatState = "attacking";
										enemies[i].attackCounter = 0;
									}
								}
								else{
									enemies[i].seek(vec);
									enemies[i].maxSpeed = .5;
								}
								enemies[i].attackCooldown++;
							}
						}
						else if(enemies[i].enemyCombatState == "attacking"){
							if( gameState == GAME_STATE_PLAY){
								if(enemies[i].animation.frameIndexAttack < ATTACK_FRAMES - 1){
									if(enemies[i].attackCounter >= attackDelay){
										calculateEnemyAttacks();
										checkEnemyAttacks(enemies[i]);
										enemies[i].drawAttack(ctx);
										//enemies[i].attackCounter = 0;
									}
									enemies[i].attackCounter ++;

								}
								else{
									enemies[i].seek(vec);
									enemies[i].maxSpeed = .5;
								}
							}
						}
					}
				// ENEMY SPAWNER******************************************************************
					else if(enemies[i].enemyType == "spawner"){
						// each enemy will loop through the predefined spawn points, finds the distance to each point and stores those distances in an array
						var spawnDistances = [];
						for(var s = 0; s<spawnPoints.length; s++){
							var dist = distance(spawnPoints[s].x,spawnPoints[s].y,enemies[i]);
							spawnDistances.push(dist);
						}
						// the enemy loops through the array of distances to determine the closest spawn point to the enemy's current location
							var index = 0;
							var value = spawnDistances[0];
							for (var n = 1; n < spawnDistances.length; n++) {
							  if (spawnDistances[n] < value) {
								value = spawnDistances[n];
								index = n;
							  }
							}
							// vec2 = coordinates for closest spawn point
							vec2 = new Vector2D(spawnPoints[index].x,spawnPoints[index].y);
							// if enemies reach their spawning point they will stop moving and begin spawning enemies, otherwise they will seek their spawning point
							if(enemies[i].enemyCombatState == "knockBack"){
									enemies[i].knockBack(vec);
									enemies[i].move();
							}
							else if(Math.round(enemies[i].location.x) == spawnPoints[index].x && Math.round(enemies[i].location.y) == spawnPoints[index].y){
								if( gameState == GAME_STATE_PLAY){
									enemies[i].enemyCombatState = "attacking";
									if(spawningCounter >= spawnInterval){
										for(var d = 0; d <= enemies[i].numberOfSpawned; d++){
											var enemy = new Enemy(spawnPoints[index].x,spawnPoints[index].y,"flocker");
											enemies.push(enemy);
										}
										enemies[i].numberOfSpawned += 1;
										spawningCounter = 0;
									}
									else{
										spawningCounter ++;
									}
								}
							}
							else{
								if( gameState == GAME_STATE_PLAY){
									if(enemies[i].enemyCombatState == "chasing"){
										//enemies[i].enemyCombatState = "chasing";
										enemies[i].seek(vec2);
										enemies[i].maxSpeed = 1;
										enemies[i].move();
									}
								}
							}
						}
				// ENEMY FLOCKER******************************************************************
					else if(enemies[i].enemyType == "flocker"){
						enemies[i].separate(enemies);
						if(enemies[i].enemyCombatState == "knockBack"){
							enemies[i].knockBack(vec);
							if(gameState == GAME_STATE_START)enemies[i].move();
						}
						else if(enemies[i].enemyCombatState == "chasing"){
							if( gameState == GAME_STATE_PLAY){
								if(distance(p.x,p.y,enemies[i]) <= enemies[i].attackRange){
									if(enemies[i].attackCooldown >= flockerAttackSpeed){
										enemies[i].attackCooldown = 0;
										enemies[i].enemyCombatState = "attacking";
									}
								}else{
									enemies[i].seek(vec);
									enemies[i].maxSpeed = 2;
								}
								enemies[i].attackCooldown++;
							}
						}
						else if(enemies[i].enemyCombatState == "attacking"){
							if( gameState == GAME_STATE_PLAY){
								if(enemies[i].animation.frameIndexAttack < ATTACK_FRAMES - 1){
									if(enemies[i].attackCounter >= attackDelay){
										calculateEnemyAttacks();
										checkEnemyAttacks(enemies[i]);
										enemies[i].drawAttack(ctx);
									}
									enemies[i].attackCounter ++;
								}
								else{
									enemies[i].enemyCombatState = "chasing";
									enemies[i].seek(vec);
									enemies[i].maxSpeed = 2;
								}
							}
						}
					}
				// ENEMY TRASH********************************************************************
					else if(enemies[i].enemyType == "trash"){
						if(enemies[i].enemyCombatState == "knockBack"){
							enemies[i].knockBack(vec);
							if(gameState == GAME_STATE_START)enemies[i].move();
						}
						else if(enemies[i].enemyCombatState == "chasing"){
							if( gameState == GAME_STATE_PLAY){
								if(distance(p.x,p.y,enemies[i]) <= enemies[i].attackRange){
									if(enemies[i].attackCooldown >= trashAttackSpeed){
										enemies[i].attackCooldown = 0;
										enemies[i].enemyCombatState = "attacking";
										enemies[i].attackCounter = 0;
									}
								}else{
									enemies[i].enemyCombatState = "chasing";
									enemies[i].seek(vec);
									enemies[i].maxSpeed = 1;
								}
								enemies[i].attackCooldown++;
							}
						}
						else if(enemies[i].enemyCombatState == "attacking"){
							if( gameState == GAME_STATE_PLAY){
								if(enemies[i].animation.frameIndexAttack < ATTACK_FRAMES - 1){

									if(enemies[i].attackCounter >= attackDelay){
										calculateEnemyAttacks();
										checkEnemyAttacks(enemies[i]);
										enemies[i].drawAttack(ctx);
										//enemies[i].attackCounter = 0;
									}
									//enemies[i].attackCounter ++;
								}
								else{
									enemies[i].enemyCombatState = "chasing";
									enemies[i].seek(vec);
									enemies[i].maxSpeed = 1;
								}
								enemies[i].attackCounter ++;
							}
						}
					}
				// ENEMY BULLET/ARROW*************************************************************
					else if(enemies[i].enemyType == "bullet"){
						if(enemies[i].location.x < 0 || enemies[i].location.x > CANVAS_WIDTH || enemies[i].location.y < 0 || enemies[i].location.y > CANVAS_HEIGHT){
							enemies[i].enemyState = "dead";
						}else{
							enemies[i].seek(enemies[i].targetVec);
							enemies[i].move();
						}
					}
						wayPointCounter ++;
					if( gameState == GAME_STATE_PLAY){
						if(enemies[i].enemyCombatState == "chasing" || enemies[i].enemyCombatState == "knockBack"){
							if(enemies[i].enemyType != "spawner"){
								enemies[i].move();
							}
						}
					}
				}
					if(enemies[i].location.x >= CANVAS_WIDTH && enemies[i].enemyType != "bullet"){
						enemies[i].velocity.scaleBy(-1);
					}
					else if(enemies[i].location.x <= 0 && enemies[i].enemyType != "bullet"){
						enemies[i].velocity.scaleBy(-1);
					}
					else if(enemies[i].location.y <= 0 && enemies[i].enemyType != "bullet"){
						enemies[i].velocity.scaleBy(-1);
					}
					else if(enemies[i].location.y >= CANVAS_HEIGHT && enemies[i].enemyType != "bullet"){
						enemies[i].velocity.scaleBy(-1);
					}
				}
		}

	/*___________________________________________________ENEMY ANIMATIONS___________________________________________________*/
	// renderEnemyAnimations animates through sprite sheets according to what the enemy is doing.
	//
		function renderEnemyAnimations(){
			for(var a = 0; a<enemies.length; a++){
				var e = enemies[a];
				if(e.enemyState == "alive"){
				// GAME STATE START****************************************************************
					if(gameState == GAME_STATE_START){
						// TRASH
						if(e.enemyType == "trash"){
							var tr = e.animation;
							var x = e.location.x - e.spriteSize/2; // x location of the enemy
							var y = e.location.y - e.spriteSize/2-e.spriteYOffset; // y location of the enemy
							// Standing
							if(e.enemyCombatState == "chasing" || e.enemyCombatState == "knockBack"){
								ctx.drawImage(trash,64,64*10,64,64,x,y,e.spriteSize,e.spriteSize);
							}
							// Dying
							else if(e.enemyCombatState == "fallen"){
								tr.tickCount += 1;
								if(tr.tickCount > tr.ticksPerFrameDie){
									tr.tickCount = 0;
									if(tr.frameIndexDie < DEATH_FRAMES - 1){
										tr.frameIndexDie += 1;
									}else if(tr.frameIndexDie >= DEATH_FRAMES - 1){
										e.enemyState = "dead";
											//scoreCounter += e.score;
											//staminaCounter += 1;
											//specialCounter ++;
										//tutorialOver  += 1;
									}
								}
								ctx.drawImage(trash,tr.frameIndexDie*64,64*20,64,64,x,y,e.spriteSize,e.spriteSize);
							}
						}
						// RUSHER
						if(e.enemyType == "rusher"){
							var rr = e.animation;
							var x = e.location.x - e.spriteSize/2; // x location of the enemy
							var y = e.location.y - e.spriteSize/2-e.spriteYOffset; // y location of the enemy
							// Standing
							if(e.enemyCombatState == "chasing" || e.enemyCombatState == "knockBack"){
								ctx.drawImage(rusher,64,64*10,64,64,x,y,e.spriteSize,e.spriteSize);
							}
							// Dying
							else if(e.enemyCombatState == "fallen"){
								rr.tickCount += 1;
								if(rr.tickCount > rr.ticksPerFrameDie){
									rr.tickCount = 0;
									if(rr.frameIndexDie < DEATH_FRAMES - 1){
										rr.frameIndexDie += 1;
									}else if(rr.frameIndexDie >= DEATH_FRAMES - 1){
										e.enemyState = "dead";
											//comboMeter += .25;
											//staminaCounter += 3;
											//scoreCounter += e.score;
											//specialCounter ++;
										//tutorialOver  += 1;
									}
								}
								ctx.drawImage(rusher,rr.frameIndexDie*64,64*20,64,64,x,y,e.spriteSize,e.spriteSize);
							}
						}
						// SPAWNER
						if(e.enemyType == "spawner"){
							var s = e.animation;
							var x = e.location.x - e.spriteSize/2; // x location of the enemy
							var y = e.location.y - e.spriteSize/2-e.spriteYOffset; // y location of the enemy
							// Standing
							if(e.enemyCombatState == "chasing" || e.enemyCombatState == "knockBack"){
								ctx.drawImage(spawner,64,64*2,64,64,x,y,e.spriteSize,e.spriteSize);
							}
							// Dying
							else if(e.enemyCombatState == "fallen"){
								s.tickCount += 1;
								if(s.tickCount > s.ticksPerFrameDie){
									s.tickCount = 0;
									if(s.frameIndexDie < DEATH_FRAMES - 1){
										s.frameIndexDie += 1;
									}else if(s.frameIndexDie >= DEATH_FRAMES - 1){
										e.enemyState = "dead";
										//healthCounter += 1;
										//comboMeter += .25;
										//scoreCounter += e.score;
										//specialCounter ++;
										//tutorialOver  += 1;
									}
								}
								ctx.drawImage(spawner,s.frameIndexDie*64,64*20,64,64,x,y,e.spriteSize,e.spriteSize);
							}
						}
						// FLOCKER
						if(e.enemyType == "flocker"){
							var f = e.animation;
							var x = e.location.x - e.spriteSize/2; // x location of the enemy
							var y = e.location.y - e.spriteSize/2-e.spriteYOffset; // y location of the enemy
							// Standing
							if(e.enemyCombatState == "chasing" || e.enemyCombatState == "knockBack"){
								ctx.drawImage(flocker,64,64*10,64,64,x,y,e.spriteSize,e.spriteSize);
							}
							// Dying
							if(e.enemyCombatState == "fallen"){
								f.tickCount += 1;
								if(f.tickCount > f.ticksPerFrameDie){
									f.tickCount = 0;
									if(f.frameIndexDie < DEATH_FRAMES - 1){
										f.frameIndexDie += 1;
									}else if(f.frameIndexDie >= DEATH_FRAMES - 1){
										e.enemyState = "dead";
										//comboMeter += .25;
										//scoreCounter += e.score;
										//healthCounter += .25;
										//specialCounter ++;
										//tutorialOver  += 1;
									}
								}
								ctx.drawImage(flocker,f.frameIndexDie*64,64*20,64,64,x,y,e.spriteSize,e.spriteSize);
							}
						}
						// RANGER
						if(e.enemyType == "ranger"){
							var r = e.animation;
							var x = e.location.x - e.spriteSize/2; // x location of the enemy
							var y = e.location.y - e.spriteSize/2-e.spriteYOffset; // y location of the enemy
							// Standing
							if(e.enemyCombatState == "chasing" || e.enemyCombatState == "knockBack"){
								ctx.drawImage(ranger,64,64*10,64,64,x,y,e.spriteSize,e.spriteSize);
							}
							// Dying
							else if(e.enemyCombatState == "fallen"){
								r.tickCount += 1;
								if(r.tickCount > r.ticksPerFrameDie){
									r.tickCount = 0;
									if(r.frameIndexDie < DEATH_FRAMES - 1){
										r.frameIndexDie += 1;
									}else if(r.frameIndexDie >= DEATH_FRAMES - 1){
										e.enemyState = "dead";
										//comboMeter += .25;
										//scoreCounter += e.score;
										//damageCounter += .25;
										//tutorialOver  += 1;
									}
								}
								ctx.drawImage(ranger,r.frameIndexDie*64,64*20,64,64,x,y,e.spriteSize,e.spriteSize);
							}
						}
						// TANK
						if(e.enemyType == "tank"){
							var t = e.animation;
							var x = e.location.x - e.spriteSize/2; // x location of the enemy
							var y = e.location.y - e.spriteSize/2-e.spriteYOffset; // y location of the enemy
							// Standing
							if(e.enemyCombatState == "chasing" || e.enemyCombatState == "knockBack"){
								ctx.drawImage(tank,64,64*10,64,64,x,y,e.spriteSize,e.spriteSize);
							}
							// Dying
							else if(e.enemyCombatState == "fallen"){
								t.tickCount += 1;
								if(t.tickCount > t.ticksPerFrameDie){
									t.tickCount = 0;
									if(t.frameIndexDie < DEATH_FRAMES - 1){
										t.frameIndexDie += 1;
									}else if(t.frameIndexDie >= DEATH_FRAMES - 1){
										e.enemyState = "dead";
										//comboMeter += .25;
										//scoreCounter += e.score;
										//damageCounter += .5;
										//specialCounter ++;
										//t.frameIndexDie = 6;
										//tutorialOver  += 1;
									}
								}
								ctx.drawImage(tank,t.frameIndexDie*64,64*20,64,64,x,y,e.spriteSize,e.spriteSize);
							}
						}
					}
					// GAME STATE PLAY*************************************************************
					if(gameState == GAME_STATE_PLAY){
							var enemyDirection; // direction the enemy is facing
							var vX = Math.abs(e.velocity.x);
							var vY = Math.abs(e.velocity.y);
							var vX2 = Math.abs(p.x - e.location.x);
							var vY2 = Math.abs(p.y - e.location.y);
							// determine the direction of the enemy
							enemyDirection = findDirection(vX,vY,e.velocity.x,e.velocity.y);
						// TRASH ANIMATIONS************************************************************
							if(e.enemyType == "trash"){
									var tr = e.animation;
									var x = e.location.x - e.spriteSize/2; // x location of the enemy
									var y = e.location.y - e.spriteSize/2-e.spriteYOffset; // y location of the enemy
									// Walking
									if(e.enemyCombatState == "chasing"){
											tr.tickCount += 1;
											if(tr.tickCount > tr.ticksPerFrameWalk){
												tr.tickCount = 0;
												if(tr.frameIndexWalk < WALKCYCLE_FRAMES - 1){
													tr.frameIndexWalk += 1;
												}else{
													tr.frameIndexWalk = 0;
												}
											}
											// left
											if(enemyDirection == "left"){
												ctx.drawImage(trash,tr.frameIndexWalk*64,64*9,64,64,x,y,e.spriteSize,e.spriteSize);
												tr.lastFrame = "left";
											}
											// right
											else if(enemyDirection == "right"){
												ctx.drawImage(trash,tr.frameIndexWalk*64,64*11,64,64,x,y,e.spriteSize,e.spriteSize);
												tr.lastFrame = "right";
											}
											// down
											else if(enemyDirection == "down"){
												ctx.drawImage(trash,tr.frameIndexWalk*64,64*10,64,64,x,y,e.spriteSize,e.spriteSize);
												tr.lastFrame = "down";
											}
											// up
											else if(enemyDirection == "up"){
												ctx.drawImage(trash,tr.frameIndexWalk*64,64*8,64,64,x,y,e.spriteSize,e.spriteSize);
												tr.lastFrame = "up";
											}
									}
									// Attacking
									if(e.enemyCombatState == "attacking"){
										// change enemyDirection to face the player if attacking
										enemyDirection = findDirection(vX2,vY2,(p.x - e.location.x),(p.y - e.location.y));
										tr.tickCount += 1;
										if(tr.tickCount > tr.ticksPerFrameAttack){
											tr.tickCount = 0;
											if(tr.frameIndexAttack < ATTACK_FRAMES - 1){
												tr.frameIndexAttack += 1;
											}else{
												tr.frameIndexAttack = 0;
												//e.enemyCombatState = "chasing";
											}
										}
											// left
											if(enemyDirection == "left"){
												ctx.drawImage(trash,tr.frameIndexAttack*64,64*13,64,64,x,y,e.spriteSize,e.spriteSize);
												tr.lastFrame = "left";
											}
											// right
											else if(enemyDirection == "right"){
												ctx.drawImage(trash,tr.frameIndexAttack*64,64*15,64,64,x,y,e.spriteSize,e.spriteSize);
												tr.lastFrame = "right";
											}
											// down
											else if(enemyDirection == "down"){
												ctx.drawImage(trash,tr.frameIndexAttack*64,64*14,64,64,x,y,e.spriteSize,e.spriteSize);
												tr.lastFrame = "down";
											}
											// up
											else if(enemyDirection == "up"){
												ctx.drawImage(trash,tr.frameIndexAttack*64,64*12,64,64,x,y,e.spriteSize,e.spriteSize);
												tr.lastFrame = "up";
											}
									}
									// Knocked Back
									else if(e.enemyCombatState == "knockBack"){
										if(tr.lastFrame == "left")ctx.drawImage(trash,64,64*9,64,64,x,y,e.spriteSize,e.spriteSize);
										if(tr.lastFrame == "right")ctx.drawImage(trash,64,64*11,64,64,x,y,e.spriteSize,e.spriteSize);
										if(tr.lastFrame == "up")ctx.drawImage(trash,64,64*8,64,64,x,y,e.spriteSize,e.spriteSize);
										if(tr.lastFrame == "down")ctx.drawImage(trash,64,64*10,64,64,x,y,e.spriteSize,e.spriteSize);
									}
									// Dying
									else if(e.enemyCombatState == "fallen"){
										tr.tickCount += 1;
										if(tr.tickCount > tr.ticksPerFrameDie){
											tr.tickCount = 0;
											if(tr.frameIndexDie < DEATH_FRAMES - 1){
												tr.frameIndexDie += 1;
											}else if(tr.frameIndexDie >= DEATH_FRAMES - 1){
												e.enemyState = "dead";
												deathCounter ++;
												//scoreCounter += e.score;
												//staminaCounter += 1;
												//specialCounter ++;
												//tr.frameIndexDie = 0;
											}
										}
										ctx.drawImage(trash,tr.frameIndexDie*64,64*20,64,64,x,y,e.spriteSize,e.spriteSize);
									}
								}
						// RUSHER ANIMATIONS***********************************************************
							if(e.enemyType == "rusher"){
									var rr = e.animation;
									var x = e.location.x - e.spriteSize/2; // x location of the enemy
									var y = e.location.y - e.spriteSize/2-e.spriteYOffset; // y location of the enemy
									// Walking
									if(e.enemyCombatState == "chasing"){
											rr.tickCount += 1;
											if(rr.tickCount > rr.ticksPerFrameWalk){
												rr.tickCount = 0;
												if(rr.frameIndexWalk < WALKCYCLE_FRAMES - 1){
													rr.frameIndexWalk += 1;
												}else{
													rr.frameIndexWalk = 0;
												}
											}
											// left
											if(enemyDirection == "left"){
												ctx.drawImage(rusher,rr.frameIndexWalk*64,64*9,64,64,x,y,e.spriteSize,e.spriteSize);
												rr.lastFrame = "left";
											}
											// right
											else if(enemyDirection == "right"){
												ctx.drawImage(rusher,rr.frameIndexWalk*64,64*11,64,64,x,y,e.spriteSize,e.spriteSize);
												rr.lastFrame = "right";
											}
											// down
											else if(enemyDirection == "down"){
												ctx.drawImage(rusher,rr.frameIndexWalk*64,64*10,64,64,x,y,e.spriteSize,e.spriteSize);
												rr.lastFrame = "down";
											}
											// up
											else if(enemyDirection == "up"){
												ctx.drawImage(rusher,rr.frameIndexWalk*64,64*8,64,64,x,y,e.spriteSize,e.spriteSize);
												rr.lastFrame = "up";
											}
									}
									// Attacking
									if(e.enemyCombatState == "attacking"){
										// change enemyDirection to face the player if attacking
										enemyDirection = findDirection(vX2,vY2,(p.x - e.location.x),(p.y - e.location.y));
										rr.tickCount += 1;
										if(rr.tickCount > rr.ticksPerFrameAttack){
											rr.tickCount = 0;
											if(rr.frameIndexAttack < ATTACK_FRAMES - 1){
												rr.frameIndexAttack += 1;
											}else{
												rr.frameIndexAttack = 0;
												//e.enemyCombatState = "chasing";
											}
										}
											// left
											if(enemyDirection == "left"){
												ctx.drawImage(rusher,rr.frameIndexAttack*64,64*5,64,64,x,y,e.spriteSize,e.spriteSize);
												rr.lastFrame = "left";
											}
											// right
											else if(enemyDirection == "right"){
												ctx.drawImage(rusher,rr.frameIndexAttack*64,64*7,64,64,x,y,e.spriteSize,e.spriteSize);
												rr.lastFrame = "right";
											}
											// down
											else if(enemyDirection == "down"){
												ctx.drawImage(rusher,rr.frameIndexAttack*64,64*6,64,64,x,y,e.spriteSize,e.spriteSize);
												rr.lastFrame = "down";
											}
											// up
											else if(enemyDirection == "up"){
												ctx.drawImage(rusher,rr.frameIndexAttack*64,64*4,64,64,x,y,e.spriteSize,e.spriteSize);
												rr.lastFrame = "up";
											}
									}
									// Knocked Back
									else if(e.enemyCombatState == "knockBack"){
										if(rr.lastFrame == "left")ctx.drawImage(rusher,64,64*9,64,64,x,y,e.spriteSize,e.spriteSize);
										if(rr.lastFrame == "right")ctx.drawImage(rusher,64,64*11,64,64,x,y,e.spriteSize,e.spriteSize);
										if(rr.lastFrame == "up")ctx.drawImage(rusher,64,64*8,64,64,x,y,e.spriteSize,e.spriteSize);
										if(rr.lastFrame == "down")ctx.drawImage(rusher,64,64*10,64,64,x,y,e.spriteSize,e.spriteSize);
									}
									// Dying
									else if(e.enemyCombatState == "fallen"){
										rr.tickCount += 1;
										if(rr.tickCount > rr.ticksPerFrameDie){
											rr.tickCount = 0;
											if(rr.frameIndexDie < DEATH_FRAMES - 1){
												rr.frameIndexDie += 1;
											}else if(rr.frameIndexDie >= DEATH_FRAMES - 1){
												e.enemyState = "dead";
												deathCounter ++;
												//comboMeter += .25;
												//staminaCounter += 3;
												//scoreCounter += e.score;
												//specialCounter ++;
												//rr.frameIndexDie = 0;
											}
										}
										ctx.drawImage(rusher,rr.frameIndexDie*64,64*20,64,64,x,y,e.spriteSize,e.spriteSize);
									}
								}
						// SPAWNER ANIMATIONS**********************************************************
							if(e.enemyType == "spawner"){
								var s = e.animation;
								var x = e.location.x - e.spriteSize/2; // x location of the enemy
								var y = e.location.y - e.spriteSize/2-e.spriteYOffset; // y location of the enemy
								// Walking
								if(e.enemyCombatState == "chasing"){
										s.tickCount += 1;
										if(s.tickCount > s.ticksPerFrameWalk){
											s.tickCount = 0;
											if(s.frameIndexWalk < WALKCYCLE_FRAMES - 1){
												s.frameIndexWalk += 1;
											}else{
												s.frameIndexWalk = 0;
											}
										}
										// left
										if(enemyDirection == "left"){
											ctx.drawImage(spawner,s.frameIndexWalk*64,64*9,64,64,x,y,e.spriteSize,e.spriteSize);
											s.lastFrame = "left";
										}
										// right
										else if(enemyDirection == "right"){
											ctx.drawImage(spawner,s.frameIndexWalk*64,64*11,64,64,x,y,e.spriteSize,e.spriteSize);
											s.lastFrame = "right";
										}
										// down
										else if(enemyDirection == "down"){
											ctx.drawImage(spawner,s.frameIndexWalk*64,64*10,64,64,x,y,e.spriteSize,e.spriteSize);
											s.lastFrame = "down";
										}
										// up
										else if(enemyDirection == "up"){
											ctx.drawImage(spawner,s.frameIndexWalk*64,64*8,64,64,x,y,e.spriteSize,e.spriteSize);
											s.lastFrame = "up";
										}
								}
								// Attacking
								if(e.enemyCombatState == "attacking"){
									// change enemyDirection to face the player if attacking
									enemyDirection = findDirection(vX2,vY2,(p.x - e.location.x),(p.y - e.location.y));
									s.tickCount += 1;
									if(s.tickCount > s.ticksPerFrameAttack){
										s.tickCount = 0;
										if(s.frameIndexAttack < eNumberOfFramesCast - 1){
											s.frameIndexAttack += 1;
										}else{
											s.frameIndexAttack = 0;
											e.enemyCombatState = "chasing";
										}
									}
										// left
										if(enemyDirection == "left"){
											ctx.drawImage(spawner,s.frameIndexAttack*64,64*1,64,64,x,y,e.spriteSize,e.spriteSize);
											s.lastFrame = "left";
										}
										// right
										else if(enemyDirection == "right"){
											ctx.drawImage(spawner,s.frameIndexAttack*64,64*3,64,64,x,y,e.spriteSize,e.spriteSize);
											s.lastFrame = "right";
										}
										// down
										else if(enemyDirection == "down"){
											ctx.drawImage(spawner,s.frameIndexAttack*64,64*2,64,64,x,y,e.spriteSize,e.spriteSize);
											s.lastFrame = "down";
										}
										// up
										else if(enemyDirection == "up"){
											ctx.drawImage(spawner,s.frameIndexAttack*64,0,64,64,x,y,e.spriteSize,e.spriteSize);
											s.lastFrame = "up";
										}
								}
								// Knocked Back
								else if(e.enemyCombatState == "knockBack"){
									if(s.lastFrame == "left")ctx.drawImage(spawner,64,64*9,64,64,x,y,e.spriteSize,e.spriteSize);
									if(s.lastFrame == "right")ctx.drawImage(spawner,64,64*11,64,64,x,y,e.spriteSize,e.spriteSize);
									if(s.lastFrame == "up")ctx.drawImage(spawner,64,64*8,64,64,x,y,e.spriteSize,e.spriteSize);
									if(s.lastFrame == "down")ctx.drawImage(spawner,64,64*10,64,64,x,y,e.spriteSize,e.spriteSize);
								}
								// Dying
								else if(e.enemyCombatState == "fallen"){
									s.tickCount += 1;
									if(s.tickCount > s.ticksPerFrameDie){
										s.tickCount = 0;
										if(s.frameIndexDie < DEATH_FRAMES - 1){
											s.frameIndexDie += 1;
										}else if(s.frameIndexDie >= DEATH_FRAMES - 1){
											e.enemyState = "dead";
											deathCounter ++;
											//healthCounter += 1;
											//comboMeter += .25;
											//scoreCounter += e.score;
											//specialCounter ++;
											//s.frameIndexDie = 0;
										}
									}
									ctx.drawImage(spawner,s.frameIndexDie*64,64*20,64,64,x,y,e.spriteSize,e.spriteSize);
								}
							}
						// FLOCKER ANIMATIONS**********************************************************
							if(e.enemyType == "flocker"){
									var f = e.animation;
									var x = e.location.x - e.spriteSize/2; // x location of the enemy
									var y = e.location.y - e.spriteSize/2-e.spriteYOffset; // y location of the enemy
									// Walking
									if(e.enemyCombatState == "chasing"){
											f.tickCount += 1;
											if(f.tickCount > f.ticksPerFrameWalk){
												f.tickCount = 0;
												if(f.frameIndexWalk < WALKCYCLE_FRAMES - 1){
													f.frameIndexWalk += 1;
												}else{
													f.frameIndexWalk = 0;
												}
											}
											// left
											if(enemyDirection == "left"){
												ctx.drawImage(flocker,f.frameIndexWalk*64,64*9,64,64,x,y,e.spriteSize,e.spriteSize);
												f.lastFrame = "left";
											}
											// right
											else if(enemyDirection == "right"){
												ctx.drawImage(flocker,f.frameIndexWalk*64,64*11,64,64,x,y,e.spriteSize,e.spriteSize);
												f.lastFrame = "right";
											}
											// down
											else if(enemyDirection == "down"){
												ctx.drawImage(flocker,f.frameIndexWalk*64,64*10,64,64,x,y,e.spriteSize,e.spriteSize);
												f.lastFrame = "down";
											}
											// up
											else if(enemyDirection == "up"){
												ctx.drawImage(flocker,f.frameIndexWalk*64,64*8,64,64,x,y,e.spriteSize,e.spriteSize);
												f.lastFrame = "up";
											}
									}
									// Attacking
									if(e.enemyCombatState == "attacking"){
										// change enemyDirection to face the player if attacking
										enemyDirection = findDirection(vX2,vY2,(p.x - e.location.x),(p.y - e.location.y));
										f.tickCount += 1;
										if(f.tickCount > f.ticksPerFrameAttack){
											f.tickCount = 0;
											if(f.frameIndexAttack < ATTACK_FRAMES - 1){
												f.frameIndexAttack += 1;
											}else{
												f.frameIndexAttack = 0;
												//e.enemyCombatState = "chasing";
											}
										}
											// left
											if(enemyDirection == "left"){
												ctx.drawImage(flocker,f.frameIndexAttack*64,64*13,64,64,x,y,e.spriteSize,e.spriteSize);
												f.lastFrame = "left";
											}
											// right
											else if(enemyDirection == "right"){
												ctx.drawImage(flocker,f.frameIndexAttack*64,64*15,64,64,x,y,e.spriteSize,e.spriteSize);
												f.lastFrame = "right";
											}
											// down
											else if(enemyDirection == "down"){
												ctx.drawImage(flocker,f.frameIndexAttack*64,64*14,64,64,x,y,e.spriteSize,e.spriteSize);
												f.lastFrame = "down";
											}
											// up
											else if(enemyDirection == "up"){
												ctx.drawImage(flocker,f.frameIndexAttack*64,64*12,64,64,x,y,e.spriteSize,e.spriteSize);
												f.lastFrame = "up";
											}
									}
									// Knocked Back
									else if(e.enemyCombatState == "knockBack"){
										if(f.lastFrame == "left")ctx.drawImage(flocker,64,64*9,64,64,x,y,e.spriteSize,e.spriteSize);
										if(f.lastFrame == "right")ctx.drawImage(flocker,64,64*11,64,64,x,y,e.spriteSize,e.spriteSize);
										if(f.lastFrame == "up")ctx.drawImage(flocker,64,64*8,64,64,x,y,e.spriteSize,e.spriteSize);
										if(f.lastFrame == "down")ctx.drawImage(flocker,64,64*10,64,64,x,y,e.spriteSize,e.spriteSize);
									}
									// Dying
									else if(e.enemyCombatState == "fallen"){
										f.tickCount += 1;
										if(f.tickCount > f.ticksPerFrameDie){
											f.tickCount = 0;
											if(f.frameIndexDie < DEATH_FRAMES - 1){
												f.frameIndexDie += 1;
											}else if(f.frameIndexDie >= DEATH_FRAMES - 1){
												e.enemyState = "dead";
												deathCounter ++;
												//comboMeter += .25;
												//scoreCounter += e.score;
												//healthCounter += .25;
												//specialCounter ++;
												//f.frameIndexDie = 0;
											}
										}
										ctx.drawImage(flocker,f.frameIndexDie*64,64*20,64,64,x,y,e.spriteSize,e.spriteSize);
									}
								}
						// RANGER ANIMATIONS***********************************************************
							if(e.enemyType == "ranger"){
								var vec = new Vector2D(Math.round(p.x - e.location.x),Math.round(e.location.y - p.y));
								var vec2 = new Vector2D(e.location.x+20,0);
								var vec3 = new Vector2D((p.x - e.location.x), (p.y - e.location.y));
								var attackAngle = dotProduct(vec,vec2);
								if(vec.x > 0 && vec.y > 0){
									attackAngle = Math.PI*2 - attackAngle;
								}
								// if click is in the 1st quadrant
								else if(vec.x < 0 && vec.y > 0){
									attackAngle = Math.PI*2 - attackAngle;
								}
								// otherwise mouseX and mouseY are either in the 3rd or 4th quadrant
								else{
									attackAngle = attackAngle;
								}

								var r = e.animation;
								var x = e.location.x - e.spriteSize/2; // x location of the enemy
								var y = e.location.y - e.spriteSize/2-e.spriteYOffset; // y location of the enemy
								// Walking
								if(e.enemyCombatState == "chasing"){
										r.tickCount += 1;
										if(r.tickCount > r.ticksPerFrameWalk){
											r.tickCount = 0;
											if(r.frameIndexWalk < WALKCYCLE_FRAMES - 1){
												r.frameIndexWalk += 1;
											}else{
												r.frameIndexWalk = 0;
											}
										}
										// left
										if(enemyDirection == "left"){
											ctx.drawImage(ranger,r.frameIndexWalk*64,64*9,64,64,x,y,e.spriteSize,e.spriteSize);
											r.lastFrame = "left";
										}
										// right
										else if(enemyDirection == "right"){
											ctx.drawImage(ranger,r.frameIndexWalk*64,64*11,64,64,x,y,e.spriteSize,e.spriteSize);
											r.lastFrame = "right";
										}
										// down
										else if(enemyDirection == "down"){
											ctx.drawImage(ranger,r.frameIndexWalk*64,64*10,64,64,x,y,e.spriteSize,e.spriteSize);
											r.lastFrame = "down";
										}
										// up
										else if(enemyDirection == "up"){
											ctx.drawImage(ranger,r.frameIndexWalk*64,64*8,64,64,x,y,e.spriteSize,e.spriteSize);
											r.lastFrame = "up";
										}
								}
								// Attacking
								if(e.enemyCombatState == "attacking"){
									// change enemyDirection to face the player if attacking
									enemyDirection = findDirection(vX2,vY2,(p.x - e.location.x),(p.y - e.location.y));
									r.tickCount += 1;
									if(r.tickCount > r.ticksPerFrameAttack){
										r.tickCount = 0;
										if(r.frameIndexAttack < RANGE_ATTACK_FRAMES - 1){
											r.frameIndexAttack += 1;
										}else{
											r.frameIndexAttack = 0;
											e.shoot(e.location.x,e.location.y,vec3,enemies,attackAngle);
											e.enemyCombatState = "chasing";
										}
									}
										// left
										if(enemyDirection == "left"){
											ctx.drawImage(ranger,r.frameIndexAttack*64,64*17,64,64,x,y,e.spriteSize,e.spriteSize);
											r.lastFrame = "left";
										}
										// right
										else if(enemyDirection == "right"){
											ctx.drawImage(ranger,r.frameIndexAttack*64,64*19,64,64,x,y,e.spriteSize,e.spriteSize);
											r.lastFrame = "right";
										}
										// down
										else if(enemyDirection == "down"){
											ctx.drawImage(ranger,r.frameIndexAttack*64,64*18,64,64,x,y,e.spriteSize,e.spriteSize);
											r.lastFrame = "down";
										}
										// up
										else if(enemyDirection == "up"){
											ctx.drawImage(ranger,r.frameIndexAttack*64,64*16,64,64,x,y,e.spriteSize,e.spriteSize);
											r.lastFrame = "up";
										}
								}
								// Knocked Back
								else if(e.enemyCombatState == "knockBack"){
									if(r.lastFrame == "left")ctx.drawImage(ranger,64,64*9,64,64,x,y,e.spriteSize,e.spriteSize);
									if(r.lastFrame == "right")ctx.drawImage(ranger,64,64*11,64,64,x,y,e.spriteSize,e.spriteSize);
									if(r.lastFrame == "up")ctx.drawImage(ranger,64,64*8,64,64,x,y,e.spriteSize,e.spriteSize);
									if(r.lastFrame == "down")ctx.drawImage(ranger,64,64*10,64,64,x,y,e.spriteSize,e.spriteSize);
								}
								// Dying
								else if(e.enemyCombatState == "fallen"){
									r.tickCount += 1;
									if(r.tickCount > r.ticksPerFrameDie){
										r.tickCount = 0;
										if(r.frameIndexDie < DEATH_FRAMES - 1){
											r.frameIndexDie += 1;
										}else if(r.frameIndexDie >= DEATH_FRAMES - 1){
											e.enemyState = "dead";
											deathCounter ++;
											//comboMeter += .25;
											//scoreCounter += e.score;
											//damageCounter += .25;
											//r.frameIndexDie = 0;
										}
									}
									ctx.drawImage(ranger,r.frameIndexDie*64,64*20,64,64,x,y,e.spriteSize,e.spriteSize);
								}
							}
						// TANK ANIMATIONS*************************************************************
							if(e.enemyType == "tank"){
								var t = e.animation;
								var x = e.location.x - e.spriteSize/2; // x location of the enemy
								var y = e.location.y - e.spriteSize/2-e.spriteYOffset; // y location of the enemy
								// Walking
								if(e.enemyCombatState == "chasing"){
										t.tickCount += 1;
										if(t.tickCount > t.ticksPerFrameWalk){
											t.tickCount = 0;
											if(t.frameIndexWalk < WALKCYCLE_FRAMES - 1){
												t.frameIndexWalk += 1;
											}else{
												t.frameIndexWalk = 0;
											}
										}
										// left
										if(enemyDirection == "left"){
											ctx.drawImage(tank,t.frameIndexWalk*64,64*9,64,64,x,y,e.spriteSize,e.spriteSize);
											t.lastFrame = "left";
										}
										// right
										else if(enemyDirection == "right"){
											ctx.drawImage(tank,t.frameIndexWalk*64,64*11,64,64,x,y,e.spriteSize,e.spriteSize);
											t.lastFrame = "right";
										}
										// down
										else if(enemyDirection == "down"){
											ctx.drawImage(tank,t.frameIndexWalk*64,64*10,64,64,x,y,e.spriteSize,e.spriteSize);
											t.lastFrame = "down";
										}
										// up
										else if(enemyDirection == "up"){
											ctx.drawImage(tank,t.frameIndexWalk*64,64*8,64,64,x,y,e.spriteSize,e.spriteSize);
											t.lastFrame = "up";
										}
								}
								// Attacking
								if(e.enemyCombatState == "attacking"){
									var x = e.location.x - e.spriteSizeAttack/2; // x location of the enemy
									var y = e.location.y - e.spriteSizeAttack/2-e.spriteYOffset; // y location of the enemy
									// change enemyDirection to face the player if attacking
									enemyDirection = findDirection(vX2,vY2,(p.x - e.location.x),(p.y - e.location.y));
									t.tickCount += 1;
									if(t.tickCount > t.ticksPerFrameAttack){
										t.tickCount = 0;
										if(t.frameIndexAttack < ATTACK_FRAMES - 1){
											t.frameIndexAttack += 1;
										}else{
											t.frameIndexAttack = 0;
											e.enemyCombatState = "chasing";
										}
									}
										// left
										if(enemyDirection == "left"){
											ctx.drawImage(tank,t.frameIndexAttack*192,64*24,192,192,x,y,e.spriteSizeAttack,e.spriteSizeAttack);
											t.lastFrame = "left";
										}
										// right
										else if(enemyDirection == "right"){
											ctx.drawImage(tank,t.frameIndexAttack*192,64*30,192,192,x,y,e.spriteSizeAttack,e.spriteSizeAttack);
											t.lastFrame = "right";
										}
										// down
										else if(enemyDirection == "down"){
											ctx.drawImage(tank,t.frameIndexAttack*192,64*27,192,192,x,y,e.spriteSizeAttack,e.spriteSizeAttack);
											t.lastFrame = "down";
										}
										// up
										else if(enemyDirection == "up"){
											ctx.drawImage(tank,t.frameIndexAttack*192,64*21,192,192,x,y,e.spriteSizeAttack,e.spriteSizeAttack);
											t.lastFrame = "up";
										}
								}
								// Knocked Back
								else if(e.enemyCombatState == "knockBack"){
									if(t.lastFrame == "left")ctx.drawImage(tank,64,64*9,64,64,x,y,e.spriteSize,e.spriteSize);
									if(t.lastFrame == "right")ctx.drawImage(tank,64,64*11,64,64,x,y,e.spriteSize,e.spriteSize);
									if(t.lastFrame == "up")ctx.drawImage(tank,64,64*8,64,64,x,y,e.spriteSize,e.spriteSize);
									if(t.lastFrame == "down")ctx.drawImage(tank,64,64*10,64,64,x,y,e.spriteSize,e.spriteSize);
								}
								// Dying
								else if(e.enemyCombatState == "fallen"){
									t.tickCount += 1;
									if(t.tickCount > t.ticksPerFrameDie){
										t.tickCount = 0;
										if(t.frameIndexDie < DEATH_FRAMES - 1){
											t.frameIndexDie += 1;
										}else if(t.frameIndexDie >= DEATH_FRAMES - 1){
											e.enemyState = "dead";
											deathCounter ++;
											//e.aoeAttack(ctx);
											//comboMeter += .25;
											//scoreCounter += e.score;
											//damageCounter += .5;
											//specialCounter ++;
											//t.frameIndexDie = 0;
										}
									}
									ctx.drawImage(tank,t.frameIndexDie*64,64*20,64,64,x,y,e.spriteSize,e.spriteSize);
								}
							}
						// BULLET/ARROW ANIMATIONS*****************************************************
							if(e.enemyType == "bullet"){
								ctx.save();
								ctx.translate(e.location.x,e.location.y);
								//ctx.translate(21.5,6.5);
								ctx.rotate(e.arrowAngle);
								ctx.drawImage(arrow,-21.5,-6.5);
								ctx.restore();
							}
					}
					if(displayHitCircles){
						enemies[a].draw(ctx);
					}
				}
			}
		}
		// DISPLAY ENEMY HEALTH
		function drawEnemyHealth(){
			for(var i = enemies.length - 1; i >= 0; i--){
				var e = enemies[i];
				var width = 30;
				if(e.enemyState == "alive" && e.enemyType != "bullet"){
						var health = (e.health*width)/e.maxHealth;
						if(health <= 0) health = 0;
						ctx.save();
						ctx.fillStyle = "red";
						ctx.fillRect(e.location.x-(width/2),e.location.y-e.radius-15,width,6);
						ctx.fillStyle = "green";
						ctx.fillRect(e.location.x - (width/2),e.location.y - e.radius - 15,health,6);
						ctx.restore();
				}
			}
		}












		// CALCULATIONS & COLLISIONS**************************************************************
		function calculateAttack(){
			var vx1 = Math.round(mouse.x - p.x);
			var vy1 = Math.round(p.y - mouse.y);
			var vec2 = {x:30,y:0};

			// get magnitude of vector
			var mag = Math.round(Math.sqrt((Math.pow(vx1,2)+Math.pow(vy1,2))));
			// normalize the vector
			var vec = {x:vx1/mag, y:vy1/mag};
			// adjust vector length based on attack radius
			//vec = {x:vx1*ATTACK_RADIUS, y:vy1*ATTACK_RADIUS};
			vec.x*=ATTACK_DIST;
			vec.y*=ATTACK_DIST;
			if(vec.x >= 0 && vec.y >= 0 || vec.x < 0 && vec.y < 0){
				attackCoordX = p.x+vec.x;
				attackCoordY = p.y-vec.y;
			}
			else if(vec.x < 0 && vec.y >= 0 || vec.x >= 0 && vec.y < 0){
				attackCoordX = p.x+vec.x;
				attackCoordY = p.y-vec.y;
			}

			dotProd = dotProduct(vec,vec2);
			if(vec.x < 0 && vec.y < 0){
					dotProd = Math.PI*2 - dotProd;
				}
				// if click is in the 1st quadrant
				else if(vec.x > 0 && vec.y < 0){
					dotProd = Math.PI*2 - dotProd;
				}
				// otherwise mouseX and mouseY are either in the 3rd or 4th quadrant
				else{
					dotProd = dotProd;
				}
			//console.log(dotProd);

		}
		function checkEnemyAttacks(e){
			// distance formula
			var xs = 0;
			var ys = 0;

			xs = e.eAttackCoordX - p.x;
			xs = xs * xs;

			ys = e.eAttackCoordY - p.y;
			ys = ys * ys;

			var dist = Math.sqrt( xs + ys );
			//console.log(dist);
			//console.log(p.radius + e.attackRadius);
			if(dist <= p.radius + e.attackRadius){
				var enemyType = e.enemytype;
				var damage = 0;
				damage = e.damage;
				p.health -= damage;
				//comboMeter = 1
			}
		}
		function checkSwordCollisions(){

			if(p.state == PLAYER_STATE_ATTACK){
				for(var i = 0;i < enemies.length; i++){
					var e = enemies[i];
					var dist = distance(attackCoordX,attackCoordY,e);
					if(dist < ATTACK_RADIUS + e.radius){
						if(e.enemyState == "alive" && e.enemyCombatState != "fallen"){
								//e.enemyState = "alive";
								//pickUpSoundEffect.volume = .08;
								//pickUpSoundEffect.play();
								e.health -= p.damage;
								e.enemyCombatState = "knockBack";
								e.maxSpeed = e.knockBackDist + attackKnockBack;
								/*
								if(e.enemyType == "trash"){
									e.health -= p.damage;
									e.enemyCombatState = "knockBack";
									e.maxSpeed = e.knockBackDist + attackKnockBack;
									//scoreCounter += 1;

								}
								else if(e.enemyType == "rusher"){
									e.health -= p.damage;
									e.enemyCombatState = "knockBack";
									e.maxSpeed = e.knockBackDist + attackKnockBack;
									//healthCounter += 1;
									//scoreCounter += 1.5;

								}
								else if(e.enemyType == "spawner"){
									e.health -= p.damage;
									e.enemyCombatState = "knockBack";
									e.maxSpeed = e.knockBackDist + attackKnockBack;
									//scoreCounter += 2;

								}
								else if(e.enemyType == "ranger"){
									e.health -= p.damage;
									e.enemyCombatState = "knockBack";
									//e.animation.tickCount = 0;
									e.maxSpeed = e.knockBackDist + attackKnockBack;

								}
								else if( e.enemyType == "tank"){
									e.health -= p.damage;
									e.enemyCombatState = "knockBack";
									//e.animation.tickCount = 0;
									e.maxSpeed = e.knockBackDist + attackKnockBack;
//******************************************************************************************************************************************************
								//function that increases the tanks strength as it takes damage
									//e.growingStrength();
									//e.knockback(e.velocity);

									//specialCounter += 1;
								}
								else if( e.enemyType == "flocker"){
									e.health -= p.damage;
									e.enemyCombatState = "knockBack";
									e.maxSpeed = e.knockBackDist + attackKnockBack;
									//comboMeter += .25;
									//damageCounter += .25;
								}
								*/
//*******************************************************************************BUG**************************************************************************
								//combo meter wasn't increasing when enemies died so it now increases when they are hit by the sword
								//adjusted the actual gain way down to compensate
								//comboMeter += .05;
						}


					}
				}
			}
		}
		function calculateEnemyAttacks(){
			for(var i = enemies.length - 1; i >=0; i--){
				var e = enemies[i];
				if(e.enemyState == "alive"){
						var vx1 = Math.round(p.x - e.location.x);
						var vy1 = Math.round(e.location.y - p.y);
						var vec2 = {x:e.location.x + 30,y:0};

						// get magnitude of vector
						var mag = Math.round(Math.sqrt((Math.pow(vx1,2)+Math.pow(vy1,2))));
						// normalize the vector
						var vec = {x:vx1/mag, y:vy1/mag};

						// adjust vector length based on attack radius
						//vec = {x:vx1*ATTACK_RADIUS, y:vy1*ATTACK_RADIUS};
						vec.x*=e.attackDist;
						vec.y*=e.attackDist;

						//var eAttackCoordX = e.location.x + vec.x;
						//var eAttackCoordY = e.location.y + vec.y;

						if(vec.x >= 0 && vec.y >= 0 || vec.x < 0 && vec.y < 0){
							e.eAttackCoordX = e.location.x+vec.x;
							e.eAttackCoordY = e.location.y-vec.y;
						}
						else if(vec.x < 0 && vec.y >= 0 || vec.x >= 0 && vec.y < 0){
							e.eAttackCoordX = e.location.x+vec.x;
							e.eAttackCoordY = e.location.y-vec.y;
						}
				}
			}
		}
		function checkPlayerEnemyCollisions(){
			for( var i = enemies.length - 1; i >=0; i--){
				var e = enemies[i];
				if(e.enemyState == "alive" && e.enemyType == "bullet"){
					if( circlesIntersect2(e,p)){

							p.health -= e.damage;
					}
				}
			}
		}

		function calculateScore(){
			if(deathCounter > 0){
				comboCounter++
				if(comboCounter >= comboTimer){
					var score = deathCounter*(deathCounter*scorePerKill);
					//draw combo feedback
					if(deathCounter >= 2) sendComboFeedback(deathCounter,score);
					scoreCounter += score; // add score from kills to total score.
					//console.log("score: "+scoreCounter+ ", enemy kills: "+deathCounter);
					deathCounter = 0;
					comboCounter = 0;

				}
			}
		}










		// HUD Functions**************************************************************************
		function drawHUD(){

			if(showHealthStam){
				drawText("HP", 40,30,40,"white", 'retroText');
				drawHealthBar(80,13,300,PLAYER_HEALTH);
				drawStaminaBar(80,53,300);
			}

			//drawSpecialBar();
				if(tutorialOver < 3) p.stamina = PLAYER_STAMINA;// infinite stamina...for now

			if(gameState == GAME_STATE_START){
				ctx.save();
				// TEXT
				ctx.textAlign = "center";
				ctx.textBaseline = "middle";

				// TUTORIAL / ONBOARDING
				// Initialize Tutorial? Y/N
				if(tutorialOver == 0){
					drawText("COMBO-SMASH!", CANVAS_WIDTH/2, 120, 80, "white", 'retroText');
					drawText("Would you like a quick tutorial before playing?", CANVAS_WIDTH/2,CANVAS_HEIGHT/2 + 170, 30, "#FFD700", 'myFont');
					drawText("Yes 'Y' or No 'N'",CANVAS_WIDTH/2, CANVAS_HEIGHT/2 + 220, 20, "#FFD700", 'myFont');
				}
				// Moving
				if(tutorialOver == 1){
					drawText("Use the 'W, S, A, D' keys to move the player.", CANVAS_WIDTH/2,CANVAS_HEIGHT/2 + 170, 30, "#FFD700", 'myFont');
					drawText("(Press 'Enter' to continue)",CANVAS_WIDTH/2, CANVAS_HEIGHT/2 + 220, 20, "#FFD700", 'myFont');
				}
				// Attacking
				else if(tutorialOver == 2){
					drawText("Left clicking causes the player to attack. The player's attack is aimed ", CANVAS_WIDTH/2,CANVAS_HEIGHT/2 + 170, 30, "#FFD700", 'myFont');
					drawText("depending on the cicked location in relationship to the player.",CANVAS_WIDTH/2,CANVAS_HEIGHT/2 + 210, 30, "#FFD700", 'myFont');
					drawText("(Press 'Enter' to continue)",CANVAS_WIDTH/2, CANVAS_HEIGHT/2 + 260, 20, "#FFD700", 'myFont');
				}
				// Health + Stamina
				else if(tutorialOver == 3){
					showHealthStam = true;
					drawText("The player's health (green bar) and stamina (yellow bar) are displayed above.", CANVAS_WIDTH/2,CANVAS_HEIGHT/2 + 170, 30, "#FFD700", 'myFont');
					drawText("(Press 'Enter' to continue)",CANVAS_WIDTH/2, CANVAS_HEIGHT/2 + 220, 20, "#FFD700", 'myFont');
				}
				//Stamina
				else if(tutorialOver == 4){
					drawText("Stamina is depleted everytime the player swings their weapon.", CANVAS_WIDTH/2,CANVAS_HEIGHT/2 + 170, 30, "#FFD700", 'myFont');
					drawText("(Press 'Enter' to continue)",CANVAS_WIDTH/2, CANVAS_HEIGHT/2 + 220, 20, "#FFD700", 'myFont');
				}
				// Enemies
				else if( tutorialOver == 5){
					drawText("Monsters come in hordes and will try to kill you.", CANVAS_WIDTH/2,CANVAS_HEIGHT/2 + 170, 30, "#FFD700", 'myFont');
					drawText("(Kill the orc to continue)",CANVAS_WIDTH/2, CANVAS_HEIGHT/2 + 220, 20, "#FFD700", 'myFont');

					makeEnemy(); // spawn idle orc

					if(enemies[0].enemyState == "dead")tutorialOver++; // advance tutorial when orc is killed.
				}
				// Objective & Play Game
				else if(tutorialOver == 6){
					drawText("Survive as long as possible by killing the enemy monsters.",CANVAS_WIDTH/2,CANVAS_HEIGHT/2 + 170, 30, "#FFD700", 'myFont');
					drawText("Good Luck.",CANVAS_WIDTH/2,CANVAS_HEIGHT/2 + 210, 30, "#FFD700", 'myFont');
					drawText("(Press 'Enter' to play the game)",CANVAS_WIDTH/2, CANVAS_HEIGHT/2 + 260, 20, "#FFD700", 'myFont');
				}
				//drawText(Math.floor(totalScore), CANVAS_WIDTH - 100, 50, 60, "white");
				ctx.restore();
			}
			if(gameState == GAME_STATE_PLAY){
				// SCORE, HORDE TIMER, & HORDE LEVEL
				ctx.save();
				ctx.textAlign = "left";
				drawText("Incoming Horde: "+waveTimer, CANVAS_WIDTH/2-100,25, 20, "white", 'retroText');
				drawText("Horde Lvl: "+waveCounter, CANVAS_WIDTH/2+140,25,20,"white", 'retroText');
				//ctx.fillText("Horde Level: "+wave, CANVAS_WIDTH/2+100,60);

				drawText(Math.floor(scoreCounter), CANVAS_WIDTH - 130, 80, 60, "white", 'retroText');
				ctx.restore();
			}
			if(gameState == GAME_STATE_END){
				ctx.save();
				ctx.fillStyle = "black";
				ctx.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
				ctx.textAlign = "center";
				ctx.textBaseline = "middle";
				drawText("GAME OVER",CANVAS_WIDTH/2, CANVAS_HEIGHT/2-150, 80, "white", 'retroText');
				drawText("Horde Lvl: "+waveCounter,CANVAS_WIDTH/2,CANVAS_HEIGHT/2 - 65, 40,"white", 'retroText');
				drawText("Score: "+scoreCounter,CANVAS_WIDTH/2,CANVAS_HEIGHT/2, 40,"white", 'retroText');

				drawText("(Press 'Enter' to continue)",CANVAS_WIDTH/2, CANVAS_HEIGHT/2+220, 20, "#FFD700", 'myFont');
				ctx.restore();
			}
			if(gameState == GAME_STATE_HIGH_SCORES){
				ctx.save();
				ctx.fillStyle = "black";
				ctx.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
				ctx.textAlign = "center";
				ctx.textBaseline = "middle";
				drawText("HIGH SCORES",CANVAS_WIDTH/2, 80, 50, "white", 'retroText');
					for(var i = 0; i<10; i++){
						var s = i+1;
						drawText(s+") "+newScores[i],CANVAS_WIDTH/2, 150+(i*35), 24, "white", 'retroText');
					}
				drawText("(Press 'Enter' to play again)",CANVAS_WIDTH/2, CANVAS_HEIGHT/2+220, 20, "#FFD700", 'myFont');
				ctx.restore();
			}

		}

			// More HUD Functions
			function nextWaveTimer(gameState){
				if(gameState == GAME_STATE_PLAY && paused == false){
					waveTimer -= 1;
					if(waveTimer <- 0){
							waveTimer = WAVE_TIMER; // reset spawn timer
							waveCounter ++; // counts up by 1 for every enemy wave
							makeEnemies(); //create new enemy wave
					}
				}
			}



			/*			//new store stuff
			if(gameState == GAME_STATE_STORE){
			ctx.save();
				ctx.fillStyle = "#009999";
				ctx.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
				drawText("Welcome To the Store",CANVAS_WIDTH/2, CANVAS_HEIGHT - CANVAS_HEIGHT + 10, 20, "white");
				drawText("Score: " + totalScore,CANVAS_WIDTH/2,CANVAS_HEIGHT - CANVAS_HEIGHT + 30,20,"white");
				ctx.restore();
				drawText("Increase maximum combo meter +1",830, 130, 20, "white");
				drawText("Cost: "+comboUpgradeCost,830, 155, 20, "white");
				drawText("Increase maximum health +10",490, 130, 20, "white");
				drawText("Cost: "+healthUpgredeCost,490, 155, 20, "white");
				drawText("Unlock unlimited stamina special",150, 260, 20, "white");
				drawText("Cost: "+unlimitedStamCost,150, 285, 20, "white");
				drawText("Unlock invincibilty special",490, 260, 20, "white");
				drawText("Cost: "+invincibiltyCost,490, 285, 20, "white");
				drawText("Unlock heal special",150, 390, 20, "white");
				drawText("Cost: "+ healCost,150, 415, 20, "white");
				drawText("Unlock super damage special",490, 390, 20, "white");
				drawText("Cost: "+ damageCost,490, 415, 20, "white");
				drawText("Increase maximum stamina + 10",150, 130, 20, "white");
				drawText("Cost: "+ staminaStoreCost,150, 155, 20, "white");
				drawText("Unlock dagger weapon",830, 260, 20, "white");
				drawText("Cost: "+ daggerCost,830, 285, 20, "white");
				drawText("Unlock greatsword weapon",830, 390, 20, "white");
				drawText("Cost: "+ daggerCost,830, 415, 20, "white");
				drawText("Equip longsword",490, 520, 20, "white");
				drawText("Cost: "+ longSwordCost,490, 545, 20, "white");

				ctx.save();
				ctx.translate(-135, 140);
				ctx.rotate(Math.PI / -4);
				drawText(equipText,eX, eY, 20, "white");
				ctx.restore();

				ctx.save();
				ctx.translate(-135, 140);
				ctx.rotate(Math.PI / -4);
				drawText(wequipText,wEX, wEY, 20, "red");
				ctx.restore();

				//loops through buttons array and draws buttons
				for(var i = 0; i <buttons.length; i++){
					var b = buttons[i];
					ctx.fillStyle = b.color;
					ctx.beginPath();
					ctx.arc(b.x,b.y,b.r,0,Math.PI*2,false);
					ctx.closePath();
					ctx.fill();
			}

			}*/

		// HEALTH Bar
		function drawHealthBar(x,y,width,maxHP){
			ctx.lineWidth = 1;
			ctx.strokeStyle="white";
			ctx.strokeRect(x,y,width,35);
			if(p.health <= 0){
				p.health = 0;
				p.state = PLAYER_STATE_DEAD;
				//if(gameState == GAME_STATE_END){
				//	p.health += 1;
				//}
			}
			if(p.health > maxHP){
				var health = (maxHP*width)/maxHP;
			}else{
				var health = (p.health*width)/maxHP;
			}
			ctx.fillStyle = "red";
			ctx.fillRect(x,y,width,35);
			ctx.fillStyle = "green";
			ctx.fillRect(x,y,health,35);
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			drawText((Math.round(p.health)/10)*10+" %",x+(width/2),y+(35/2),25,"white", 'retroText');
		}
		// SPECIAL Bar
		function drawSpecialBar(){
			var inc = 150/fullSpecial;
			var meter = specialCounter*inc;
			ctx.fillStyle = "black";
			ctx.fillRect(20,10,150,35);
			ctx.fillStyle = "purple";
			if(meter >= 150) meter = 100;
			ctx.fillRect(20,10,meter,35);
		}
		// STAMINA Bar
		function drawStaminaBar(x,y,width){
			if(p.stamina >= PLAYER_STAMINA){
				p.stamina = PLAYER_STAMINA;
			}
			else if(p.stamina < 0){
				p.stamina = 0;
			}
			else{
				p.stamina += stamRegen;
			}
			ctx.lineWidth = 1;
			ctx.strokeStyle="white";
			ctx.strokeRect(x,y,width,12);
			ctx.fillStyle = "red";
			ctx.fillRect(x,y,(PLAYER_STAMINA*width)/PLAYER_STAMINA,12);
			ctx.fillStyle = "yellow";
			ctx.fillRect(x,y,(p.stamina*width)/PLAYER_STAMINA,12);
		}


		/*
		function drawComboUI(){
			//Draws the combo meter and counters on screen
			drawText("Combo:" + Math.floor(comboMeter) + "X",60,170,20,"white");
			drawText("Score:" + Math.floor(scoreCounter),60,200,20,"white");
			drawText("Health:" + Math.floor(healthCounter),60,230,20,"white");
			drawText("Stamina:" + Math.floor(staminaCounter),60,260,20,"white");
			drawText("Damage:" + Math.floor(damageCounter),60,290,20,"white");

			if(comboMeter >= comboMeterMax){
				comboMeter = comboMeterMax;
			}
		}
		*/




		// MISC. Functions************************************************************************
		//If a button is clicked, the store upgrade is used
		/*function buttonClicked(button){
			if(button.ID == "Combo" && totalScore >= comboUpgradeCost){
				totalScore -= comboUpgradeCost;
				if(totalScore <= 0){
					totalScore = 0;
				}
				comboMeterMax += 1;
				comboUpgradeCost += 100 * 5;

			}
			else if( button.ID == "Health" && totalScore >= healthUpgredeCost){
				totalScore -= healthUpgredeCost;
				if(totalScore <= 0){
					totalScore = 0;
				}
				playerMaxHealth += 10;
				PLAYER_HEALTH += 10;

				p.health += 10;
				healthUpgredeCost += 10 * 10;
			}
			else if( button.ID == "Stamina" && totalScore >= unlimitedStamCost){
				equippedSpecial = unlimitedStam;
				totalScore -= unlimitedStamCost;
				unlimitedStamCost = 0;

				eX = 120;
				eY = 230;
			}
			else if( button.ID == "Invincibilty" && totalScore >= invincibiltyCost){
				equippedSpecial = invincibilty;
				totalScore -= invincibiltyCost;
				invincibiltyCost = 0;
				eX = 370;
				eY = 460;

			}
			else if( button.ID == "heal" && totalScore >= healCost){
				equippedSpecial = heal;
				totalScore -= healCost;
				healCost = 0;
				eX = 25;
				eY = 315;
			}
			else if( button.ID == "damageBuff" && totalScore >= damageCost){
				totalScore -= damageCost;
				equippedSpecial = damageBuff;
				damageCost = 0;
				eX = 260;
				eY = 555;

			}

			else if(button.ID == "stamIncrease" &&  totalScore >= staminaStoreCost){
				totalScore -= staminaStoreCost;
				if(totalScore <= 0){
					totalScore = 0;
				}
				PLAYER_STAMINA += 10;
				staminaStoreCost += 200 * 10;

			}

			else if(button.ID == "dagger" && totalScore >= daggerCost){
				totalScore -= daggerCost;
				equippedWeapon = dagger;
				daggerCost = 0;
				wEX = 600;
				wEY = 715;

			}

			else if(button.ID == "greatSword" && totalScore >= greatSwordCost){
				totalScore -= greatSwordCost;
				equippedWeapon = greatSword;
				greatSwordCost = 0;
				wEX = 510;
				wEY = 795;
			}

			else if(button.ID == "longSword" && totalScore >= longSwordCost){
				equippedWeapon = longSword;
				wEX = 185;
				wEY = 655;

			}


		}*/
		//function doTutorial(){
		//console.log(tutorialOver);
		//	if(tutorialOver == 5){
		//		gameState = GAME_STATE_PLAY;
		//	}
		//}

		//Finds if the mouse is clicked inside a circle
		function mouseInsideButton(x,y,I){
			var dx = x - I.x;
			var dy = y - I.y;
			return dx * dx + dy * dy  <= I.r * I.r;

		}
		//If a button is clicked, the store upgrade is used
		/*function buttonClicked(button){
			if(button.ID == "Combo" && totalScore >= comboUpgradeCost){
				totalScore -= comboUpgradeCost;
				if(totalScore <= 0){
					totalScore = 0;
				}
				comboMeterMax += 5;
				comboUpgradeCost += 5;

			}
			else if( button.ID == "Health" && totalScore >= healthUpgredeCost){
				totalScore -= healthUpgredeCost;
				if(totalScore <= 0){
					totalScore = 0;
				}
				playerMaxHealth += 10
				PLAYER_HEALTH += 10;
				//*******************************************************************************BUG FIX************************************************************************
				//not really a bug but upgrading the health wouldnt update the health bar when the player started playing again
				//now it should update
				p.health += 10;
				healthUpgredeCost += 10;
			}
			else if( button.ID == "Stamina" && totalScore >= unlimitedStamCost){
				equippedSpecial = unlimitedStam;
				unlimitedStamCost = 0;

				eX = 120;
				eY = 230;
			}
			else if( button.ID == "Invincibilty" && totalScore >= invincibiltyCost){
				equippedSpecial = invincibilty;
				invincibiltyCost = 0;
				eX = 370;
				eY = 460;

			}
			else if( button.ID == "heal" && totalScore >= healCost){
				equippedSpecial = heal;
				healCost = 0;
				eX = 25;
				eY = 315;
			}
			else if( button.ID == "damageBuff" && totalScore >= damageCost){
				equippedSpecial = damageBuff;
				damageCost = 0;
				eX = 260;
				eY = 555;

			}


		}

		function findMouseCoor(e){
			var mouse = getMouse(e);
			for(var i = buttons.length - 1; i >= 0; i--){
				var b = buttons[i];
				if(mouseInsideButton(mouse.x,mouse.y,b)){
					if(gameState == GAME_STATE_STORE){
						buttonClicked(b);
					}

				}
			}
		}*/
		//Finds if the mouse is clicked inside a circle
		function mouseInsideButton(x,y,I){
			var dx = x - I.x;
			var dy = y - I.y;
			return dx * dx + dy * dy  <= I.r * I.r;

		}
		function makeEnemy(){
			if(enemies.length < 1){
				var enemy = new Enemy(320,345,"trash");
				//var enemy2 = new Enemy(410,155,"trash");
				//var enemy3 = new Enemy(550,115,"trash");
				//var enemy4 = new Enemy(600,375,"spawner");
				//var enemy5 = new Enemy(320,300,"rusher");
				//var enemy6 = new Enemy(700,320,"ranger");
				//var enemy7 = new Enemy(400,115,"ranger");
				//var enemy8 = new Enemy(420,115,"ranger");
				//var enemy9 = new Enemy(440,315,"tank");

				enemies.push(enemy);
				//enemies.push(enemy2);
				//enemies.push(enemy3);
				//enemies.push(enemy4);
				//enemies.push(enemy5);
				//enemies.push(enemy6);
				//enemies.push(enemy7);
				//enemies.push(enemy8);
				//enemies.push(enemy9);

			}

		}
		function storeScores(s){
			// grab the array of scores from localStorage and store them in an scores array
			var scores = JSON.parse(localStorage.getItem("scores"));
			// if scores haven't been stored yet, set all highscores to zero
			if(scores === null || scores === undefined) scores = hs;
				// add latest score to the scores array
				scores.push(s);
				// clear the localStorage
				localStorage.clear();
				// sort the scores array by descending numerical value
				scores.sort(function(a,b){return b-a});
				// delete the 11th score in the array
				scores.splice(10,1);
			// the scores are now updated and set back in localStorage
			newScores = scores;
			localStorage.setItem("scores",JSON.stringify(newScores));
		}
	function reset(){
			gameState = GAME_STATE_START;
			waveTimer = WAVE_TIMER;
			waveCounter = 0;
			tutorialOver = 0;
			comboFeedback = [];

			//totalScore = 0;
			//specialCounter = 0;
			scoreCounter = 0;
			//comboTextCounter = 0;
			//staminaCounter = 0;
			//healthCounter = 0;
			PLAYER_SPEED = 150;
			alpha = 1; // alpha level of black background during tutorial
			//ATTACK_RADIUS = 50;
			waveTimer = WAVE_TIMER;
			p.state = PLAYER_STATE_NORMAL
			PLAYER_HEALTH = playerMaxHealth;
			p.health = playerMaxHealth;
			p.stamina = PLAYER_STAMINA;
			p.speed = PLAYER_SPEED;
			lastFrame = "up";
			p.x = CANVAS_WIDTH/2;
			p.y = CANVAS_HEIGHT/2;
			enemies = [];
			showHealthStam = false;
			//makeTutorial();


		}
		function calculateDeltaTime(){
		// what's with the (+ new Date) below?
		// + calls Date.valueOf(), which converts it from an object to a
		// primitive (number of miliseconds since January 1, 1970 local time)
			var now,fps;
			now = (+new Date);
			fps = 1000/(now-lastTime);
			fps = clamp(fps, 12,60);
			lastTime = now; //lastTime is a global
			return 1/fps;
		}

		function backgroundTransition(){
			ctx.fillStyle = "rgba(0,0,0,"+alpha+")";
			ctx.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
			if(tutorialOver >= 7) alpha -= .005;
		}
		function drawPauseScreen(){
			ctx.save();
			ctx.fillStyle = "black";
			ctx.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			drawText("... Paused ...",CANVAS_WIDTH/2, CANVAS_HEIGHT/2, 70, "white", 'retroText');
			ctx.restore();
		}
		// Tracks the location of the mouse
		function updateMouse(e){
				//mouse.x = e.pageX - e.target.offsetLeft;
				//mouse.y = e.pageY - e.target.offsetTop;
				var pos = getMousePos(canvas, e);
				mouse.x = pos.x;
				mouse.y = pos.y;
		}

		function checkLS(){
			if(lsClearFeedback){
					ctx.save();
					ctx.textAlign = "left";
					drawText("High Scores - Cleared", 20,CANVAS_HEIGHT-100,20,"white", 'myFont');
					ctx.restore();
					notificationCounter ++;
					if(notificationCounter >= notificationTimer){
						lsClearFeedback = false;
						notificationCounter = 0;
					}
			}
		}

		/*_______________________Text Functions_______________________*/
		function drawText(string, x, y, size, color, font){
			ctx.font = size+'px '+font;
			ctx.fillStyle = color;
			ctx.fillText(string, x, y);
		}
		function sendComboFeedback(comboKills,comboPoints){
			var comboText = {combo:comboKills, points:comboPoints, moveTextY:30, textAlpha:1, comboTextCounter:0, comboTextTimer: 140};
			comboFeedback.push(comboText);

		}
		function drawComboFeedback(){

			for(var i = 0; i < comboFeedback.length; i++){
				var c = comboFeedback[i];

				ctx.font = '18px retroText';
				// if combo is greater than 3 change color, else it remains white.
				ctx.fillStyle = "rgba(250,250,250,"+c.textAlpha+")";
				if(c.combo > 3) ctx.fillStyle = "rgba(255,196,71,"+c.textAlpha+")";
				if(c.combo > 6) ctx.fillStyle = "rgba(273,178,255,"+c.textAlpha+")";
				if(c.combo > 12) ctx.fillStyle = "rgba(255,127,127,"+c.textAlpha+")";

				if(gameState == GAME_STATE_END) return; // exit function if game ends before combo is drawn.
				ctx.fillText(c.combo+ "X COMBO, "+c.points+"pts!" , p.x, p.y - c.moveTextY);
				//fade and move text
				c.moveTextY += .65;
				c.textAlpha -= .005;
				c.comboTextCounter ++;

				if(c.comboTextCounter >= c.comboTextTimer){
					comboFeedback.splice(i,1);
				}
			}
			/*
			var ypos = moveTextY + 30;
			ctx.font = 'bold 12px retroText';
			ctx.fillStyle = "rgba(250,250,250,"+textAlpha+")";
			ctx.fillText(combo+ "x COMBO, "+points+"pts!" , p.x, p.y - ypos);
			moveTextY += .15;
			textAlpha -= .005;
			comboTextCounter ++;
					if(comboTextCounter >= comboTextTimer){
						comboTextCounter = 0;
						textAlpha = 1;
						moveTextY = 0;
					}
					*/
		}

	}())
