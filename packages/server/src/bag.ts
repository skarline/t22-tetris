import Random from "./utils/random"

import { Tetromino, Tetrominoes } from "./piece"

export default class Bag {
  public items: Tetromino[]

  private random: Random

  constructor(seed: number, private minItems: number = 3) {
    this.random = new Random(seed)

    this.items = this.shuffle()
  }

  public next(): Tetromino {
    if (this.items.length <= this.minItems) this.items.push(...this.shuffle())

    return this.items.pop()
  }

  private shuffle(): Tetromino[] {
    const pieces = [...Tetrominoes]

    const sorted = pieces.sort(() => this.random.next() - 0.5)

    return sorted
  }
}
