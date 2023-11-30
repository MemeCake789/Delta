var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,  
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Mouse = Matter.Mouse;

class Player {
  constructor() {
    this.width = 80;
    this.height = 80;
    this.isJumping = false;

    const bodyOptions = {
      parts: [
        Bodies.rectangle(0, -500, this.width, this.height, {
          render: {
            fillStyle: 'white',
            strokeStyle: 'grey',
            lineWidth: 8
          }
        }),
        Bodies.rectangle(0, -450, this.width * 0.7, 20, {
          sleepThreshold: Infinity,
          isSensor: true,
          label: 'foot'
        })
      ],
      frictionAir: 0.02,
      inertia: Infinity,
      label: 'player'
    };

    this.body = Body.create(bodyOptions);
  }

  isFootInContact(engine) { // Move the function inside the class
    const footSensor = this.body.parts.find(part => part.label === 'foot');
    const bodies = engine.world.bodies;
    const collisions = Matter.Query.collides(footSensor, bodies);

    const isFootInContact = collisions.length === 1;

    return isFootInContact;
  }
}

export default Player;
