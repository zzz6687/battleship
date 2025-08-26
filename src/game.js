// game.js
import { Player } from "./player";
import { setUpBoards } from "./setUpGameboard";
import { placingPlayerShips } from "./placeShip";

export function startGameClick(
  computerGameboard,
  humanGameboard,
  human,
  computer
) {
  computerGameboard.computerPlaceShips([5, 4, 3, 3, 2]);
  console.log(
    "📦 Состояние компьютера:",
    computerGameboard,
    computerGameboard.ships
  );

  const computerBoardElement = document.getElementById("computer-board");
  const humanBoardElement = document.getElementById("player-board");

  let currentTurn = "human";

  computerBoardElement.style.pointerEvents = "auto";

  const playerCells = document.querySelectorAll("#player-board .cell");
  const computerCells = document.querySelectorAll("#computer-board .cell");

  const oldResetBtn = document.getElementById("resetBtn");
  if (oldResetBtn) {
    oldResetBtn.remove();
  }

  computerCells.forEach((cell) => {
    cell.addEventListener("click", async () => {
      if (currentTurn !== "human") return;

      const shotRow = parseInt(cell.dataset.row, 10);
      const shotCol = parseInt(cell.dataset.col, 10);

      const attackResult = human.attack(computerGameboard, shotRow, shotCol);

      cell.style.backgroundColor = attackResult.hit ? "red" : "grey";

      currentTurn = "computer";
      computerBoardElement.style.pointerEvents = "none";

      console.log("Computer's turn...");

      const { x, y, hit } = computer.attack(humanGameboard);

      const humanCell = document.querySelector(
        `#player-board .cell[data-row="${x}"][data-col="${y}"]`
      );

      if (hit === null) {
        return;
      }
      if (hit) {
        humanCell.firstChild.style.setProperty(
          "background-color",
          "red",
          "important"
        );
      } else {
        humanCell.style.backgroundColor = "grey";
      }

      if (computerGameboard.allShipsSunk()) {
        alert("Player won!");
        humanBoardElement.style.pointerEvents = "auto";
        makeResetBtn();
        return;
      } else if (humanGameboard.allShipsSunk()) {
        alert("Computer won!");
        humanBoardElement.style.pointerEvents = "auto";
        makeResetBtn();
        return;
      }

      currentTurn = "human";
      computerBoardElement.style.pointerEvents = "auto";

      console.log("Attack coords:", { x, y, hit });
      console.log("Cell found:", humanCell);

      cell.style.pointerEvents = "none";
    });
  });
}

function makeResetBtn() {
  const gameContainer = document.getElementById("game-container");

  const resetBtn = document.createElement("button");
  resetBtn.id = "resetBtn";
  resetBtn.textContent = "Reset Game";
  gameContainer.appendChild(resetBtn);

  resetBtn.addEventListener("click", () => {
    const playerBoardElement = document.getElementById("player-board");
    const computerBoardElement = document.getElementById("computer-board");

    if (playerBoardElement) playerBoardElement.innerHTML = "";
    if (computerBoardElement) computerBoardElement.innerHTML = "";

    const player = new Player("human");
    const computer = new Player("computer");

    setUpBoards(player.gameboard, computer.gameboard);

    placingPlayerShips(player.gameboard, computer.gameboard, player, computer);

    resetBtn.remove();
  });
}
