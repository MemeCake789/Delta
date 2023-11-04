// Coding Train / Daniel Shiffman
// 5.18 Matter.js tutorial 

// https://www.youtube.com/watch?v=uITcoKpbQq4

// Note that the syntax has been updated to use object destructuring
const { Engine, World, Bodies, Composite } = Matter;

let engine;
let world;
let circles = [];
let boundaries = [];

function setup() {
    createCanvas(400, 400);
    // create an engine
    engine = Engine.create();
    world = engine.world;
    boundaries.push(new Boundary(150, 100, width* 0.6, 20, 0.3));
    boundaries.push(new Boundary(250, 300, width* 0.6, 20, -0.3));  
}
    
function mouseDragged() {
    circles.push(new Circle(mouseX, mouseY, random(5, 10)));
}

function draw() {
    background(51);
    Engine.update(engine);
    for (let i = 0; i < circles.length; i++) {
        circles[i].show();
    }
    for (let i = 0; i < boundaries.length; i++) {
        boundaries[i].show();
    }
}