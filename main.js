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
    wireframes: false,
    showDebug: true,
    background: '#303030' // color name or hex code

    
  },
  
  
});

var easeAmount = 0.05;
// Player
const playerWidth = 80;
const playerHeight = 80;
const hitboxWidth = playerWidth * 0.8; 
const hitboxHeight = 10;



const player = Body.create({
  parts: [
    Bodies.rectangle(0, -500, playerWidth, playerHeight ,{
      render: {
        fillStyle: 'white',
        strokeStyle: 'grey',
        lineWidth: 8
   }
    }),
    Bodies.rectangle(0, -450, hitboxWidth, hitboxHeight, {label: 'foot',
    render:{
      fillStyle: '#212121',

    }
  }), // thanks to landgreen for helping with this
    Bodies.polygon(0, -500, 3, 10, { label: 'eye',   angle: Math.PI,
    render:{
      fillStyle: 'white',
      strokeStyle: 'grey',
      lineWidth: 8,
    }
  }),
    Bodies.rectangle(24,-500,28,1,{ label: 'mouth',
      render:{
        fillStyle: 'grey',
        strokeStyle: 'grey',
        lineWidth: 4,
      }
    })
  ],
  
  frictionAir: 0.02,
  inertia: Infinity, // stop rotation
  label: 'player'
});



// ███████████████████████████████████ WALLS ████████████████████████████████████████

// wall contact jumping  
let touchingWall = false;


// Level class with hitboxes
class Level {

  constructor() {
    this.walls = [];
  }

  addWall(x, y, width, height, options) {

    // Default options
    const defaultOptions = {
      isStatic: true,
      label: 'wall',
      color: '#c2c2c2' 
    };

    // Merge passed in options with defaults
    const wallOptions = {...defaultOptions, ...options};

    // Add wall with options
    this.walls.push({
      x: x, 
      y: y,
      width: width,
      height: height, 
      ...wallOptions
    });

  }

  addToWorld(world) {
    
    // Create wall bodies
    const bodies = this.walls.map(wall => {
      return Bodies.rectangle(wall.x, wall.y, wall.width, wall.height, {
        isStatic: wall.isStatic,
        label: wall.label,
        render: {
          fillStyle: wall.color
        }
      });
    });
    
    // Add to world
    World.add(world, bodies);

  }

}

// Usage:

const level = new Level();

level.addWall(0, 0, 100, 100, {color: 'blue'}); 
level.addWall(100, 0, 100, 100, {isStatic: false});

// create level  
var level1 = new Level();


level1.addWall(0, 0, 1000, 60, {color: 'blue'});
level1.addWall(-500,-220,100,500)
level1.addWall(450,-350,100,250)
level1.addWall(300,-250,300,50)
level1.addWall(-400,-150,150,50)
level1.addWall(0,-250,100,50)



// add bodies to world 
World.add(engine.world, [player]);
level1.addToWorld(engine.world);

// run engine
Engine.run(engine); 

// run renderer  
Render.run(render);

// ███████████████████████████████████ COLLISION ████████████████████████████████████████



Matter.Events.on(engine, 'collisionStart', function(event) {

  event.pairs.forEach(pair => {
    if (pair.bodyA.label === 'foot' || pair.bodyB.label === 'foot') {
      touchingWall = true;
    }  
  });

});

Matter.Events.on(engine, 'collisionEnd', function(event) {
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
  targetMin.y = player.position.y + ( (mouse.position.y / 4) - 500 );

  targetMax.x = player.position.x + ( (mouse.position.x *0.7) + 400 );
  targetMax.y = player.position.y + ( (mouse.position.y *0.7) + 400 );
  
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


