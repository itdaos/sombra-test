export function shuffleArray(arr) {
  const array = [...arr];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function getRandomSubset(arr, size) {
  const array = [...arr];
  const subset = [];
  while (subset.length < size) {
    const randomIndex = Math.floor(Math.random() * array.length);
    subset.push(array[randomIndex]);
    array.splice(randomIndex, 1);
  }
  return subset;
}

export function duplicateArrayElements(array) {
  const duplicatedArray = [];
  for (let i = 0; i < array.length; i++) {
    duplicatedArray.push(array[i]);
    duplicatedArray.push(array[i]);
  }
  return duplicatedArray;
}

export function createBanner(parent, className, message) {
  const banner = document.createElement("div");
  banner.classList.add(`overlay-${className}`);
  banner.innerHTML = message;
  parent.appendChild(banner);
}

export function formatTimerText(seconds) {
  return `${("00" + Math.floor(seconds / 60)).slice(-2)}:${(
    "00" +
    (seconds % 60)
  ).slice(-2)}`;
}
