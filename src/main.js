const gameBackgroundMusic = new Audio("/music.mp3");
const gameOverSound = new Audio("/gameover.wav");
const spaceShip = document.getElementById("space-ship");
const spaceshipCoords = spaceShip.getBoundingClientRect();
const playground = document.getElementById("playground");
const playgroundCoords = playground.getBoundingClientRect();
const speedOfObstacle = 1;
const speedOfFireshot = 2;
const windowWidth = window.visualViewport.width;
const body = document.querySelector("body");
const bodyCoords = body.getBoundingClientRect();
const explosionSound = new Audio('/explosion3.ogg')
const fireshotSound = new Audio('/laser3.ogg')

let obstacleIntervalId;
let fireshotIntervalId;


window.onload = () => {
    gameBackgroundMusic.play();
  gameBackgroundMusic.loop = true;
  gameStart();
}


function gameStart() {
  spaceShip.addEventListener("touchmove", (e) => {
    spaceShip.style.left = `${e.targetTouches[0].clientX}px`;
  });
  obstacleIntervalId = setInterval(launchObstacle, 3000);
  fireshotIntervalId = setInterval(launchFireshot, 500);
}

// body.addEventListener("touchmove", (e) => launchFireshot(e));

function createObstacle() {
  const obstacle = document.createElement("img");
  obstacle.src = "rock (2).png";
  obstacle.setAttribute("class", "obstacle");
  obstacle.setAttribute("id", "obstacle");
  obstacle.style.position = "absolute";

  return obstacle;
}

function launchObstacle() {
  const obstacleXCords = Math.round(Math.random() * windowWidth);
  const obstacleTopPosition = 0;
  const obstacle = createObstacle();
  obstacle.style.left = `${obstacleXCords}px`;

  body.appendChild(obstacle);
  moveObstacle(obstacle, obstacleTopPosition);
}

function moveObstacle(obstacle, obstacleTopPosition) {
  if (detectCollisionWithSpaceship()) {
    gameOver();
  }

  obstacleTopPosition += speedOfObstacle;
  obstacle.style.top = `${obstacleTopPosition}px`;
  if (obstacleTopPosition > bodyCoords.height) {
    obstacle.remove();
  }
  requestAnimationFrame(() => {
    moveObstacle(obstacle, obstacleTopPosition);
  });
}

function createFireShot() {
  const fireshot = document.createElement("img");
  fireshot.src = "fire-shot.png";
  fireshot.setAttribute("class", "fireshot");
  fireshot.setAttribute("id", "fireshot");
  fireshot.style.position = "absolute";

  return fireshot;
}

function launchFireshot() {
  const fireshot = createFireShot();

  const spaceshipCoords = spaceShip.getBoundingClientRect();
  const fireshotTopPosition = spaceshipCoords.top - spaceshipCoords.height / 2;
  fireshot.style.left = `${spaceshipCoords.left + spaceshipCoords.width / 2}px`;
  // fireshot.style.top = `${spaceshipCoords.top + spaceshipCoords.height / 2}px`;

  body.appendChild(fireshot);
  // fireshotSound.play();
  moveFireshot(fireshot, fireshotTopPosition);
}

function moveFireshot(fireshot, fireshotTopPosition) {
  if (detectCollisionWithObstacle()) {
    alert("Game Over!");
    return;
  }
  fireshotTopPosition -= speedOfFireshot;
  fireshot.style.top = `${fireshotTopPosition}px`;
  if (fireshotTopPosition < 0) {
    fireshot.remove();
    return;
  }
  requestAnimationFrame(() => {
    moveFireshot(fireshot, fireshotTopPosition);
  });
}

function detectCollisionWithObstacle() {
  const obstacles = document.querySelectorAll(".obstacle");
  const fireshots = document.querySelectorAll(".fireshot");
  for (let i = 0; i < obstacles.length; i++) {
    for (let j = 0; j < fireshots.length; j++) {
      const obstacleRect = obstacles[i].getBoundingClientRect();
      const fireshotRect = fireshots[j].getBoundingClientRect();

      if (
        obstacleRect.left < fireshotRect.right &&
        obstacleRect.right > fireshotRect.left &&
        obstacleRect.top < fireshotRect.bottom &&
        obstacleRect.bottom > fireshotRect.top
      ) {
        explosionSound.play();
        showExplosion(obstacles[i], fireshots[j]);
      }
    }
  }
}
function detectCollisionWithSpaceship() {
  const obstacles = document.querySelectorAll(".obstacle");
  const spaceshipRect = spaceShip.getBoundingClientRect();

  for (let i = 0; i < obstacles.length; i++) {
    const obstacleRect = obstacles[i].getBoundingClientRect();

    if (
      obstacleRect.left < spaceshipRect.right &&
      obstacleRect.right > spaceshipRect.left &&
      obstacleRect.top < spaceshipRect.bottom &&
      obstacleRect.bottom > spaceshipRect.top
    ) {
      return true;
    }
  }
  return false;
}

function showExplosion(obstacle, fireshot) {
  fireshot.remove();
  obstacle.src = `exposion.png`;
  setTimeout(() => {
    obstacle.remove();
  }, 100);
}

function gameOver() {
  document.querySelectorAll(".obstacle").forEach((obstacle) => {
    obstacle.remove();
  });
  document.querySelectorAll(".fireshot").forEach((fireshot) => {
    fireshot.remove();
  });
  spaceShip.remove();
  clearInterval(fireshotIntervalId);
  clearInterval(obstacleIntervalId);
  gameBackgroundMusic.pause();
  gameOverSound.play();
}

