

// module aliases 
var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,  
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Mouse = Matter.Mouse;

// create engine  
var engine = Engine.create();

// create renderer
var render = Render.create({
  element: document.body,
  engine: engine, 
  options: {
    width: window.innerWidth,
    height: window.innerHeight 
  }
});

// create player and ground
var player = Bodies.rectangle(0, -100, 80, 80);

// wall contact jumping  
let touchingWall = false;

// create Wall class
// Level class with integrated Wall 
class Level {

    constructor() {
      this.walls = [];
    }
  
    addWall(x, y, width, height) {
      this.walls.push({
        x: x,
        y: y, 
        width: width,
        height: height,
        isStatic: true,
        label: 'wall' 
      });
    }
  
    addToWorld(world) {
      var bodies = this.walls.map(wall => {
        return Bodies.rectangle(wall.x, wall.y, wall.width, wall.height, {
          isStatic: wall.isStatic,
          label: wall.label
        });
      });
      
      World.add(world, bodies);
    }
  
  }
  

// create level  
var level1 = new Level();


level1.addWall(0, 0, 810, 60);
level1.addWall(-100,-100,100,500)

// add bodies to world 
World.add(engine.world, [player]);
level1.addToWorld(engine.world);

// run engine
Engine.run(engine); 

// run renderer  
Render.run(render);

// check for wall collisions
Matter.Events.on(engine, 'collisionStart', function(event) {
  const pairs = event.pairs;

  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i];
    
    if (pair.bodyA === player || pair.bodyB === player) {
      if (pair.bodyA.label === 'wall' || pair.bodyB.label === 'wall') {
        touchingWall = true;
      }
    }
  }  
});

Matter.Events.on(engine, 'collisionEnd', function() {
  touchingWall = false; 
});

// create mouse
var mouse = Mouse.create(render.canvas);

// target positions 
var targetMin = { x: player.position.x - 500, y: player.position.y - 200 };
var targetMax = { x: player.position.x + 500, y: player.position.y + 200 };

// set camera
Render.lookAt(render, {
    min: targetMin,
    max: targetMax
});

let I = 4
// side scroll
Matter.Events.on(engine, 'afterUpdate', function() {
  targetMin.x = Math.min(player.position.x, mouse.position.x) - ( window.innerHeight / I );
  targetMin.y = Math.min(player.position.y, mouse.position.y) - ( window.innerWidth / I ); 
  targetMax.x = Math.max(player.position.x, mouse.position.x) + ( window.innerHeight / I );
  targetMax.y = Math.max(player.position.y, mouse.position.y) + ( window.innerWidth / I );

  var easeAmount = 0.05;
  render.bounds.min.x += (targetMin.x - render.bounds.min.x) * easeAmount;
  render.bounds.min.y += (targetMin.y - render.bounds.min.y) * easeAmount;
  render.bounds.max.x += (targetMax.x - render.bounds.max.x) * easeAmount;
  render.bounds.max.y += (targetMax.y - render.bounds.max.y) * easeAmount;

  Render.lookAt(render, {
    min: render.bounds.min, 
    max: render.bounds.max
  });
});

// input keys
let keys = {
  37: false, // left
  39: false, // right
  38: false, // up
  87: false, // W  
  65: false, // A
  83: false, // S
  68: false  // D
};

// key handlers
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

// game loop
function gameLoop() {

  // left/right movement
  if (keys[37] || keys[65]) { 
    Body.setVelocity(player, {x: -5, y: player.velocity.y});
  }
  
  if (keys[39] || keys[68]) {
    Body.setVelocity(player, {x: 5, y: player.velocity.y});
  }
  
  // jump only if touching wall
  if ((keys[38] || keys[87])) {
    if (touchingWall) {
      Body.applyForce(player, player.position, {x: 0, y: -0.3});
    }
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();


