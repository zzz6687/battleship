// ui.js

export function setUpBoards(playerGameboard, computerGameboard) {
  const playerBoardElement = document.getElementById("player-board");
  const compBoardElement = document.getElementById("computer-board");
  const playerControls = document.getElementById("player-controls");

  if (playerBoardElement) playerBoardElement.innerHTML = "";
  if (compBoardElement) compBoardElement.innerHTML = "";
  if (playerControls) playerControls.innerHTML = "";

  if (!playerBoardElement || !compBoardElement) {
    alert("Game board elements not found in the DOM");
    return;
  }

  createGrid(playerBoardElement, playerGameboard, true);
  createGrid(compBoardElement, computerGameboard, false);
}

function createGrid(boardElement, gameboard, isPlayer = false) {
  boardElement.innerHTML = "";

  if (isPlayer) {
    const controls = document.getElementById("player-controls");
    //const placeYourShipText = document.createElement("h4");
    //placeYourShipText.id = "placeYourShipsId";
    //placeYourShipText.textContent = "Place your ships";
    //controls.appendChild(placeYourShipText);

    const fleet = document.createElement("div");
    fleet.id = "fleet";
    fleet.classList.add("hasShips");
    controls.appendChild(fleet);

    const sizes = [5, 4, 3, 3, 2];
    for (let size of sizes) {
      const ship = document.createElement("div");
      ship.classList.add("ship");
      ship.setAttribute("draggable", "true");
      ship.setAttribute("data-size", size.toString());

      fleet.appendChild(ship);
    }

    //boardElement.appendChild(fleet);
  }
  for (let row = 0; row < gameboard.size; row++) {
    for (let col = 0; col < gameboard.size; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = row;
      cell.dataset.col = col;
      if (isPlayer) {
        for (const shipData of gameboard.ships) {
          if (shipData.coordinates.includes(`${row},${col}`)) {
            cell.classList.add("ship");
            break;
          }
        }
      }
      boardElement.appendChild(cell);
    }
  }
}
