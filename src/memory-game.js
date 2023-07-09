import anime from "animejs";
import {
  getRandomSubset,
  duplicateArrayElements,
  shuffleArray,
  createBanner,
  formatTimerText,
} from "./utils";
import MemoryCard from "./memory-card";

// enum-like object
const GAME_STATUS = {
  NOT_STARTED: 0,
  STARTED: 1,
  CARD_CLICKED: 2,
  FINISHED: 3,
};

const EMOJII_POOL = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const prepareGameItems = (size) => {
  const playableSubset = getRandomSubset(EMOJII_POOL, size);
  return shuffleArray(duplicateArrayElements(playableSubset));
};

// class inheritance
// vite -> webpack/liveserver
// initial commit!

export class MatchGrid {
  constructor({ viewport, gameSize, timeLimit, theme }) {
    this.viewport = viewport;
    this.gameSize = gameSize;
    this.timeLimit = timeLimit;
    this.theme = theme;
    this.stage = GAME_STATUS.NOT_STARTED;
    this.cardClickedLast = -1;
    this.memoryCards = [];

    this.start = this.start.bind(this);
    this.init = this.init.bind(this);
  }

  init(element) {
    // reset game area
    this.currentTime = this.timeLimit;
    clearInterval(this.timerInterval);
    this.memoryCards = [];

    // reset game area node
    while (element.hasChildNodes()) {
      element.removeChild(element.firstChild);
    }

    // check if params are valid for initialization
    if ((this.gameSize.cols * this.gameSize.rows) % 2 != 0) {
      const errorMessage = document.createElement("p");
      errorMessage.style.cssText = "color: #dd2222;";
      errorMessage.innerText =
        "Cannot create a game since it has uneven number of cards";
      element.appendChild(errorMessage);
      return;
    }

    // generate a list of cards to play from the pool
    this.gameItems = prepareGameItems(
      (this.gameSize.cols * this.gameSize.rows) / 2
    );

    // initialize the timer
    this.timer = document.createElement("div");
    this.timer.id = "timer";
    this.timer.className = "timer";
    this.timer.innerText = formatTimerText(this.currentTime);
    element.appendChild(this.timer);

    // draw grid and grid items
    const grid = document.createElement("div");
    grid.id = "game-grid";
    grid.style.cssText = `grid-template-columns:${" 1fr".repeat(
      this.gameSize.cols
    )};`;
    for (let i = 0; i < this.gameSize.rows * this.gameSize.cols; i++) {
      const memoryCard = new MemoryCard(this.gameItems[i], i, this.gameItems);

      this.memoryCards.push(memoryCard);
      grid.appendChild(memoryCard.element);
    }

    grid.onclick = (event) => {
      const gameCard = event.target.closest(".game-card");
      if (!gameCard) return;

      const idx = gameCard.dataset.id;

      const grid = event.target.closest("#game-grid");
      const memoryCard = this.memoryCards[idx];

      if (this.stage == GAME_STATUS.STARTED) {
        memoryCard.flip();

        this.cardClickedLast = idx;
        this.stage = GAME_STATUS.CARD_CLICKED;
      } else if (this.stage == GAME_STATUS.CARD_CLICKED) {
        memoryCard.flip();

        if (this.gameItems[this.cardClickedLast] === this.gameItems[idx]) {
          // succes - hide chosen cards
          setTimeout(() => {
            grid
              .querySelector(`div[data-id="${this.cardClickedLast}"]`)
              .classList.add("hidden");
            grid.querySelector(`div[data-id="${idx}"]`).classList.add("hidden");
            this.cardClickedLast = -1;
          }, 500);
        } else {
          setTimeout(() => {
            // flush all non hidden cards back
            grid
              .querySelectorAll(`.game-card:not(.hidden)`)
              .forEach((el) => el.classList.remove("active"));
            this.cardClickedLast = -1;
          }, 500);
        }
        this.stage = GAME_STATUS.STARTED;
      }
    };

    element.appendChild(grid);

    // add overlays that pop on win or loss
    createBanner(element, "won", "you won!");
    createBanner(element, "lost", "you lost(");
    createBanner(element, "go", "GO!");

    // style and themeing
    element.style.setProperty("--primary-color", this.theme.primaryColor);
    element.style.setProperty("--background-color", this.theme.backgroundColor);
    Object.assign(element.style, {
      width: `${this.viewport.width}px`,
      height: `${this.viewport.height}px`,
    });

    this.mouseInBounds = false;
    element.addEventListener("mouseenter", () => (this.mouseInBounds = true));
    element.addEventListener("mouseleave", () => (this.mouseInBounds = false));
  }

  start() {
    this.stage = GAME_STATUS.STARTED;
    anime({
      targets: "#game-area .overlay-go",
      scale: [0, 1, 0],
    });

    this.timerInterval = setInterval(() => {
      if (this.mouseInBounds) {
        this.currentTime -= 1;
        this.timer.innerText = formatTimerText(this.currentTime);
      }
      if (this.currentTime > 0) return;
      clearInterval(this.timerInterval);
      if (this.stage !== GAME_STATUS.FINISHED) {
        this.stage = GAME_STATUS.FINISHED;
        anime({
          targets: "#game-area .overlay-lost",
          scale: [0, 1],
          translateY: "-50%",
        });
      }
    }, 1000);

    this.winInterval = setInterval(() => {
      const notOpenedCard = document
        .getElementById("game-area")
        .querySelectorAll(".game-card:not(.hidden)");
      if (notOpenedCard.length === 0) {
        this.stage = GAME_STATUS.FINISHED;
        clearInterval(this.timerInterval);
        clearInterval(this.winInterval);
        anime({
          targets: "#game-area .overlay-won",
          scale: [0, 1],
          translateY: "-50%",
        });
      }
    });
  }
}
