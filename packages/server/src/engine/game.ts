import Bag from "./bag"
import Piece from "./piece"
import Matrix from "./matrix"

import { Tetromino } from "./piece"

import Constants from "./constants"

import Timer from "../utils/timer"
import Match from "../match"
import { Vector2 } from "../lib/math"

import { PartialGameEvent, EventMap } from "../events"
import { Action } from "../actions"

export default class Game {
  private actionsState: { [key: string]: any } = {}

  public matrix: Matrix
  public generator: Bag

  public activePiece?: Piece
  public holdQueue?: Tetromino

  public level: number

  private fallTimer = new Timer(() => this.fall(), this.getFallSpeed())
  private lockTimer = new Timer(() => this.lock(), Constants.LOCK_TIMEOUT, true)
  private autoShiftTimer = new Timer(() => this.autoShift(), Constants.AUTO_SHIFT_TIMEOUT)

  constructor(private match: Match, private slot: number) {
    this.matrix = new Matrix(match.options)
    this.generator = new Bag(match.options.game.seed)
    this.level = match.options.game.initialLevel
  }

  /**
   * Get the fall speed (seconds per line)
   */
  private getFallSpeed(): number {
    return 1000 * (0.8 - (this.level - 1) * 0.007) ** (this.level - 1)
  }

  /**
   * Start the initial countdown
   */
  public countdown(): void {
    const seconds = this.match.options.game.countdown

    new Timer(() => this.start(), seconds * 1000, true).start()
  }

  /**
   * Stop the game
   */
  public stop(): void {
    this.fallTimer.stop()
  }

  private start(): void {
    this.nextPiece()
  }

  private dispatchGameEvent<K extends keyof EventMap>(event: K, arg: EventMap[K]): void {
    const payload: PartialGameEvent & EventMap[K] = { slot: this.slot, ...arg }
    this.match.eventBus.dispatch(event, payload)
  }

  public notifyControllerActionPressed(action: Action): void {
    this.actionsState[action] = true

    if (!this.activePiece) return

    switch (action) {
      case "move-left":
        this.move(Vector2.LEFT)
        this.autoShiftTimer.start(Constants.AUTO_SHIFT_DELAY)
        break
      case "move-right":
        this.move(Vector2.RIGHT)
        this.autoShiftTimer.start(Constants.AUTO_SHIFT_DELAY)
        break
      case "rotate-left":
        this.rotate(-1)
        break
      case "rotate-right":
        this.rotate(1)
        break
      case "soft-drop":
        this.toggleSoftDrop(true)
    }
  }

  public notifyControllerActionReleased(action: Action): void {
    this.actionsState[action] = false

    if (!this.activePiece) return

    switch (action) {
      case "move-left":
      case "move-right":
        this.autoShiftTimer.stop()
        break
      case "soft-drop":
        this.toggleSoftDrop(false)
    }
  }

  private isActionPressed(action: Action): boolean {
    return this.actionsState[action] ?? false
  }

  private toggleSoftDrop(value: boolean) {
    const multiplier = value ? Constants.SOFT_DROP_MULTIPLIER : 1

    this.fallTimer.interval = this.getFallSpeed() / multiplier
  }

  /**
   * Set the current piece
   */
  private nextPiece(tetromino?: Tetromino): void {
    const piece = new Piece(tetromino ?? this.generator.next())

    const position = new Vector2(
      Math.floor((this.matrix.width - piece.size()) / 2),
      this.matrix.height / 2 - piece.size()
    )

    piece.moveTo(position)

    this.activePiece = piece

    this.fallTimer.start()

    this.dispatchGameEvent("next-piece", { piece })
  }

  /**
   * Test if the piece will collide at the given offset
   */
  private testPieceMoveCollision(offsetPosition: Vector2, offsetRotation: number = 0): boolean {
    const position = this.activePiece.position.add(offsetPosition)
    const rotation = this.activePiece.rotation + offsetRotation

    const virtualPiece = new Piece(this.activePiece.tetromino, position, rotation)

    return this.matrix.testPiece(virtualPiece)
  }

  /**
   * Lock the current piece in the matrix
   */
  private lock(): void {
    this.matrix.setPiece(this.activePiece)

    this.dispatchGameEvent("piece-lock", { piece: this.activePiece })

    const clearedLines = this.matrix.checkForLineClears()

    if (clearedLines.length > 0) {
      this.dispatchGameEvent("line-clear", { lines: clearedLines })
    }

    this.nextPiece()
  }

  private autoShift(): void {
    const direction = new Vector2(
      Number(this.isActionPressed("move-right")) - Number(this.isActionPressed("move-left")),
      0
    )

    this.move(direction)
  }

  private move(direction: Vector2) {
    const collision = this.testPieceMoveCollision(direction)

    if (collision) {
      this.dispatchGameEvent("piece-move-collision", { direction })

      return
    }

    this.activePiece.move(direction)

    if (this.lockTimer.isRunning()) {
      this.lockTimer.stop()

      if (this.isFlooring()) {
        this.lockTimer.start()
      } else {
        this.fallTimer.start()
      }
    }

    const { position } = this.activePiece

    this.dispatchGameEvent("piece-move", { position })
  }

  private rotate(direction: number) {
    const offsets = this.activePiece.getTetrominoOffsets(direction)

    for (const offset of offsets) {
      const isValidRotation = !this.testPieceMoveCollision(Vector2.ZERO, direction)

      if (isValidRotation) {
        this.activePiece.rotate(direction)
        this.activePiece.move(offset)

        const { rotation } = this.activePiece

        this.dispatchGameEvent("piece-rotate", { rotation })

        return
      }
    }
  }

  private fall() {
    if (this.isFlooring()) {
      this.lockTimer.start()
      this.fallTimer.stop()

      return
    }

    this.move(Vector2.DOWN)
  }

  private isFlooring(): boolean {
    return this.testPieceMoveCollision(Vector2.DOWN)
  }

  private getGhostPosition(): Vector2 | undefined {
    if (!this.activePiece) return undefined

    let position = this.activePiece.position

    while (!this.testPieceMoveCollision(position)) position.add(Vector2.DOWN)

    return position
  }

  private drop() {
    if (!this.activePiece) return

    this.move(this.getGhostPosition())
    this.lock()
  }

  private hold() {
    const toHold = this.activePiece.tetromino

    this.nextPiece(this.holdQueue ?? this.generator.next())

    this.holdQueue = toHold
  }
}
