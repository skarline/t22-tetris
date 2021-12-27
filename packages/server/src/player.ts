import Playfield from "./playfield"
import Bag from "./bag"
import Piece from "./piece"

import { type ServerOptions } from "./server"
import { type Tetromino } from "./piece"

import { Action } from "./global"

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

    this.setPiece(this.bag.next())

    console.log(this.piece.tetromino)

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
  private setPiece(type: Tetromino): void {
    const x: number = Math.floor(this.playfield.width / 2) - 1
    const y: number = -4

    this.piece = new Piece(type, { x, y })
  }

  /**
   * Test if the piece will collide at the given offset
   */
  private testCollision(offset: { x: number; y: number }): boolean {
    const { x, y } = this.piece.position

    const testX = x + offset.x
    const testY = y + offset.y

    return this.playfield.test(this.piece, { x: testX, y: testY })
  }

  /**
   * Lock the current piece in the playfield
   */
  private lockPiece(): void {
    this.playfield.setPiece(this.piece)
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

  private moveLeft() {}
  
  private moveRight() {}
  
  private rotate() {}
  
  private drop() {
    if (this.testCollision({ x: 0, y: 1 })) {
      this.lockPiece()
      return
    }
    
    this.piece.move({ x: 0, y: 1 }) 
  }

  private forceDrop() {
    this.drop()
    this.resetDropTimer()
  }
  
  private hardDrop() {}
  
  private hold() {}
}
