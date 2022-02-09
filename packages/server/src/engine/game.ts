import Bag from "./bag"
import Piece from "./piece"
import Matrix from "./matrix"

import type { Tetromino } from "./types"
import type { ServerOptions, PlayerAction } from "../server"

import SharedConstants from "./constants"

import * as Events from "../events"

import EventBus from "../event-bus"

export default class Game {
  public matrix: Matrix
  public bag: Bag

  public piece: Piece
  public holdQueue?: Tetromino

  public level: number

  private fallInterval: ReturnType<typeof setInterval>

  private isPlaying: boolean = false

  constructor(
    private slot: number,
    private options: ServerOptions,
    private eventBus: EventBus
  ) {
    this.matrix = new Matrix(options)
    this.bag = new Bag(options.seed)
    this.level = options.initialLevel
  }

  get fallSpeed(): number {
    return 1000 * (0.8 - (this.level - 1) * 0.007) ** (this.level - 1)
  }

  /**
   * Start the game
   */
  public start(): void {
    this.nextPiece()

    setTimeout(() => {
      this.resetFallInterval()

      this.isPlaying = true
    }, this.options.countdown * 1000)
  }

  /**
   * Stop the game
   */
  public stop(): void {
    clearInterval(this.fallInterval)

    this.isPlaying = false
  }

  private resetFallInterval() {
    if (this.fallInterval) clearInterval(this.fallInterval)

    this.fallInterval = setInterval(() => {
      this.fall()
    }, this.fallSpeed)
  }

  /**
   * Set the current piece
   */
  private nextPiece(tetromino?: Tetromino): void {
    const piece = new Piece(tetromino ?? this.bag.next())

    const x = Math.floor((this.matrix.width - piece.size) / 2)
    const y = this.matrix.height / 2 - piece.size

    piece.moveTo(x, y)

    this.eventBus.dispatch<Events.NextPieceEvent>("next-piece", {
      slot: this.slot,
      piece
    })

    this.piece = piece

    // Check for game over
    if (this.testCollision()) this.stop()
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

    return this.matrix.test(testPiece)
  }

  /**
   * Lock the current piece in the matrix
   */
  private lock(): void {
    this.matrix.setPiece(this.piece)

    // Check for line clears
    const clearedLines = this.matrix.clearLines()

    this.eventBus.dispatch<Events.PieceLockEvent>("piece-lock", {
      slot: this.slot,
      clearedLines,
      piece: this.piece
    })

    if (clearedLines.length) {
      setTimeout(() => {
        this.nextPiece()
      }, SharedConstants.clearDelay * 1000)
    } else {
      this.nextPiece()
    }
  }

  /**
   * Handle input events
   */
  public handleAction(action: PlayerAction) {
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
    if (this.testCollision(x, y)) return

    this.piece.move(x, y)

    this.eventBus.dispatch<Events.PieceMoveEvent>("piece-move", {
      slot: this.slot,
      position: this.piece.position
    })
  }

  private rotate(direction: number) {
    const offsets = this.piece.getRotationOffsets(direction)

    for (const [x, y] of offsets) {
      if (!this.testCollision(x, y, direction)) {
        this.piece.rotate(direction)
        this.piece.move(x, y)

        this.eventBus.dispatch<Events.PieceRotateEvent>("piece-rotate", {
          slot: this.slot,
          rotation: this.piece.rotation
        })

        return
      }
    }
  }

  private fall(forced: boolean = false) {
    if (forced) this.resetFallInterval()

    if (this.testCollision(0, 1)) this.lock()
    else this.move(0, 1)
  }

  private drop() {
    this.resetFallInterval()

    while (!this.testCollision(0, 1)) {
      this.move(0, 1)
    }
  }

  private hold() {
    this.holdQueue = this.piece.tetromino
    this.nextPiece(this.holdQueue ?? this.bag.next())
  }
}
