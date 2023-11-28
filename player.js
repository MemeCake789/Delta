var Body = Matter.Body,
    Bodies = Matter.Bodies,
    World = Matter.World;

const playerWidth = 80;
const playerHeight = 80;
const hitboxWidth = playerWidth * 0.8; 
const hitboxHeight = 10;
let isJumping = false;

const player = Body.create({
  parts: [
    Bodies.rectangle(0, -500, playerWidth, playerHeight ,{
      render: {
        fillStyle: 'white',
        strokeStyle: 'grey',
        lineWidth: 8
      }
    }),
    Bodies.rectangle(0, -450, playerWidth*0.7, 20, {
      sleepThreshold: Infinity,
      isSensor: true,
      label: 'foot'
    }),
  ],
  frictionAir: 0.02,
  inertia: Infinity,
  label: 'player'
});

function isFootInContact(engine) {
  const footSensor = player.parts.find(part => part.label === 'foot');
  const bodies = engine.world.bodies;
  const collisions = Matter.Query.collides(footSensor, bodies);
  if (collisions.length === 1) {
    return false;
  } else {
    return true;
  }
}

 export { player , isFootInContact};
 