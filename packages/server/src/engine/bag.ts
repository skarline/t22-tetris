import Random from "../utils/random"

import { Tetrominoes } from "./piece"
import { Tetromino } from "./types"

export default class Bag {
  private random: Random = new Random(this.seed)

  public items: Tetromino[]

  constructor(private seed: number) {
    this.items = this.shuffle(Tetrominoes)
  }

  public next(): Tetromino {
    if (this.items.length <= Tetrominoes.length) {
      this.items.push(...this.shuffle(Tetrominoes))
    }

    return this.items.pop()
  }

  private shuffle(tetrominoes: Tetromino[]): Tetromino[] {
    const sorted = tetrominoes.sort(() => this.random.next() - 0.5)

    return sorted
  }
}
