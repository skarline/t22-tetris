import Piece from "./piece"

import type { ServerOptions } from "../server"
import { BlockType } from "./types"

export default class Matrix {
  private blocks: BlockType[] = []

  public width = this.options.playfieldWidth
  public height = this.options.playfieldHeight * 2 // buffer zone

  constructor(private options: ServerOptions) {
    this.clear()
  }

  /**
   * Get the block at the given position
   */
  public get(x: number, y: number): BlockType | undefined {
    const index = y * this.width + x

    if (this.inBounds(x, y)) return this.blocks[index]

    return undefined
  }

  /**
   * Set the block at the given position
   */
  public set(x: number, y: number, block: BlockType): void {
    const index = y * this.width + x

    if (this.inBounds(x, y)) this.blocks[index] = block
  }

  /**
   * Test if a piece will collide at the given position
   */
  public test(piece: Piece): boolean {
    const { x, y } = piece.position

    return piece.getBlocks().some(({ x: blockX, y: blockY }) => {
      const testX = x + blockX
      const testY = y + blockY

      const block = this.get(testX, testY)

      return block !== BlockType.Empty
    })
  }

  /**
   * Set the blocks of a piece in the playfield
   */
  public setPiece(piece: Piece): void {
    const { x, y } = piece.position

    piece.getBlocks().forEach(({ x: blockX, y: blockY }) => {
      this.set(x + blockX, y + blockY, piece.tetromino.blockType)
    })
  }

  public clearLines(): number[] {
    let clearedLines = []

    for (let y = this.height - 1; y >= 0; y--) {
      const line = this.blocks.slice(y * this.width, (y + 1) * this.width)

      if (line.every((block) => block !== BlockType.Empty)) {
        this.blocks.splice(y * this.width, this.width)

        clearedLines.push(y)
      }
    }

    this.blocks.unshift(
      ...new Array(this.width * clearedLines.length)
        .fill(0)
        .map(() => BlockType.Empty)
    )

    return clearedLines
  }

  /**
   * Clear the playfield
   */
  private clear(): void {
    this.blocks = new Array(this.width * this.height).fill(BlockType.Empty)
  }

  private inBounds(x: number, y: number): boolean {
    const i = y * this.width + x

    return i >= 0 && i < this.blocks.length
  }
}
