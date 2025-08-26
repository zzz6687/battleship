// Gameboard.js
import { Ship } from "./ship";

export class Gameboard {
  constructor() {
    this.ships = [];
    this.missedShots = [];
    this.attacks = new Set();
    this.size = 10;
    this.blockedList = new Set();
  }

  placeShip(ship, row, col, isHorizontal = true) {
    if (!this.canPlaceShip(ship, row, col, isHorizontal)) {
      return false;
    }

    const shipCoordinates = [];

    for (let i = 0; i < ship.length; i++) {
      const coordX = isHorizontal ? row : row + i;
      const coordY = isHorizontal ? col + i : col;
      const coordinate = `${coordX},${coordY}`;
      shipCoordinates.push(coordinate);
    }

    // блокируем сам корабль и все клетки вокруг
    for (const coord of shipCoordinates) {
      const [x, y] = coord.split(",").map(Number);

      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          const nx = x + dx;
          const ny = y + dy;

          if (nx >= 0 && nx < this.size && ny >= 0 && ny < this.size) {
            this.blockedList.add(`${nx},${ny}`);
          }
        }
      }
    }

    this.ships.push({
      ship: ship,
      coordinates: shipCoordinates,
    });

    return true;
  }

  canPlaceShip(ship, row, col, isHorizontal) {
    for (let i = 0; i < ship.length; i++) {
      const coordX = isHorizontal ? row : row + i;
      const coordY = isHorizontal ? col + i : col;

      if (coordX >= this.size || coordY >= this.size) {
        return false;
      }

      const coordinate = `${coordX},${coordY}`;
      if (this.blockedList.has(coordinate)) {
        return false;
      }
    }
    return true;
  }

  computerPlaceShips(shipSizes) {
    for (const size of shipSizes) {
      let placed = false;

      while (!placed) {
        const isHorizontal = Math.random() < 0.5;
        const row = Math.floor(Math.random() * this.size);
        const col = Math.floor(Math.random() * this.size);

        const ship = new Ship(size);

        if (this.placeShip(ship, row, col, isHorizontal) !== false) {
          placed = true;
        }
      }
    }
  }

  receiveAttack(row, col) {
    const coordinates = `${row},${col}`;

    if (this.attacks.has(coordinates)) {
      return null;
    }

    this.attacks.add(coordinates);
    let hitShip = false;

    for (const shipData of this.ships) {
      if (shipData.coordinates.includes(coordinates)) {
        shipData.ship.hit();
        hitShip = true;
        break;
      }
    }

    if (!hitShip) {
      this.missedShots.push(coordinates);
    }
    return hitShip;
  }

  allShipsSunk() {
    // should be able to report whether or not all of their ships have been sunk
    return this.ships.every((shipData) => shipData.ship.isSunk());
  }
}
