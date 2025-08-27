//index.js
import { Player } from "./player";
import { setUpBoards } from "./setUpGameboard";
import "./styles.css";
import { placingPlayerShips } from "./placeShip";

window.addEventListener("load", (event) => {
  const player = new Player("human");
  const computer = new Player("computer");

  setUpBoards(player.gameboard, computer.gameboard);
  placingPlayerShips(player.gameboard, computer.gameboard, player, computer);
});
