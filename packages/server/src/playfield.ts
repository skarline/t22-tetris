import Piece from "./piece"

import { ServerOptions, Block, BlockType } from "./types"

export default class Playfield {
  private blocks: Block[] = []

  public width = this.options.playfieldWidth
  public height = this.options.playfieldHeight

  constructor(private options: ServerOptions) {
    this.clear()
  }

  /**
   * Get the block at the given position
   */
  public get(x: number, y: number): Block | undefined {
    if (x < 0 || x >= this.width || y >= this.height) return undefined
    if (y < 0) return { type: BlockType.Empty }

    return this.blocks[y * this.width + x]
  }

  /**
   * Set the block at the given position
   */
  public set(x: number, y: number, block: Block): boolean {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return false

    this.blocks[y * this.width + x] = block

    return true
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

      return !block || block.type !== BlockType.Empty
    })
  }

  /**
   * Set the blocks of a piece in the playfield
   */
  public setPiece(piece: Piece): boolean {
    let canPlace = true

    const { x, y } = piece.position

    piece.getBlocks().forEach(({ x: blockX, y: blockY }) => {
      const placed = this.set(x + blockX, y + blockY, {
        type: piece.tetromino.blockType
      })

      if (!placed) canPlace = false
    })

    return canPlace
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
