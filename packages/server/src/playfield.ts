import Piece from "./piece"

import { Block, BlockType } from "./piece"
import { type ServerOptions } from "./server"

export default class Playfield {
  private blocks: Block[] = []

  public width = this.options.playfieldWidth
  public height = this.options.playfieldHeight

  constructor(private options: ServerOptions) {
    this.clear()
  }

  public get(x: number, y: number): Block | undefined {
    return this.blocks[y * this.width + x]
  }

  public set(x: number, y: number, block: Block): void {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return

    this.blocks[y * this.width + x] = block
  }

  /**
   * Test if a piece will collide at the given position
   */
  public test(piece: Piece, position: { x: number; y: number }): boolean {
    const { x, y } = position

    const blocks = piece.getBlocks()

    return blocks.some(({ x: blockX, y: blockY }) => {
      const testX = x + blockX
      const testY = y + blockY

      const block = this.get(testX, testY)

      if (!block || block.type !== BlockType.Empty) return true
    })
  }

  /**
   * Set the blocks of a piece in the playfield
   */
  public setPiece(piece: Piece): void {
    const { x, y } = piece.position
    
    const blocks = piece.getBlocks()

    for (const { x: bx, y: by } of blocks) {
      this.set(x + bx, y + by, { type: piece.tetromino.blockType })
    }
  }

  /**
   * Clear the playfield
   */
  private clear(): void {
    this.blocks = []

    const size = this.width * this.height

    for (let i = 0; i < size; i++) {
      this.blocks.push({ type: BlockType.Empty })
    }
  }
}
