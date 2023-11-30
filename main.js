// main.js
import Player from './player.js';
import { Level } from './level.js';

let isJumping = false;

var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,  
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Mouse = Matter.Mouse;

var engine = Engine.create();
var render = Render.create({
  element: document.body,
  engine: engine, 
  options: {
    width: window.innerWidth,
    height: window.innerHeight,
    wireframes: false,
    showDebug: true,
    background: '#303030'
  },
});

var easeAmount = 0.05;
const player = new Player();


World.add(engine.world, [player.body]); // Replace player with player.body

var level1 = new Level();
level1.addWall(500, 0, 2000, 60, {color: 'blue'});
level1.addWall(-500,-220,100,500)
level1.addWall(450,-350,100,250)
level1.addWall(300,-250,300,50)
level1.addWall(-400,-150,150,50)
level1.addWall(0,-250,100,50)
level1.addToWorld(engine.world);

Matter.Runner.run(engine)
Render.run(render);

var mouse = Mouse.create(render.canvas);
var targetMin = { x: player.body.position.x - 500, y: player.body.position.y - 200 };
var targetMax = { x: player.body.position.x + 500, y: player.body.position.y + 200 };

Render.lookAt(render, {
    min: targetMin,
    max: targetMax
});

let keys = {
  37: false, // left
  39: false, // right
  38: false, // up
  87: false, // W  
  65: false, // A
  83: false, // S
  68: false  // D
};

window.addEventListener('keydown', function(e) {
  if (e.keyCode in keys) {
    keys[e.keyCode] = true;
  }  
});

window.addEventListener('keyup', function(e) {
  if (e.keyCode in keys) {
    keys[e.keyCode] = false;
  }
});

function gameLoop() {

  
  if (keys[37] || keys[65]) { 
    Body.setVelocity(player.body, {x: -5, y: player.body.velocity.y});
  }
  
  if (keys[39] || keys[68]) {
    Body.setVelocity(player.body, {x: 5, y: player.body.velocity.y});
  }
  
  if ((keys[38] || keys[87]) && !player.isFootInContact(engine) && !isJumping) {
    Body.applyForce(player.body, player.body.position, {x: 0, y: -0.3});
    isJumping = true;
  }

  const LEVEL_MIN_Y = 1000;

  if (player.body.position.y > LEVEL_MIN_Y) {
    Body.setPosition(player.body, {
      x: -100,
      y: -1000
    });
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();

Matter.Events.on(engine, 'afterUpdate', function() {
  targetMin.x = player.body.position.x + ( (mouse.position.x / 5) - 500 ); 
  targetMin.y = player.body.position.y + ( (mouse.position.y / 6) - 200 );

  targetMax.x = player.body.position.x + ( (mouse.position.x *0.3) + 400 );
  targetMax.y = player.body.position.y + ( (mouse.position.y *0.3) + 400 );
  
  render.bounds.min.x += (targetMin.x - render.bounds.min.x) * easeAmount;
  render.bounds.min.y += (targetMin.y - render.bounds.min.y) * easeAmount;
  render.bounds.max.x += (targetMax.x - render.bounds.max.x) * easeAmount;
  render.bounds.max.y += (targetMax.y - render.bounds.max.y) * easeAmount;

  Render.lookAt(render, {
    min: render.bounds.min, 
    max: render.bounds.max
  });

  if (player.body.velocity.y > 0 && player.isFootInContact(engine)) {
    isJumping = false;
  }
});

