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

document.querySelector(".js-settings-button").addEventListener("click", loadSettingsPopUp);

// Renders the settings popup with the custom target
function loadSettingsPopUp() {
  let customTargetURL;

  document.querySelector(".js-settings").innerHTML = `
    <div class="settings js-settings-popup">
      <div class="target-settings">
        Target:
        <div class="js-current-target"></div>
        <input type="file" class="js-change-target">
      </div>

      <div class="settings-buttons-container js-settings-buttons">
        <button class="cancel-button js-cancel-button">
          Cancel
        </button>

        <button class="restore-button js-restore-button">
          Restore Defaults
        </button>

        <button class="save-button js-save-button">
          Save
        </button>
      </div>
    </div>
  `;

  loadCurrentTarget(localStorage.getItem("target-setting"));

  // Track the image files changed in the settings
  const targetFileElement = document.querySelector(".js-change-target");

  targetFileElement.addEventListener("change", () => {
    const fr = new FileReader();
    fr.readAsDataURL(targetFileElement.files[0]);   // index 0 has the passed-in image
    
    // Wait for the image data to load then store it in localStorage
    fr.addEventListener("load", () => {
      const url = fr.result;
      customTargetURL = url;
      loadCurrentTarget(url);
    });
  });

  // Close the settings pop-up when the cancel button is clicked
  document.querySelector(".js-cancel-button").addEventListener("click", () => {
    document.querySelector(".js-settings-popup").remove();
  });

  // Restore the default target when the restore defaults button is clicked
  document.querySelector(".js-restore-button").addEventListener("click", restoreDefaults);

  // Save the settings via localStorage when the save button is clicked
  document.querySelector(".js-save-button").addEventListener("click", () => {
    if (customTargetURL) {
      localStorage.setItem("target-setting", customTargetURL);
      document.querySelector(".js-settings-buttons").innerHTML += `
        <div class="saved-message js-saved-message">Saved!</div>
      `;

      // Show a saved message for 1.5 seconds as a confirmation
      setTimeout(() => {
        document.querySelector(".js-saved-message").remove();
        loadSettingsPopUp();
      }, 1500);
    }
  });
}

// Removes any saved custom target
function restoreDefaults() {
  localStorage.removeItem("target-setting");
  loadSettingsPopUp();
}

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

// Loads the chosen target image in the settings pop-up
function loadCurrentTarget(url) {
  if (url) {
    document.querySelector(".js-current-target").innerHTML = `
      <img src="${url}" class="current-target">
    `;
  }
}
