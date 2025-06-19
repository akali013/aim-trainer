// For each button, go to the game page with the corresponding difficulty
document.querySelector(".js-easy-button").addEventListener("click", () => {
  window.location.href = "game-page.html?difficulty=easy";
});
document.querySelector(".js-medium-button").addEventListener("click", () => {
  window.location.href = "game-page.html?difficulty=medium";
});
document.querySelector(".js-hard-button").addEventListener("click", () => {
  window.location.href = "game-page.html?difficulty=hard";
});
document.querySelector(".js-extreme-button").addEventListener("click", () => {
  window.location.href = "game-page.html?difficulty=extreme";
});