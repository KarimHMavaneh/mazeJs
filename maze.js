// =====================boilerplate code ==========
const { Engine, World, Render, Runner, Bodies, Body, Events } = Matter;
const cellsHorizontal =20;
const cellsVertical = 20
const height = window.innerHeight;
const width = window.innerWidth;
const rectLengthX = width / cellsHorizontal;
const rectLengthY = height / cellsVertical;

const engine = Engine.create();
// disable gravity
engine.world.gravity.y = 0;
const { world } = engine;
const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    wireframes: false,
    // width and height of the canva s
    width,
    height,
  },
});

Render.run(render);
Runner.run(Runner.create(), engine);
// =========== End of Boilerplate code ============

// Creaate  Walls
const walls = [
  Bodies.rectangle(width / 2, 0, width, 4, { isStatic: true }),
  Bodies.rectangle(width / 2, height, width, 4, { isStatic: true }),
  Bodies.rectangle(0, height / 2, 4, height, { isStatic: true }),
  Bodies.rectangle(width, height / 2, 4, height, { isStatic: true }),
];

World.add(world, walls);

// Maze generation
const shuffle = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};
const grid = Array(cellsVertical)
  .fill(null)
  .map(() => Array(cellsHorizontal).fill(false));

const verticals = Array(cellsVertical)
  .fill(null)
  .map(() => Array(cellsHorizontal - 1).fill(false));

const horizontals = Array(cellsVertical - 1)
  .fill(null)
  .map(() => Array(cellsHorizontal).fill(false));

const startRow = Math.floor(Math.random() * cellsVertical);
const startColumn = Math.floor(Math.random() * cellsHorizontal);

const traverseTheCells = (row, col) => {
  //If the cell has  already been visited then return.
  if (grid[row][col]) {
    return;
  }
  // if Not Mark this cell as being visited
  grid[row][col] = true;
  // Assemble randomly-ordered list of neighbors
  const neighbors = shuffle([
    [row - 1, col, "up"],
    [row, col + 1, "right"],
    [row + 1, col, "down"],
    [row, col - 1, "left"],
  ]);

  for (let neighbor of neighbors) {
    const [nextRow, nextCol, direction] = neighbor;
    // For each neighbor....
    // See if that neighbor is out of bounds
    if (
      nextRow < 0 ||
      nextRow >= cellsVertical ||
      nextCol < 0 ||
      nextCol >= cellsHorizontal
    ) {
      continue;
    }
    // If we have visited that neighbor, contine to next neighbor
    if (grid[nextRow][nextCol]) {
      continue;
    }
    // Remove a wall from either horizontals or verticals
    if (direction === "left") {
      verticals[row][col - 1] = true;
    } else if (direction === "right") {
      verticals[row][col] = true;
    } else if (direction === "up") {
      horizontals[row - 1][col] = true;
    } else if (direction === "down") {
      horizontals[row][col] = true;
    }
    traverseTheCells(nextRow, nextCol);
  }
};
traverseTheCells(startRow, startColumn);

horizontals.forEach((row, rowIdx) => {
  row.forEach((open, colIdx) => {
    if (open) {
      return;
    }
    // console.log(rectLength, rowIdx, colIdx);
    const wall = Bodies.rectangle(
      colIdx * rectLengthX + rectLengthX / 2,
      rowIdx * rectLengthY + rectLengthY,
      rectLengthX,
      3,
      {
        label: "wall",
        isStatic: true,
        render: {
          fillStyle: "orange",
        },
      }
    );
    // const wall = Bodies.rectangle(width / 2, 200, 30, 4, { isStatic: true });
    World.add(world, wall);
  });
});

verticals.forEach((row, rowIdx) => {
  row.forEach((open, colIdx) => {
    if (open) {
      return;
    }
    // console.log(rectLength, rowIdx, colIdx);
    const wall = Bodies.rectangle(
      colIdx * rectLengthX + rectLengthX,
      rowIdx * rectLengthY + rectLengthY / 2,
      3,
      rectLengthY,
      {
        label: "wall",
        isStatic: true,
        render: {
          fillStyle: "orange",
        },
      }
    );
    // const wall = Bodies.rectangle(width / 2, 200, 30, 4, { isStatic: true });
    World.add(world, wall);
  });
});
// Goal
const goal = Bodies.rectangle(
  width - rectLengthX / 2,
  height - rectLengthY / 2,
  rectLengthX * 0.7,
  rectLengthY * 0.7,
  {
    label: "goal",
    isStatic: true,
    render: {
      fillStyle: "blue",
    },
  }
);

World.add(world, goal);
// ball
const radius = Math.min(rectLengthX, rectLengthX) / 4;
const ball = Bodies.circle(rectLengthX / 2, rectLengthY / 2, radius, {
  isStatic: false,
  label: "ball",
  render: {
    fillStyle: "green",
  },
});
World.add(world, ball);

document.addEventListener("keydown", (event) => {
  const { x, y } = ball.velocity;
  if (event.key === "ArrowUp") {
    Body.setVelocity(ball, { x, y: y - 5 });
  }
  if (event.key === "ArrowRight") {
    Body.setVelocity(ball, { x: x + 5, y });
  }
  if (event.key === "ArrowDown") {
    Body.setVelocity(ball, { x, y: y + 3 });
  }
  if (event.key === "ArrowLeft") {
    Body.setVelocity(ball, { x: x - 5, y });
  }
});

// win condition
Events.on(engine, "collisionStart", (event) => {
  event.pairs.forEach((collision) => {
    const labels = ["ball", "goal"];
    if (
      labels.includes(collision.bodyA.label) &&
      labels.includes(collision.bodyB.label)
    ) {
      document.querySelector(".winner").classList.remove("hidden");
      world.gravity.y = 1;
      world.bodies.forEach((body) => {
        if (body.label === "wall") {
          Body.setStatic(body, false);
        }
      });
    }
  });
});
