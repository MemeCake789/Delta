const Engine = Matter.Engine,
      World = Matter.World,
      Bodies = Matter.Bodies;

class Level {
  constructor(levelData) {
    this.walls = levelData;
    this.engine = Engine.create();
    this.world = this.engine.world;
  }

  startLevel() {
    this.walls.forEach(wall => {
      let wallBody = Bodies.rectangle(wall.x, wall.y, wall.width, wall.height);
      World.add(this.world, wallBody);
    });
  }

  endLevel() {
    World.clear(this.world);
    Engine.clear(this.engine); 
    this.walls = [];
  }
}


//class Level {
//  constructor() {
//    this.walls = [];
//  }
//
//  addWall(x, y, width, height, options) {
//    const defaultOptions = {
//      isStatic: true,
//      label: 'wall',
//      color: '#c2c2c2' 
//    };
//    const wallOptions = {...defaultOptions, ...options};
//    this.walls.push({
//      x: x, 
//      y: y,
//      width: width,
//      height: height, 
//      ...wallOptions
//    });
//  }
//
//  addToWorld(world) {
//    const bodies = this.walls.map(wall => {
//      return Bodies.rectangle(wall.x, wall.y, wall.width, wall.height, {
//        isStatic: wall.isStatic,
//        label: wall.label,
//        render: {
//          fillStyle: wall.color
//        }
//      });
//    });
//    World.add(world, bodies);
//  }
//}

export { Level };
