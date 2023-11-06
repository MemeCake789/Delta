 // module aliases
 var Engine = Matter.Engine,
 Render = Matter.Render,
 World = Matter.World,
 Bodies = Matter.Bodies,
 Body = Matter.Body;

// create an engine
var engine = Engine.create();

// create a renderer
var render = Render.create({
 element: document.body,
 engine: engine
});

// create two boxes and a ground
var player = Bodies.rectangle(200, 200, 80, 80);
var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

var platform = Bodies.rectangle(400, 500, 300, 30, { isStatic: true });



// add all of the bodies to the world
World.add(engine.world, [player, ground, platform]);

// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);

// implement side scrolling
Matter.Events.on(engine, 'afterUpdate', function() {
 Render.lookAt(render, {
     min: { x: player.position.x - 400, y: 0 },
     max: { x: player.position.x + 400, y: 600 }
 });
});

// add controls
var isGrounded = false;

window.addEventListener('keydown', function(event) {
 switch (event.keyCode) {
     case 37: // left
         Body.setVelocity(player, {x: -5, y: player.velocity.y});
         break;
     case 39: // right
         Body.setVelocity(player, {x: 5, y: player.velocity.y});
         break;
     case 38: // up
         if (isGrounded) {
             Body.applyForce(player, player.position, {x: 0, y: -0.3});
             isGrounded = false;
         }
         break;

 }
});

// add collision events

Matter.Events.on(engine, 'collisionStart', function(event) {
 var pairs = event.pairs;

 for (var i = 0; i < pairs.length; i++) {
     var pair = pairs[i];

     if (pair.bodyA === player && pair.bodyB === ground || pair.bodyA === ground && pair.bodyB === player)  { // checks if player is colliding with the ground
         isGrounded = true;
     }
 }
});