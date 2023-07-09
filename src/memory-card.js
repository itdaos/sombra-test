const gridItemTemplate = (content) => {
  const inner = document.createElement("div");
  inner.className = "game-card-inner";

  const back = document.createElement("div");
  back.className = "back";
  back.innerHTML = content;

  const front = document.createElement("div");
  front.className = "front";

  inner.appendChild(back);
  inner.appendChild(front);

  return inner;
};

export default class MemoryCard {
  constructor(content, id, gameItems, isOpen = false) {
    this.isOpen = isOpen;
    this.gameItems = gameItems;

    this.element = document.createElement("div");
    this.element.className = "game-card";
    this.element.dataset.id = id;
    this.element.appendChild(gridItemTemplate(content));
  }

  flip() {
    this.element.classList.toggle("active");
  }
}
