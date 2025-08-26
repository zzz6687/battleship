//placeShip.js
import { Ship } from "./ship";
import { startGameClick } from "./game";

export function placingPlayerShips(
  gameboardPlayer,
  gameboardComputer,
  player,
  computer
) {
  const fleet = document.getElementById("fleet");
  const playerBoard = document.getElementById("player-board");

  const rotateBtn = document.createElement("button");
  rotateBtn.id = "rotateBtn";
  rotateBtn.textContent = "Rotate Ships";
  playerBoard.appendChild(rotateBtn);
  rotateBtn.style.display = "block";

  let draggedShip = null;
  let orientation = "horizontal";
  let shipCount = 5;

  function updateShipOrientation() {
    fleet.querySelectorAll(".ship").forEach((ship) => {
      if (orientation === "vertical") {
        ship.classList.add("vertical");
        fleet.style.flexDirection = "row";
      } else {
        ship.classList.remove("vertical");
        fleet.style.flexDirection = "column";
      }
    });
  }

  updateShipOrientation();

  const playerCells = document.querySelectorAll("#player-board .cell");

  playerCells.forEach((cell) => {
    cell.addEventListener("dragover", (e) => e.preventDefault());

    cell.addEventListener("drop", (e) => {
      e.preventDefault();
      if (!draggedShip) return;

      const size = parseInt(draggedShip.dataset.size, 10);
      const startRow = parseInt(cell.dataset.row, 10);
      const startCol = parseInt(cell.dataset.col, 10);

      const ship = new Ship(size);
      const isHorizontal = orientation === "horizontal";

      if (
        !gameboardPlayer.canPlaceShip(ship, startRow, startCol, isHorizontal)
      ) {
        return;
      }

      for (let i = 0; i < size; i++) {
        const targetRow = isHorizontal ? startRow : startRow + i;
        const targetCol = isHorizontal ? startCol + i : startCol;

        if (
          targetRow >= gameboardPlayer.size ||
          targetCol >= gameboardPlayer.size
        ) {
          return;
        }
      }

      if (!gameboardPlayer.placeShip(ship, startRow, startCol, isHorizontal)) {
        return;
      }

      for (let i = 0; i < size; i++) {
        const targetRow = isHorizontal ? startRow : startRow + i;
        const targetCol = isHorizontal ? startCol + i : startCol;

        const targetCell = document.querySelector(
          `#player-board .cell[data-row="${targetRow}"][data-col="${targetCol}"]`
        );

        const part = document.createElement("div");
        part.classList.add("ship-cell");
        targetCell.appendChild(part);
      }

      draggedShip.remove();
      draggedShip = null;
      shipCount--;

      if (shipCount === 0) {
        fleet.classList.remove("hasShips");
        const computerSide = document.getElementById("computerSide");
        //const placeYourShipsText = document.getElementById("placeYourShipsId");
        if (fleet.classList.contains("hasShips")) {
          return;
        } else {
          const startGameBtn = document.createElement("button");
          startGameBtn.textContent = "Start";
          startGameBtn.id = "startBtn";
          computerSide.appendChild(startGameBtn);

          rotateBtn.style.display = "none";
          //placeYourShipsText.remove();

          startGameBtn.addEventListener("click", () => {
            startGameClick(
              gameboardComputer,
              gameboardPlayer,
              player,
              computer
            );
            startGameBtn.remove();
          });
        }
      }
    });
  });

  document.querySelectorAll(".ship").forEach((ship) => {
    const size = parseInt(ship.dataset.size, 10);

    ship.innerHTML = "";

    for (let i = 0; i < size; i++) {
      const part = document.createElement("div");
      part.classList.add("ship-cell");
      ship.appendChild(part);
    }

    ship.addEventListener("dragstart", () => {
      draggedShip = ship;
    });
  });

  rotateBtn.addEventListener("click", () => {
    orientation = orientation === "horizontal" ? "vertical" : "horizontal";
    updateShipOrientation();
  });
}
