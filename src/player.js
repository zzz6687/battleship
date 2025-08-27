// player.js
import { Gameboard } from "./gameboard";

export class Player {
  constructor(type = "human") {
    this.type = type;
    this.gameboard = new Gameboard();
    this.computerAttacks = new Set();
  }

  attack(opponentGameboard, x, y) {
    if (this.type === "computer" && (x === undefined || y === undefined)) {
      return this.#generateComputerAttack(opponentGameboard);
    }

    const hit = opponentGameboard.receiveAttack(x, y);
    return { x, y, hit };
  }

  #generateComputerAttack(oppGameboard) {
    let x, y, coord;

    do {
      x = Math.floor(Math.random() * 10);
      y = Math.floor(Math.random() * 10);
      coord = `${x},${y}`;
    } while (this.computerAttacks.has(coord));

    this.computerAttacks.add(coord);

    const hit = oppGameboard.receiveAttack(x, y);
    return { x, y, hit };
  }
}
