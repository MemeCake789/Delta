var Bodies = Matter.Bodies,
    World = Matter.World;

class Level {
  constructor() {
    this.walls = [];//
  }

  addWall(x, y, width, height, options) {
    const defaultOptions = {
      isStatic: true,
      label: 'wall',
      color: '#c2c2c2' 
    };
    const wallOptions = {...defaultOptions, ...options};
    this.walls.push({
      x: x, 
      y: y,
      width: width,
      height: height, 
      ...wallOptions
    });
  }

  addToWorld(world) {
    const bodies = this.walls.map(wall => {
      return Bodies.rectangle(wall.x, wall.y, wall.width, wall.height, {
        isStatic: wall.isStatic,
        label: wall.label,
        render: {
          fillStyle: wall.color
        }
      });
    });
    World.add(world, bodies);
  }
}

export { Level };
