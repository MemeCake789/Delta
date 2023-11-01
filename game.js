// Import Matter.js
const Matter = require('matter-js');

// Import other necessary files
const Level = require('./level');
const Player = require('./player');
const Spawn = require('./spawn');

// Create a new engine
let engine = Matter.Engine.create();

// Create a new world for the engine
let world = engine.world;

// Create a Game class
class Game {
  constructor() {
    this.level = null;
    this.player = null;
    this.spawn = null;
  }

  start(levelNumber) {
    // Create a new level
    this.level = new Level(levelNumber);

    // Create a new player
    this.player = new Player(100, 100);

    // Create a new spawn manager
    this.spawn = new Spawn();

    // Start the game loop
    Matter.Engine.run(engine);
    this.update();
  }

  update() {
    // Update the game state here

    // Example: Move the player to the right
    this.player.moveRight();

    // Example: Spawn an object every 2 seconds
    if (Matter.Common.now() % 2000 === 0) {
      this.spawn.spawnObject(400, 200, 50, 50);
    }

    // Call the update method recursively to create a game loop
    requestAnimationFrame(() => this.update());
  }
}

module.exports = Game;
