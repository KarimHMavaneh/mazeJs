// =====================boilerplate code ==========
const {
  Engine,
  World,
  Render,
  Runner,
  Bodies,
  MouseConstraint,
  Mouse,
} = Matter;

const height = 600;
const width = 800;
const engine = Engine.create();
const { world } = engine;
const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    wireframes: false,
    // width and height of the canvas
    width,
    height,
  },
});

Render.run(render);
Runner.run(Runner.create(), engine);
// =========== End of Boilerplate code ============
// constraint
World.add(
  world,
  MouseConstraint.create(engine, {
    mouse: Mouse.create(render.canvas),
  })
);

// Creaate  Walls
const walls = [
  Bodies.rectangle(400, 0, 800, 40, { isStatic: true }),
  Bodies.rectangle(400, 600, 800, 40, { isStatic: true }),
  Bodies.rectangle(0, 300, 40, 600, { isStatic: true }),
  Bodies.rectangle(800, 300, 40, 600, { isStatic: true }),
];
// const shape = Bodies.rectangle(300, 80, 90, 150, {
//   // gravity is enabled by default otherwise put static to true
//   //   isStatic: true,
// });

// Random Shapes
for (let i = 0; i < 30; i++) {
  if (Math.random() > 0.5) {
    World.add(
      world,
      Bodies.rectangle(Math.random() * width, Math.random() * height, 70, 50)
    );
  } else {
    World.add(
      world,
      Bodies.circle(Math.random() * width, Math.random() * height, 20)
    );
  }
}

World.add(world, walls);
