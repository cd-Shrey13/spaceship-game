const spaceShip = document.getElementById("space-ship");
const speedOfObstacle = 1;
let topPosition = 0;
const speedOfFireshot = 2;
const windowWidth = window.visualViewport.width;

const body = document.querySelector("body");

spaceShip.addEventListener("touchmove", (e) => {
  const xCoords = e.targetTouches[0].clientX;
  const yCoords = e.targetTouches[0].clientY;

  if (50 < xCoords < window.innerWidth - 100)
    spaceShip.style.left = `${e.targetTouches[0].clientX}px`;
  // if (50 < yCoords < window.innerHeight - 100)
  //   spaceShip.style.top = `${e.targetTouches[0].clientY}px`;
});

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
  const obstacleXCords = Math.round(Math.random() * (windowWidth - 200));
  const obstacleTopPosition = 0;
  const obstacle = createObstacle();
  obstacle.style.left = `${obstacleXCords}px`;

  body.appendChild(obstacle);
  moveObstacle(obstacle, obstacleTopPosition);
}

function moveObstacle(obstacle, obstacleTopPosition) {
  obstacleTopPosition += speedOfObstacle;
  obstacle.style.top = `${obstacleTopPosition}px`;
  if (obstacleTopPosition > window.innerHeight - 200) {
    obstacle.remove();
  }
  requestAnimationFrame(() => {
    detectCollision();
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

function createExplosion() {
  const explosion = document.createElement("img");
  explosion.src = "exposion.png";
  explosion.setAttribute("class", "explosion");
  explosion.setAttribute("id", "explosion");
  explosion.style.position = "absolute";
  return explosion;
}

function launchFireshot() {
  const fireshot = createFireShot();
  console.log();

  const fireshotTopPosition = window.innerHeight - 150;
  fireshot.style.left = `${Math.round(
    Number.parseInt(spaceShip.style.left)
  )}px`;
  fireshot.style.top = `${fireshotTopPosition}px`;

  body.appendChild(fireshot);
  moveFireshot(fireshot, fireshotTopPosition);
}

function moveFireshot(fireshot, fireshotTopPosition) {
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

function detectCollision() {
  const obstacles = document.querySelectorAll(".obstacle");
  const fireshots = document.querySelectorAll(".fireshot");
  for (let i = 0; i < obstacles.length; i++) {
    for (let j = 0; j < fireshots.length; j++) {
      // Simple bounding box collision detection
      const obstacleRect = obstacles[i].getBoundingClientRect();
      const fireshotRect = fireshots[j].getBoundingClientRect();
      if (
        obstacleRect.left < fireshotRect.right &&
        obstacleRect.right > fireshotRect.left &&
        obstacleRect.top < fireshotRect.bottom &&
        obstacleRect.bottom > fireshotRect.top
      ) {
        // Collision detected, remove both
        showExplosion(obstacleRect.right, obstacleRect.top);
        obstacles[i].remove();
        fireshots[j].remove();

        return;
      }
    }
  }
}

function showExplosion(left, top) {
  const explosion = createExplosion();
  explosion.style.left = `${left}px`;
  explosion.style.top = `${top}px`;
  body.appendChild(explosion);
  setTimeout(() => {
    explosion.remove();
  }, 100);
}

setInterval(launchObstacle, 3000);
setInterval(launchFireshot, 1000);
