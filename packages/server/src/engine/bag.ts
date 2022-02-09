import Random from "../utils/random"

import { Tetrominoes } from "./piece"
import { Tetromino } from "./types"

export default class Bag {
  private random: Random = new Random(this.seed)

  public items: Tetromino[]

  constructor(private seed: number) {
    this.items = this.shuffle()
  }

  public next(): Tetromino {
    if (this.items.length <= Tetrominoes.length) {
      this.items.push(...this.shuffle())
    }

    return this.items.pop()
  }

  private shuffle(): Tetromino[] {
    const sorted = [...Tetrominoes].sort(() => this.random.next() - 0.5)

    return sorted
  }
}
