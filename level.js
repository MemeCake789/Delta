import Matter from "matter-js";

var Bodies = Matter.Bodies,
    World = Matter.World;

class Level {
  constructor(wallData) {
    this.walls = wallData;
  }

  start(world) {
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

  end(world) {
    Matter.Composite.clear(world)
  }
}

export { Level };