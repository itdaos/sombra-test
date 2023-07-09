import { MatchGrid } from "./memory-game";
import "./style.css";

const GAME_OPTIONS = {
  viewport: {
    width: 600,
    height: 500,
  },
  gameSize: {
    rows: 4,
    cols: 4,
  },
  timeLimit: 100,
  theme: {
    primaryColor: "#fafafa",
    backgroundColor: "#242424",
  },
};

const gameArea = document.getElementById("game-area");

const memoryGame = new MatchGrid(GAME_OPTIONS);

memoryGame.init(gameArea);

document
  .getElementById("game-start")
  .addEventListener("click", memoryGame.start);

document
  .getElementById("game-reset")
  .addEventListener("click", () => memoryGame.init(gameArea));
