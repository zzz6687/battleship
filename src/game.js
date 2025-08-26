// game.js
import { Player } from "./player";
import { setUpBoards } from "./setUpGameboard";
import { placingPlayerShips } from "./placeShip";
import { showWinnerPopup } from "./winnerPopup";

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

      cell.style.backgroundColor = attackResult.hit ? "#CC0000" : "#C6E6FB";
      cell.style.pointerEvents = "none";

      if (computerGameboard.allShipsSunk()) {
        showWinnerPopup("Player");
        //humanBoardElement.style.pointerEvents = "auto";
        //makeResetBtn();
        return;
      } else if (humanGameboard.allShipsSunk()) {
        showWinnerPopup("Computer");
        //humanBoardElement.style.pointerEvents = "auto";
        //makeResetBtn();
        return;
      }

      if (!attackResult.hit) {
        currentTurn = "computer";
        computerTurn();
      } else {
        currentTurn = "human";
        computerBoardElement.style.pointerEvents = "auto";
      }

      function computerTurn() {
        const computerBoardElement = document.getElementById("computer-board");

        // Делаем доску некликабельной для хода компьютера
        computerBoardElement.style.pointerEvents = "none";

        const takeTurn = () => {
          const { x, y, hit } = computer.attack(humanGameboard);

          if (hit === null) {
            currentTurn = "human";
            computerBoardElement.style.pointerEvents = "auto";
            return;
          }

          const humanCell = document.querySelector(
            `#player-board .cell[data-row="${x}"][data-col="${y}"]`
          );

          if (hit) {
            humanCell.firstChild.style.setProperty(
              "background-color",
              "#CC0000",
              "important"
            );
            if (humanGameboard.allShipsSunk()) {
              showWinnerPopup("Computer");
              return;
            }
            setTimeout(takeTurn, 600);
          } else {
            humanCell.style.backgroundColor = "#C6E6FB";
            currentTurn = "human";
            computerBoardElement.style.pointerEvents = "auto";
          }
        };
        takeTurn();
      }
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
