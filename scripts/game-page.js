let target = document.querySelector(".js-target");
const url = new URL(window.location.href);
const difficulty = url.searchParams.get("difficulty");
let clickTime;    // How many ms the user has to click the target before it moves
let missPenalty;    // Deduct this amount from score when a click is missed
let score = 0;
let personalBest = JSON.parse(localStorage.getItem(`${difficulty}-pb`)) || 0;
const background = document.querySelector(".js-background");
let time = 60;    // 60 seconds
let timeoutIds = {    // Tracks the timeout ids of the two timers so they can be reset separately for whatever reason
  timer: 0,
  reposition: 0
}
const customTargetURL = localStorage.getItem("target-setting");    // Load target image URL from the settings pop-up

beginSession();

function beginSession() {
  score = 0;

  // Register when the target is clicked
  if (customTargetURL) {
    // Replace the default target with the custom one
    target.remove();
    document.querySelector(".js-background").innerHTML += `
      <img src="${customTargetURL}" class="custom-target js-custom-target">
    `;
    target = document.querySelector(".js-custom-target");
    target.addEventListener("click", registerClick);
  }
  else {
    // Use the default target (red circle)
    target.addEventListener("click", registerClick);
  }

  switch (difficulty) {
    case "easy": {
      loadEasyMode(); 
      break;
    }
    case "medium": {
      loadMediumMode();
      break;
    }
    case "hard": {
      loadHardMode();
      break;
    }
    case "extreme": {
      loadExtremeMode();
    }
  }
  loadTimer();
  loadScore();
  repositionTarget();   // Start with a random position each time
  cycleTargetMovement();

  // Apply a miss penalty when the target isn't clicked but the background is
  background.addEventListener("click", registerMissedClick);
}

function registerClick(event) {
  event.stopPropagation();    // Prevents the background from also being clicked
  clearTimeout(timeoutIds.reposition);    // Reset target reposition timer
  score++;
  loadScore();
  repositionTarget();
  cycleTargetMovement();
}

function registerMissedClick() {
  if (missPenalty) {
    score -= missPenalty;
    if (score < 0) {
      score = 0;
    }
    loadScore();
  }
}

// Make the target move every clickTime milliseconds
async function cycleTargetMovement() {
  if (clickTime) {
    while (time > 0) {
      await timeout(clickTime, "reposition");
      repositionTarget();
    }
  }
}

// Easy mode will have 
// - target padding of 25px
// - unlimited time to click target
// - no penalty for missed clicks
function loadEasyMode() {
  if (customTargetURL) {
    target.style.width = "50px";
    target.style.height = "50px";
  }
  else {
    target.style.padding = "25px";
  }
  clickTime = "";
  missPenalty = 0;
}

// Medium mode will have
// - target padding of 20px
// - 5 seconds to click target
// - -1 miss penalty
function loadMediumMode() {
  if (customTargetURL) {
    target.style.width = "40px";
    target.style.height = "40px";
  }
  else {
    target.style.padding = "20px";
  }
  clickTime = 5000;
  missPenalty = 1;
}

// Hard mode will have
// - target padding of 15px
// - 3 seconds to click target
// - -1 miss penalty
function loadHardMode() {
  if (customTargetURL) {
    target.style.width = "30px";
    target.style.height = "30px";
  }
  else {
    target.style.padding = "15px";
  }
  clickTime = 3000;
  missPenalty = 1;
}

// Extreme mode will have
// - target padding of 10px
// - 2 seconds to click target
// - -2 miss penalty
function loadExtremeMode() {
  if (customTargetURL) {
    target.style.width = "20px";
    target.style.height = "20px";
  }
  else {
    target.style.padding = "10px";
  }
  clickTime = 2000;
  missPenalty = 2;
}

// Loads a 1 minute timer into the screen
async function loadTimer() {
  const timer = document.querySelector(".js-timer");
  while (time >= 0) {
    timer.innerHTML = time;
    time--; 
    await timeout(1000, "timer");  // Wait one second
  }
  endSession();
}

// Wait a given number of milliseconds via a 
// returned promise that's handled with an await 
// type is the type of timer this is being used with:
// timer: session timer
// reposition: reposition timer
function timeout(ms, type) {
  return new Promise(resolve => {
    timeoutIds[type] = setTimeout(resolve, ms);
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
// ! Note that custom targets use width and height while the default target uses padding !
function getRandomOffsetX() {
  const windowWidth = window.innerWidth;
  let targetSize = 0;
  if (customTargetURL) {
    targetSize = Number(window.getComputedStyle(target).getPropertyValue("width").substring(0, window.getComputedStyle(target).getPropertyValue("width").length - 2));  // Remove the "px"
  }
  else {
    targetSize = Number(window.getComputedStyle(target).getPropertyValue("padding").substring(0, window.getComputedStyle(target).getPropertyValue("padding").length - 2));
  }
  return Math.floor(Math.random() * (windowWidth - (targetSize * 2)));
}

// Same as offset x, but use window height instead of width
// Movable range: 0 to window height - target size (padding * 2)
function getRandomOffsetY() {
  const windowHeight = window.innerHeight;
  let targetSize = 0;
  if (customTargetURL) {
    targetSize = Number(window.getComputedStyle(target).getPropertyValue("height").substring(0, window.getComputedStyle(target).getPropertyValue("height").length - 2));  // Remove the "px"
  }
  else {
    targetSize = Number(window.getComputedStyle(target).getPropertyValue("padding").substring(0, window.getComputedStyle(target).getPropertyValue("padding").length - 2));
  }
    return Math.floor(Math.random() * (windowHeight - (targetSize * 2)));
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