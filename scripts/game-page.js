

const target = document.querySelector(".js-target");

// Register when the target is clicked
document.querySelector(".js-target").addEventListener("click", () => {
  repositionTarget();
});


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