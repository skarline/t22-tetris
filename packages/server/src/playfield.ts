import Piece from "./piece"

import { ServerOptions, BlockType } from "./types"

export default class Playfield {
  private blocks: BlockType[] = []

  public topMargin = 4

  public width = this.options.playfieldWidth
  public height = this.options.playfieldHeight + this.topMargin

  constructor(private options: ServerOptions) {
    this.clear()
  }

  /**
   * Get the block at the given position
   */
  public get(x: number, y: number): BlockType | undefined {
    if (x < 0 || x >= this.width || y >= this.height) return undefined
    if (y < 0) return BlockType.Empty

    return this.blocks[y * this.width + x]
  }

  /**
   * Set the block at the given position
   */
  public set(x: number, y: number, block: BlockType): void {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height)
      this.blocks[y * this.width + x] = block
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
  public setPiece(piece: Piece): boolean {
    let inBounds = false

    const { x, y } = piece.position

    piece.getBlocks().forEach(({ x: blockX, y: blockY }) => {
      this.set(x + blockX, y + blockY, piece.tetromino.blockType)

      if (y > this.topMargin) inBounds = true
    })

    return inBounds
  }

  /**
   * Clear the playfield
   */
  private clear(): void {
    this.blocks = new Array(this.width * this.height).fill(BlockType.Empty)
  }
}
