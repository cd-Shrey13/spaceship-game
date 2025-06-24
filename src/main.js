const spaceShip = document.getElementById("space-ship");
const speedOfObstacle = 1;
let topPosition = 0;
const speedOfFireshot = 2;
const windowWidth = window.visualViewport.width;

const body = document.querySelector("body");

body.addEventListener("touchmove", (e) => {
  console.log(e);
  spaceShip.style.left = `${e.targetTouches[0].clientX}px`;
  spaceShip.style.top = `${e.targetTouches[0].clientY}px`;
});

body.addEventListener("touchmove", (e) => launchFireshot(e));

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

function launchFireshot(e) {
  const fireshot = createFireShot();
  const fireshotTopPosition = e.targetTouches[0].clientY;
  fireshot.style.left = `${e.targetTouches[0].clientX}px`;
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

setInterval(launchObstacle, 3000);
