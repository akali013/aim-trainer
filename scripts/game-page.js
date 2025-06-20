const target = document.querySelector(".js-target");
const url = new URL(window.location.href);
const difficulty = url.searchParams.get("difficulty");
let clickTime;    // How many ms the user has to click the target before it moves
let missPenalty;    // Deduct this amount from score when a click is missed
let score = 0;
let personalBest = JSON.parse(localStorage.getItem(`${difficulty}-pb`)) || 0;

beginSession();

function beginSession() {
  switch (difficulty) {
    case "easy": {
      loadEasyMode(); 
      break;
    }
  }
  loadTimer();
  loadScore();

  // Register when the target is clicked
  document.querySelector(".js-target").addEventListener("click", registerClick);
}

function registerClick() {
  score += 1;
  loadScore();
  repositionTarget();
}

// Easy mode will have 
// - target padding of 25px
// - unlimited time to click target
// - no penalty for missed clicks
function loadEasyMode() {
  target.style.padding = "25px";
  clickTime = "";
  missPenalty = 0;
}

// Loads a 1 minute timer into the screen
async function loadTimer() {
  let time = 60;    // 60 seconds
  const timer = document.querySelector(".js-timer");
  while (time >= 0) {
    await timeout(1000);  // Wait one second
    timer.innerHTML = time;
    time--; 
  }
  endSession();
}

// Wait a given number of milliseconds via a 
// returned promise that's handled with an await 
function timeout(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

// Renders the score on the screen below the timer
function loadScore() {
  const scoreElement = document.querySelector(".js-score");
  scoreElement.innerHTML = score;
}

// Handles the app when the timer ends
function endSession() {
  // Disable clicking the target first
  target.removeEventListener("click", registerClick);
  if (score > personalBest) {
    personalBest = score;
    localStorage.setItem(`${difficulty}-pb`, JSON.stringify(score));
  }
  const results = document.querySelector(".js-results-container");
  results.innerHTML = `
    <div class="results">
      <div class="results-info">
        <div>
          Score: ${score}
        </div>
        <div>
          Personal Best: ${personalBest}
        </div>
      </div>

      <div class="buttons-container">
        <button class="return-button js-return-button">
          Return
        </button>

        <button class="restart-button js-restart-button">
          Restart
        </button>
      </div>
    </div>
  `;

  document.querySelector(".js-return-button").addEventListener("click", () => {
    window.location.href = "start-page.html";
  });
  document.querySelector(".js-restart-button").addEventListener("click", () => {
    beginSession();
    results.innerHTML = "";
  });
}

// Moves the target to another position in the screen when clicked.
function repositionTarget() { 
  target.style.left = getRandomOffsetX() + "px";
  target.style.top = getRandomOffsetY() + "px";
  console.log(`X: ${target.style.left}`);
  console.log(`Y: ${target.style.top}`);
}

// Returns a random offset to change the target's position
// while also remaining in the viewport
// Movable range: 0 to window width - target size (padding * 2) 
function getRandomOffsetX() {
  const windowWidth = window.innerWidth;
  const padding = Number(window.getComputedStyle(target).getPropertyValue("padding").substring(0, window.getComputedStyle(target).getPropertyValue("padding").length - 2));  // Remove the "px"
  return Math.floor(Math.random() * (windowWidth - (padding * 2)));
}

// Same as offset x, but use window height instead of width
// Movable range: 0 to window height - target size (padding * 2)
function getRandomOffsetY() {
  const windowHeight = window.innerHeight;
  const padding = Number(window.getComputedStyle(target).getPropertyValue("padding").substring(0, window.getComputedStyle(target).getPropertyValue("padding").length - 2));  // Remove the "px"
  return Math.floor(Math.random() * (windowHeight - (padding * 2)));
}