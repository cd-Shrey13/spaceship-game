// ==========================\n// Game Constants & Variables\n// ==========================
const gameBackgroundMusic = new Audio("/music.mp3");
const gameOverSound = new Audio("/gameover.wav");
const explosionSound = new Audio("/explosion3.ogg");
const fireshotSound = new Audio("/laser3.ogg");

const spaceShip = document.getElementById("space-ship");
const playground = document.getElementById("playground");
const body = document.querySelector("body");
const scoreBoard = document.getElementById("score-board");
const gameoverDialog = document.getElementById("game-over-dialog");

let SCORE = 0;
const SCORE_OFFSET = 100;
let DIFFICULTY_INCREASE_DELAY = 20000;
let OBSTACLE_SPAWN_DELAY = 5000;
let OBSTACLE_SPAWN_DELAY_OFFSET = 1000;
let OBSTACLE_SPEED = 1;
const speedOfFireshot = 2;

let obstacleIntervalId = null;
let difficultyInvervalId = null;
let fireLoopId = null;
let isFiring = false;
let isDragging = false;

// ==========================\n// Game Initialization\n// ==========================
window.onload = () => {
  // gameBackgroundMusic.play();
  // gameBackgroundMusic.loop = true;
  gameStart();
};

function gameStart() {
  resetGameStats();
  setupTouchControls();
  setupMouseControls();
  setupKeyboardControls();
  setupFiringControls();
  displayScore();
  obstacleIntervalId = setInterval(launchObstacle, OBSTACLE_SPAWN_DELAY);
  difficultyInvervalId = setInterval(
    difficultyIncrease,
    DIFFICULTY_INCREASE_DELAY
  );
}

function resetGameStats() {
  SCORE = 0;
  DIFFICULTY_INCREASE_DELAY = 20000;
  OBSTACLE_SPAWN_DELAY = 5000;
  OBSTACLE_SPAWN_DELAY_OFFSET = 1000;
  OBSTACLE_SPEED = 1;
  return;
}

// ==========================\n// User Input Handlers\n// ==========================
function setupTouchControls() {
  spaceShip.addEventListener("touchmove", (e) => {
    const touchX = e.targetTouches[0].clientX;
    const playgroundRect = playground.getBoundingClientRect();
    const shipRect = spaceShip.getBoundingClientRect();
    const shipHalfWidth = shipRect.width / 2;

    const x = e.clientX - playgroundRect.left; // Mouse X inside playground
    const clampedX = Math.max(
      shipHalfWidth,
      Math.min(playgroundRect.width - shipHalfWidth, x)
    );
    spaceShip.style.left = `${clampedX - shipHalfWidth}px`;
  });
}

function setupMouseControls() {
  spaceShip.addEventListener("mousedown", () => (isDragging = true));

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const playgroundRect = playground.getBoundingClientRect();
    const shipRect = spaceShip.getBoundingClientRect();
    const shipHalfWidth = shipRect.width / 2;

    const x = e.clientX - playgroundRect.left; // Mouse X inside playground
    const clampedX = Math.max(
      shipHalfWidth,
      Math.min(playgroundRect.width - shipHalfWidth, x)
    );
    spaceShip.style.left = `${clampedX - shipHalfWidth}px`;
  });

  document.addEventListener("mouseup", () => (isDragging = false));
}

function setupKeyboardControls() {
  document.addEventListener("keydown", (e) => {
    const moveStep = 20;
    const playgroundRect = playground.getBoundingClientRect();
    const shipRect = spaceShip.getBoundingClientRect();

    if (e.code === "ArrowLeft") {
      let newLeft = shipRect.left - moveStep - playgroundRect.left;
      newLeft = Math.max(newLeft, 0);
      spaceShip.style.left = `${newLeft}px`;
    }

    if (e.code === "ArrowRight") {
      let newLeft = shipRect.left + moveStep - playgroundRect.left;
      newLeft = Math.min(newLeft, playgroundRect.width - shipRect.width);
      spaceShip.style.left = `${newLeft}px`;
    }

    if (e.code === "Space") {
      launchFireshot();
    }
  });
}

function setupFiringControls() {
  spaceShip.addEventListener("touchstart", startFiring);
  spaceShip.addEventListener("mousedown", startFiring);
  document.addEventListener("touchend", stopFiring);
  document.addEventListener("mouseup", stopFiring);
}

function startFiring() {
  if (isFiring) return;
  isFiring = true;
  fireLoopId = setInterval(() => launchFireshot(), 500);
}

function stopFiring() {
  isFiring = false;
  clearInterval(fireLoopId);
}

gameoverDialog.addEventListener("click", () => {
  gameoverDialog.style.visibility = "hidden";
  gameStart();
});

// ==========================\n// Game Object Creation\n// ==========================
function createObstacle() {
  const obstacle = document.createElement("img");
  obstacle.src = "rock (2).png";
  obstacle.classList.add("obstacle");
  obstacle.style.position = "absolute";
  return obstacle;
}

function createFireShot() {
  const fireshot = document.createElement("img");
  fireshot.src = "fireshot.gif";
  fireshot.classList.add("fireshot");
  fireshot.style.position = "absolute";
  return fireshot;
}

