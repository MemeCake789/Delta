// Import Matter.js
const Matter = require('matter-js');

// Create a Player class
class Player {
  constructor(x, y) {
    this.playerBody = Matter.Bodies.rectangle(x, y, 50, 50);
    Matter.World.add(world, this.playerBody);
  }

  moveLeft() {
    Matter.Body.applyForce(this.playerBody, this.playerBody.position, { x: -0.05, y: 0 });
  }

  moveRight() {
    Matter.Body.applyForce(this.playerBody, this.playerBody.position, { x: 0.05, y: 0 });
  }

  jump() {
    Matter.Body.applyForce(this.playerBody, this.playerBody.position, { x: 0, y: -0.1 });
  }
}

module.exports = Player;
