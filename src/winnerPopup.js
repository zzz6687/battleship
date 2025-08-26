import { Player } from "./player";
import { setUpBoards } from "./setUpGameboard";
import { placingPlayerShips } from "./placeShip";

export function showWinnerPopup(message) {
  const popupWindow = document.getElementById("popup");
  const popupMessage = document.getElementById("popupmessage");
  const restartBtn = document.getElementById("restartBtn");

  popupMessage.textContent = message + " is a winner!";
  popupWindow.classList.remove("hidden");

  const gameContainer = document.getElementById("game-container");

  restartBtn.addEventListener("click", () => {
    const playerBoardElement = document.getElementById("player-board");
    const computerBoardElement = document.getElementById("computer-board");

    if (playerBoardElement) playerBoardElement.innerHTML = "";
    if (computerBoardElement) computerBoardElement.innerHTML = "";

    const player = new Player("human");
    const computer = new Player("computer");

    setUpBoards(player.gameboard, computer.gameboard);

    placingPlayerShips(player.gameboard, computer.gameboard, player, computer);

    popupWindow.classList.add("hidden");
  });
}
