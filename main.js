// ███████████████████████████████████ SETUP ████████████████████████████████████████

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
    height: window.innerHeight,
    showVelocties: true 
  },
  
  
});

var easeAmount = 0.05;
// Player
const playerWidth = 80;
const playerHeight = 80;
const hitboxWidth = playerWidth * 0.8; 
const hitboxHeight = 10;
const cubeWidth = 20;
const cubeHeight = 60;

const player = Bodies.rectangle(0, -500, playerWidth, playerHeight, {
  chamfer: {radius: 10},
  inertia: Infinity // stop rotation

});

// Going to leave this alone until i can figure out how to make this work
// const player = Body.create({
//   parts: [
//     Bodies.rectangle(0, -500, playerWidth, playerHeight),
//     Bodies.rectangle(0, -463, hitboxWidth, hitboxHeight, {isSensor: true}),
//     Bodies.rectangle(0, -500, cubeWidth, cubeHeight) 
//   ],
//   
//   frictionAir: 0.02,
// 
//   label: 'player'
// });

// ███████████████████████████████████ WALLS ████████████████████████████████████████

// wall contact jumping  
let touchingWall = false;

// Level class with hitboxes
class Level {

  constructor() {
    this.walls = [];
  }

  addWall(x, y, width, height) {

    // Add wall
    this.walls.push({
      x: x,  
      y: y,
      width: width,
      height: height,
      isStatic: true,
      label: 'wall'
    });
    
    // Add hitbox above wall
    const hitboxHeight = 20;
    this.walls.push({
      x: x,
      y: y -( height/2),
      width: width, 
      height: hitboxHeight,
      isStatic: true,
      label: 'hitbox',
      
      
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


level1.addWall(0, 0, 1000, 60);
level1.addWall(-500,-220,100,500)
level1.addWall(450,-300,100,250)
level1.addWall(300,-200,300,50)


// add bodies to world 
World.add(engine.world, [player]);
level1.addToWorld(engine.world);

// run engine
Engine.run(engine); 

// run renderer  
Render.run(render);

// ███████████████████████████████████ COLLISION ████████████████████████████████████████

Matter.Events.on(engine, 'collisionStart', function(event) {
  var pairs = event.pairs;
 
  for (var i = 0; i < pairs.length; i++) {
      var pair = pairs[i];
 
      if (pair.bodyA === player && pair.bodyB.label === 'hitbox' || pair.bodyA.label === 'hitbox' && pair.bodyB === player)  { // checks if player is colliding with the ground
        touchingWall = true;
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

// ███████████████████████████████████ SIDE SCROLLING ████████████████████████████████████████


Matter.Events.on(engine, 'afterUpdate', function() {
  // Huge math to get the camera to follow the mouse and player ( with easing )
  
  targetMin.x = player.position.x + ( (mouse.position.x / 5) - 500 ); 
  targetMin.y = player.position.y + ( (mouse.position.y / 5) - 500 );

  targetMax.x = player.position.x + ( (mouse.position.x / 2) + 400 );
  targetMax.y = player.position.y + ( (mouse.position.y / 2) + 400 );
  
  render.bounds.min.x += (targetMin.x - render.bounds.min.x) * easeAmount;
  render.bounds.min.y += (targetMin.y - render.bounds.min.y) * easeAmount;
  render.bounds.max.x += (targetMax.x - render.bounds.max.x) * easeAmount;
  render.bounds.max.y += (targetMax.y - render.bounds.max.y) * easeAmount;

  Render.lookAt(render, {
    min: render.bounds.min, 
    max: render.bounds.max
  });
});


// ███████████████████████████████████ MOVEMENT ████████████████████████████████████████

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
// Set level minimum y value 
const LEVEL_MIN_Y = 1000;


// ███████████████████████████████████ GAME LOOP ████████████████████████████████████████

// Check player position each engine update
Matter.Events.on(engine, 'afterUpdate', function() {

  if (player.position.y > LEVEL_MIN_Y) {
    // Player is below level minimum, move back up

    Body.setPosition(player, {
      x: -100,
      y: -1000
    });


  }
 

});
  requestAnimationFrame(gameLoop);
}

gameLoop();


