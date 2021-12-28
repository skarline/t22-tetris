import Logger from "./utils/logger"
import Playfield from "./playfield"
import Bag from "./bag"
import Piece from "./piece"

import { ServerOptions, Action, Tetromino } from "./types"

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
      this.drop()
    }, 1000 / this.options.fallSpeed)
  }

  /**
   * Set the current piece
   */
  private nextPiece(): void {
    const piece = new Piece(this.bag.next())

    piece.position = {
      x: Math.floor((this.playfield.width - piece.size()) / 2),
      y: -piece.size()
    }

    this.piece = piece

    if (this.testCollision()) {
      this.stop()

      Logger.log(`Player ${this.id} lost`)
    }
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
  public handle(action: Action, args: any) {
    if (!this.isPlaying) return

    switch (action) {
      case "move":
        this.move(args)
        break
      case "down":
        this.fall(true)
        break
      case "rotate":
        this.rotate(args)
        break
      case "drop":
        this.drop()
        break
      case "hold":
        this.hold()
        break
    }
  }

  private move(x: number) {
    if (this.testCollision(x)) return

    this.piece.position.x += x
  }

  private rotate(clockwise: boolean = true) {
    const offsetRotation = clockwise ? 1 : -1

    if (!this.testCollision(0, 0, offsetRotation)) {
      this.piece.rotation += offsetRotation
      return
    }

    if (!this.testCollision(0, -1, offsetRotation)) {
      this.piece.rotation += offsetRotation
      this.piece.position.y -= 1

      this.resetFallTimer()
    }
  }

  private fall(forced: boolean = false) {
    if (forced) this.resetFallTimer()

    if (this.testCollision(0, 1)) this.lockPiece()
    else this.piece.position.y += 1
  }

  private drop() {
    this.resetFallTimer()

    while (!this.testCollision(0, 1)) {
      this.piece.position.y += 1
    }
  }

  private hold() {}
}
