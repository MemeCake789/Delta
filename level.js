class Boundary {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        let options = {
            friction: 0.3,
            restitution: 0.6,
            isStatic: true
        }
        this.body = Bodies.rectangle(this.x, this.y, this.w, this.h, options);
        Composite.add(world, this.body);
    }

    show() {
        let pos = this.body.position;
        let angle = this.body.angle;
        push();
        translate(pos.x, pos.y);
        rotate(angle);
        rectMode(CENTER);
        strokeWeight(1);
        noStroke();
        fill(0);
        rect(0, 0, this.w, this.h);
        pop();
    }
}

/*
class Wall {
    constructor(x, y, width, height) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      let options = {
        friction: 0.3,
        restitution: 0.6,
        isStatic: true
    }
    this.body = Bodies.rectangle(this.x, this.y, this.width, this.height, options);
    Composite.add(world, this.body);
    }

    show() {
        let pos = this.body.position;
        let angle = this.body.angle;
        push();
        translate(pos.x, pos.y);
        rotate(angle);
        rectMode(CENTER);
        strokeWeight(1);
        noStroke();
        fill(0);
        rect(0, 0, this.w, this.h);
        pop();
    }
  }
  
  class Level {
    constructor(name, walls) {
      this.name = name;
      this.walls = walls;
    }
  }
  
  // Define the levels as an array of Level instances
  const levels = [
    new Level("Level 1", [
      new Wall(100, 200, 200, 20),
      new Wall(300, 400, 20, 200),
      // Add more walls as needed
    ]),
    new Level("Level 2", [
      // Define the walls for level 2
    ]),
    // Add more levels as needed
  ];
  
  // Export the levels array
  export default levels;
  

*/