// ==========================\n// Game Logic\n// ==========================
function launchObstacle() {
  let obstacleTopPosition = 0;
  const obstacle = createObstacle();

  const playgroundRect = playground.getBoundingClientRect();
  playground.appendChild(obstacle);

  const obstacleWidth = obstacle.getBoundingClientRect().width;
  const maximumX = playgroundRect.width - obstacleWidth;
  const randomX = Math.random() * maximumX;

  obstacle.style.left = `${randomX}px`;
  // obstacle.style.top= `0px`
  moveObstacle(obstacle, obstacleTopPosition);
}

function moveObstacle(obstacle, obstacleTopPosition) {
  if (!document.body.contains(obstacle)) return;

  obstacleTopPosition += OBSTACLE_SPEED;
  obstacle.style.top = `${obstacleTopPosition}px`;

  if (checkSpaceshipCollision()) {
    gameOver();
    return;
  }

  const playgroundRect = playground.getBoundingClientRect();
  if (obstacleTopPosition >= playgroundRect.bottom) {
    obstacle.remove();
    return;
  }

  requestAnimationFrame(() => moveObstacle(obstacle, obstacleTopPosition));
}

function launchFireshot() {
  const playgroundRect = playground.getBoundingClientRect();
  const shipCoords = spaceShip.getBoundingClientRect();

  const relX = shipCoords.left - playgroundRect.left;
  const relY = shipCoords.top - playgroundRect.top;

  const fireshot = createFireShot();
  fireshot.style.left = `${relX + shipCoords.width / 2}px`;
  fireshot.style.top = `${relY}px`;

  playground.appendChild(fireshot);
  moveFireshot(fireshot, relY);
}

function moveFireshot(fireshot, fireshotTopPosition) {
  if (!document.body.contains(fireshot)) return;

  fireshotTopPosition -= speedOfFireshot;
  fireshot.style.top = `${fireshotTopPosition}px`;

  const hit = checkObstacleCollision(fireshot);
  if (hit) {
    showExplosion(hit, fireshot);
    increaseScore();
    return;
  }

  const playgroundRect = playground.getBoundingClientRect();
  if (fireshotTopPosition <= playgroundRect.top) {
    fireshot.remove();
    return;
  }

  requestAnimationFrame(() => moveFireshot(fireshot, fireshotTopPosition));
}

function showExplosion(obstacle, fireshot) {
  fireshot.remove();
  obstacle.src = `exposion.png`;
  setTimeout(() => obstacle.remove(), 100);
}

// ==========================\n// Collision Detection\n// ==========================
function checkObstacleCollision(fireshot) {
  const shotRect = fireshot.getBoundingClientRect();
  const obstacles = document.querySelectorAll(".obstacle");

  for (const obstacle of obstacles) {
    const obsRect = obstacle.getBoundingClientRect();
    if (
      obsRect.left < shotRect.right &&
      obsRect.right > shotRect.left &&
      obsRect.top < shotRect.bottom &&
      obsRect.bottom > shotRect.top
    ) {
      return obstacle;
    }
  }
  return null;
}

function checkSpaceshipCollision() {
  const obstacles = document.querySelectorAll(".obstacle");
  const shipRect = spaceShip.getBoundingClientRect();

  for (const obs of obstacles) {
    const obsRect = obs.getBoundingClientRect();
    if (
      obsRect.left < shipRect.right &&
      obsRect.right > shipRect.left &&
      obsRect.top < shipRect.bottom &&
      obsRect.bottom > shipRect.top
    ) {
      return true;
    }
  }
  return false;
}

// ==========================\n// Game State Management\n// ==========================
function gameOver() {
  document.querySelectorAll(".obstacle").forEach((el) => el.remove());
  document.querySelectorAll(".fireshot").forEach((el) => el.remove());
  gameOverSound.play();
  gameoverDialog.style.visibility = "visible";
  clearInterval(fireLoopId);
  clearInterval(obstacleIntervalId);
  clearInterval(difficultyInvervalId);
  gameBackgroundMusic.pause();
  // TODO: Add Game Over Screen or Restart Option
}

// ==========================\n// Score & Difficulty System\n// ==========================
function increaseScore() {
  SCORE += SCORE_OFFSET;
  displayScore();
  return;
  // TODO: Update score display in UI
}

function resetScore() {
  SCORE = 0;
  displayScore();
  return;
  // TODO: Reset score display in UI
}

function displayScore() {
  scoreBoard.innerText = `${SCORE}`;
  return;
}

function difficultyIncrease() {
  if (OBSTACLE_SPAWN_DELAY == 2000) {
    OBSTACLE_SPAWN_DELAY_OFFSET = 500;
  }
  if (OBSTACLE_SPAWN_DELAY == 1000) {
    OBSTACLE_SPAWN_DELAY_OFFSET = 100;
  }
  OBSTACLE_SPAWN_DELAY -= OBSTACLE_SPAWN_DELAY_OFFSET;
  OBSTACLE_SPEED++;
}
