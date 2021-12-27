import Logger from "./utils/logger"
import Playfield from "./playfield"
import Bag from "./bag"
import Piece from "./piece"

import { type ServerOptions } from "./server"
import { type Tetromino } from "./piece"

export enum Action {
  LEFT = "left",
  RIGHT = "right",
  ROTATE = "rotate",
  DROP = "drop",
  HARD_DROP = "hardDrop",
  HOLD = "hold"
}

interface Offset {
  x?: number
  y?: number
  rotation?: number
}

export default class Player {
  public playfield: Playfield
  public bag: Bag

  public piece: Piece
  public heldPiece?: Tetromino

  private dropTimer: ReturnType<typeof setInterval>

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
      this.resetDropTimer()
      
      this.isPlaying = true
    }, countdown * 1000)
  }

  /**
   * Stop the game
   */
  public stop(): void {
    clearInterval(this.dropTimer)

    this.isPlaying = false
  }

  private resetDropTimer() {
    if (this.dropTimer) clearInterval(this.dropTimer)

    this.dropTimer = setInterval(() => { this.drop() }, 1000 / this.options.dropsPerSecond)
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
  private testCollision(offset: Offset = {}): boolean {
    offset = {
      x: 0,
      y: 0,
      rotation: 0,
      ...offset,
    }

    const { position } = this.piece

    const x = position.x + offset.x
    const y = position.y + offset.y
    const rotation = this.piece.rotation + offset.rotation

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
  public handleAction(action: Action): void {
    if (!this.isPlaying) return

    switch (action) {
      case Action.LEFT:
        this.moveLeft()
        break
      case Action.RIGHT:
        this.moveRight()
        break
      case Action.ROTATE:
        this.rotate()
        break
      case Action.DROP:
        this.forceDrop()
        break
      case Action.HARD_DROP:
        this.hardDrop()
        break
      case Action.HOLD:
        this.hold()
        break
    }
  }

  private moveLeft() {
    if (this.testCollision({ x: -1 })) return

    this.piece.move(-1, 0)
  }
  
  private moveRight() {
    if (this.testCollision({ x: 1 })) return

    this.piece.move(1, 0)
  }
  
  private rotate(clockwise: boolean = true) {
    const rotation = clockwise ? 1 : -1

    if (this.testCollision({ rotation })) return

    this.piece.rotate(clockwise)
  }
  
  private drop() {
    if (this.testCollision({ x: 0, y: 1 })) {
      this.lockPiece()
      return
    }
    
    this.piece.move(0, 1) 
  }

  private forceDrop() {
    this.drop()
    this.resetDropTimer()
  }
  
  private hardDrop() {}
  
  private hold() {}
}
