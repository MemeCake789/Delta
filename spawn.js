// Import Matter.js
const Matter = require('matter-js');

// Create a Spawn class
class Spawn {
  constructor() {
    this.objects = [];
  }

  spawnObject(x, y, width, height) {
    const object = Matter.Bodies.rectangle(x, y, width, height);
    this.objects.push(object);
    Matter.World.add(world, object);
  }

  despawnAllObjects() {
    this.objects.forEach(object => {
      Matter.World.remove(world, object);
    });
    this.objects = [];
  }
}

module.exports = Spawn;
