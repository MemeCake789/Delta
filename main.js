// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    mouse = Matter.Mouse.create(document.body);

// create an engine
var engine = Engine.create();

// create a renderer
var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: window.innerWidth,
        height: window.innerHeight
    }
});

// create two boxes and a ground
var player = Bodies.rectangle(200, 200, 80, 80);
var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

var platform = Bodies.rectangle(400, 500, 300, 30, { isStatic: true });
var platform2 = Bodies.rectangle(500, 400, 300, 30, { isStatic: true });
var platform3 = Bodies.rectangle(600, 300, 300, 30, { isStatic: true });

// add all of the bodies to the world
World.add(engine.world, [player, ground, platform, platform2, platform3]);

// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);

// implement side scrolling
// Create a mouse input
var mouse = Matter.Mouse.create(render.canvas);

// Create target positions for the camera
var targetMin = { x: player.position.x - 500, y: player.position.y - 200 };
var targetMax = { x: player.position.x + 500, y: player.position.y + 200 };

// Set the camera's initial position
Render.lookAt(render, {
    min: targetMin,
    max: targetMax
});

Matter.Events.on(engine, 'afterUpdate', function () {
    // Get the mouse position
    var mousePosition = mouse.position;

    // Update the target positions
    targetMin.x = Math.min(player.position.x, mousePosition.x) - 500;
    targetMin.y = Math.min(player.position.y, mousePosition.y) - 200;
    targetMax.x = Math.max(player.position.x, mousePosition.x) + 500;
    targetMax.y = Math.max(player.position.y, mousePosition.y) + 200;

    // Update the camera's position
    var easeAmount = 0.05;
    render.bounds.min.x += (targetMin.x - render.bounds.min.x) * easeAmount;
    render.bounds.min.y += (targetMin.y - render.bounds.min.y) * easeAmount;
    render.bounds.max.x += (targetMax.x - render.bounds.max.x) * easeAmount;
    render.bounds.max.y += (targetMax.y - render.bounds.max.y) * easeAmount;

    // Apply the updated position to the Render.lookAt function
    Render.lookAt(render, {
        min: render.bounds.min,
        max: render.bounds.max
    });
});


// add controls
var isGrounded = false;

let keys = {
    37: false, // left
    39: false, // right
    38: false, // up
    87: false, // W
    65: false, // A
    83: false, // S
    68: false  // D
}

window.addEventListener('keydown', function (event) {
    if (event.keyCode in keys) {
        keys[event.keyCode] = true;
    }
});

window.addEventListener('keyup', function (event) {
    if (event.keyCode in keys) {
        keys[event.keyCode] = false;
    }
});

function gameLoop() {
    if (keys[37] || keys[65]) { // left or A
        Body.setVelocity(player, { x: -5, y: player.velocity.y });
    }
    if (keys[39] || keys[68]) { // right or D
        Body.setVelocity(player, { x: 5, y: player.velocity.y });
    }
    if ((keys[38] || keys[87]) && isGrounded) { // up or W
        Body.applyForce(player, player.position, { x: 0, y: -0.5 });
        isGrounded = false;
    }
    requestAnimationFrame(gameLoop);
}

gameLoop();

// add collision events
Matter.Events.on(engine, 'collisionStart', function (event) {
    var pairs = event.pairs;

    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i];

        if (pair.bodyA === player && pair.bodyB === ground || pair.bodyA === ground && pair.bodyB === player) { // checks if player is colliding with the ground
            isGrounded = true;
        }
    }
});

mouse.element.addEventListener('mousemove', function (event) {
    let position = Matter.Mouse._getRelativeMousePosition(event, mouse.element, mouse.pixelRatio);
    document.getElementById('mousePosition').textContent = `Mouse position: (${position.x}, ${position.y})`;
    document.getElementById('mousePosition').style.left = `${ mousePosition.x}px`;
    document.getElementById('mousePosition').style.top = `${ mousePosition.y}px`;
});

