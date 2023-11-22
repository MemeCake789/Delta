//// REFRENCE -  https://codepen.io/lilgreenland/pen/ozqwJJ
//
//"use strict";
///* TODO:  **************************************************************
//make a graphics that looks like the player has (loose wires / a tail / a rope) to indicate player motion
//
//draw images on top of bodies
//  make an svg convert to png and add it to canvas
//  add a foreground layer for shadows and lights stuff in front of player
//
//player interaction
//  portals
//    need to find a way to fire the portals at locations
//      use raycasting in matter.js
//      they could only interact with statics
//  gun
//    you'd have to add bad guys too of course...
//  super mario sunshine
//    turn bullets into a stream of water that propels player
//    seems uninteresting
//    
//game mechanics
//  mechanics that support the physics engine
//    add rope/constraint
//  store/spawn bodies in player (like starfall)
//  get ideas from game: limbo / inside
//  environmental hazards
//    laser
//    lava
//  button / switch
//  door
//  fizzler
//  moving platform
//  map zones
//    water
//    low friction ground
//    bouncy ground
// 
// physics puzzle mechanics
//  move a block over and jump on it to get over a wall
//  drop some weight on a suspended nonrotating block to lower it and remove a blockage
//  knock over a very tall plank to clear a wide gap
// 
// give each foot a sensor to check for ground collisions
//  feet with not go into the ground even on slanted ground
//  this might be not worth it, but it might look really cool
//
//track foot positions with velocity better as the player walks/crouch/runs
//
//track what body the player is standing on
//  when player jumps/moves apply an opposite force on that body
//  leg animation should be relative to the velocity of the body player is on
//
//only allow jumping if the player body has collided with something
//
//try switching back to static and kinetic friction and keeping air friction constant
//  find a way to onyl have friction on the ground, other wise player drags on edges.
//  maybe only have static friction when the player keys aren't pressed?
//
//FIX************************************************************
//
//when body sleeping is on:
//  sometimes the jump sensor gets stuck on and lets player jump on air
//    try resetting mech.onGround every cycle
//
//pause in matter isn't working/possible??
//  slowing time down makes all the bodies bounce around.
//
//holding a body with a constraint pushes on other bodies too easily
//  mostly fixed by capping the mass of what player can hold
//
//*/
//
////set up canvas
//const canvas = document.getElementById('canvas');
//const ctx = canvas.getContext("2d");
//
//function setupCanvas() {
//  canvas.width = window.innerWidth;
//  canvas.height = window.innerHeight;
//  ctx.font = "17px Arial";
//  ctx.lineJoin = 'round';
//  ctx.lineCap = "round";
//}
//setupCanvas();
//window.onresize = function() {
//  setupCanvas();
//};
//
//// pointer lock object forking for cross browser
//
//canvas.requestPointerLock = canvas.requestPointerLock ||
//                            canvas.mozRequestPointerLock;
//
//document.exitPointerLock = document.exitPointerLock ||
//                           document.mozExitPointerLock;
//
//canvas.onclick = function() {
//  canvas.requestPointerLock();
//};
//
//
//
////mouse move input
//window.onmousemove = function(e) {
//  mech.getMousePos(e.clientX, e.clientY);
//};
////mouse click input
//
////keyboard input
//const keys = [];
//document.body.addEventListener("keyup", function(e) {
//  keys[e.keyCode] = false;
//});
//document.body.addEventListener("keydown", function(e) {
//  keys[e.keyCode] = true;
//  if (keys[84]) { //t = testing mode
//    if (game.testing) {
//      game.testing = false;
//    } else {
//      game.testing = true;
//    }
//  }
//});
//
//const stats = new Stats(); //setup stats library to show FPS
//stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
////stats.domElement.style.opacity   = '0.5'
//
//// game Object Prototype *********************************************
////*********************************************************************
//const gameProto = function() {
//  this.testing = false; //testing mode: shows wireframe and some variables
//  //time related vars and methods
//  this.mouseDown = false;
//  this.cycle = 0;
//  this.lastTimeStamp = 0; //tracks time stamps for measuing delta
//  this.delta = 0; //measures how slow the engine is running compared to 60fps
//  this.timing = function() {
//    this.cycle++; //tracks game cycles
//    //delta is used to adjust forces on game slow down;
//    this.delta = (engine.timing.timestamp - this.lastTimeStamp) / 16.666666666666;
//    this.lastTimeStamp = engine.timing.timestamp; //track last engine timestamp
//  }
//  this.yDeath = 4000;
//}
//const game = new gameProto();
//
//// player Object Prototype *********************************************
////*********************************************************************
//const mechProto = function() {
//  this.width = 50;
//  this.radius = 30;
//  this.stroke = "#333";
//  this.fill = "#eee";
//  this.height = 42;
//  this.yOffWhen = {
//    crouch: 22,
//    stand: 49,
//    jump: 70
//  }
//  this.yOff = 70;
//  this.yOffGoal = 70;
//  this.onGround = false; //checks if on ground or in air
//  this.numTouching = 0;
//  this.crouch = false;
//  this.isHeadClear = true;
//  this.spawnPos = {
//    x: 675,
//    y: 750
//  };
//  this.spawnVel = {
//    x: 0,
//    y: 0
//  };
//  this.x = this.spawnPos.x;
//  this.y = this.spawnPos.y;
//  this.Sy = this.y; //adds a smoothing effect to vertical only
//  this.Vx = 0;
//  this.VxMax = 7;
//  this.VxMaxAir = 2;
//  this.Vy = 0;
//  this.mass = 5;
//  this.Fx = 0.004 * this.mass; //run Force on ground
//  this.FxAir = 0.0006 * this.mass; //run Force in Air
//  this.Fy = -0.04 * this.mass; //jump Force
//  this.angle = 0;
//  this.walk_cycle = 0;
//  this.stepSize = 0;
//  this.flipLegs = -1;
//  this.hip = {
//    x: 12,
//    y: 24,
//  };
//  this.knee = {
//    x: 0,
//    y: 0,
//    x2: 0,
//    y2: 0
//  };
//  this.foot = {
//    x: 0,
//    y: 0
//  };
//  this.legLength1 = 55;
//  this.legLength2 = 45;
//  this.canvasX = canvas.width / 2;
//  this.canvasY = canvas.height / 2;
//  this.transX = this.canvasX - this.x;
//  this.transY = this.canvasX - this.x;
//  this.mouse = {
//    x: canvas.width / 3,
//    y: canvas.height
//  };
//  this.getMousePos = function(x, y) {
//    this.mouse.x = x;
//    this.mouse.y = y;
//  };
//  this.testingMoveLook = function() {
//    //move    
//    //player.force.y += -engine.world.gravity.y / 200;  //antigravity???
//    this.x = player.position.x;
//    this.y = playerBody.position.y - this.yOff;
//    this.Vx = player.velocity.x;
//    this.Vy = player.velocity.y;
//    //look
//    this.canvasX = canvas.width / 2
//    this.canvasY = canvas.height / 2
//    this.transX = this.canvasX - this.x;
//    this.transY = this.canvasY - this.y;
//    this.angle = Math.atan2(this.mouse.y - this.canvasY, this.mouse.x - this.canvasX);
//  }
//
//  this.move = function() {
//    this.x = player.position.x;
//    //looking at player body, to ignore the other parts of the player composite
//    this.y = playerBody.position.y - this.yOff;
//    this.Vx = player.velocity.x;
//    this.Vy = player.velocity.y;
//  };
//  this.look = function() {
//    //set a max on mouse look
//    let mX = this.mouse.x;
//    if (mX > canvas.width * 0.8) {
//      mX = canvas.width * 0.8;
//    } else if (mX < canvas.width * 0.2) {
//      mX = canvas.width * 0.2;
//    }
//    let mY = this.mouse.y;
//    if (mY > canvas.height * 0.8) {
//      mY = canvas.height * 0.8;
//    } else if (mY < canvas.height * 0.2) {
//      mY = canvas.height * 0.2;
//    }
//    //set mouse look
//    this.canvasX = this.canvasX * 0.94 + (canvas.width - mX) * 0.06;
//    this.canvasY = this.canvasY * 0.94 + (canvas.height - mY) * 0.06;
//    //set translate values
//    this.transX = this.canvasX - this.x;
//    this.Sy = 0.98 * this.Sy + 0.02 * (this.y);
//    this.transY = this.canvasY - this.Sy;
//    //make player head angled towards mouse
//    this.angle = Math.atan2(this.mouse.y - this.canvasY, this.mouse.x - this.canvasX);
//  };
//  this.doCrouch = function() {
//    if (!this.crouch) {
//      this.crouch = true;
//      player.frictionAir = 0.5;
//      this.yOffGoal = this.yOffWhen.crouch;
//      Matter.Body.translate(playerHead, {
//        x: 0,
//        y: 40
//      })
//    }
//  }
//  this.undoCrouch = function() {
//    this.crouch = false;
//    player.frictionAir = 0.12;
//    this.yOffGoal = this.yOffWhen.stand;
//    Matter.Body.translate(playerHead, {
//      x: 0,
//      y: -40
//    })
//  }
//  this.enterAir = function() {
//    if (this.crouch) {
//      this.undoCrouch();
//    }
//    this.onGround = false;
//    player.frictionAir = 0.001;
//    this.yOffGoal = this.yOffWhen.jump;
//
//  };
//  this.enterLand = function() {
//    if (this.crouch) {
//      this.undoCrouch();
//    }
//    this.onGround = true;
//    player.frictionAir = 0.12;
//    this.yOffGoal = this.yOffWhen.stand;
//  };
//  this.buttonCD_jump = 0; //cooldown for player buttons
//  this.keyMove = function() {
//    if (this.onGround) { //on ground **********************************
//      if (this.crouch) { //crouch
//        if (!(keys[40] || keys[83]) && this.isHeadClear) { //not pressing crouch anymore
//          this.undoCrouch();
//        }
//      } else if (keys[40] || keys[83]) { //on ground && not crouched and pressing s or down
//        this.doCrouch();
//      } else if ((keys[32] || keys[38] || keys[87]) && this.buttonCD_jump + 20 < game.cycle) { //jump
//        this.buttonCD_jump = game.cycle; //can't jump until 20 cycles pass
//        Matter.Body.setVelocity(player, { //zero player velocity for consistant jumps
//          x: player.velocity.x,
//          y: 0
//        });
//        player.force.y += this.Fy / game.delta; //jump force / delta so that force is the same on game slowdowns
//      }
//      //horizontal move on ground
//      if (keys[37] || keys[65]) { //left or a
//        if (player.velocity.x > -this.VxMax) {
//          player.force.x += -this.Fx / game.delta;
//        }
//      } else if (keys[39] || keys[68]) { //right or d
//        if (player.velocity.x < this.VxMax) {
//          player.force.x += this.Fx / game.delta;
//        }
//      }  //end ground section****************************
//
//    } else { // in air **********************************
//      //check for short jumps
//      if (this.buttonCD_jump + 60 > game.cycle && //just pressed jump
//        !(keys[32] || keys[38] || keys[87]) && //but not pressing jump key
//        this.Vy < 0) { // and velocity is up
//        Matter.Body.setVelocity(player, { //reduce player velocity every cycle until not true
//          x: player.velocity.x,
//          y: player.velocity.y * 0.94
//        });
//      }
//      //horizontal move in air
//      if (keys[37] || keys[65]) { // move player   left / a
//        if (player.velocity.x > -this.VxMaxAir) {
//          player.force.x += -this.FxAir / game.delta;
//        }
//      } else if (keys[39] || keys[68]) { //move player  right / d
//        if (player.velocity.x < this.VxMaxAir) {
//          player.force.x += this.FxAir / game.delta;
//        }
//      }
//    }  //end air section **************************
//    
//    if (Math.abs(this.Vx) > this.VxMax){ //extra air friction if moving too fast 
//      Matter.Body.setVelocity(player, {
//        x: player.velocity.x * 0.99,
//        y: player.velocity.y
//      });
//    }
//    //smoothly move height towards height goal
//    this.yOff = this.yOff * 0.85 + this.yOffGoal * 0.15
//  };
//  this.deathCheck = function() {
//    if (this.y > game.yDeath) { // if player is 4000px deep reset to spawn Position and Velocity
//      Matter.Body.setPosition(player, this.spawnPos);
//      Matter.Body.setVelocity(player, this.spawnVel);
//      this.dropBody();
//    }
//  };
//  this.holdKeyDown = 0;
//  this.buttonCD_hold = 0; //cooldown for player buttons
//  this.keyHold = function() { //checks for holding/dropping/picking up bodies
//    if (this.isHolding) {
//      //give the constaint more length and less stiffness if it is pulled out of position
//      const Dx = body[this.holdingBody].position.x - holdConstraint.pointA.x;
//      const Dy = body[this.holdingBody].position.y - holdConstraint.pointA.y;
//      holdConstraint.length = Math.sqrt(Dx * Dx + Dy * Dy) * 0.95;
//      holdConstraint.stiffness = -0.01 * holdConstraint.length + 1;
//      if (holdConstraint.length > 100) this.dropBody(); //drop it if the constraint gets too long
//      holdConstraint.pointA = { //set constraint position
//        x: this.x + 50 * Math.cos(this.angle), //just in front of player nose
//        y: this.y + 50 * Math.sin(this.angle)
//      };
//      if (keys[81]) { // q = rotate the body
//        body[this.holdingBody].torque = 0.05 * body[this.holdingBody].mass;
//      }
//      //look for dropping held body
//      if (this.buttonCD_hold < game.cycle) {
//        if (keys[69]) { //if holding e drops
//          this.holdKeyDown++;
//        } else if (this.holdKeyDown && !keys[69]) {
//          this.dropBody(); //if you hold down e long enough the body is thrown
//          this.throwBody();
//        }
//      }
//    } else if (keys[69]) { //when not holding  e = pick up body
//      this.findClosestBody();
//      if (this.closest.dist2 < 10000) { //pick up if distance closer then 100*100
//        this.isHolding = true;
//        this.holdKeyDown = 0;
//        this.buttonCD_hold = game.cycle + 20;
//        body[this.holdingBody].collisionFilter.group = 2; //force old holdingBody to collide with player
//        this.holdingBody = this.closest.index; //set new body to be the holdingBody
//        //body[this.closest.index].isSensor = true; //sensor seems a bit inconsistant
//        body[this.holdingBody].collisionFilter.group = -2; //don't collide with player
//        body[this.holdingBody].frictionAir = 0.1; //makes the holding body less jittery
//        holdConstraint.bodyB = body[this.holdingBody];
//        holdConstraint.length = 0;
//        holdConstraint.pointA = {
//          x: this.x + 50 * Math.cos(this.angle),
//          y: this.y + 50 * Math.sin(this.angle)
//        };
//      }
//    }
//  };
//  this.dropBody = function() {
//    let timer; //reset player collision
//    function resetPlayerCollision() {
//      timer = setTimeout(function() {
//        const dx = mech.x - body[mech.holdingBody].position.x
//        const dy = mech.y - body[mech.holdingBody].position.y
//        if (dx * dx + dy * dy > 20000) {
//          body[mech.holdingBody].collisionFilter.group = 2; //can collide with player
//        } else {
//          resetPlayerCollision();
//        }
//      }, 100);
//    }
//    resetPlayerCollision();
//    this.isHolding = false;
//    body[this.holdingBody].frictionAir = 0.01;
//    holdConstraint.bodyB = jumpSensor; //set on sensor to get the constaint on somethign else
//  };
//  this.throwMax = 150;
//  this.throwBody = function() {
//    let throwMag = 0;
//    if (this.holdKeyDown > 20) {
//      if (this.holdKeyDown > this.throwMax) this.holdKeyDown = this.throwMax;
//      //scale fire with mass and with holdKeyDown time
//      throwMag = body[this.holdingBody].mass * this.holdKeyDown * 0.001;
//    }
//    body[this.holdingBody].force.x += throwMag * Math.cos(this.angle);
//    body[this.holdingBody].force.y += throwMag * Math.sin(this.angle);
//  };
//  this.isHolding = false;
//  this.holdingBody = 0;
//  this.closest = {
//    dist2: 1000000,
//    index: 0
//  };
//  this.findClosestBody = function() {
//    this.closest.dist2 = 100000;
//    for (let i = 0; i < body.length; i++) {
//      const Px = body[i].position.x - (this.x + 50 * Math.cos(this.angle));
//      const Py = body[i].position.y - (this.y + 50 * Math.sin(this.angle));
//      if (body[i].mass < player.mass && Px * Px + Py * Py < this.closest.dist2) {
//        this.closest.dist2 = Px * Px + Py * Py;
//        this.closest.index = i;
//      }
//    }
//  };
//  /*   this.forcePoke = function() {
//      for (var i = 0; i < body.length; i++) {
//        var Dx = body[i].position.x - (this.mouse.x - this.transX);
//        var Dy = body[i].position.y - (this.mouse.y - this.transY);
//        var accel = 0.2 / Math.sqrt(Dx * Dx + Dy * Dy);
//        if (accel > 0.01) accel = 0.01; //cap accel
//        accel = accel * body[i].mass //scale with mass
//        var angle = Math.atan2(Dy, Dx);
//        body[i].force.x -= accel * Math.cos(angle);
//        body[i].force.y -= accel * Math.sin(angle);
//      }
//    }; */
//  this.drawLeg = function(stroke) {
//    ctx.save();
//    ctx.translate(this.x, this.y);
//    ctx.scale(this.flipLegs, 1);
//    //leg lines
//    ctx.strokeStyle = stroke;
//    ctx.lineWidth = 7;
//    ctx.beginPath();
//    ctx.moveTo(this.hip.x, this.hip.y);
//    ctx.lineTo(this.knee.x, this.knee.y);
//    ctx.lineTo(this.foot.x, this.foot.y);
//    ctx.stroke();
//    //toe lines
//    ctx.lineWidth = 4;
//    ctx.beginPath();
//    ctx.moveTo(this.foot.x, this.foot.y);
//    ctx.lineTo(this.foot.x - 15, this.foot.y + 5);
//    ctx.moveTo(this.foot.x, this.foot.y);
//    ctx.lineTo(this.foot.x + 15, this.foot.y + 5);
//    ctx.stroke();
//    //hip joint
//    ctx.strokeStyle = this.stroke;
//    ctx.fillStyle = this.fill;
//    ctx.lineWidth = 2;
//    ctx.beginPath();
//    ctx.arc(this.hip.x, this.hip.y, 11, 0, 2 * Math.PI);
//    ctx.fill();
//    ctx.stroke();
//    //knee joint
//    ctx.beginPath();
//    ctx.arc(this.knee.x, this.knee.y, 7, 0, 2 * Math.PI);
//    ctx.fill();
//    ctx.stroke();
//    //foot joint
//    ctx.beginPath();
//    ctx.arc(this.foot.x, this.foot.y, 6, 0, 2 * Math.PI);
//    ctx.fill();
//    ctx.stroke();
//    ctx.restore();
//  };
//  this.calcLeg = function(cycle_offset, offset) {
//    this.hip.x = 12 + offset;
//    this.hip.y = 24 + offset;
//    //stepSize goes to zero if Vx is zero or not on ground (make this transition cleaner)
//    //changes to stepsize are smoothed by adding only a percent of the new value each cycle
//    this.stepSize = 0.9 * this.stepSize + 0.1 * (8 * Math.sqrt(Math.abs(this.Vx)) * this.onGround);
//    const stepAngle = 0.037 * this.walk_cycle + cycle_offset;
//    this.foot.x = 2 * this.stepSize * Math.cos(stepAngle) + offset;
//    this.foot.y = offset + this.stepSize * Math.sin(stepAngle) + this.yOff + this.height;
//    const Ymax = this.yOff + this.height;
//    if (this.foot.y > Ymax) this.foot.y = Ymax;
//
//    //calculate knee position as intersection of circle from hip and foot
//    const d = Math.sqrt((this.hip.x - this.foot.x) * (this.hip.x - this.foot.x) +
//      (this.hip.y - this.foot.y) * (this.hip.y - this.foot.y));
//    const l = (this.legLength1 * this.legLength1 - this.legLength2 * this.legLength2 + d * d) / (2 * d);
//    const h = Math.sqrt(this.legLength1 * this.legLength1 - l * l);
//    this.knee.x = l / d * (this.foot.x - this.hip.x) - h / d * (this.foot.y - this.hip.y) + this.hip.x + offset;
//    this.knee.y = l / d * (this.foot.y - this.hip.y) + h / d * (this.foot.x - this.hip.x) + this.hip.y;
//  };
//  this.draw = function() {
//    ctx.fillStyle = this.fill;
//    if (this.mouse.x > canvas.width / 2) {
//      this.flipLegs = 1;
//    } else {
//      this.flipLegs = -1;
//    }
//    this.walk_cycle += this.flipLegs * this.Vx;
//    this.calcLeg(Math.PI, -3);
//    this.drawLeg('#444');
//    this.calcLeg(0, 0);
//    this.drawLeg('#333');
//    //draw body
//    ctx.save();
//    ctx.translate(this.x, this.y);
//    ctx.rotate(this.angle);
//    ctx.strokeStyle = this.stroke;
//    ctx.lineWidth = 2;
//    //ctx.fillStyle = this.fill;
//    let grd = ctx.createLinearGradient(-30, 0, 30, 0);
//    grd.addColorStop(0, "#bbb");
//    grd.addColorStop(1, "#fff");
//    ctx.fillStyle = grd;
//    ctx.beginPath();
//    //ctx.moveTo(0, 0);
//    ctx.arc(0, 0, 30, 0, 2 * Math.PI);
//    ctx.arc(15, 0, 4, 0, 2 * Math.PI);
//    ctx.fill();
//    ctx.stroke();
//    ctx.restore();
//
//    //draw holding graphics
//    if (this.isHolding) {
//      if (this.holdKeyDown > 20) {
//        if (this.holdKeyDown > this.throwMax) {
//          ctx.strokeStyle = 'rgba(255, 0, 255, 0.8)';
//        } else {
//          ctx.strokeStyle = 'rgba(255, 0, 255, ' + (0.2 + 0.4 * this.holdKeyDown / this.throwMax) + ')';
//        }
//      } else {
//        ctx.strokeStyle = 'rgba(0, 255, 255, 0.2)';
//      }
//      ctx.lineWidth = 10;
//      ctx.beginPath();
//      ctx.moveTo(holdConstraint.bodyB.position.x + Math.random() * 2,
//        holdConstraint.bodyB.position.y + Math.random() * 2);
//      ctx.lineTo(this.x + 15 * Math.cos(this.angle), this.y + 15 * Math.sin(this.angle));
//      //ctx.lineTo(holdConstraint.pointA.x,holdConstraint.pointA.y);
//      ctx.stroke();
//    }
//
//  };
//  this.info = function() {
//    let line = 80;
//    ctx.fillStyle = "#000";
//    ctx.fillText("Press T to exit testing mode", 5, line);
//    line += 30;
//    ctx.fillText("cycle = " + game.cycle, 5, line);
//    line += 20;
//    ctx.fillText("delta = " + game.delta.toFixed(6), 5, line);
//    line += 20;
//    ctx.fillText("mX = " + (this.mouse.x - this.transX).toFixed(2), 5, line);
//    line += 20;
//    ctx.fillText("mY = " + (this.mouse.y - this.transY).toFixed(2), 5, line);
//    line += 20;
//    ctx.fillText("x = " + this.x.toFixed(0), 5, line);
//    line += 20;
//    ctx.fillText("y = " + this.y.toFixed(0), 5, line);
//    line += 20;
//    ctx.fillText("Vx = " + this.Vx.toFixed(2), 5, line);
//    line += 20;
//    ctx.fillText("Vy = " + this.Vy.toFixed(2), 5, line);
//    line += 20;
//    ctx.fillText("Fx = " + player.force.x.toFixed(3), 5, line);
//    line += 20;
//    ctx.fillText("Fy = " + player.force.y.toFixed(3), 5, line);
//    line += 20;
//    ctx.fillText("yOff = " + this.yOff.toFixed(1), 5, line);
//    line += 20;
//    ctx.fillText("mass = " + player.mass.toFixed(1), 5, line);
//    line += 20;
//    ctx.fillText("onGround = " + this.onGround, 5, line);
//    line += 20;
//    ctx.fillText("crouch = " + this.crouch, 5, line);
//    line += 20;
//    ctx.fillText("isHeadClear = " + this.isHeadClear, 5, line);
//    line += 20;
//    ctx.fillText("HeadIsSensor = " + headSensor.isSensor, 5, line);
//    line += 20;
//    ctx.fillText("frictionAir = " + player.frictionAir.toFixed(3), 5, line);
//    line += 20;
//    ctx.fillText("stepSize = " + this.stepSize.toFixed(2), 5, line);
//    line += 20;
//    ctx.fillText("numTouching = " + mech.numTouching, 5, line);
//  };
//};
//const mech = new mechProto();
//
////bullets***************************************************************
////************************************************************************
//
//const bullet = [];
//
////mouse click events
//window.onmousedown = function(e) {
//  game.mouseDown = true;
//};
//window.onmouseup = function(e) {
//  game.mouseDown = false;
//};
//
//function fireBullet(type) {
//  const len = bullet.length;
//  //bullet[len] = Bodies.polygon(e.x - mech.transX, e.y- mech.transY, 5, 5);
//  const dist = 15 //radial distance mech head
//  const dir = (Math.random() - 0.5) * 0.1 + mech.angle
//  //spawn as a rectangle
//  bullet[len] = Bodies.rectangle(mech.x + dist * Math.cos(mech.angle), mech.y + dist * Math.sin(mech.angle), 10, 3, {
//    angle: dir,
//    //density: 0.001,
//    //friction: 0.05,
//    frictionAir: 0,
//    //frictionStatic: 0.2,
//    restitution: 0.25,
//    //sleepThreshold: 30, //bullets despawn on sleep after __ cycles
//    collisionFilter: {
//      group: -2 //can't collide with player (at first)
//    }
//  });    
//  //fire polygons
//  //bullet[len] = Bodies.polygon(mech.x + dist*Math.cos(mech.angle), mech.y + dist*Math.sin(mech.angle),5, 5,{ angle: Math.random(), collisionFilter: {group: -2 } });
//  //fire circles
//  //bullet[len] = Bodies.circle(mech.x + dist*Math.cos(mech.angle), mech.y + dist*Math.sin(mech.angle), 3,{ restitution: 0.5, sleepThreshold: 15, collisionFilter: { group: -2 }});
//  bullet[len].birthCycle = game.cycle;
//  bullet[len].blankfunc = function() {  //blank functino for later
//  }
//  //bullet velocity in direction of player plus player velocity
//  // Matter.Body.setVelocity(bullet[len], {
//  //   x: mech.Vx + vel * Math.cos(dir),
//  //   y: mech.Vy + vel * Math.sin(dir)
//  // });
//  Matter.Body.setVelocity(bullet[len], {
//    x: mech.Vx,
//    y: mech.Vy
//  });
//  //add force to fire bullets
//  const vel = 0.0025;
//  const f = {
//    x: vel * Math.cos(dir) / game.delta,
//    y: vel * Math.sin(dir) / game.delta
//  }
//  bullet[len].force = f;
//  //equal but opposite force on player
//  player.force.x -= f.x;
//  player.force.y -= f.y;
//  
//  World.add(engine.world, bullet[len]); //add bullet to world
//}
//
//function bulletLoop() {
//  //fire check
//  if (game.mouseDown && !(game.cycle % 2)) {
//    fireBullet();
//  }
//  //all bullet loop
//  let i = bullet.length;
//  while (i--) {
//    //soon after spawn bullets can collide with player
//    //this may need to be removed
//    if (bullet[i].birthCycle + 5 < game.cycle){
//      bullet[i].collisionFilter.group = 1;
//    }
//    
//    //bullets despawn if the sleep or if they fall down or after some cycles
//    if (bullet[i].isSleeping /* || bullet[i].position.y > game.yDeath */ || bullet[i].birthCycle + 360 < game.cycle) {
//      Matter.World.remove(engine.world, bullet[i]);
//      bullet.splice(i, 1);
//    }
//  }
//}
//
////matter.js ***********************************************************
////*********************************************************************
////*********************************************************************
//// module aliases
//const Engine = Matter.Engine,
//  World = Matter.World,
//  Events = Matter.Events,
//  Composites = Matter.Composites,
//  Composite = Matter.Composite,
//  Constraint = Matter.Constraint,
//  Vertices = Matter.Vertices,
//  Query = Matter.Query,
//  Body = Matter.Body,
//  Bodies = Matter.Bodies;
//
//// create an engine
//const engine = Engine.create();
//engine.enableSleeping = true;
//
////define player *************************************************************
////***************************************************************************
////player as a series of vertices
//let vector = Vertices.fromPath('0 40  0 115  20 130  30 130  50 115  50 40');
//const playerBody = Matter.Bodies.fromVertices(0, 0, vector);
////this sensor check if the player is on the ground to enable jumping
var jumpSensor = Bodies.rectangle(0, 46, 40, 20, {
  sleepThreshold: Infinity,
  isSensor: true
});
////this part of the player lowers on crouch
//vector = Vertices.fromPath('0 -66 18 -82  0 -37 50 -37 50 -66 32 -82');
//const playerHead = Matter.Bodies.fromVertices(0, -55, vector,{
//  sleepThreshold: Infinity,
//});
////a part of player that senses if the player's head is empty and can return after crouching
//const headSensor = Bodies.rectangle(0, -57, 48, 45, {
//  sleepThreshold: Infinity,
//  isSensor: true,
//});
//
//const player = Body.create({ //combine jumpSensor and playerBody
//  parts: [playerBody, playerHead, jumpSensor, headSensor],
//  inertia: Infinity, //prevents player rotation
//  friction: 0,
//  frictionStatic: 0,
//  restitution: 0.3,
//  sleepThreshold: Infinity,
//  collisionFilter: {
//    group: -2
//  },
//});
//
//Matter.Body.setPosition(player, mech.spawnPos);
//Matter.Body.setVelocity(player, mech.spawnVel);
//Matter.Body.setMass(player, mech.mass);
//World.add(engine.world, [player]);
////holding body constraint
//const holdConstraint = Constraint.create({
//  pointA: {
//    x: 0,
//    y: 0
//  },
//  //setting constaint to jump sensor because it has to be on something until the player picks up things
//  bodyB: jumpSensor,
//  stiffness: 0.4,
//});
//World.add(engine.world, holdConstraint);
//
////spawn bodies  *************************************************************
////***************************************************************************
////arrays that hold all the elements that are drawn by the renderer
//const body = []; //non static bodies
//const map = []; //all static bodies
//const cons = []; //all constaints between a point and a body
//const consBB = []; //all constaints between two bodies
//
//spawn();
//
//function spawn() { //spawns bodies and map elements
//  function BodyRect(x, y, width, height) { //speeds up adding reactangles to map array
//    body[body.length] = Bodies.rectangle(x + width / 2, y + height / 2, width, height);
//  }
//
//  function constraintPB(x, y, bodyIndex, stiffness) {
//    cons[cons.length] = Constraint.create({
//      pointA: {
//        x: x,
//        y: y
//      },
//      bodyB: body[bodyIndex],
//      stiffness: stiffness,
//    })
//  }
//
//  function constraintBB(bodyIndexA, bodyIndexB, stiffness) {
//    consBB[consBB.length] = Constraint.create({
//      bodyA: body[bodyIndexA],
//      bodyB: body[bodyIndexB],
//      stiffness: stiffness,
//    })
//  }
//
//  BodyRect(1475, 0, 100, 800); //huge tall vertical box
//  BodyRect(800, 438, 250, 10); //long skinny box
//
//  for (let i = 0; i < 10; i++) { //random bouncy circles
//    body[body.length] = Bodies.circle(-800 + (0.5 - Math.random()) * 200, 600 + (0.5 - Math.random()) * 200, 7 + Math.ceil(Math.random() * 30), {
//      restitution: 0.8,
//    })
//  }
//
//  for (let i = 0; i < 10; i++) { //stack of medium hexagons
//    body[body.length] = Bodies.polygon(-400, 30 - i * 70, 6, 40, {
//      angle: Math.PI / 2,
//    });
//  }
//
//  for (let i = 0; i < 5; i++) { //stairs of boxes taller on left
//    for (let j = 0; j < 5 - i; j++) {
//      const r = 40;
//      body[body.length] = Bodies.rectangle(50 + r / 2 + i * r, 900 - r / 2 - i * r, r, r, {
//        restitution: 0.8,
//      });
//    }
//  }
//  for (let i = 0; i < 10; i++) { //stairs of boxes taller on right
//    for (let j = 0; j < i; j++) {
//      const r = 120;
//      body[body.length] = Bodies.rectangle(2639 + r / 2 + i * r, 900 + r - i * r, r, r, {
//        restitution: 0.6,
//        friction: 0.3,
//        frictionStatic: 0.9,
//      });
//    }
//  }
//  for (let i = 0; i < 10; i++) { //a stack of boxes
//    body[body.length] = Bodies.rectangle(936, 700 + i * 21, 25, 21);
//  }
//  for (let i = 0; i < 10; i++) { //a stack of boxes
//    body[body.length] = Bodies.rectangle(464, 700 + i * 21, 25, 21);
//  }
//  body[body.length] = Bodies.circle(20, 590, 20, { //medium circle
//      friction: 0,
//      frictionAir: 0.001,
//      frictionStatic: 0,
//      restitution: 0.99,
//    }) //medium circle
//  constraintPB(20, 125, body.length - 1, 0.9);
//
//  body[body.length] = Bodies.circle(60, 590, 20, { //medium circle
//      friction: 0,
//      frictionAir: 0.001,
//      frictionStatic: 0,
//      restitution: 0.99,
//    }) //medium circle
//  constraintPB(60, 125, body.length - 1, 0.9);
//
//  body[body.length] = Bodies.circle(100, 590, 20, { //medium circle
//      friction: 0,
//      frictionAir: 0.001,
//      frictionStatic: 0,
//      restitution: 0.99,
//    }) //medium circle
//  constraintPB(100, 125, body.length - 1, 0.9);
//
//  body[body.length] = Bodies.circle(140, 590, 20, { //medium circle
//    friction: 0,
//    frictionAir: 0.001,
//    frictionStatic: 0,
//    restitution: 0.99,
//  })
//  constraintPB(140, 125, body.length - 1, 0.9);
//
//  body[body.length] = Bodies.circle(645, 125, 20, { //medium circle
//    friction: 0,
//    frictionAir: 0.001,
//    frictionStatic: 0,
//    restitution: 0.99,
//  })
//  constraintPB(180, 125, body.length - 1, 0.9);
//
//  //a loose constraint
//  body[body.length] = Bodies.rectangle(-1300, 100, 50, 80, { 
//    friction: 0,
//    frictionAir: 0,
//    frictionStatic: 0,
//    restitution: 0.99,
//  })
//  constraintPB(-1300, -200, body.length - 1, 0.001);
//  
//  //a bridge
//  body[body.length] = Bodies.rectangle(-800, 400, 250, 40, { 
//    inertia: Infinity, //prevents rotation
//    friction: 0.1,
//    frictionAir: 0.001,
//    frictionStatic: 0.6,
//    restitution: 0,
//  })
//  constraintPB(-1000, -600, body.length - 1, 0.002)
//  constraintPB(-600, -600, body.length - 1, 0.002)
//  
//  
//  
//  // body[body.length] = Bodies.circle(0, 570, 20)
//  // body[body.length] = Bodies.circle(30, 570, 20)
//  // body[body.length] = Bodies.circle(0, 600, 20)
//  // constraintBB(body.length - 2, body.length - 3, 0.2)
//  // constraintBB(body.length - 2, body.length - 1, 0.2)
//
//  //map statics  **************************************************************
//  //***************************************************************************
//  function mapRect(x, y, width, height) { //addes reactangles to map array
//    map[map.length] = Bodies.rectangle(x + width / 2, y + height / 2, width, height);
//  }
//
//  function mapVertex(x, y, vector) { //addes reactangles to map array
//    map[map.length] = Matter.Bodies.fromVertices(x, y, Vertices.fromPath(vector));
//  }
//  //mapVertex(-1700, 700, '0 0 0 -500 500 -500 1000 -400 1500 0'); //large ramp
//  //mapVertex(1285, 867, '200 0  200 100 0 100'); // ramp
//  mapVertex(1400, 854, '0 100 600 100 600 0 150 0'); // ramp
//  mapVertex(-1300, 670, '0 0 -500 0 -500 200'); //angeled ceiling
//  //mapVertex(-1650, 700, '0 0 500 0 500 200'); //angeled ceiling
//  //mapRect(1350, 800, 300, 100) //ground 
//  mapRect(650, 890, 50, 10) //ground bump
//  mapRect(-600, 0, 400, 200); //left cave
//  mapRect(-600, 600, 400, 194); //left cave
//  mapRect(-50, 700, 100, 200); //left wall
//  mapRect(0, 100, 300, 50); //left high platform
//  mapRect(550, 450, 300, 50); //wide platform
//  mapRect(650, 250, 100, 50); //wide platform
//  mapRect(1000, 450, 400, 50); //platform
//  mapRect(1200, 250, 200, 50); //platform
//  mapRect(1300, 50, 100, 50); //platform
//  //mapRect(1150, 888, 45, 20); //ground bump
//  mapRect(450, 650, 500, 50); //platform 1
//
//  map[map.length] = Bodies.rectangle(0, 1000, 4000, 200); //ground
//  map[map.length] = Bodies.rectangle(4600, 1000, 4000, 200); //far right ground
//
//  //add arrays to the world******************************************************
//  //*****************************************************************************
//  for (let i = 0; i < body.length; i++) {
//    body[i].collisionFilter.group = 1;
//    World.add(engine.world, body[i]); //add to world
//  }
//  for (let i = 0; i < map.length; i++) {
//    map[i].collisionFilter.group = -1;
//    Matter.Body.setStatic(map[i], true); //make static
//    World.add(engine.world, map[i]); //add to world
//  }
//  for (let i = 0; i < cons.length; i++) {
//    World.add(engine.world, cons[i]);
//  }
//  for (let i = 0; i < consBB.length; i++) {
//    World.add(engine.world, consBB[i]);
//  }
//}
//
//// matter events *********************************************************
////************************************************************************
//
//function playerOnGroundCheck(event) { //runs on collisions events
//  function enter() {
//    mech.numTouching++;
//    if (!mech.onGround) mech.enterLand();
//  }
//  const pairs = event.pairs;
//  for (let i = 0, j = pairs.length; i != j; ++i) {
//    let pair = pairs[i];
//    if (pair.bodyA === jumpSensor) {
//      enter()
//    } else if (pair.bodyB === jumpSensor) {
//      enter()
//    }
//  }
//}
//
//function playerOffGroundCheck(event) { //runs on collisions events
//  function enter() {
//    if (mech.onGround && mech.numTouching === 0) mech.enterAir();
//  }
//  const pairs = event.pairs;
//  for (let i = 0, j = pairs.length; i != j; ++i) {
//    let pair = pairs[i];
//    if (pair.bodyA === jumpSensor) {
//      enter()
//    } else if (pair.bodyB === jumpSensor) {
//      enter()
//    }
//  }
//}
//
//function playerHeadCheck(event) { //runs on collisions events
//  if (mech.crouch) {
//    mech.isHeadClear = true;
//    const pairs = event.pairs;
//    for (let i = 0, j = pairs.length; i != j; ++i) {
//      let pair = pairs[i];
//      if (pair.bodyA === headSensor) {
//        mech.isHeadClear = false;
//      } else if (pair.bodyB === headSensor) {
//        mech.isHeadClear = false;
//      }
//    }
//  }
//}
//
//Events.on(engine, "beforeUpdate", function(event) {
//  mech.numTouching = 0;
//});
//
//Events.on(engine, "afterUpdate", function(event) {
//  let f = player.force.x*player.force.x+player.force.y*player.force.y;
//  if (f != 0)
//    console.log(f);
//});
//
////determine if player is on the ground
//Events.on(engine, "collisionStart", function(event) {
//  playerOnGroundCheck(event);
//  playerHeadCheck(event);
//});
//Events.on(engine, "collisionActive", function(event) {
//  playerOnGroundCheck(event);
//  playerHeadCheck(event);
//});
//Events.on(engine, 'collisionEnd', function(event) {
//  playerOffGroundCheck(event);
//});
//
//// Events.on(player, "sleepStart", function() {
////   Matter.Sleeping.set(player, false)
//// })
//
//// render ***********************************************************
////*******************************************************************
//function drawMatterWireFrames() {
//  const bodies = Composite.allBodies(engine.world);
//  ctx.beginPath();
//  for (let i = 0; i < bodies.length; i += 1) {
//    let vertices = bodies[i].vertices;
//    //ctx.moveTo(bodies[i].position.x, bodies[i].position.y);
//    ctx.moveTo(vertices[0].x, vertices[0].y);
//    for (let j = 1; j < vertices.length; j += 1) {
//      ctx.lineTo(vertices[j].x, vertices[j].y);
//    }
//    ctx.lineTo(vertices[0].x, vertices[0].y);
//  }
//  ctx.lineWidth = 1;
//  ctx.strokeStyle = '#000';
//  ctx.stroke();
//}
//
//function drawMap() {
//  //draw map
//  ctx.beginPath();
//  for (let i = 0; i < map.length; i += 1) {
//    let vertices = map[i].vertices;
//    ctx.moveTo(vertices[0].x, vertices[0].y);
//    for (let j = 1; j < vertices.length; j += 1) {
//      ctx.lineTo(vertices[j].x, vertices[j].y);
//    }
//    ctx.lineTo(vertices[0].x, vertices[0].y);
//  }
//  ctx.fillStyle = '#444';
//  ctx.fill();
//}
//
//function drawBody() {
//  //draw body
//  ctx.beginPath();
//  for (let i = 0; i < body.length; i += 1) {
//    let vertices = body[i].vertices;
//    ctx.moveTo(vertices[0].x, vertices[0].y);
//    for (let j = 1; j < vertices.length; j += 1) {
//      ctx.lineTo(vertices[j].x, vertices[j].y);
//    }
//    ctx.lineTo(vertices[0].x, vertices[0].y);
//  }
//  ctx.lineWidth = 1.5;
//  ctx.fillStyle = '#777';
//  ctx.fill();
//  ctx.strokeStyle = '#222';
//  ctx.stroke();
//}
//
//function drawBullet() {
//  //draw body
//  ctx.beginPath();
//  for (let i = 0; i < bullet.length; i += 1) {
//    let vertices = bullet[i].vertices;
//    ctx.moveTo(vertices[0].x, vertices[0].y);
//    for (let j = 1; j < vertices.length; j += 1) {
//      ctx.lineTo(vertices[j].x, vertices[j].y);
//    }
//    ctx.lineTo(vertices[0].x, vertices[0].y);
//  }
//  ctx.fillStyle = '#f34';
//  //ctx.fillStyle = '#0cc';
//  ctx.fill();
//}
//
//function drawCons() {
//  //draw body
//  ctx.beginPath();
//  for (let i = 0; i < cons.length; i += 1) {
//    ctx.moveTo(cons[i].pointA.x, cons[i].pointA.y);
//    ctx.lineTo(cons[i].bodyB.position.x, cons[i].bodyB.position.y);
//  }
//  ctx.lineWidth = 1;
//  ctx.strokeStyle = '#999';
//  ctx.stroke();
//}
//
//function drawPlayerBodyTesting() {
//  //draw one body
//  ctx.beginPath();
//  let bodyDraw = jumpSensor.vertices;
//  ctx.moveTo(bodyDraw[0].x, bodyDraw[0].y);
//  for (let j = 1; j < bodyDraw.length; j += 1) {
//    ctx.lineTo(bodyDraw[j].x, bodyDraw[j].y);
//  }
//  ctx.lineTo(bodyDraw[0].x, bodyDraw[0].y);
//  ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
//  ctx.fill();
//  ctx.strokeStyle = '#000';
//  ctx.stroke();
//  //draw one body
//  ctx.beginPath();
//  bodyDraw = playerBody.vertices;
//  ctx.moveTo(bodyDraw[0].x, bodyDraw[0].y);
//  for (let j = 1; j < bodyDraw.length; j += 1) {
//    ctx.lineTo(bodyDraw[j].x, bodyDraw[j].y);
//  }
//  ctx.lineTo(bodyDraw[0].x, bodyDraw[0].y);
//  ctx.fillStyle = 'rgba(0, 255, 255, 0.3)';
//  ctx.fill();
//  ctx.stroke();
//  //draw one body
//  ctx.beginPath();
//  bodyDraw = playerHead.vertices;
//  ctx.moveTo(bodyDraw[0].x, bodyDraw[0].y);
//  for (let j = 1; j < bodyDraw.length; j += 1) {
//    ctx.lineTo(bodyDraw[j].x, bodyDraw[j].y);
//  }
//  ctx.lineTo(bodyDraw[0].x, bodyDraw[0].y);
//  ctx.fillStyle = 'rgba(255, 255, 0, 0.3)';
//  ctx.fill();
//  ctx.stroke();
//  //draw one body
//  ctx.beginPath();
//  bodyDraw = headSensor.vertices;
//  ctx.moveTo(bodyDraw[0].x, bodyDraw[0].y);
//  for (let j = 1; j < bodyDraw.length; j += 1) {
//    ctx.lineTo(bodyDraw[j].x, bodyDraw[j].y);
//  }
//  ctx.lineTo(bodyDraw[0].x, bodyDraw[0].y);
//  ctx.fillStyle = 'rgba(0, 0, 255, 0.3)';
//  ctx.fill();
//  ctx.stroke();
//}
//
////main loop ************************************************************
////**********************************************************************
//function cycle() {
//  stats.begin();
//  game.timing();
//
//  ctx.clearRect(0, 0, canvas.width, canvas.height);
//  mech.keyMove();
//  mech.keyHold();
//
//  if (game.testing) {
//    mech.testingMoveLook();
//    mech.deathCheck();
//    bulletLoop();
//    ctx.save();
//    ctx.translate(mech.transX, mech.transY);
//    mech.draw();
//    drawMatterWireFrames();
//    drawPlayerBodyTesting();
//    ctx.restore();
//    mech.info();
//  } else {
//    mech.move();
//    mech.deathCheck();
//    mech.look();
//    bulletLoop();
//    ctx.save();
//    ctx.translate(mech.transX, mech.transY);
//    drawCons();
//    drawBody();
//    mech.draw();
//    drawMap();
//    drawBullet();
//    ctx.restore();
//  }
//  //ctx.drawImage(space_img,1800,0);
//  //ctx.drawImage(bmo_img,-300,200);
//  //ctx.drawImage(bgtest_img,-300,200);
//  //svg graphics
//  document.getElementById('background').setAttribute(
//    'transform', 'translate(' + (mech.transX) + ',' + (mech.transY) + ')');
//  document.getElementById('foreground').setAttribute(
//    'transform', 'translate(' + (mech.transX) + ',' + (mech.transY) + ')');
//  stats.end();
//  requestAnimationFrame(cycle);
//}
//
//// const bmo_img = new Image();   // Create new img element
//// bmo_img.src = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/464612/Bmo.png'; // Set source path
//
//// const bgtest_img = new Image();   // Create new img element
//// bgtest_img.src = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/464612/backgroundtest.png'; // Set source path
//
//// const space_img = new Image();   // Create new img element
//// space_img.src = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/464612/Space.jpg'; // Set source path
//
//function runPlatformer(el) {
//  el.onclick = null; //removes the onclick effect so the function only runs once
//  el.style.display = 'none'; //hides the element that spawned the function
//  document.body.appendChild(stats.dom); //show stats.js FPS tracker
//  Engine.run(engine); //starts game engine
//  console.clear(); //gets rid of annoying console message about vertecies not working
//  requestAnimationFrame(cycle); //starts game loop
//}