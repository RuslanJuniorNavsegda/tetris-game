const canvas = document.getElementById("tetris");
const context = canvas.getContext("2d");
const BLOCK_SIZE = 30;
const COLS = 10;
const ROWS = 20;
let score = 0;
let level = 1;
let lines = 0;
let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;
let gameOver = false;

const SHAPES = [
  [[1, 1, 1, 1]],
  [
    [1, 1],
    [1, 1],
  ],
  [
    [1, 1, 1],
    [0, 1, 0],
  ],
  [
    [1, 1, 1],
    [1, 0, 0],
  ],
  [
    [1, 1, 1],
    [0, 0, 1],
  ],
  [
    [1, 1, 0],
    [0, 1, 1],
  ],
  [
    [0, 1, 1],
    [1, 1, 0],
  ],
];

const COLORS = [
  "#00f0f0",
  "#f0f000",
  "#a000f0",
  "#f0a000",
  "#0000f0",
  "#00f000",
  "#f00000",
];

const board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));

let piece = {
  shape: null,
  color: null,
  x: 0,
  y: 0,
};

function createPiece() {
  const shapeIndex = Math.floor(Math.random() * SHAPES.length);
  piece = {
    shape: SHAPES[shapeIndex],
    color: COLORS[shapeIndex],
    x: Math.floor(COLS / 2) - Math.floor(SHAPES[shapeIndex][0].length / 2),
    y: 0,
  };
}

function draw() {
  context.fillStyle = "#000";
  context.fillRect(0, 0, canvas.width, canvas.height);

  board.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        context.fillStyle = value;
        context.fillRect(
          x * BLOCK_SIZE,
          y * BLOCK_SIZE,
          BLOCK_SIZE - 1,
          BLOCK_SIZE - 1
        );
      }
    });
  });

  if (piece.shape) {
    piece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value) {
          context.fillStyle = piece.color;
          context.fillRect(
            (piece.x + x) * BLOCK_SIZE,
            (piece.y + y) * BLOCK_SIZE,
            BLOCK_SIZE - 1,
            BLOCK_SIZE - 1
          );
        }
      });
    });
  }
}

function collision() {
  return piece.shape.some((row, y) => {
    return row.some((value, x) => {
      if (!value) return false;
      const newX = piece.x + x;
      const newY = piece.y + y;
      return (
        newX < 0 ||
        newX >= COLS ||
        newY >= ROWS ||
        (newY >= 0 && board[newY][newX])
      );
    });
  });
}

function merge() {
  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        board[piece.y + y][piece.x + x] = piece.color;
      }
    });
  });
}

function clearLines() {
  let linesCleared = 0;
  outer: for (let y = ROWS - 1; y >= 0; y--) {
    for (let x = 0; x < COLS; x++) {
      if (!board[y][x]) continue outer;
    }
    const row = board.splice(y, 1)[0].fill(0);
    board.unshift(row);
    y++;
    linesCleared++;
  }
  if (linesCleared > 0) {
    lines += linesCleared;
    score += linesCleared * 100 * level;
    level = Math.floor(lines / 10) + 1;
    dropInterval = Math.max(100, 1000 - (level - 1) * 100);
    updateScore();
  }
}

function updateScore() {
  document.getElementById("score").textContent = score;
  document.getElementById("level").textContent = level;
  document.getElementById("lines").textContent = lines;
}

function rotate() {
  const rotated = piece.shape[0].map((_, i) =>
    piece.shape.map((row) => row[i]).reverse()
  );
  const previousShape = piece.shape;
  piece.shape = rotated;
  if (collision()) {
    piece.shape = previousShape;
  }
}

function move(dir) {
  piece.x += dir;
  if (collision()) {
    piece.x -= dir;
  }
}

function drop() {
  piece.y++;
  if (collision()) {
    piece.y--;
    merge();
    clearLines();
    createPiece();
    if (collision()) {
      gameOver = true;
      alert("Game Over! Score: " + score);
      resetGame();
    }
  }
  dropCounter = 0;
}

function resetGame() {
  board.forEach((row) => row.fill(0));
  score = 0;
  level = 1;
  lines = 0;
  dropInterval = 1000;
  gameOver = false;
  updateScore();
  createPiece();
}

function update(time = 0) {
  if (gameOver) return;

  const deltaTime = time - lastTime;
  lastTime = time;
  dropCounter += deltaTime;
  if (dropCounter > dropInterval) {
    drop();
  }
  draw();
  requestAnimationFrame(update);
}

createPiece();
update();
