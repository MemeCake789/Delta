// Import Matter.js
const Matter = require('matter-js');

// Create a new engine
let engine = Matter.Engine.create();

// Create a new world for the engine
let world = engine.world;

// Define level data
const levelData = [
  {
    levelNumber: 1,
    staticBodies: [
      { x: 400, y: 610, width: 810, height: 60 },
      { x: 400, y: 500, width: 200, height: 10 },
      { x: 600, y: 400, width: 200, height: 10 }
    ]
  },
  {
    levelNumber: 2,
    staticBodies: [
      { x: 400, y: 610, width: 810, height: 60 },
      { x: 400, y: 500, width: 300, height: 10 },
      { x: 600, y: 400, width: 100, height: 10 },
      { x: 200, y: 300, width: 200, height: 10 }
    ]
  }
];

// Create a Level class
class Level {
  constructor(levelNumber) {
    this.levelNumber = levelNumber;
    this.staticBodies = [];

    // Find the level data for the given level number
    const level = levelData.find(data => data.levelNumber === levelNumber);

    if (level) {
      // Create static bodies based on level data
      level.staticBodies.forEach(bodyData => {
        const body = Matter.Bodies.rectangle(bodyData.x, bodyData.y, bodyData.width, bodyData.height, { isStatic: true });
        this.staticBodies.push(body);
      });
    }

    // Add all static bodies to the world
    Matter.World.add(world, this.staticBodies);
  }

  // You can add more methods to this class to add more functionality
}

module.exports = Level;
