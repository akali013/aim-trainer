const easyButton = document.querySelector(".js-easy-button");
const mediumButton = document.querySelector(".js-medium-button");
const hardButton = document.querySelector(".js-hard-button");
const extremeButton = document.querySelector(".js-extreme-button");
  const descElement = document.querySelector(".js-difficulty-description");

// For each button, go to the game page with the corresponding difficulty
easyButton.addEventListener("click", () => {
  window.location.href = "game-page.html?difficulty=easy";
});
mediumButton.addEventListener("click", () => {
  window.location.href = "game-page.html?difficulty=medium";
});
hardButton.addEventListener("click", () => {
  window.location.href = "game-page.html?difficulty=hard";
});
extremeButton.addEventListener("click", () => {
  window.location.href = "game-page.html?difficulty=extreme";
});

// When hovering over a difficulty button, show the corresponding description
easyButton.addEventListener("mouseover", () => {
  showDifficultyDescription("easy");
});
mediumButton.addEventListener("mouseover", () => {
  showDifficultyDescription("medium");
});
hardButton.addEventListener("mouseover", () => {
  showDifficultyDescription("hard");
});
extremeButton.addEventListener("mouseover", () => {
  showDifficultyDescription("extreme");
});

easyButton.addEventListener("mouseout", () => {
  descElement.innerHTML = "";
});
mediumButton.addEventListener("mouseout", () => {
  descElement.innerHTML = "";
});
hardButton.addEventListener("mouseout", () => {
  descElement.innerHTML = "";
});
extremeButton.addEventListener("mouseout", () => {
  descElement.innerHTML = "";
});


function showDifficultyDescription(difficulty) {
  switch (difficulty) {
    case "easy": 
      descElement.style.color = "green";
      descElement.innerHTML = `
        Easy mode
        <ul class="difficulty-list">
          <li>1 minute timer</li>
          <li>Target size: 100px</li>
          <li>Unlimited time to click target</li>
          <li>No miss penalty</li>
        </ul>
      `;
      break;
    case "medium":
      descElement.style.color = "rgb(160, 143, 33)";
      descElement.innerHTML = `
        Medium mode
        <ul class="difficulty-list">
          <li>1 minute timer</li>
          <li>Target size: 80px</li>
          <li>5 seconds to click target</li>
          <li>Miss penalty: 1</li>
        </ul>
      `;
      break;
    case "hard":
      descElement.style.color = "red";
      descElement.innerHTML = `
        Hard mode
        <ul class="difficulty-list">
          <li>1 minute timer</li>
          <li>Target size: 60px</li>
          <li>3 seconds to click target</li>
          <li>Miss penalty: 1</li>
        </ul>
      `;
      break;
    case "extreme":
      descElement.style.color = "purple";
      descElement.innerHTML = `
        Extreme mode
        <ul class="difficulty-list">
          <li>1 minute timer</li>
          <li>Target size: 40px</li>
          <li>2 seconds to click target</li>
          <li>Miss penalty: 2</li>
        </ul>
      `;
      break;
  }
}