// ship.js

export class Ship {
  constructor(length) {
    (this.length = length), (this.gotHit = 0), (this.sunk = false);
  }

  hit() {
    this.gotHit++;
    return this.gotHit;
  }

  isSunk() {
    if (this.length === this.gotHit || this.length <= this.gotHit) {
      this.sunk = true;
    }
    return this.sunk;
  }
}
