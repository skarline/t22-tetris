import Logger from "./utils/logger"
import Playfield from "./playfield"
import Bag from "./bag"
import Piece from "./piece"

import type { ServerOptions, Action, Tetromino } from "./types"

export default class Player {
  public playfield: Playfield
  public bag: Bag

  public piece: Piece
  public heldPiece?: Tetromino

  private fallTimer: ReturnType<typeof setInterval>

  private isPlaying: boolean = false

  constructor(public id: string, private options: ServerOptions) {
    this.playfield = new Playfield(options)
  }

  /**
   * Start the game
   */
  public start(countdown: number = 0): void {
    this.bag = new Bag(this.options.seed, this.options.minBagItems)

    this.nextPiece()

    setTimeout(() => {
      this.resetFallTimer()

      this.isPlaying = true
    }, countdown * 1000)
  }

  /**
   * Stop the game
   */
  public stop(): void {
    clearInterval(this.fallTimer)

    this.isPlaying = false
  }

  private resetFallTimer() {
    if (this.fallTimer) clearInterval(this.fallTimer)

    this.fallTimer = setInterval(() => {
      this.fall()
    }, 1000 / this.options.fallSpeed)
  }

  /**
   * Set the current piece
   */
  private nextPiece(): void {
    const piece = new Piece(this.bag.next())

    const x = Math.floor((this.playfield.width - piece.size) / 2)
    const y = this.playfield.topMargin - piece.size

    piece.moveTo(x, y)

    this.piece = piece
  }

  /**
   * Test if the piece will collide at the given offset
   */
  private testCollision(
    offsetX: number = 0,
    offsetY: number = 0,
    offsetRotation: number = 0
  ): boolean {
    const { position } = this.piece

    const x = position.x + offsetX
    const y = position.y + offsetY
    const rotation = this.piece.rotation + offsetRotation

    const testPiece = new Piece(this.piece.tetromino, { x, y }, rotation)

    return this.playfield.test(testPiece)
  }

  /**
   * Lock the current piece in the playfield
   */
  private lockPiece(): void {
    if (this.playfield.setPiece(this.piece)) this.nextPiece()
    else this.stop()
  }

  /**
   * Handle input events
   */
  public handleAction(action: Action) {
    if (!this.isPlaying) return

    switch (action) {
      case "left":
        this.move(-1, 0)
        break
      case "right":
        this.move(1, 0)
        break
      case "down":
        this.fall(true)
        break
      case "rotate-right":
        this.rotate(1)
        break
      case "rotate-left":
        this.rotate(-1)
        break
      case "drop":
        this.drop()
        break
      case "hold":
        this.hold()
        break
    }
  }

  private move(x: number, y: number) {
    if (this.testCollision(x)) return

    this.piece.move(x, 0)
  }

  private rotate(direction: number) {
    const offsets = this.piece.getRotationOffsets(direction)

    for (const [x, y] of offsets) {
      if (!this.testCollision(x, y, direction)) {
        this.piece.rotate(direction)
        this.piece.move(x, y)

        return
      }
    }
  }

  private fall(forced: boolean = false) {
    if (forced) this.resetFallTimer()

    if (this.testCollision(0, 1)) this.lockPiece()
    else this.piece.move(0, 1)
  }

  private drop() {
    this.resetFallTimer()

    while (!this.testCollision(0, 1)) {
      this.piece.move(0, 1)
    }
  }

  private hold() {}
}
