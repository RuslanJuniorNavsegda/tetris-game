window.speedMultiplier = 1;

document.getElementById("speed1x").addEventListener("click", () => setSpeed(1));
document.getElementById("speed2x").addEventListener("click", () => setSpeed(2));
document.getElementById("speed3x").addEventListener("click", () => setSpeed(3));

function setSpeed(multiplier) {
  window.speedMultiplier = multiplier;
  document
    .querySelectorAll(".speed-btn")
    .forEach((btn) => btn.classList.remove("active"));
  document.getElementById(`speed${multiplier}x`).classList.add("active");
}

const mobileButtons = {
  "left-btn": () => move(-1),
  "right-btn": () => move(1),
  "down-btn": () => drop(),
  "rotate-btn": () => rotate(),
  "drop-btn": () => {
    while (!collision()) {
      piece.y++;
    }
    piece.y--;
    merge();
    clearLines();
    createPiece();
  },
};

Object.entries(mobileButtons).forEach(([id, action]) => {
  const button = document.getElementById(id);
  if (button) {
    button.addEventListener("touchstart", (e) => {
      e.preventDefault();
      action();
    });

    button.addEventListener("mousedown", (e) => {
      e.preventDefault();
      action();
    });
  }
});

document.addEventListener("keydown", (event) => {
  if (gameOver) return;

  switch (event.keyCode) {
    case 37:
      move(-1);
      break;
    case 39:
      move(1);
      break;
    case 40:
      drop();
      break;
    case 38:
      rotate();
      break;
    case 32:
      while (!collision()) {
        piece.y++;
      }
      piece.y--;
      merge();
      clearLines();
      createPiece();
      break;
  }
});
