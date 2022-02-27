import Piece from "./piece"

import type MatchOptions from "../match-options"

import Block from "./block"

import { Vector2 } from "../lib/math"

export default class Matrix {
  private blocks: Block[] = []

  public width: number
  public height: number

  constructor(options: MatchOptions) {
    this.width = options.game.matrixWidth
    this.height = options.game.matrixHeight * 2 // buffer zone

    this.clear()
  }

  /**
   * Get the block at the given position
   */
  public getBlock(at: Vector2): Block | undefined {
    if (this.isInBounds(at)) return this.blocks[this.getIndex(at)]

    return undefined
  }

  /**
   * Set the block at the given position
   */
  public setBlock(at: Vector2, block: Block): void {
    if (this.isInBounds(at)) this.blocks[this.getIndex(at)] = block
  }

  /**
   * Test if a piece will collide at the given position
   */
  public testPiece(piece: Piece): boolean {
    return piece.getBlocksPositions().some((blockPosition) => {
      const position = blockPosition.add(piece.position)

      if (!this.isInBounds(position)) return true
      if (this.getBlock(position) !== Block.Empty) return true
    })
  }

  /**
   * Set the blocks of a piece in the playfield
   */
  public setPiece(piece: Piece): void {
    for (const position of piece.getBlocksPositions()) {
      this.setBlock(position, piece.tetromino.blockType)
    }
  }

  public checkForLineClears(): number[] {
    let clearedLines = []

    // Check and clear from bottom to top
    for (let y = this.height - 1; y >= 0; y--) {
      const blocks = this.getLineBlocks(y)

      // Boolean() will resolve false for empty blocks (value 0)
      if (blocks.every(Boolean)) {
        this.blocks.splice(y * this.width, this.width)

        clearedLines.push(y)
      }
    }

    // Push new lines to the top
    this.blocks.unshift(...new Array(this.width * clearedLines.length).fill(Block.Empty))

    return clearedLines
  }

  private getIndex(position: Vector2): number {
    return position.y * this.width + position.x
  }

  private getLineBlocks(y: number): Block[] {
    return this.blocks.slice(y * this.width, (y + 1) * this.width)
  }

  private clear(): void {
    this.blocks = new Array(this.width * this.height).fill(Block.Empty)
  }

  private isInBounds(position: Vector2): boolean {
    const { x, y } = position

    return x >= 0 && x < this.width && y >= 0 && y < this.height
  }
}
