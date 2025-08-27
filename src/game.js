// game.js
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

  let currentTurn = "human";

  computerBoardElement.style.pointerEvents = "auto";

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
        return;
      } else if (humanGameboard.allShipsSunk()) {
        showWinnerPopup("Computer");
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
