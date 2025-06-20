const target = document.querySelector(".js-target");
const url = new URL(window.location.href);
const difficulty = url.searchParams.get("difficulty");
let clickTime;    // How many ms the user has to click the target before it moves
let missPenalty;    // Deduct this amount from score when a click is missed
let score = 0;
let personalBest = JSON.parse(localStorage.getItem(`${difficulty}-pb`)) || 0;
const background = document.querySelector(".js-background");

beginSession();

function beginSession() {
  score = 0;
  switch (difficulty) {
    case "easy": {
      loadEasyMode(); 
      break;
    }
    case "medium": {
      loadMediumMode();
      break;
    }
  }
  loadTimer();
  loadScore();
  repositionTarget();
  cycleTargetMovement();

  // Register when the target is clicked
  target.addEventListener("click", registerClick);

  // Apply a miss penalty when the target isn't clicked but the background is
  background.addEventListener("click", registerMissedClick);
}

function registerClick(event) {
  event.stopPropagation();    // Prevents the background from also being clicked
  score++;
  loadScore();
  repositionTarget();
}

function registerMissedClick() {
  score -= missPenalty;
  if (score < 0) {
    score = 0;
  }
  loadScore();
}

// Make the target move every clickTime milliseconds
async function cycleTargetMovement() {
  if (clickTime) {
    await timeout(clickTime);
    repositionTarget();
  }
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

// Medium mode will have
// - target padding of 20px
// - 5 seconds to click target
// - -1 miss penalty
function loadMediumMode() {
  target.style.padding = "20px";
  clickTime = 5000;
  missPenalty = 1;
}

// Loads a 1 minute timer into the screen
async function loadTimer() {
  let time = 60;    // 60 seconds
  const timer = document.querySelector(".js-timer");
  while (time >= 0) {
    timer.innerHTML = time;
    time--; 
    await timeout(1000);  // Wait one second
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

// Renders the score on the screen in the top-left
function loadScore() {
  const scoreElement = document.querySelector(".js-score");
  scoreElement.innerHTML = score;
}

// Handles the app when the timer ends
function endSession() {
  // Disable clicking first
  target.removeEventListener("click", registerClick);
  background.removeEventListener("click", registerMissedClick);

  // Update difficulty's pb if score is higher
  if (score > personalBest) {
    personalBest = score;
    localStorage.setItem(`${difficulty}-pb`, JSON.stringify(score));
  }

  showResults();
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

// Show the results pop-up when the timer is finished
// includes the score, personal best of the difficulty,
// and return and restart buttons.
function showResults() {
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